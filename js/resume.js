// Resume builder functionality

class ResumeBuilder {
    constructor() {
        this.resumeData = Storage.get('resumeData', this.getDefaultResumeData());
        this.experienceCounter = 0;
        this.educationCounter = 0;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.loadResumeData();
        this.setupAutoSave();
    }
    
    getDefaultResumeData() {
        return {
            personalInfo: {
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                address: '',
                linkedin: ''
            },
            summary: '',
            experience: [],
            education: [],
            skills: {
                technical: '',
                soft: ''
            }
        };
    }
    
    bindEvents() {
        // Add experience button
        const addExperienceBtn = DOM.find('#addExperienceBtn');
        if (addExperienceBtn) {
            addExperienceBtn.addEventListener('click', () => this.addExperience());
        }
        
        // Add education button
        const addEducationBtn = DOM.find('#addEducationBtn');
        if (addEducationBtn) {
            addEducationBtn.addEventListener('click', () => this.addEducation());
        }
        
        // Form submission
        const resumeForm = DOM.find('#resumeForm');
        if (resumeForm) {
            resumeForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }
        
        // Preview and download buttons
        const previewBtn = DOM.find('#previewBtn');
        const downloadBtn = DOM.find('#downloadBtn');
        
        if (previewBtn) {
            previewBtn.addEventListener('click', () => this.previewResume());
        }
        
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.downloadResume());
        }
    }
    
    setupAutoSave() {
        // Auto-save on input changes
        const form = DOM.find('#resumeForm');
        if (form) {
            form.addEventListener('input', debounce(() => {
                this.saveResumeData();
            }, 1000));
        }
    }
    
    loadResumeData() {
        // Load personal information
        const personalInfo = this.resumeData.personalInfo;
        Object.keys(personalInfo).forEach(key => {
            const input = DOM.find(`#${key}`);
            if (input && personalInfo[key]) {
                input.value = personalInfo[key];
            }
        });
        
        // Load summary
        const summaryTextarea = DOM.find('#summary');
        if (summaryTextarea && this.resumeData.summary) {
            summaryTextarea.value = this.resumeData.summary;
        }
        
        // Load skills
        const technicalSkills = DOM.find('#technicalSkills');
        const softSkills = DOM.find('#softSkills');
        
        if (technicalSkills && this.resumeData.skills.technical) {
            technicalSkills.value = this.resumeData.skills.technical;
        }
        
        if (softSkills && this.resumeData.skills.soft) {
            softSkills.value = this.resumeData.skills.soft;
        }
        
        // Load experience
        this.resumeData.experience.forEach(exp => {
            this.addExperience(exp);
        });
        
        // Load education
        this.resumeData.education.forEach(edu => {
            this.addEducation(edu);
        });
    }
    
    addExperience(data = null) {
        const experienceList = DOM.find('#experienceList');
        if (!experienceList) return;
        
        const id = `experience-${++this.experienceCounter}`;
        const experienceItem = DOM.createElement('div', 'experience-item');
        experienceItem.id = id;
        
        experienceItem.innerHTML = `
            <div class="item-header">
                <h4>Work Experience</h4>
                <button type="button" class="remove-btn" onclick="resumeBuilder.removeExperience('${id}')">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
            <div class="item-grid">
                <div class="form-group">
                    <label>Job Title *</label>
                    <input type="text" name="jobTitle" value="${data?.jobTitle || ''}" required>
                </div>
                <div class="form-group">
                    <label>Company *</label>
                    <input type="text" name="company" value="${data?.company || ''}" required>
                </div>
                <div class="form-group">
                    <label>Location</label>
                    <input type="text" name="location" value="${data?.location || ''}" placeholder="City, State">
                </div>
                <div class="form-group">
                    <label>Employment Type</label>
                    <select name="employmentType">
                        <option value="Full-time" ${data?.employmentType === 'Full-time' ? 'selected' : ''}>Full-time</option>
                        <option value="Part-time" ${data?.employmentType === 'Part-time' ? 'selected' : ''}>Part-time</option>
                        <option value="Contract" ${data?.employmentType === 'Contract' ? 'selected' : ''}>Contract</option>
                        <option value="Freelance" ${data?.employmentType === 'Freelance' ? 'selected' : ''}>Freelance</option>
                        <option value="Internship" ${data?.employmentType === 'Internship' ? 'selected' : ''}>Internship</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Start Date</label>
                    <input type="month" name="startDate" value="${data?.startDate || ''}">
                </div>
                <div class="form-group">
                    <label>End Date</label>
                    <input type="month" name="endDate" value="${data?.endDate || ''}" ${data?.isCurrent ? 'disabled' : ''}>
                </div>
                <div class="form-group full-width">
                    <div class="checkbox-group">
                        <input type="checkbox" name="isCurrent" ${data?.isCurrent ? 'checked' : ''} 
                               onchange="this.closest('.experience-item').querySelector('input[name=endDate]').disabled = this.checked">
                        <label>I currently work here</label>
                    </div>
                </div>
                <div class="form-group full-width">
                    <label>Job Description & Achievements</label>
                    <textarea name="description" rows="4" placeholder="Describe your responsibilities and key achievements...">${data?.description || ''}</textarea>
                </div>
            </div>
        `;
        
        experienceList.appendChild(experienceItem);
        Animation.slideUp(experienceItem);
    }
    
    removeExperience(id) {
        const item = DOM.find(`#${id}`);
        if (item && confirm('Are you sure you want to remove this experience?')) {
            item.remove();
            this.saveResumeData();
        }
    }
    
    addEducation(data = null) {
        const educationList = DOM.find('#educationList');
        if (!educationList) return;
        
        const id = `education-${++this.educationCounter}`;
        const educationItem = DOM.createElement('div', 'education-item');
        educationItem.id = id;
        
        educationItem.innerHTML = `
            <div class="item-header">
                <h4>Education</h4>
                <button type="button" class="remove-btn" onclick="resumeBuilder.removeEducation('${id}')">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
            <div class="item-grid">
                <div class="form-group">
                    <label>Institution *</label>
                    <input type="text" name="institution" value="${data?.institution || ''}" required>
                </div>
                <div class="form-group">
                    <label>Degree *</label>
                    <input type="text" name="degree" value="${data?.degree || ''}" placeholder="Bachelor's, Master's, etc." required>
                </div>
                <div class="form-group">
                    <label>Field of Study</label>
                    <input type="text" name="fieldOfStudy" value="${data?.fieldOfStudy || ''}" placeholder="Computer Science, Business, etc.">
                </div>
                <div class="form-group">
                    <label>Location</label>
                    <input type="text" name="location" value="${data?.location || ''}" placeholder="City, State">
                </div>
                <div class="form-group">
                    <label>Start Date</label>
                    <input type="month" name="startDate" value="${data?.startDate || ''}">
                </div>
                <div class="form-group">
                    <label>Graduation Date</label>
                    <input type="month" name="endDate" value="${data?.endDate || ''}">
                </div>
                <div class="form-group">
                    <label>GPA (Optional)</label>
                    <input type="number" name="gpa" step="0.01" min="0" max="4" value="${data?.gpa || ''}" placeholder="3.8">
                </div>
                <div class="form-group">
                    <label>Honors/Awards</label>
                    <input type="text" name="honors" value="${data?.honors || ''}" placeholder="Magna Cum Laude, Dean's List, etc.">
                </div>
                <div class="form-group full-width">
                    <label>Activities & Societies</label>
                    <textarea name="activities" rows="2" placeholder="Student organizations, clubs, volunteer work...">${data?.activities || ''}</textarea>
                </div>
            </div>
        `;
        
        educationList.appendChild(educationItem);
        Animation.slideUp(educationItem);
    }
    
    removeEducation(id) {
        const item = DOM.find(`#${id}`);
        if (item && confirm('Are you sure you want to remove this education entry?')) {
            item.remove();
            this.saveResumeData();
        }
    }
    
    saveResumeData() {
        const formData = new FormData(DOM.find('#resumeForm'));
        
        // Personal information
        const personalInfo = {};
        ['firstName', 'lastName', 'email', 'phone', 'address', 'linkedin'].forEach(field => {
            personalInfo[field] = formData.get(field) || '';
        });
        
        // Summary
        const summary = formData.get('summary') || '';
        
        // Skills
        const skills = {
            technical: formData.get('technicalSkills') || '',
            soft: formData.get('softSkills') || ''
        };
        
        // Experience
        const experience = [];
        DOM.findAll('.experience-item').forEach(item => {
            const expData = new FormData();
            item.querySelectorAll('input, textarea, select').forEach(input => {
                expData.append(input.name, input.type === 'checkbox' ? input.checked : input.value);
            });
            
            experience.push({
                jobTitle: expData.get('jobTitle'),
                company: expData.get('company'),
                location: expData.get('location'),
                employmentType: expData.get('employmentType'),
                startDate: expData.get('startDate'),
                endDate: expData.get('endDate'),
                isCurrent: expData.get('isCurrent') === 'true',
                description: expData.get('description')
            });
        });
        
        // Education
        const education = [];
        DOM.findAll('.education-item').forEach(item => {
            const eduData = new FormData();
            item.querySelectorAll('input, textarea, select').forEach(input => {
                eduData.append(input.name, input.value);
            });
            
            education.push({
                institution: eduData.get('institution'),
                degree: eduData.get('degree'),
                fieldOfStudy: eduData.get('fieldOfStudy'),
                location: eduData.get('location'),
                startDate: eduData.get('startDate'),
                endDate: eduData.get('endDate'),
                gpa: eduData.get('gpa'),
                honors: eduData.get('honors'),
                activities: eduData.get('activities')
            });
        });
        
        this.resumeData = {
            personalInfo,
            summary,
            experience,
            education,
            skills
        };
        
        Storage.set('resumeData', this.resumeData);
    }
    
    handleFormSubmit(e) {
        e.preventDefault();
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.classList.add('saving');
        submitBtn.disabled = true;
        
        this.saveResumeData();
        
        setTimeout(() => {
            submitBtn.classList.remove('saving');
            submitBtn.disabled = false;
            Toast.success('Resume saved successfully!');
        }, 1000);
    }
    
    previewResume() {
        // Create a simple preview modal or new window
        const previewWindow = window.open('', '_blank', 'width=800,height=600');
        const resumeHTML = this.generateResumeHTML();
        
        previewWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Resume Preview</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 2rem; line-height: 1.6; }
                    .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 1rem; margin-bottom: 2rem; }
                    .section { margin-bottom: 2rem; }
                    .section h2 { color: #333; border-bottom: 1px solid #ccc; padding-bottom: 0.5rem; }
                    .experience-item, .education-item { margin-bottom: 1rem; }
                    .item-header { font-weight: bold; }
                    .item-details { color: #666; font-size: 0.9em; }
                </style>
            </head>
            <body>${resumeHTML}</body>
            </html>
        `);
    }
    
    generateResumeHTML() {
        const { personalInfo, summary, experience, education, skills } = this.resumeData;
        
        let html = `
            <div class="header">
                <h1>${personalInfo.firstName} ${personalInfo.lastName}</h1>
                <p>${personalInfo.email} | ${personalInfo.phone}</p>
                <p>${personalInfo.address}</p>
                ${personalInfo.linkedin ? `<p><a href="${personalInfo.linkedin}">LinkedIn Profile</a></p>` : ''}
            </div>
        `;
        
        if (summary) {
            html += `
                <div class="section">
                    <h2>Professional Summary</h2>
                    <p>${summary}</p>
                </div>
            `;
        }
        
        if (experience.length > 0) {
            html += `<div class="section"><h2>Work Experience</h2>`;
            experience.forEach(exp => {
                html += `
                    <div class="experience-item">
                        <div class="item-header">${exp.jobTitle} - ${exp.company}</div>
                        <div class="item-details">${exp.location} | ${exp.employmentType} | ${exp.startDate} - ${exp.isCurrent ? 'Present' : exp.endDate}</div>
                        <p>${exp.description}</p>
                    </div>
                `;
            });
            html += `</div>`;
        }
        
        if (education.length > 0) {
            html += `<div class="section"><h2>Education</h2>`;
            education.forEach(edu => {
                html += `
                    <div class="education-item">
                        <div class="item-header">${edu.degree} in ${edu.fieldOfStudy} - ${edu.institution}</div>
                        <div class="item-details">${edu.location} | ${edu.startDate} - ${edu.endDate}</div>
                        ${edu.gpa ? `<p>GPA: ${edu.gpa}</p>` : ''}
                        ${edu.honors ? `<p>Honors: ${edu.honors}</p>` : ''}
                        ${edu.activities ? `<p>Activities: ${edu.activities}</p>` : ''}
                    </div>
                `;
            });
            html += `</div>`;
        }
        
        if (skills.technical || skills.soft) {
            html += `<div class="section"><h2>Skills</h2>`;
            if (skills.technical) {
                html += `<p><strong>Technical Skills:</strong> ${skills.technical}</p>`;
            }
            if (skills.soft) {
                html += `<p><strong>Soft Skills:</strong> ${skills.soft}</p>`;
            }
            html += `</div>`;
        }
        
        return html;
    }
    
    downloadResume() {
        Toast.info('PDF download feature coming soon! Use the preview for now.');
    }
}

// Initialize resume builder when page loads
DOM.ready(() => {
    if (getCurrentPage() === 'resume.html') {
        window.resumeBuilder = new ResumeBuilder();
    }
});

// Helper function to get current page
function getCurrentPage() {
    return window.location.pathname.split('/').pop();
}