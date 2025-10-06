// Main application entry point

let jobCardManager;

// Initialize the application
DOM.ready(() => {
    initializeApp();
});

function initializeApp() {
    // Initialize job swipe functionality
    const jobStack = DOM.find('#jobStack');
    if (jobStack) {
        jobCardManager = new JobCardManager(jobStack);
    }
    
    // Bind control buttons
    bindControlButtons();
    
    // Initialize other page-specific functionality
    initializePageSpecificFeatures();
    
    console.log('SwipeHire application initialized');
}

function bindControlButtons() {
    // Undo button
    const undoBtn = DOM.find('#undoBtn');
    if (undoBtn) {
        undoBtn.addEventListener('click', () => {
            eventBus.emit('undoSwipe');
        });
    }
    
    // Refresh button
    const refreshBtn = DOM.find('#refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            eventBus.emit('refreshJobs');
        });
    }
    
    // Load more jobs button
    const loadMoreBtn = DOM.find('#loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            eventBus.emit('refreshJobs');
        });
    }
}

function initializePageSpecificFeatures() {
    const currentPage = getCurrentPage();
    
    switch (currentPage) {
        case 'index.html':
        case '':
            // Already initialized job swipe functionality above
            break;
        case 'browse.html':
            initializeBrowsePage();
            break;
        case 'applications.html':
            initializeApplicationsPage();
            break;
        case 'resume.html':
            initializeResumePage();
            break;
        case 'profile.html':
            initializeProfilePage();
            break;
    }
}

function getCurrentPage() {
    return window.location.pathname.split('/').pop();
}

