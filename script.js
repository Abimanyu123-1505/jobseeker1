// Mock Data
const mockJobs = [
    {
        id: '1',
        title: 'Senior Frontend Developer',
        company: {
            name: 'TechCorp Inc.',
            logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=logo',
            size: '500-1000 employees'
        },
        description: 'We are looking for a passionate Senior Frontend Developer to join our dynamic team. You will be responsible for developing user-facing features using modern web technologies.',
        requirements: [
            '5+ years of React experience',
            'TypeScript proficiency', 
            'Experience with modern CSS frameworks',
            'Knowledge of state management (Redux/Zustand)'
        ],
        salaryMin: 100000,
        salaryMax: 140000,
        location: {
            city: 'San Francisco',
            state: 'CA',
            isRemote: true
        },
        jobType: 'Full-time',
        benefits: ['Health Insurance', 'Stock Options', 'Remote Work', '401k'],
        postedDate: '2024-01-15'
    },
    {
        id: '2',
        title: 'Product Manager',
        company: {
            name: 'StartupXYZ',
            logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&h=100&fit=crop&crop=logo',
            size: '50-100 employees'
        },
        description: 'Join our product team to drive the development of innovative financial products. Lead cross-functional teams and own the product roadmap.',
        requirements: [
            '3+ years of product management experience',
            'Experience in fintech or financial services',
            'Strong analytical skills',
            'Excellent communication skills'
        ],
        salaryMin: 120000,
        salaryMax: 160000,
        location: {
            city: 'New York',
            state: 'NY',
            isRemote: false
        },
        jobType: 'Full-time',
        benefits: ['Health Insurance', 'Equity', 'Flexible PTO'],
        postedDate: '2024-01-18'
    },
    {
        id: '3',
        title: 'UX/UI Designer',
        company: {
            name: 'Design Studio Pro',
            logo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop&crop=logo',
            size: '20-50 employees'
        },
        description: 'Create beautiful and intuitive user experiences for web and mobile applications. Work closely with clients to understand their needs.',
        requirements: [
            'Portfolio showcasing UX/UI work',
            'Proficiency in Figma and Adobe Creative Suite',
            'Understanding of design systems',
            'Experience with user research'
        ],
        salaryMin: 80000,
        salaryMax: 110000,
        location: {
            city: 'Austin',
            state: 'TX',
            isRemote: true
        },
        jobType: 'Full-time',
        benefits: ['Health Insurance', 'Creative Budget', 'Remote Work'],
        postedDate: '2024-01-20'
    },
    {
        id: '4',
        title: 'Backend Engineer',
        company: {
            name: 'CloudTech Solutions',
            logo: 'https://images.unsplash.com/photo-1516387938699-a93567ec168e?w=100&h=100&fit=crop&crop=logo',
            size: '200-500 employees'
        },
        description: 'Build scalable backend systems and APIs. Work with microservices architecture and cloud-native technologies.',
        requirements: [
            'Strong experience with Node.js or Python',
            'Database design and optimization',
            'Experience with AWS or Azure',
            'Knowledge of microservices architecture'
        ],
        salaryMin: 95000,
        salaryMax: 130000,
        location: {
            city: 'Seattle',
            state: 'WA',
            isRemote: true
        },
        jobType: 'Full-time',
        benefits: ['Health Insurance', '401k', 'Learning Budget', 'Remote Work'],
        postedDate: '2024-01-22'
    },
    {
        id: '5',
        title: 'Data Scientist',
        company: {
            name: 'AI Innovations Lab',
            logo: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=100&h=100&fit=crop&crop=logo',
            size: '100-200 employees'
        },
        description: 'Apply machine learning techniques to solve complex business problems. Work with large datasets and develop predictive models.',
        requirements: [
            'PhD or Masters in related field',
            'Strong Python and R skills',
            'Experience with ML frameworks',
            'Statistical analysis expertise'
        ],
        salaryMin: 130000,
        salaryMax: 180000,
        location: {
            city: 'Boston',
            state: 'MA',
            isRemote: false
        },
        jobType: 'Full-time',
        benefits: ['Health Insurance', 'Research Budget', 'Conference Funding'],
        postedDate: '2024-01-25'
    }
];

// Application State
let swipeHistory = JSON.parse(localStorage.getItem('swipeHistory') || '[]');
let applications = JSON.parse(localStorage.getItem('applications') || '[]');

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    updateJobStack();
    updateBrowseJobs(mockJobs);
    updateApplicationsList();
    initializeResumeBuilder();
    
    // Search functionality
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    
    // Application tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const status = this.dataset.status;
            filterApplications(status);
        });
    });
});

