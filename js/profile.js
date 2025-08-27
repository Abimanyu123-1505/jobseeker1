// Profile page functionality

class ProfileManager {
    constructor() {
        this.profileData = Storage.get('profileData', this.getDefaultProfileData());
        this.init();
    }
    
    init() {
        this.loadProfileData();
        this.bindEvents();
        this.updateStats();
    }
    
    getDefaultProfileData() {
        return {
            personal: {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phone: ''
            },
            preferences: {
                jobTypes: ['Full-time'],
                industries: ['Technology'],
                locations: 'San Francisco, Remote',
                minSalary: 80000,
                maxSalary: 150000,
                remotePreference: 'any'
            },
            notifications: {
                jobRecommendations: true,
                applicationUpdates: true,
                interviewReminders: true,
                weeklySummary: false
            }
        };
    }
    
    loadProfileData() {
        // Load personal information
        const { personal, preferences, notifications } = this.profileData;
        
        // Update profile header
        DOM.find('#profileName').textContent = `${personal.firstName} ${personal.lastName}`;
        DOM.find('#profileEmail').textContent = personal.email;
        
        // Load account form
        DOM.find('#firstName').value = personal.firstName;
        DOM.find('#lastName').value = personal.lastName;
        DOM.find('#email').value = personal.email;
        DOM.find('#phone').value = personal.phone;
        
        // Load preferences
        DOM.find('#preferredLocations').value = preferences.locations;
        DOM.find('#minSalary').value = preferences.minSalary;
        DOM.find('#maxSalary').value = preferences.maxSalary;
        DOM.find('#remotePreference').value = preferences.remotePreference;
        
        // Load job type checkboxes
        DOM.findAll('input[name="jobTypes"]').forEach(checkbox => {
            checkbox.checked = preferences.jobTypes.includes(checkbox.value);
        });
        
        // Load industry checkboxes
        DOM.findAll('input[name="industries"]').forEach(checkbox => {
            checkbox.checked = preferences.industries.includes(checkbox.value);
        });
        
        // Load notification settings
        Object.keys(notifications).forEach(key => {
            const checkbox = DOM.find(`input[name="${key}"]`);
            if (checkbox) {
                checkbox.checked = notifications[key];
            }
        });
    }
    
    bindEvents() {
        // Account form submission
        const accountForm = DOM.find('#accountForm');
        if (accountForm) {
            accountForm.addEventListener('submit', (e) => this.handleAccountSubmit(e));
        }
        
        // Preferences form submission
        const preferencesForm = DOM.find('#preferencesForm');
        if (preferencesForm) {
            preferencesForm.addEventListener('submit', (e) => this.handlePreferencesSubmit(e));
        }
        
        // Notification form submission
        const notificationForm = DOM.find('#notificationForm');
        if (notificationForm) {
            notificationForm.addEventListener('submit', (e) => this.handleNotificationSubmit(e));
        }
        
        // Data management buttons
        const exportDataBtn = DOM.find('#exportDataBtn');
        const clearHistoryBtn = DOM.find('#clearHistoryBtn');
        const deleteAccountBtn = DOM.find('#deleteAccountBtn');
        
        if (exportDataBtn) {
            exportDataBtn.addEventListener('click', () => this.exportData());
        }
        
        if (clearHistoryBtn) {
            clearHistoryBtn.addEventListener('click', () => this.clearHistory());
        }
        
        if (deleteAccountBtn) {
            deleteAccountBtn.addEventListener('click', () => this.deleteAccount());
        }
        
        // Auto-save on input changes
        [accountForm, preferencesForm, notificationForm].forEach(form => {
            if (form) {
                form.addEventListener('change', debounce(() => {
                    this.saveAllData();
                }, 1000));
            }
        });
    }
    
    handleAccountSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        this.profileData.personal = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone') || ''
        };
        
        this.saveProfileData();
        this.loadProfileData(); // Refresh display
        Toast.success('Account information updated!');
    }
    
    handlePreferencesSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        
        // Get selected job types
        const jobTypes = [];
        DOM.findAll('input[name="jobTypes"]:checked').forEach(checkbox => {
            jobTypes.push(checkbox.value);
        });
        
        // Get selected industries
        const industries = [];
        DOM.findAll('input[name="industries"]:checked').forEach(checkbox => {
            industries.push(checkbox.value);
        });
        
        this.profileData.preferences = {
            jobTypes,
            industries,
            locations: formData.get('preferredLocations') || DOM.find('#preferredLocations').value,
            minSalary: parseInt(formData.get('minSalary')) || parseInt(DOM.find('#minSalary').value) || 0,
            maxSalary: parseInt(formData.get('maxSalary')) || parseInt(DOM.find('#maxSalary').value) || 0,
            remotePreference: formData.get('remotePreference') || DOM.find('#remotePreference').value
        };
        
        this.saveProfileData();
        Toast.success('Job preferences updated!');
    }
    
    handleNotificationSubmit(e) {
        e.preventDefault();
        
        const notifications = {};
        DOM.findAll('.notification-form input[type="checkbox"]').forEach(checkbox => {
            notifications[checkbox.name] = checkbox.checked;
        });
        
        this.profileData.notifications = notifications;
        this.saveProfileData();
        Toast.success('Notification settings updated!');
    }
    
    saveAllData() {
        // Collect all form data
        const accountForm = DOM.find('#accountForm');
        const preferencesForm = DOM.find('#preferencesForm');
        const notificationForm = DOM.find('#notificationForm');
        
        if (accountForm) {
            const formData = new FormData(accountForm);
            this.profileData.personal = {
                firstName: formData.get('firstName') || DOM.find('#firstName').value,
                lastName: formData.get('lastName') || DOM.find('#lastName').value,
                email: formData.get('email') || DOM.find('#email').value,
                phone: formData.get('phone') || DOM.find('#phone').value || ''
            };
        }
        
        if (preferencesForm) {
            // Job types
            const jobTypes = [];
            DOM.findAll('input[name="jobTypes"]:checked').forEach(checkbox => {
                jobTypes.push(checkbox.value);
            });
            
            // Industries
            const industries = [];
            DOM.findAll('input[name="industries"]:checked').forEach(checkbox => {
                industries.push(checkbox.value);
            });
            
            this.profileData.preferences = {
                jobTypes,
                industries,
                locations: DOM.find('#preferredLocations').value,
                minSalary: parseInt(DOM.find('#minSalary').value) || 0,
                maxSalary: parseInt(DOM.find('#maxSalary').value) || 0,
                remotePreference: DOM.find('#remotePreference').value
            };
        }
        
        if (notificationForm) {
            const notifications = {};
            DOM.findAll('.notification-form input[type="checkbox"]').forEach(checkbox => {
                notifications[checkbox.name] = checkbox.checked;
            });
            this.profileData.notifications = notifications;
        }
        
        this.saveProfileData();
        this.loadProfileData(); // Refresh display
    }
    
    saveProfileData() {
        Storage.set('profileData', this.profileData);
    }
    
    updateStats() {
        // Update application count
        const applications = Storage.get('applications', []);
        DOM.find('#applicationsCount').textContent = applications.length;
        
        // Update saved jobs count
        const swipeHistory = Storage.get('swipeHistory', []);
        const savedJobs = swipeHistory.filter(swipe => swipe.action === 'save');
        DOM.find('#savedJobsCount').textContent = savedJobs.length;
        
        // Profile views is just a placeholder for now
        DOM.find('#profileViews').textContent = '24';
    }
    
    exportData() {
        const allData = {
            profile: this.profileData,
            applications: Storage.get('applications', []),
            swipeHistory: Storage.get('swipeHistory', []),
            resumeData: Storage.get('resumeData', {}),
            exportedAt: new Date().toISOString()
        };
        
        const dataBlob = new Blob([JSON.stringify(allData, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `swipehire-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        Toast.success('Data exported successfully!');
    }
    
    clearHistory() {
        if (confirm('Are you sure you want to clear all your application history? This action cannot be undone.')) {
            Storage.remove('applications');
            Storage.remove('swipeHistory');
            this.updateStats();
            Toast.success('Application history cleared!');
            
            // Refresh other pages if needed
            eventBus.emit('historyCleared');
        }
    }
    
    deleteAccount() {
        const confirmation = prompt('Type "DELETE" to confirm account deletion:');
        if (confirmation === 'DELETE') {
            // Clear all stored data
            Storage.remove('profileData');
            Storage.remove('applications');
            Storage.remove('swipeHistory');
            Storage.remove('resumeData');
            
            Toast.success('Account deleted successfully!');
            
            // Redirect to home page after a delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } else if (confirmation !== null) {
            Toast.error('Incorrect confirmation. Account not deleted.');
        }
    }
}

// Initialize profile manager when page loads
DOM.ready(() => {
    if (getCurrentPage() === 'profile.html') {
        window.profileManager = new ProfileManager();
    }
});

// Helper function to get current page
function getCurrentPage() {
    return window.location.pathname.split('/').pop();
}