// Browse page functionality
function initializeBrowsePage() {
    const searchInput = DOM.find('#searchInput');
    const jobList = DOM.find('#jobList');
    const resultsCount = DOM.find('#resultsCount');
    
    if (!jobList) return;
    
    let allJobs = [...mockJobs];
    
    // Debounced search function
    const debouncedSearch = debounce((query) => {
        const filteredJobs = filterJobs(allJobs, query);
        renderJobList(filteredJobs);
        updateResultsCount(filteredJobs.length);
    }, 300);
    
    // Search input handler
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            debouncedSearch(e.target.value);
        });
    }
    
    // Initial render
    renderJobList(allJobs);
    updateResultsCount(allJobs.length);
    
    function filterJobs(jobs, query) {
        if (!query.trim()) return jobs;
        
        const searchTerm = query.toLowerCase();
        return jobs.filter(job => 
            job.title.toLowerCase().includes(searchTerm) ||
            job.company.name.toLowerCase().includes(searchTerm) ||
            job.description.toLowerCase().includes(searchTerm) ||
            job.location.city.toLowerCase().includes(searchTerm) ||
            job.requirements.some(req => req.toLowerCase().includes(searchTerm))
        );
    }
    
    function renderJobList(jobs) {
        if (jobs.length === 0) {
            jobList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <h3>No jobs found</h3>
                    <p>Try adjusting your search terms</p>
                </div>
            `;
            return;
        }
        
        jobList.innerHTML = jobs.map(job => createJobListItem(job)).join('');
    }
    
    function createJobListItem(job) {
        return `
            <div class="job-list-item" data-job-id="${job.id}">
                <div class="job-item-header">
                    <div class="job-item-info">
                        <img src="${job.company.logo}" alt="${job.company.name}" class="company-logo-small"
                             onerror="this.src='https://via.placeholder.com/40x40/4F46E5/FFFFFF?text=${job.company.name.charAt(0)}'">
                        <div>
                            <h3 class="job-item-title">${job.title}</h3>
                            <p class="job-item-company">${job.company.name}</p>
                        </div>
                    </div>
                    <div class="job-type-badge-small">${job.jobType}</div>
                </div>
                
                <div class="job-item-details">
                    <span class="job-item-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${job.location.city}, ${job.location.state}${job.location.isRemote ? ' (Remote)' : ''}
                    </span>
                    <span class="job-item-salary">
                        <i class="fas fa-dollar-sign"></i>
                        ${SalaryUtils.format(job.salaryMin, job.salaryMax)}
                    </span>
                </div>
                
                <div class="job-item-description">
                    <p>${job.description.substring(0, 150)}...</p>
                </div>
                
                <div class="job-item-requirements">
                    ${job.requirements.slice(0, 3).map(req => 
                        `<span class="requirement-tag-small">${req}</span>`
                    ).join('')}
                    ${job.requirements.length > 3 ? `<span class="requirement-tag-small">+${job.requirements.length - 3} more</span>` : ''}
                </div>
                
                <div class="job-item-actions">
                    <button class="btn btn-outline btn-small" onclick="viewJobDetails('${job.id}')">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                    <button class="btn btn-primary btn-small" onclick="quickApplyFromBrowse('${job.id}')">
                        <i class="fas fa-paper-plane"></i> Quick Apply
                    </button>
                </div>
            </div>
        `;
    }
    
    function updateResultsCount(count) {
        if (resultsCount) {
            resultsCount.textContent = `${count} job${count !== 1 ? 's' : ''} found`;
        }
    }
}

// Applications page functionality
function initializeApplicationsPage() {
    const applicationsList = DOM.find('#applicationsList');
    const statusTabs = DOM.findAll('.status-tab');
    
    if (!applicationsList) return;
    
    let currentFilter = 'all';
    
    // Bind status tab clicks
    statusTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab
            statusTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Filter applications
            currentFilter = tab.dataset.status;
            renderApplications();
        });
    });
    
    // Initial render
    renderApplications();
    
    function renderApplications() {
        const applications = Storage.get('applications', []);
        const filteredApps = currentFilter === 'all' 
            ? applications 
            : applications.filter(app => app.status === currentFilter);
        
        if (filteredApps.length === 0) {
            applicationsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-briefcase"></i>
                    <h3>No applications found</h3>
                    <p>${currentFilter === 'all' ? 'Start swiping to apply to jobs!' : `No ${currentFilter} applications yet.`}</p>
                </div>
            `;
            return;
        }
        
        // Sort by application date (newest first)
        filteredApps.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
        
        applicationsList.innerHTML = filteredApps.map(app => createApplicationItem(app)).join('');
    }
    
    function createApplicationItem(application) {
        const statusColors = {
            pending: 'warning',
            interview: 'info',
            rejected: 'danger',
            accepted: 'success'
        };
        
        return `
            <div class="application-item" data-app-id="${application.id}">
                <div class="application-header">
                    <div class="application-info">
                        <h3 class="application-title">${application.jobTitle}</h3>
                        <p class="application-company">${application.companyName}</p>
                    </div>
                    <span class="status-badge status-${statusColors[application.status]}">${application.status}</span>
                </div>
                
                <div class="application-details">
                    <p class="application-date">Applied ${DateUtils.timeAgo(application.appliedAt)}</p>
                    ${application.notes ? `<p class="application-notes">${application.notes}</p>` : ''}
                </div>
                
                <div class="application-actions">
                    <button class="btn btn-outline btn-small" onclick="viewApplicationDetails('${application.id}')">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                    <button class="btn btn-danger btn-small" onclick="withdrawApplication('${application.id}')">
                        <i class="fas fa-times"></i> Withdraw
                    </button>
                </div>
            </div>
        `;
    }
    
    // Listen for new applications
    eventBus.on('applicationCreated', () => {
        renderApplications();
    });
}

// Global functions for button clicks
window.quickApplyFromBrowse = function(jobId) {
    const job = mockJobs.find(j => j.id === jobId);
    if (!job) return;
    
    const applications = Storage.get('applications', []);
    
    // Check if already applied
    if (applications.some(app => app.jobId === jobId)) {
        Toast.warning('You have already applied to this job');
        return;
    }
    
    const application = {
        id: generateId(),
        jobId: jobId,
        jobTitle: job.title,
        companyName: job.company.name,
        status: 'pending',
        appliedAt: new Date().toISOString(),
        notes: 'Applied from browse page'
    };
    
    applications.push(application);
    Storage.set('applications', applications);
    
    Toast.success(`Applied to ${job.title}!`);
    eventBus.emit('applicationCreated', application);
};

window.viewJobDetails = function(jobId) {
    Toast.info('Job details modal coming soon!');
};

window.viewApplicationDetails = function(applicationId) {
    Toast.info('Application details have been sent to your registered mail!!');
};

window.withdrawApplication = function(applicationId) {
    const applications = Storage.get('applications', []);
    const application = applications.find(app => app.id === applicationId);
    
    if (!application) return;
    
    if (confirm(`Are you sure you want to withdraw your application for ${application.jobTitle}?`)) {
        const updatedApps = applications.filter(app => app.id !== applicationId);
        Storage.set('applications', updatedApps);
        
        Toast.success('Application withdrawn');
        
        // Re-render applications if on applications page
        if (getCurrentPage() === 'applications.html') {
            initializeApplicationsPage();
        }
    }
};