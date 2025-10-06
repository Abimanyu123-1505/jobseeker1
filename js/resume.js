// Resume builder functionality

class ResumeBuilder {
    constructor() {
        this.resumeData = Storage.get('resumeData', this.getDefaultResumeData());
        this.experienceCounter = 0;
        this.educationCounter = 0;
        this.projectCounter = 0;
        this.selectedTemplate = 'modern';
        this.selectedIndustry = 'technology';
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.loadResumeData();
        this.setupAutoSave();
        this.updateProgress();
        this.showIndustrySections();
    }
    
    getDefaultResumeData() {
        return {
            personalInfo: {
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                city: '',
                state: '',
                zipCode: '',
                linkedin: '',
                portfolio: ''
            },
            summary: '',
            experience: [],
            education: [],
            projects: [],
            industry: 'technology',
            skills: {
                // Technology
                programmingLanguages: [],
                frameworks: [],
                tools: [],
                // Business
                financialSkills: [],
                businessTools: [],
                businessCerts: [],
                // Healthcare
                medicalSkills: [],
                medicalCerts: [],
                specializations: [],
                // Creative
                designTools: [],
                creativeSkills: [],
                // Education
                teachingCerts: [],
                subjects: [],
                teachingMethods: [],
                // General
                technical: [],
                soft: [],
                languages: [],
                certifications: []
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

        // Add project buttons
        const addProjectBtn = DOM.find('#addProjectBtn');
        if (addProjectBtn) {
            addProjectBtn.addEventListener('click', () => this.addProject());
        }

        const addCreativeProjectBtn = DOM.find('#addCreativeProjectBtn');
        if (addCreativeProjectBtn) {
            addCreativeProjectBtn.addEventListener('click', () => this.addCreativeProject());
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

        // Industry selection
        DOM.findAll('.industry-option').forEach(option => {
            option.addEventListener('click', () => {
                DOM.findAll('.industry-option').forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                this.selectedIndustry = option.dataset.industry;
                this.resumeData.industry = this.selectedIndustry;
                this.showIndustrySections();
                this.saveResumeData();
            });
        });

        // Template selection
        DOM.findAll('.template-option').forEach(option => {
            option.addEventListener('click', () => {
                DOM.findAll('.template-option').forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                this.selectedTemplate = option.dataset.template;
            });
        });

        // Auto-update progress on input
        const form = DOM.find('#resumeForm');
        if (form) {
            form.addEventListener('input', () => {
                this.updateProgress();
            });
        }
    }

    showIndustrySections() {
        // Hide all industry-specific sections
        DOM.findAll('.industry-specific').forEach(section => {
            section.style.display = 'none';
        });
        
        // Show only the selected industry section
        const activeSection = DOM.find(`.industry-specific[data-industry="${this.selectedIndustry}"]`);
        if (activeSection) {
            activeSection.style.display = 'block';
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

    updateProgress() {
        let progress = 0;
        const totalFields = 12;
        
        // Personal info
        if (this.resumeData.personalInfo.firstName) progress += 10;
        if (this.resumeData.personalInfo.lastName) progress += 10;
        if (this.resumeData.personalInfo.email) progress += 10;
        
        // Summary
        if (this.resumeData.summary) progress += 10;
        
        // Experience
        if (this.resumeData.experience.length > 0) progress += 20;
        
        // Education
        if (this.resumeData.education.length > 0) progress += 15;
        
        // Skills (industry-specific)
        progress += this.calculateSkillsProgress();
        
        // Ensure progress doesn't exceed 100%
        progress = Math.min(progress, 100);
        
        const progressBar = DOM.find('#resumeProgress');
        const progressText = DOM.find('#progressPercentage');
        
        if (progressBar && progressText) {
            progressBar.style.width = `${progress}%`;
            progressText.textContent = `${progress}%`;
        }
    }

    calculateSkillsProgress() {
        let skillsProgress = 0;
        const industrySkills = this.getIndustrySkills();
        
        if (industrySkills.some(skillType => this.resumeData.skills[skillType]?.length > 0)) {
            skillsProgress += 25;
        }
        
        return skillsProgress;
    }

    getIndustrySkills() {
        const industrySkillMap = {
            technology: ['programmingLanguages', 'frameworks', 'tools'],
            business: ['financialSkills', 'businessTools', 'businessCerts'],
            healthcare: ['medicalSkills', 'medicalCerts', 'specializations'],
            creative: ['designTools', 'creativeSkills'],
            education: ['teachingCerts', 'subjects', 'teachingMethods'],
            general: ['technical', 'soft', 'languages', 'certifications']
        };
        
        return industrySkillMap[this.selectedIndustry] || [];
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
        
        // Load industry selection
        if (this.resumeData.industry) {
            this.selectedIndustry = this.resumeData.industry;
            const industryOption = DOM.find(`.industry-option[data-industry="${this.resumeData.industry}"]`);
            if (industryOption) {
                DOM.findAll('.industry-option').forEach(opt => opt.classList.remove('active'));
                industryOption.classList.add('active');
            }
        }
        
        // Load skills tags
        this.renderSkillsTags();
        
        // Load experience
        this.resumeData.experience.forEach(exp => {
            this.addExperience(exp);
        });
        
        // Load education
        this.resumeData.education.forEach(edu => {
            this.addEducation(edu);
        });

        // Load projects
        this.resumeData.projects.forEach(project => {
            this.addProject(project);
        });

        this.showIndustrySections();
    }

    renderSkillsTags() {
        const allSkillTypes = [
            // Technology
            'programmingLanguages', 'frameworks', 'tools',
            // Business
            'financialSkills', 'businessTools', 'businessCerts',
            // Healthcare
            'medicalSkills', 'medicalCerts', 'specializations',
            // Creative
            'designTools', 'creativeSkills',
            // Education
            'teachingCerts', 'subjects', 'teachingMethods',
            // General
            'technical', 'soft', 'languages', 'certifications'
        ];
        
        allSkillTypes.forEach(type => {
            const container = DOM.find(`#${type}Tags`);
            if (container && this.resumeData.skills[type]) {
                container.innerHTML = this.resumeData.skills[type].map(skill => 
                    `<span class="skill-tag">${skill}<i class="fas fa-times" onclick="resumeBuilder.removeSkill('${type}', '${skill}')"></i></span>`
                ).join('');
            }
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
                <div class="form-group required">
                    <label>Job Title</label>
                    <input type="text" name="jobTitle" value="${data?.jobTitle || ''}" required>
                </div>
                <div class="form-group required">
                    <label>Company</label>
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
                <div class="form-group required">
                    <label>Institution</label>
                    <input type="text" name="institution" value="${data?.institution || ''}" required>
                </div>
                <div class="form-group required">
                    <label>Degree</label>
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

    addProject(data = null) {
        const projectsList = DOM.find('#projectsList');
        const id = `project-${++this.projectCounter}`;
        
        const projectItem = DOM.createElement('div', 'project-item');
        projectItem.innerHTML = `
            <div class="item-header">
                <h4>Technical Project</h4>
                <button type="button" class="remove-btn" onclick="resumeBuilder.removeProject('${id}')">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
            <div class="item-grid">
                <div class="form-group required">
                    <label>Project Name</label>
                    <input type="text" name="projectName" value="${data?.name || ''}" required>
                </div>
                <div class="form-group">
                    <label>Technologies Used</label>
                    <input type="text" name="technologies" value="${data?.technologies || ''}" placeholder="React, Node.js, MongoDB...">
                </div>
                <div class="form-group full-width">
                    <label>Project Description</label>
                    <textarea name="description" rows="3" placeholder="Describe the project and your role...">${data?.description || ''}</textarea>
                </div>
                <div class="form-group full-width">
                    <label>Project URL (Optional)</label>
                    <input type="url" name="projectUrl" value="${data?.url || ''}" placeholder="https://your-project.com">
                </div>
            </div>
        `;
        
        projectsList.appendChild(projectItem);
        Animation.slideUp(projectItem);
    }

    addCreativeProject(data = null) {
        const projectsList = DOM.find('#creativeProjectsList');
        const id = `creative-project-${++this.projectCounter}`;
        
        const projectItem = DOM.createElement('div', 'project-item');
        projectItem.innerHTML = `
            <div class="item-header">
                <h4>Creative Project</h4>
                <button type="button" class="remove-btn" onclick="resumeBuilder.removeProject('${id}')">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
            <div class="item-grid">
                <div class="form-group required">
                    <label>Project Name</label>
                    <input type="text" name="projectName" value="${data?.name || ''}" required>
                </div>
                <div class="form-group">
                    <label>Tools Used</label>
                    <input type="text" name="tools" value="${data?.tools || ''}" placeholder="Photoshop, Illustrator, Figma...">
                </div>
                <div class="form-group full-width">
                    <label>Project Description</label>
                    <textarea name="description" rows="3" placeholder="Describe the creative concept and your role...">${data?.description || ''}</textarea>
                </div>
                <div class="form-group full-width">
                    <label>Project URL/Portfolio Link</label>
                    <input type="url" name="projectUrl" value="${data?.url || ''}" placeholder="https://your-portfolio.com/project">
                </div>
            </div>
        `;
        
        projectsList.appendChild(projectItem);
        Animation.slideUp(projectItem);
    }

    removeProject(id) {
        const item = DOM.find(`#${id}`);
        if (item && confirm('Are you sure you want to remove this project?')) {
            item.remove();
            this.saveResumeData();
        }
    }

    addSkill(type) {
        const input = DOM.find(`#${type}Input`);
        const value = input.value.trim();
        
        if (value && !this.resumeData.skills[type].includes(value)) {
            this.resumeData.skills[type].push(value);
            this.saveResumeData();
            this.renderSkillsTags();
            input.value = '';
            this.updateProgress();
        }
    }

    removeSkill(type, skill) {
        this.resumeData.skills[type] = this.resumeData.skills[type].filter(s => s !== skill);
        this.saveResumeData();
        this.renderSkillsTags();
        this.updateProgress();
    }
    
    saveResumeData() {
        const formData = new FormData(DOM.find('#resumeForm'));
        
        // Personal information
        const personalInfo = {};
        ['firstName', 'lastName', 'email', 'phone', 'city', 'state', 'zipCode', 'linkedin', 'portfolio'].forEach(field => {
            personalInfo[field] = formData.get(field) || '';
        });
        
        // Summary
        const summary = formData.get('summary') || '';
        
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

        // Projects
        const projects = [];
        DOM.findAll('.project-item').forEach(item => {
            const projectData = new FormData();
            item.querySelectorAll('input, textarea').forEach(input => {
                projectData.append(input.name, input.value);
            });
            
            projects.push({
                name: projectData.get('projectName'),
                technologies: projectData.get('technologies') || projectData.get('tools'),
                description: projectData.get('description'),
                url: projectData.get('projectUrl')
            });
        });
        
        this.resumeData = {
            personalInfo,
            summary,
            experience,
            education,
            projects,
            industry: this.selectedIndustry,
            skills: this.resumeData.skills // Skills are managed separately
        };
        
        Storage.set('resumeData', this.resumeData);
        this.updateProgress();
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
        const previewWindow = window.open('', '_blank', 'width=800,height=1000,scrollbars=yes');
        const resumeHTML = this.generateResumeHTML(this.selectedTemplate);
        
        previewWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Resume Preview - ${this.selectedIndustry.charAt(0).toUpperCase() + this.selectedIndustry.slice(1)}</title>
                <style>
                    ${this.getTemplateStyles(this.selectedTemplate)}
                </style>
            </head>
            <body>${resumeHTML}</body>
            </html>
        `);
        previewWindow.document.close();
    }

    getTemplateStyles(template) {
        const baseStyles = `
            body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                margin: 2rem; 
                line-height: 1.6; 
                color: #333;
            }
            .resume { max-width: 800px; margin: 0 auto; }
            .resume-section { margin: 2rem 0; }
            .resume-section h2 { 
                border-bottom: 2px solid #e5e7eb; 
                padding-bottom: 0.5rem; 
                margin-bottom: 1rem; 
            }
            .contact-info { display: flex; gap: 1.5rem; flex-wrap: wrap; margin-bottom: 1rem; }
            .experience-item, .education-item, .project-item { margin-bottom: 1.5rem; }
            .skill-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem; }
            .skill-tag { background: #e0e7ff; color: #3730a3; padding: 0.25rem 0.75rem; border-radius: 1rem; font-size: 0.875rem; }
            .industry-skills { margin-top: 1rem; }
            .skill-category { margin-bottom: 1rem; }
            .skill-category h4 { margin: 0 0 0.5rem 0; color: #374151; font-size: 1rem; }
        `;
        
        const templateStyles = {
            modern: `
                ${baseStyles}
                .resume-header { text-align: center; border-bottom: 3px solid #4f46e5; padding-bottom: 1rem; }
                .resume-header h1 { color: #1f2937; font-size: 2.5rem; margin: 0; }
                .resume-section h2 { color: #4f46e5; }
            `,
            professional: `
                ${baseStyles}
                .resume-header { border-left: 4px solid #1f2937; padding-left: 1rem; }
                .resume-header h1 { color: #1f2937; margin: 0; }
                .resume-section h2 { color: #1f2937; border-bottom: 1px solid #1f2937; }
            `,
            creative: `
                ${baseStyles}
                body { background: #f8fafc; }
                .resume { background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                .resume-header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 2rem; border-radius: 8px; }
                .resume-header h1 { margin: 0; }
                .resume-section h2 { color: #667eea; }
            `
        };
        
        return templateStyles[template] || templateStyles.modern;
    }
    
    generateResumeHTML(template = 'modern') {
        const { personalInfo, summary, experience, education, projects, skills, industry } = this.resumeData;
        
        let html = `
            <div class="resume ${template}-resume">
                <header class="resume-header">
                    <h1>${personalInfo.firstName} ${personalInfo.lastName}</h1>
                    <div class="contact-info">
                        ${personalInfo.email ? `<span><i class="fas fa-envelope"></i> ${personalInfo.email}</span>` : ''}
                        ${personalInfo.phone ? `<span><i class="fas fa-phone"></i> ${personalInfo.phone}</span>` : ''}
                        ${personalInfo.linkedin ? `<span><i class="fab fa-linkedin"></i> ${personalInfo.linkedin}</span>` : ''}
                        ${personalInfo.portfolio ? `<span><i class="fas fa-globe"></i> ${personalInfo.portfolio}</span>` : ''}
                    </div>
                </header>
                
                ${summary ? `
                <section class="resume-section">
                    <h2>Professional Summary</h2>
                    <p>${summary}</p>
                </section>
                ` : ''}
                
                ${experience.length > 0 ? `
                <section class="resume-section">
                    <h2>Work Experience</h2>
                    ${experience.map(exp => `
                        <div class="experience-item">
                            <div class="experience-header">
                                <h3>${exp.jobTitle}</h3>
                                <span class="company">${exp.company}</span>
                                <span class="date">${this.formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}</span>
                            </div>
                            <div class="experience-details">
                                <span class="location">${exp.location}</span>
                                <span class="employment-type">${exp.employmentType}</span>
                            </div>
                            ${exp.description ? `<div class="experience-description">${this.formatDescription(exp.description)}</div>` : ''}
                        </div>
                    `).join('')}
                </section>
                ` : ''}
                
                ${education.length > 0 ? `
                <section class="resume-section">
                    <h2>Education</h2>
                    ${education.map(edu => `
                        <div class="education-item">
                            <div class="education-header">
                                <h3>${edu.degree} ${edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</h3>
                                <span class="institution">${edu.institution}</span>
                                <span class="date">${this.formatDateRange(edu.startDate, edu.endDate)}</span>
                            </div>
                            ${edu.gpa ? `<div class="gpa">GPA: ${edu.gpa}</div>` : ''}
                            ${edu.honors ? `<div class="honors">${edu.honors}</div>` : ''}
                        </div>
                    `).join('')}
                </section>
                ` : ''}
                
                ${projects.length > 0 ? `
                <section class="resume-section">
                    <h2>${industry === 'creative' ? 'Creative Projects' : 'Projects'}</h2>
                    ${projects.map(project => `
                        <div class="project-item">
                            <h3>${project.name}</h3>
                            ${project.technologies ? `<div class="technologies">Technologies: ${project.technologies}</div>` : ''}
                            ${project.description ? `<p>${project.description}</p>` : ''}
                            ${project.url ? `<div class="project-url"><a href="${project.url}">View Project</a></div>` : ''}
                        </div>
                    `).join('')}
                </section>
                ` : ''}
                
                ${this.hasIndustrySkills(skills, industry) ? `
                <section class="resume-section">
                    <h2>Skills & Expertise</h2>
                    <div class="industry-skills">
                        ${this.generateIndustrySkillsHTML(skills, industry)}
                    </div>
                </section>
                ` : ''}
            </div>
        `;
        
        return html;
    }

    generateIndustrySkillsHTML(skills, industry) {
        const skillCategories = {
            technology: [
                { title: 'Programming Languages', key: 'programmingLanguages' },
                { title: 'Frameworks & Libraries', key: 'frameworks' },
                { title: 'Tools & Technologies', key: 'tools' }
            ],
            business: [
                { title: 'Financial Skills', key: 'financialSkills' },
                { title: 'Business Tools', key: 'businessTools' },
                { title: 'Certifications', key: 'businessCerts' }
            ],
            healthcare: [
                { title: 'Medical Skills', key: 'medicalSkills' },
                { title: 'Certifications', key: 'medicalCerts' },
                { title: 'Specializations', key: 'specializations' }
            ],
            creative: [
                { title: 'Design Tools', key: 'designTools' },
                { title: 'Creative Skills', key: 'creativeSkills' }
            ],
            education: [
                { title: 'Teaching Certifications', key: 'teachingCerts' },
                { title: 'Subjects & Grades', key: 'subjects' },
                { title: 'Teaching Methods', key: 'teachingMethods' }
            ],
            general: [
                { title: 'Technical Skills', key: 'technical' },
                { title: 'Soft Skills', key: 'soft' },
                { title: 'Languages', key: 'languages' },
                { title: 'Certifications', key: 'certifications' }
            ]
        };

        const categories = skillCategories[industry] || [];
        let html = '';

        categories.forEach(category => {
            if (skills[category.key] && skills[category.key].length > 0) {
                html += `
                    <div class="skill-category">
                        <h4>${category.title}</h4>
                        <div class="skill-tags">
                            ${skills[category.key].map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                        </div>
                    </div>
                `;
            }
        });

        return html;
    }

    hasIndustrySkills(skills, industry) {
        const industrySkills = this.getIndustrySkillsForIndustry(industry);
        return industrySkills.some(skillType => skills[skillType] && skills[skillType].length > 0);
    }

    getIndustrySkillsForIndustry(industry) {
        const industrySkillMap = {
            technology: ['programmingLanguages', 'frameworks', 'tools'],
            business: ['financialSkills', 'businessTools', 'businessCerts'],
            healthcare: ['medicalSkills', 'medicalCerts', 'specializations'],
            creative: ['designTools', 'creativeSkills'],
            education: ['teachingCerts', 'subjects', 'teachingMethods'],
            general: ['technical', 'soft', 'languages', 'certifications']
        };
        
        return industrySkillMap[industry] || [];
    }

    // Helper methods
    formatDateRange(startDate, endDate, isCurrent = false) {
        if (!startDate) return '';
        const start = new Date(startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
        const end = isCurrent ? 'Present' : (endDate ? new Date(endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '');
        return `${start} - ${end}`;
    }

    formatDescription(description) {
        const points = description.split('\n').filter(point => point.trim());
        if (points.length > 1) {
            return `<ul>${points.map(point => `<li>${point}</li>`).join('')}</ul>`;
        }
        return `<p>${description}</p>`;
    }
    
    downloadResume() {
    Toast.info('Generating PDF... This may take a moment.');
    
    const resumeHTML = this.generateResumeHTML(this.selectedTemplate);
    const pdfWindow = window.open('', '_blank');
    
    // Create a styled HTML page for PDF conversion
    const pdfHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Resume - ${this.resumeData.personalInfo.firstName} ${this.resumeData.personalInfo.lastName}</title>
            <meta charset="UTF-8">
            <style>
                ${this.getPDFStyles()}
            </style>
        </head>
        <body>
            <div id="resume-content">
                ${resumeHTML}
            </div>
            <script>
                // Add page breaks for better PDF formatting
                function addPageBreaks() {
                    const content = document.getElementById('resume-content');
                    const sections = content.querySelectorAll('.resume-section');
                    let currentHeight = 0;
                    const pageHeight = 1122; // A4 height in pixels at 96 DPI
                    
                    sections.forEach((section, index) => {
                        const sectionHeight = section.offsetHeight;
                        if (currentHeight + sectionHeight > pageHeight && index > 0) {
                            section.style.pageBreakBefore = 'always';
                            currentHeight = sectionHeight;
                        } else {
                            currentHeight += sectionHeight;
                        }
                    });
                }
                
                window.onload = function() {
                    addPageBreaks();
                };
            <\/script>
        </body>
        </html>
    `;
    
    pdfWindow.document.write(pdfHTML);
    pdfWindow.document.close();
    
    // Wait for content to load then generate PDF
    setTimeout(() => {
        this.generatePDF(pdfWindow);
    }, 1000);
}

generatePDF(pdfWindow) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    // Set PDF properties
    doc.setProperties({
        title: `Resume - ${this.resumeData.personalInfo.firstName} ${this.resumeData.personalInfo.lastName}`,
        subject: 'Professional Resume',
        author: `${this.resumeData.personalInfo.firstName} ${this.resumeData.personalInfo.lastName}`,
        keywords: 'resume, cv, professional',
        creator: 'SwipeHire Resume Builder'
    });

    // Capture the content and generate PDF
    html2canvas(pdfWindow.document.getElementById('resume-content'), {
        scale: 2, // Higher quality
        useCORS: true,
        logging: false
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 295; // A4 height in mm
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        // Add first page
        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // Add additional pages if needed
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            doc.addPage();
            doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        // Save the PDF
        const fileName = `Resume_${this.resumeData.personalInfo.firstName}_${this.resumeData.personalInfo.lastName}.pdf`.replace(/\s+/g, '_');
        doc.save(fileName);
        
        // Close the print window
        pdfWindow.close();
        
        Toast.success('PDF downloaded successfully!');
    }).catch(error => {
        console.error('PDF generation error:', error);
        Toast.error('Failed to generate PDF. Please try again.');
        pdfWindow.close();
    });
}

getPDFStyles() {
    return `
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 20px;
            line-height: 1.4;
            color: #333;
            background: #fff;
        }
        
        .resume {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .resume-header {
            text-align: center;
            border-bottom: 3px solid #4f46e5;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        
        .resume-header h1 {
            font-size: 32px;
            margin: 0 0 10px 0;
            color: #1f2937;
            font-weight: 700;
        }
        
        .contact-info {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 20px;
            margin-bottom: 10px;
            font-size: 14px;
        }
        
        .contact-info span {
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        .resume-section {
            margin: 25px 0;
            page-break-inside: avoid;
        }
        
        .resume-section h2 {
            font-size: 20px;
            color: #4f46e5;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 8px;
            margin-bottom: 15px;
            font-weight: 600;
        }
        
        .experience-item, .education-item, .project-item {
            margin-bottom: 20px;
            page-break-inside: avoid;
        }
        
        .experience-header, .education-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 5px;
        }
        
        .experience-header h3, .education-header h3 {
            font-size: 16px;
            margin: 0;
            font-weight: 600;
            color: #1f2937;
        }
        
        .company, .institution {
            font-weight: 600;
            color: #374151;
        }
        
        .date {
            color: #6b7280;
            font-size: 14px;
            white-space: nowrap;
        }
        
        .experience-details {
            display: flex;
            gap: 15px;
            margin-bottom: 8px;
            font-size: 14px;
            color: #6b7280;
        }
        
        .experience-description, .education-description {
            font-size: 14px;
            line-height: 1.5;
        }
        
        .experience-description ul, .education-description ul {
            margin: 5px 0;
            padding-left: 20px;
        }
        
        .experience-description li, .education-description li {
            margin-bottom: 3px;
        }
        
        .gpa, .honors {
            font-size: 14px;
            color: #374151;
            margin: 2px 0;
        }
        
        .technologies {
            font-size: 14px;
            color: #6b7280;
            font-style: italic;
            margin: 5px 0;
        }
        
        .project-url a {
            color: #4f46e5;
            text-decoration: none;
            font-size: 14px;
        }
        
        .skill-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 8px;
        }
        
        .skill-tag {
            background: #e0e7ff;
            color: #3730a3;
            padding: 4px 12px;
            border-radius: 16px;
            font-size: 12px;
            border: 1px solid #c7d2fe;
        }
        
        .skill-category {
            margin-bottom: 15px;
        }
        
        .skill-category h4 {
            font-size: 14px;
            margin: 0 0 8px 0;
            color: #374151;
            font-weight: 600;
        }
        
        .industry-skills {
            margin-top: 10px;
        }
        
        /* Print-specific styles */
        @media print {
            body {
                margin: 0;
                padding: 0;
            }
            
            .resume {
                padding: 15px;
                box-shadow: none;
            }
            
            .resume-section {
                margin: 20px 0;
            }
            
            .contact-info {
                font-size: 12px;
            }
            
            .resume-header h1 {
                font-size: 28px;
            }
            
            .resume-section h2 {
                font-size: 18px;
            }
        }
        
        /* Ensure proper page breaks */
        .resume-section {
            page-break-inside: avoid;
        }
        
        .experience-item, .education-item, .project-item {
            page-break-inside: avoid;
        }
        
        /* Avoid breaking inside important elements */
        .experience-header, .education-header {
            page-break-inside: avoid;
        }
    `;
}

// Alternative simpler PDF generation method (if html2canvas has issues)
generateSimplePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const { personalInfo, summary, experience, education, projects, skills, industry } = this.resumeData;
    
    // Set font and initial position
    doc.setFont('helvetica');
    let yPosition = 20;
    
    // Header
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(`${personalInfo.firstName} ${personalInfo.lastName}`, 105, yPosition, { align: 'center' });
    yPosition += 15;
    
    // Contact info
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const contactInfo = [];
    if (personalInfo.email) contactInfo.push(personalInfo.email);
    if (personalInfo.phone) contactInfo.push(personalInfo.phone);
    if (personalInfo.linkedin) contactInfo.push(personalInfo.linkedin);
    
    doc.text(contactInfo.join(' | '), 105, yPosition, { align: 'center' });
    yPosition += 20;
    
    // Professional Summary
    if (summary) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('PROFESSIONAL SUMMARY', 20, yPosition);
        yPosition += 10;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const splitSummary = doc.splitTextToSize(summary, 170);
        doc.text(splitSummary, 20, yPosition);
        yPosition += splitSummary.length * 5 + 15;
    }
    
    // Work Experience
    if (experience.length > 0) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('WORK EXPERIENCE', 20, yPosition);
        yPosition += 10;
        
        experience.forEach(exp => {
            // Check for page break
            if (yPosition > 250) {
                doc.addPage();
                yPosition = 20;
            }
            
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.text(exp.jobTitle, 20, yPosition);
            
            const companyText = `${exp.company} | ${exp.location || ''} | ${exp.employmentType || ''}`;
            doc.setFont('helvetica', 'normal');
            doc.text(companyText, 20, yPosition + 5);
            
            const dateText = `${this.formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}`;
            doc.text(dateText, 170, yPosition, { align: 'right' });
            
            yPosition += 12;
            
            if (exp.description) {
                doc.setFontSize(9);
                const splitDesc = doc.splitTextToSize(exp.description, 170);
                doc.text(splitDesc, 20, yPosition);
                yPosition += splitDesc.length * 4 + 8;
            }
            
            yPosition += 5;
        });
        
        yPosition += 5;
    }
    
    // Education
    if (education.length > 0) {
        // Check for page break
        if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
        }
        
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('EDUCATION', 20, yPosition);
        yPosition += 10;
        
        education.forEach(edu => {
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.text(`${edu.degree}${edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}`, 20, yPosition);
            
            doc.setFont('helvetica', 'normal');
            doc.text(edu.institution, 20, yPosition + 5);
            
            const dateText = `${this.formatDateRange(edu.startDate, edu.endDate)}`;
            doc.text(dateText, 170, yPosition, { align: 'right' });
            
            yPosition += 15;
            
            if (edu.gpa) {
                doc.text(`GPA: ${edu.gpa}`, 20, yPosition);
                yPosition += 5;
            }
            
            if (edu.honors) {
                doc.text(`Honors: ${edu.honors}`, 20, yPosition);
                yPosition += 5;
            }
            
            yPosition += 5;
        });
    }
    
    // Skills
    const industrySkills = this.getIndustrySkillsForIndustry(industry);
    const hasSkills = industrySkills.some(skillType => skills[skillType] && skills[skillType].length > 0);
    
    if (hasSkills) {
        // Check for page break
        if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
        }
        
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('SKILLS & EXPERTISE', 20, yPosition);
        yPosition += 10;
        
        industrySkills.forEach(skillType => {
            if (skills[skillType] && skills[skillType].length > 0) {
                const skillText = skills[skillType].join(', ');
                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                const splitSkills = doc.splitTextToSize(skillText, 170);
                doc.text(splitSkills, 20, yPosition);
                yPosition += splitSkills.length * 4 + 5;
            }
        });
    }
    
    // Save the PDF
    const fileName = `Resume_${personalInfo.firstName}_${personalInfo.lastName}.pdf`.replace(/\s+/g, '_');
    doc.save(fileName);
    Toast.success('PDF downloaded successfully!');
}

// Update the downloadResume method to use the simple version as fallback
downloadResume() {
    // Check if jsPDF and html2canvas are available
    if (typeof window.jspdf === 'undefined' || typeof html2canvas === 'undefined') {
        Toast.error('PDF libraries not loaded. Please check your internet connection.');
        return;
    }

    Toast.info('Generating PDF... This may take a moment.');
    
    try {
        // Try the advanced method first
        const resumeHTML = this.generateResumeHTML(this.selectedTemplate);
        const pdfWindow = window.open('', '_blank');
        
        const pdfHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Resume - ${this.resumeData.personalInfo.firstName} ${this.resumeData.personalInfo.lastName}</title>
                <meta charset="UTF-8">
                <style>${this.getPDFStyles()}</style>
            </head>
            <body>
                <div id="resume-content">${resumeHTML}</div>
            </body>
            </html>
        `;
        
        pdfWindow.document.write(pdfHTML);
        pdfWindow.document.close();
        
        setTimeout(() => {
            this.generatePDF(pdfWindow);
        }, 1000);
        
    } catch (error) {
        console.error('Advanced PDF generation failed, falling back to simple method:', error);
        // Fallback to simple PDF generation
        this.generateSimplePDF();
    }
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