# SwipeHire - Job Search Website

SwipeHire is a modern job search platform that allows users to discover jobs through a Tinder-style swiping interface, build professional resumes, and manage job applications.

## Features

### 🎯 **Job Discovery (Tinder-style)**
- Swipe through curated job cards
- Left swipe to pass, right swipe to apply, up swipe to save
- Interactive gestures with visual feedback
- Undo functionality for accidental swipes

### 🔍 **Job Browse & Search**
- Search jobs by title, company, location, or skills
- Filter and browse all available positions
- Quick apply functionality
- Detailed job information cards

### 📄 **Resume Builder**
- Professional resume creation tool
- Multiple sections: Personal info, experience, education, skills
- Auto-save functionality
- PDF download capability (planned)

### 📊 **Application Tracking**
- Track all submitted applications
- Filter by status (Pending, Interview, Rejected, Accepted)
- Application timeline and notes
- Withdraw applications option

### 👤 **User Profile**
- Job preferences management
- Salary range settings
- Industry and location preferences
- Account settings

## Technology Stack

- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with CSS Grid and Flexbox
- **Icons**: Font Awesome 6
- **Storage**: localStorage for data persistence
- **No frameworks**: Built with vanilla JavaScript for maximum compatibility

## Project Structure

```
swipehire-website/
├── index.html              # Home page with job swiping
├── browse.html             # Job browse and search page
├── applications.html       # Applications tracking page
├── resume.html            # Resume builder page
├── profile.html           # User profile page
├── css/
│   ├── styles.css         # Main stylesheet
│   ├── browse.css         # Browse page specific styles
│   ├── applications.css   # Applications page styles
│   └── resume.css         # Resume builder styles
├── js/
│   ├── data.js           # Mock data and constants
│   ├── utils.js          # Utility functions
│   ├── swipe.js          # Swipe functionality
│   ├── main.js           # Main application logic
│   └── resume.js         # Resume builder logic
└── README.md             # This file
```

## Getting Started

1. **Clone or download** the repository
2. **Open `index.html`** in any modern web browser
3. **Start swiping** through job opportunities!

No build process or dependencies required - it's a pure web application.

## Features Overview

### Main Pages

1. **Discover (index.html)**
   - Job card swiping interface
   - Action buttons for pass/save/apply
   - Undo functionality
   - Empty state when no jobs available

2. **Browse Jobs (browse.html)**
   - Search functionality with real-time filtering
   - Job list with detailed information
   - Quick apply buttons
   - Responsive job cards

3. **Applications (applications.html)**
   - Status-based filtering tabs
   - Application timeline
   - Withdraw application functionality
   - Status badges and counts

4. **Resume Builder (resume.html)**
   - Multi-section resume form
   - Dynamic experience/education entries
   - Auto-save to localStorage
   - Professional styling

5. **Profile (profile.html)**
   - User preferences
   - Job search criteria
   - Account settings

### Key JavaScript Components

- **SwipeCard Class**: Handles touch/mouse gestures for job cards
- **JobCardManager**: Manages job queue and swipe actions
- **Storage Utilities**: localStorage wrapper functions
- **Toast System**: User notifications
- **Event Bus**: Component communication
- **Navigation**: Mobile-responsive menu

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari, Android Chrome)

## Responsive Design

The website is fully responsive and optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## Data Storage

All user data is stored locally using localStorage:
- Swipe history
- Applications
- Resume data
- User preferences

No server or database required.

## Customization

### Adding New Jobs
Edit `js/data.js` and add new job objects to the `mockJobs` array.

### Styling
Modify CSS custom properties in `css/styles.css` to change colors, fonts, and spacing.

### Functionality
Extend JavaScript modules in the `js/` directory to add new features.

## Future Enhancements

- [ ] PDF resume generation
- [ ] Job filtering by multiple criteria
- [ ] Application status updates
- [ ] Email notifications
- [ ] Company profiles
- [ ] Interview scheduling
- [ ] Salary insights
- [ ] Job recommendations based on user behavior

## License

This project is open source and available under the MIT License.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For questions or issues, please open an issue in the GitHub repository.

---

**SwipeHire** - Making job search as simple as a swipe! 🚀