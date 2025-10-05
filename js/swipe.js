// Swipe functionality for job cards

class SwipeCard {
    constructor(element, job, callbacks) {
        this.element = element;
        this.job = job;
        this.callbacks = callbacks || {};
        this.startX = 0;
        this.startY = 0;
        this.currentX = 0;
        this.currentY = 0;
        this.isDragging = false;
        this.threshold = 80; // Minimum distance to trigger swipe
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.createIndicator();
    }
    
    createIndicator() {
        this.indicator = DOM.createElement('div', 'swipe-indicator');
        this.indicator.innerHTML = '<i class="fas fa-heart"></i>';
        this.element.appendChild(this.indicator);
    }
    
    bindEvents() {
        // Mouse events
        this.element.addEventListener('mousedown', this.handleStart.bind(this));
        this.element.addEventListener('mousemove', this.handleMove.bind(this));
        this.element.addEventListener('mouseup', this.handleEnd.bind(this));
        this.element.addEventListener('mouseleave', this.handleEnd.bind(this));
        
        // Touch events
        this.element.addEventListener('touchstart', this.handleStart.bind(this));
        this.element.addEventListener('touchmove', this.handleMove.bind(this));
        this.element.addEventListener('touchend', this.handleEnd.bind(this));
        
        // Prevent text selection
        this.element.addEventListener('selectstart', (e) => e.preventDefault());
    }
    
    handleStart(e) {
        e.preventDefault();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        
        this.startX = clientX;
        this.startY = clientY;
        this.currentX = clientX;
        this.currentY = clientY;
        this.isDragging = true;
        
        this.element.classList.add('dragging');
        this.element.style.transition = 'none';
    }
    