// Navigation
function initializeNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const pages = document.querySelectorAll('.page');
    
    navButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetPage = this.dataset.page;
            
            navButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            pages.forEach(page => {
                page.classList.remove('active');
                if (page.id === targetPage) {
                    page.classList.add('active');
                }
            });
            
            const titles = {
                'swipe-page': 'Discover Jobs',
                'browse-page': 'Browse Jobs',
                'applications-page': 'Applications',
                'resume-page': 'Resume Builder',
                'profile-page': 'Profile'
            };
            
            const headerTitle = document.querySelector('.header-text h1');
            if (headerTitle && titles[targetPage]) {
                headerTitle.textContent = titles[targetPage];
            }
        });
    });
}

// Job Card Creation
function createJobCard(job) {
    const formatSalary = (min, max) => {
        if (!min && !max) return 'Salary not disclosed';
        if (min && max) return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k`;
        if (min) return `$${(min / 1000).toFixed(0)}k+`;
        return `Up to $${(max / 1000).toFixed(0)}k`;
    };

    const card = document.createElement('div');
    card.className = 'job-card top-card';
    card.dataset.jobId = job.id;
    
    card.innerHTML = `
        <div class="swipe-indicator" id="swipe-indicator-${job.id}">
            <i class="fas fa-arrow-right"></i>
        </div>
        
        <div class="job-header">
            <div class="job-title-section">
                <div class="company-info">
                    <img src="${job.company.logo}" alt="${job.company.name} logo" class="company-logo">
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
                    <span>${formatSalary(job.salaryMin, job.salaryMax)}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-clock"></i>
                    <span>Posted ${new Date(job.postedDate).toLocaleDateString()}</span>
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
                    ${job.requirements.slice(0, 3).map(req => `<li>${req}</li>`).join('')}
                    ${job.requirements.length > 3 ? `<li>+${job.requirements.length - 3} more requirements</li>` : ''}
                </ul>
            </div>

            ${job.benefits ? `
                <div class="benefits-section">
                    <h4>Benefits:</h4>
                    <div class="benefits-tags">
                        ${job.benefits.slice(0, 4).map(benefit => `<span class="benefit-tag">${benefit}</span>`).join('')}
                        ${job.benefits.length > 4 ? `<span class="benefit-tag">+${job.benefits.length - 4}</span>` : ''}
                    </div>
                </div>
            ` : ''}

            <div class="swipe-instructions-card">
                <div class="swipe-directions">
                    <div class="swipe-direction">
                        <i class="fas fa-arrow-left text-red"></i>
                        <span>Pass</span>
                    </div>
                    <div class="swipe-direction">
                        <i class="fas fa-arrow-up text-blue"></i>
                        <span>Save</span>
                    </div>
                    <div class="swipe-direction">
                        <i class="fas fa-arrow-right text-green"></i>
                        <span>Apply</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    addSwipeListeners(card);
    return card;
}

// Swipe Functionality
function addSwipeListeners(card) {
    let startX = 0, startY = 0, isDragging = false;
    const indicator = card.querySelector('.swipe-indicator');

    function handleStart(e) {
        e.preventDefault();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        startX = clientX;
        startY = clientY;
        isDragging = true;
        card.classList.add('dragging');
    }

    function handleMove(e) {
        if (!isDragging) return;
        e.preventDefault();
        
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        
        const deltaX = clientX - startX;
        const deltaY = clientY - startY;
        const rotation = deltaX * 0.1;
        
        card.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(${rotation}deg)`;
        
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);
        
        if (absX > 30 && absX > absY) {
            indicator.className = `swipe-indicator show ${deltaX > 0 ? 'right' : 'left'}`;
            indicator.innerHTML = deltaX > 0 ? '<i class="fas fa-heart"></i>' : '<i class="fas fa-times"></i>';
        } else if (absY > 30 && absY > absX && deltaY < 0) {
            indicator.className = 'swipe-indicator show up';
            indicator.innerHTML = '<i class="fas fa-bookmark"></i>';
        } else {
            indicator.classList.remove('show');
        }
    }

    function handleEnd(e) {
        if (!isDragging) return;
        
        const clientX = e.clientX || (e.changedTouches && e.changedTouches[0].clientX);
        const clientY = e.clientY || (e.changedTouches && e.changedTouches[0].clientY);
        
        const deltaX = clientX - startX;
        const deltaY = clientY - startY;
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);
        
        let direction = null;
        
        if (absX > 50 && absX > absY) {
            direction = deltaX > 0 ? 'right' : 'left';
        } else if (absY > 50 && absY > absX && deltaY < 0) {
            direction = 'up';
        }
        
        if (direction) {
            swipeJob(direction);
        } else {
            card.style.transform = '';
        }
        
        isDragging = false;
        card.classList.remove('dragging');
        indicator.classList.remove('show');
    }

    // Mouse events
    card.addEventListener('mousedown', handleStart);
    card.addEventListener('mousemove', handleMove);
    card.addEventListener('mouseup', handleEnd);
    card.addEventListener('mouseleave', handleEnd);

    // Touch events
    card.addEventListener('touchstart', handleStart);
    card.addEventListener('touchmove', handleMove);
    card.addEventListener('touchend', handleEnd);
}

// Swipe Actions
function swipeJob(direction) {
    const currentJob = getCurrentJob();
    if (!currentJob) return;

    const swipeAction = {
        id: `swipe-${Date.now()}`,
        jobId: currentJob.id,
        action: direction,
        timestamp: new Date().toISOString()
    };
    
    swipeHistory.push(swipeAction);
    localStorage.setItem('swipeHistory', JSON.stringify(swipeHistory));

    if (direction === 'right') {
        const application = {
            id: `app-${Date.now()}`,
            jobId: currentJob.id,
            jobTitle: currentJob.title,
            companyName: currentJob.company.name,
            status: 'pending',
            appliedAt: new Date().toISOString()
        };
        applications.push(application);
        localStorage.setItem('applications', JSON.stringify(applications));
        showToast('Application sent successfully!', 'success');
    } else if (direction === 'left') {
        showToast('Job passed', 'error');
    } else if (direction === 'up') {
        showToast('Job saved for later', 'info');
    }

    updateJobStack();
    updateApplicationsList();
}

function undoLastSwipe() {
    if (swipeHistory.length === 0) {
        showToast('No actions to undo', 'error');
        return;
    }

    const lastSwipe = swipeHistory.pop();
    localStorage.setItem('swipeHistory', JSON.stringify(swipeHistory));

    if (lastSwipe.action === 'right') {
        applications = applications.filter(app => app.jobId !== lastSwipe.jobId);
        localStorage.setItem('applications', JSON.stringify(applications));
    }

    updateJobStack();
    updateApplicationsList();
    showToast('Last action undone', 'info');
}

function getCurrentJob() {
    const swipedJobIds = new Set(swipeHistory.map(s => s.jobId));
    const availableJobs = mockJobs.filter(job => !swipedJobIds.has(job.id));
    return availableJobs[0] || null;
}

function updateJobStack() {
    const jobStack = document.getElementById('job-stack');
    const noJobsMessage = document.getElementById('no-jobs-message');
    const currentJob = getCurrentJob();
    
    if (!currentJob) {
        if (jobStack) jobStack.style.display = 'none';
        if (noJobsMessage) noJobsMessage.style.display = 'block';
        return;
    }
    
    if (jobStack) {
        jobStack.style.display = 'block';
        jobStack.innerHTML = '';
        const card = createJobCard(currentJob);
        jobStack.appendChild(card);
    }
    if (noJobsMessage) noJobsMessage.style.display = 'none';
}

function loadMoreJobs() {
    showToast('Loading more jobs...', 'info');
    setTimeout(() => {
        swipeHistory = [];
        localStorage.setItem('swipeHistory', JSON.stringify(swipeHistory));
        updateJobStack();
        showToast('New jobs loaded!', 'success');
    }, 1000);
}

// Browse Page
function handleSearch() {
    const searchInput = document.getElementById('search-input');
    const query = searchInput.value.toLowerCase();
    const filteredJobs = mockJobs.filter(job =>
        job.title.toLowerCase().includes(query) ||
        job.company.name.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        job.location.city.toLowerCase().includes(query)
    );
    updateBrowseJobs(filteredJobs);
}

function updateBrowseJobs(jobs) {
    const jobList = document.getElementById('job-list');
    const resultsCount = document.getElementById('results-count');
    
    if (resultsCount) {
        resultsCount.textContent = `${jobs.length} jobs found`;
    }
    
    if (!jobList) return;
    
    if (jobs.length === 0) {
        jobList.innerHTML = `
            <div class="text-center p-4">
                <div class="empty-state">
                    <i class="fas fa-search empty-icon"></i>
                    <h3>No jobs found</h3>
                    <p>Try adjusting your search terms</p>
                </div>
            </div>
        `;
        return;
    }
    
    jobList.innerHTML = jobs.map(job => createBrowseJobCard(job)).join('');
}

function createBrowseJobCard(job) {
    const formatSalary = (min, max) => {
        if (!min && !max) return 'Salary not disclosed';
        if (min && max) return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k`;
        if (min) return `$${(min / 1000).toFixed(0)}k+`;
        return `Up to $${(max / 1000).toFixed(0)}k`;
    };

    return `
        <div class="browse-job-card">
            <div class="browse-job-header">
                <div class="browse-job-info">
                    <img src="${job.company.logo}" alt="${job.company.name} logo" class="company-logo">
                    <div>
                        <h3 class="browse-job-title">${job.title}</h3>
                        <p class="browse-company-name">${job.company.name}</p>
                    </div>
                </div>
                <div class="job-type-badge">${job.jobType}</div>
            </div>
            
            <div class="browse-job-details">
                <div>
                    <i class="fas fa-map-marker-alt"></i>
                    ${job.location.city}, ${job.location.state}${job.location.isRemote ? ' (Remote)' : ''}
                </div>
                <div>
                    <i class="fas fa-dollar-sign"></i>
                    ${formatSalary(job.salaryMin, job.salaryMax)}
                </div>
            </div>
            
            <div class="browse-job-description">
                ${job.description}
            </div>
            
            <div class="browse-requirements">
                ${job.requirements.slice(0, 3).map(req => 
                    `<span class="requirement-tag">${req.length > 20 ? req.substring(0, 20) + '...' : req}</span>`
                ).join('')}
                ${job.requirements.length > 3 ? `<span class="requirement-tag">+${job.requirements.length - 3}</span>` : ''}
            </div>
            
            <div class="browse-actions">
                <button class="btn btn-outline" onclick="viewJobDetails('${job.id}')">View Details</button>
                <button class="btn btn-primary" onclick="quickApply('${job.id}')">Quick Apply</button>
            </div>
        </div>
    `;
}

function quickApply(jobId) {
    const job = mockJobs.find(j => j.id === jobId);
    if (!job) return;
    
    if (applications.some(app => app.jobId === jobId)) {
        showToast('You have already applied to this job', 'error');
        return;
    }
    
    const application = {
        id: `app-${Date.now()}`,
        jobId: jobId,
        jobTitle: job.title,
        companyName: job.company.name,
        status: 'pending',
        appliedAt: new Date().toISOString()
    };
    
    applications.push(application);
    localStorage.setItem('applications', JSON.stringify(applications));
    updateApplicationsList();
    showToast('Application sent successfully!', 'success');
}

function viewJobDetails(jobId) {
    showToast('Job details feature coming soon!', 'info');
}

// Applications Page
function updateApplicationsList() {
    const applicationsList = document.getElementById('applications-list');
    if (!applicationsList) return;
    
    if (applications.length === 0) {
        applicationsList.innerHTML = `
            <div class="text-center p-4">
                <div class="empty-state">
                    <i class="fas fa-briefcase empty-icon"></i>
                    <h3>No applications yet</h3>
                    <p>Start swiping to apply to jobs!</p>
                </div>
            </div>
        `;
        return;
    }
    
    applicationsList.innerHTML = applications
        .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
        .map(app => createApplicationCard(app)).join('');
}

function createApplicationCard(application) {
    return `
        <div class="application-card">
            <div class="application-header">
                <div>
                    <h3>${application.jobTitle}</h3>
                    <p>${application.companyName}</p>
                </div>
                <span class="status-badge status-${application.status}">${application.status}</span>
            </div>
            
            <div class="application-details">
                <p>Applied on ${new Date(application.appliedAt).toLocaleDateString()}</p>
            </div>
            
            <div class="application-actions">
                <button class="btn btn-outline" onclick="viewApplication('${application.id}')">View Details</button>
                <button class="btn btn-outline" onclick="withdrawApplication('${application.id}')">Withdraw</button>
            </div>
        </div>
    `;
}

function filterApplications(status) {
    const filtered = status === 'all' ? applications : applications.filter(app => app.status === status);
    const applicationsList = document.getElementById('applications-list');
    
    if (!applicationsList) return;
    
    if (filtered.length === 0) {
        applicationsList.innerHTML = `
            <div class="text-center p-4">
                <div class="empty-state">
                    <i class="fas fa-briefcase empty-icon"></i>
                    <h3>No ${status === 'all' ? '' : status} applications</h3>
                    <p>No applications found with this status.</p>
                </div>
            </div>
        `;
        return;
    }
    
    applicationsList.innerHTML = filtered
        .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
        .map(app => createApplicationCard(app)).join('');
}

function viewApplication(appId) {
    showToast('Application details feature coming soon!', 'info');
}

function withdrawApplication(appId) {
    applications = applications.filter(app => app.id !== appId);
    localStorage.setItem('applications', JSON.stringify(applications));
    updateApplicationsList();
    showToast('Application withdrawn', 'success');
}

// Resume Builder
function initializeResumeBuilder() {
    const savedResume = JSON.parse(localStorage.getItem('resume') || '{}');
    
    const fields = ['firstName', 'lastName', 'email', 'phone', 'location', 'linkedin', 'summary', 'technicalSkills', 'softSkills'];
    fields.forEach(field => {
        const element = document.getElementById(field);
        if (element && savedResume[field]) {
            element.value = savedResume[field];
        }
        if (element) {
            element.addEventListener('input', saveResumeData);
        }
    });
}

function saveResumeData() {
    const resumeData = {
        firstName: document.getElementById('firstName').value || '',
        lastName: document.getElementById('lastName').value || '',
        email: document.getElementById('email').value || '',
        phone: document.getElementById('phone').value || '',
        location: document.getElementById('location').value || '',
        linkedin: document.getElementById('linkedin').value || '',
        summary: document.getElementById('summary').value || '',
        technicalSkills: document.getElementById('technicalSkills').value || '',
        softSkills: document.getElementById('softSkills').value || ''
    };
    
    localStorage.setItem('resume', JSON.stringify(resumeData));
}

function addExperience() {
    const experienceList = document.getElementById('experience-list');
    const experienceId = Date.now();
    
    const experienceItem = document.createElement('div');
    experienceItem.className = 'experience-item';
    experienceItem.id = `experience-${experienceId}`;
    
    experienceItem.innerHTML = `
        <div class="experience-header">
            <h4>Work Experience</h4>
            <button type="button" class="remove-btn" onclick="removeExperience('${experienceId}')">Remove</button>
        </div>
        <div class="form-grid">
            <input type="text" placeholder="Job Title" name="position">
            <input type="text" placeholder="Company" name="company">
            <input type="text" placeholder="Location" name="location">
            <input type="month" placeholder="Start Date" name="startDate">
            <input type="month" placeholder="End Date" name="endDate">
            <label class="full-width"><input type="checkbox" name="isCurrent"> I currently work here</label>
            <textarea placeholder="Job description and achievements..." name="description" rows="3" class="full-width"></textarea>
        </div>
    `;
    
    experienceList.appendChild(experienceItem);
}

function removeExperience(experienceId) {
    const experienceItem = document.getElementById(`experience-${experienceId}`);
    if (experienceItem) {
        experienceItem.remove();
    }
}

function addEducation() {
    const educationList = document.getElementById('education-list');
    const educationId = Date.now();
    
    const educationItem = document.createElement('div');
    educationItem.className = 'education-item';
    educationItem.id = `education-${educationId}`;
    
    educationItem.innerHTML = `
        <div class="education-header">
            <h4>Education</h4>
            <button type="button" class="remove-btn" onclick="removeEducation('${educationId}')">Remove</button>
        </div>
        <div class="form-grid">
            <input type="text" placeholder="Institution" name="institution">
            <input type="text" placeholder="Degree" name="degree">
            <input type="text" placeholder="Field of Study" name="fieldOfStudy">
            <input type="text" placeholder="Location" name="location">
            <input type="month" placeholder="Start Date" name="startDate">
            <input type="month" placeholder="End Date" name="endDate">
            <input type="text" placeholder="GPA (Optional)" name="gpa" class="full-width">
        </div>
    `;
    
    educationList.appendChild(educationItem);
}

function removeEducation(educationId) {
    const educationItem = document.getElementById(`education-${educationId}`);
    if (educationItem) {
        educationItem.remove();
    }
}

// Toast Notifications
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}