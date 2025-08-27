// Mock job data
const mockJobs = [
    {
        id: '1',
        title: 'Senior Frontend Developer',
        company: {
            name: 'TechFlow Inc.',
            logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=logo',
            size: '500-1000 employees'
        },
        description: 'Join our dynamic team to build cutting-edge web applications using React, TypeScript, and modern development practices. You will work on user-facing features that impact millions of users worldwide.',
        requirements: [
            '5+ years React experience',
            'TypeScript proficiency',
            'Modern CSS frameworks',
            'State management (Redux/Zustand)',
            'Testing experience'
        ],
        salaryMin: 100000,
        salaryMax: 140000,
        location: {
            city: 'San Francisco',
            state: 'CA',
            isRemote: true
        },
        jobType: 'Full-time',
        benefits: ['Health Insurance', 'Stock Options', 'Remote Work', '401k', 'Flexible PTO'],
        postedDate: '2024-01-15'
    },
    {
        id: '2',
        title: 'Product Manager',
        company: {
            name: 'InnovateLabs',
            logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&h=100&fit=crop&crop=logo',
            size: '50-100 employees'
        },
        description: 'Drive product strategy and roadmap for our fintech platform. Collaborate with engineering, design, and business teams to deliver products that delight customers and drive business growth.',
        requirements: [
            '3+ years product management',
            'Fintech experience preferred',
            'Data-driven approach',
            'Strong communication skills',
            'Agile methodology'
        ],
        salaryMin: 120000,
        salaryMax: 160000,
        location: {
            city: 'New York',
            state: 'NY',
            isRemote: false
        },
        jobType: 'Full-time',
        benefits: ['Health Insurance', 'Equity', 'Flexible PTO', 'Learning Budget'],
        postedDate: '2024-01-18'
    },
    {
        id: '3',
        title: 'UX/UI Designer',
        company: {
            name: 'DesignStudio Pro',
            logo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop&crop=logo',
            size: '20-50 employees'
        },
        description: 'Create beautiful, intuitive user experiences for web and mobile applications. Work closely with product and engineering teams to bring designs to life.',
        requirements: [
            'Portfolio of UX/UI work',
            'Figma & Adobe Suite',
            'Design systems experience',
            'User research skills',
            'Prototyping abilities'
        ],
        salaryMin: 80000,
        salaryMax: 110000,
        location: {
            city: 'Austin',
            state: 'TX',
            isRemote: true
        },
        jobType: 'Full-time',
        benefits: ['Health Insurance', 'Creative Budget', 'Remote Work', 'Flexible Hours'],
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
        description: 'Build scalable backend systems and APIs using Node.js, Python, and cloud technologies. Work on microservices architecture serving millions of requests daily.',
        requirements: [
            'Node.js or Python expertise',
            'Database design & optimization',
            'AWS/Azure experience',
            'Microservices architecture',
            'API development'
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
        description: 'Apply machine learning techniques to solve complex business problems. Work with large datasets and develop predictive models that drive business decisions.',
        requirements: [
            'PhD or Masters in related field',
            'Python & R proficiency',
            'ML frameworks experience',
            'Statistical analysis',
            'Big data technologies'
        ],
        salaryMin: 130000,
        salaryMax: 180000,
        location: {
            city: 'Boston',
            state: 'MA',
            isRemote: false
        },
        jobType: 'Full-time',
        benefits: ['Health Insurance', 'Research Budget', 'Conference Funding', 'Stock Options'],
        postedDate: '2024-01-25'
    },
    {
        id: '6',
        title: 'DevOps Engineer',
        company: {
            name: 'ScaleTech',
            logo: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=100&h=100&fit=crop&crop=logo',
            size: '300-500 employees'
        },
        description: 'Manage and optimize cloud infrastructure, CI/CD pipelines, and deployment processes. Ensure system reliability and scalability for high-traffic applications.',
        requirements: [
            'Kubernetes & Docker',
            'AWS/GCP expertise',
            'Infrastructure as Code',
            'Monitoring & alerting',
            'CI/CD pipeline experience'
        ],
        salaryMin: 110000,
        salaryMax: 150000,
        location: {
            city: 'Denver',
            state: 'CO',
            isRemote: true
        },
        jobType: 'Full-time',
        benefits: ['Health Insurance', 'Stock Options', 'Remote Work', 'Learning Budget'],
        postedDate: '2024-01-28'
    }
];

// Mock applications data
const mockApplications = [
    {
        id: 'app-1',
        jobId: '1',
        jobTitle: 'Senior Frontend Developer',
        companyName: 'TechFlow Inc.',
        status: 'pending',
        appliedAt: '2024-01-20T10:00:00Z',
        notes: 'Applied through SwipeHire platform'
    },
    {
        id: 'app-2', 
        jobId: '3',
        jobTitle: 'UX/UI Designer',
        companyName: 'DesignStudio Pro',
        status: 'interview',
        appliedAt: '2024-01-18T14:30:00Z',
        interviewDate: '2024-02-01T10:00:00Z'
    }
];

// User profile data
const defaultUserProfile = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/johndoe',
    jobPreferences: {
        jobTypes: ['Full-time'],
        industries: ['Technology', 'Startup'],
        locations: ['San Francisco', 'Remote'],
        salaryMin: 80000,
        salaryMax: 150000,
        remoteWork: true
    }
};

// Resume data structure
const defaultResume = {
    personalInfo: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        linkedin: 'linkedin.com/in/johndoe'
    },
    summary: 'Experienced software engineer with 5+ years building scalable web applications.',
    experience: [],
    education: [],
    skills: {
        technical: ['JavaScript', 'React', 'Node.js', 'Python'],
        soft: ['Leadership', 'Communication', 'Problem Solving']
    }
};