    handleMove(e) {
        if (!this.isDragging) return;
        
        e.preventDefault();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        
        this.currentX = clientX;
        this.currentY = clientY;
        
        const deltaX = this.currentX - this.startX;
        const deltaY = this.currentY - this.startY;
        const rotation = deltaX * 0.1; // Subtle rotation effect
        
        // Apply transform
        this.element.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(${rotation}deg)`;
        
        // Show appropriate indicator
        this.showIndicator(deltaX, deltaY);
    }
    
    handleEnd(e) {
        if (!this.isDragging) return;
        
        const deltaX = this.currentX - this.startX;
        const deltaY = this.currentY - this.startY;
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);
        
        this.isDragging = false;
        this.element.classList.remove('dragging');
        this.element.style.transition = 'transform 0.3s ease';
        this.hideIndicator();
        
        // Determine swipe direction
        let direction = null;
        
        if (absX > this.threshold && absX > absY) {
            direction = deltaX > 0 ? 'right' : 'left';
        } else if (absY > this.threshold && absY > absX && deltaY < 0) {
            direction = 'up';
        }
        
        if (direction) {
            this.executeSwipe(direction);
        } else {
            this.resetPosition();
        }
    }
    
    showIndicator(deltaX, deltaY) {
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);
        
        if (absX > 30 && absX > absY) {
            this.indicator.className = `swipe-indicator show ${deltaX > 0 ? 'right' : 'left'}`;
            this.indicator.innerHTML = deltaX > 0 
                ? '<i class="fas fa-heart"></i>' 
                : '<i class="fas fa-times"></i>';
        } else if (absY > 30 && absY > absX && deltaY < 0) {
            this.indicator.className = 'swipe-indicator show up';
            this.indicator.innerHTML = '<i class="fas fa-bookmark"></i>';
        } else {
            this.indicator.classList.remove('show');
        }
    }
    
    hideIndicator() {
        this.indicator.classList.remove('show', 'left', 'right', 'up');
    }
    
    executeSwipe(direction) {
        const exitDistance = window.innerWidth;
        let transform = '';
        
        switch (direction) {
            case 'left':
                transform = `translateX(-${exitDistance}px) rotate(-30deg)`;
                break;
            case 'right':
                transform = `translateX(${exitDistance}px) rotate(30deg)`;
                break;
            case 'up':
                transform = `translateY(-${window.innerHeight}px) scale(0.8)`;
                break;
        }
        
        this.element.style.transform = transform;
        this.element.style.opacity = '0';
        
        // Execute callback after animation
        setTimeout(() => {
            if (this.callbacks[direction]) {
                this.callbacks[direction](this.job);
            }
            this.element.remove();
        }, 300);
    }
    
    resetPosition() {
        this.element.style.transform = '';
    }
    
    // Programmatic swipe methods
    swipeLeft() {
        this.executeSwipe('left');
    }
    
    swipeRight() {
        this.executeSwipe('right');
    }
    
    swipeUp() {
        this.executeSwipe('up');
    }
}

// Job card manager
class JobCardManager {
    constructor(container) {
        this.container = container;
        this.jobs = [...mockJobs];
        this.currentIndex = 0;
        this.swipeHistory = Storage.get('swipeHistory', []);
        this.activeCard = null;
        
        this.init();
    }
    
    init() {
        this.filterAvailableJobs();
        this.renderCurrentCard();
        this.bindActionButtons();
        
        // Listen for undo events
        eventBus.on('undoSwipe', () => this.undoLastSwipe());
        eventBus.on('refreshJobs', () => this.refreshJobs());
    }
    
    filterAvailableJobs() {
        const swipedJobIds = new Set(this.swipeHistory.map(s => s.jobId));
        this.jobs = mockJobs.filter(job => !swipedJobIds.has(job.id));
    }
    
    renderCurrentCard() {
        this.container.innerHTML = '';
        
        if (this.jobs.length === 0) {
            this.showEmptyState();
            return;
        }
        
        const currentJob = this.jobs[0];
        const cardElement = this.createJobCard(currentJob);
        
        this.activeCard = new SwipeCard(cardElement, currentJob, {
            left: (job) => this.handleSwipe(job, 'pass'),
            right: (job) => this.handleSwipe(job, 'apply'),
            up: (job) => this.handleSwipe(job, 'save')
        });
        
        this.container.appendChild(cardElement);
        
        // Add next card preview if available
        if (this.jobs.length > 1) {
            const nextJob = this.jobs[1];
            const nextCard = this.createJobCard(nextJob);
            nextCard.classList.add('next-card');
            this.container.appendChild(nextCard);
        }
    }
    
    createJobCard(job) {
        const card = DOM.createElement('div', 'job-card top-card');
        card.dataset.jobId = job.id;
        
        card.innerHTML = `
            <div class="job-header">
                <div class="job-title-section">
                    <div class="company-info">
                        <img src="${job.company.logo}" alt="${job.company.name}" class="company-logo" 
                             onerror="this.src='https://via.placeholder.com/60x60/4F46E5/FFFFFF?text=${job.company.name.charAt(0)}'">
                        <div>
                            <h3 class="job-title">${job.title}</h3>
                            <p class="company-name">${job.company.name}</p>
                        </div>
                    </div>
                    <div class="job-type-badge">${job.jobType}</div>
                </div>
            </div>
            
            <div class="job-content">
                <div class="job-details">
                    <div class="detail-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${job.location.city}, ${job.location.state}${job.location.isRemote ? ' (Remote)' : ''}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-dollar-sign"></i>
                        <span>${SalaryUtils.format(job.salaryMin, job.salaryMax)}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-clock"></i>
                        <span>Posted ${DateUtils.timeAgo(job.postedDate)}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-users"></i>
                        <span>${job.company.size}</span>
                    </div>
                </div>
                
                <div class="job-description">
                    <p>${job.description}</p>
                </div>
                
                <div class="requirements-section">
                    <h4>Key Requirements:</h4>
                    <ul class="requirements-list">
                        ${job.requirements.map(req => `<li>${req}</li>`).join('')}
                    </ul>
                </div>
                
                ${job.benefits ? `
                    <div class="benefits-section">
                        <h4>Benefits:</h4>
                        <div class="benefits-tags">
                            ${job.benefits.map(benefit => `<span class="benefit-tag">${benefit}</span>`).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
        
        return card;
    }
    
    bindActionButtons() {
        const rejectBtn = DOM.find('#rejectBtn');
        const saveBtn = DOM.find('#saveBtn');
        const applyBtn = DOM.find('#applyBtn');
        
        if (rejectBtn) rejectBtn.addEventListener('click', () => this.swipeLeft());
        if (saveBtn) saveBtn.addEventListener('click', () => this.swipeUp());
        if (applyBtn) applyBtn.addEventListener('click', () => this.swipeRight());
    }
    
    swipeLeft() {
        if (this.activeCard) this.activeCard.swipeLeft();
    }
    
    swipeRight() {
        if (this.activeCard) this.activeCard.swipeRight();
    }
    
    swipeUp() {
        if (this.activeCard) this.activeCard.swipeUp();
    }
    
    handleSwipe(job, action) {
        // Record swipe action
        const swipeAction = {
            id: generateId(),
            jobId: job.id,
            action: action,
            timestamp: new Date().toISOString()
        };
        
        this.swipeHistory.push(swipeAction);
        Storage.set('swipeHistory', this.swipeHistory);
        
        // Handle specific actions
        switch (action) {
            case 'apply':
                this.createApplication(job);
                Toast.success(`Applied to ${job.title}!`);
                break;
            case 'save':
                Toast.info(`Saved ${job.title} for later`);
                break;
            case 'pass':
                Toast.error(`Passed on ${job.title}`);
                break;
        }
        
        // Move to next job
        this.jobs.shift();
        
        // Render next card after short delay
        setTimeout(() => {
            this.renderCurrentCard();
            eventBus.emit('jobSwiped', { job, action });
        }, 100);
    }
    
    createApplication(job) {
        const applications = Storage.get('applications', []);
        
        // Check if already applied
        const existingApp = applications.find(app => app.jobId === job.id);
        if (existingApp) {
            Toast.warning('You have already applied to this job');
            return;
        }
        
        const application = {
            id: generateId(),
            jobId: job.id,
            jobTitle: job.title,
            companyName: job.company.name,
            status: 'pending',
            appliedAt: new Date().toISOString(),
            notes: 'Applied through SwipeHire'
        };
        
        applications.push(application);
        Storage.set('applications', applications);
        
        eventBus.emit('applicationCreated', application);
    }
    
    showEmptyState() {
        const noJobsMessage = DOM.find('#noJobsMessage');
        if (noJobsMessage) {
            noJobsMessage.style.display = 'block';
        }
    }
    
    undoLastSwipe() {
        if (this.swipeHistory.length === 0) {
            Toast.warning('No actions to undo');
            return;
        }
        
        const lastSwipe = this.swipeHistory.pop();
        Storage.set('swipeHistory', this.swipeHistory);
        
        // Remove application if it was an apply action
        if (lastSwipe.action === 'apply') {
            const applications = Storage.get('applications', []);
            const updatedApps = applications.filter(app => app.jobId !== lastSwipe.jobId);
            Storage.set('applications', updatedApps);
        }
        
        // Refresh jobs and render
        this.filterAvailableJobs();
        this.renderCurrentCard();
        
        Toast.info('Last action undone');
        eventBus.emit('swipeUndone', lastSwipe);
    }
    
    refreshJobs() {
        // Reset swipe history to show all jobs again
        this.swipeHistory = [];
        Storage.set('swipeHistory', this.swipeHistory);
        
        this.filterAvailableJobs();
        this.renderCurrentCard();
        
        Toast.success('Jobs refreshed!');
    }
}
