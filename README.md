# Smart Student Companion

A modern, professional web application designed to be your all-in-one student productivity hub. Built with React, TypeScript, and Tailwind CSS for the CodeZen Innovate Challenge.

## ✨ Features

### 🎯 Core Functionality
- **Smart To-Do Lists**: Add, complete, and delete tasks with local storage persistence
- **Class Timetable**: Manage weekly class schedules with a clean grid interface
- **Quick Notes**: Sticky-note style notes with edit and delete functionality
- **Productivity Tools**:
  - **CGPA Calculator**: Calculate GPA with subject credits and grades
  - **Unit Converter**: Convert between various units (length, data storage)
  - **Motivational Quotes**: Fetch inspirational quotes from external API

### 🎨 Design & UX
- **Dark Theme**: Default dark mode with light mode toggle
- **Gold Accent**: Professional gold (#FFD700) highlights throughout
- **Smooth Animations**: Framer Motion powered transitions and micro-interactions
- **Responsive Design**: Mobile-first approach with responsive layouts
- **Modern UI**: Clean cards, rounded corners, and soft shadows

### 🔧 Technical Features
- **TypeScript**: Full type safety and better development experience
- **Local Storage**: Data persistence without backend requirements
- **Component Architecture**: Well-structured, reusable components
- **Tailwind CSS**: Utility-first styling with custom theme
- **Lucide Icons**: Beautiful, consistent iconography

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smart-student-companion
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## 📱 Usage

### Landing Page
- Clean hero section with app introduction
- "Login as Student" button for mock authentication
- Feature showcase with animated cards

### Dashboard
After logging in, access four main sections:

1. **To-Do List**
   - Add new tasks with the input field
   - Mark tasks as complete/incomplete
   - Delete tasks with the trash icon
   - View task statistics

2. **Timetable**
   - Add classes with day, time, subject, and room
   - View weekly schedule in a grid layout
   - Delete classes as needed

3. **Quick Notes**
   - Create colorful sticky notes
   - Edit existing notes inline
   - Delete notes with confirmation

4. **Tools**
   - **CGPA Calculator**: Add subjects with credits and grades
   - **Unit Converter**: Convert between length and data units
   - **Motivational Quotes**: Fetch new inspirational quotes

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom theme
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: React Hooks with localStorage
- **Build Tool**: Create React App
- **Deployment**: Ready for Vercel/Netlify

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.tsx          # Navigation with theme toggle
│   ├── LandingPage.tsx     # Hero section and features
│   ├── Dashboard.tsx       # Main dashboard with tabs
│   ├── TodoList.tsx        # Task management
│   ├── Timetable.tsx       # Class schedule
│   ├── QuickNotes.tsx      # Sticky notes
│   ├── ToolsSection.tsx    # CGPA, converter, quotes
│   └── Footer.tsx          # Footer with branding
├── App.tsx                 # Main app component
├── index.tsx              # React entry point
└── index.css              # Global styles and Tailwind
```

## 🎨 Design System

### Colors
- **Primary Gold**: #FFD700
- **Dark Background**: #0F0F0F
- **Card Background**: #1A1A1A
- **Border**: #333333

### Typography
- **Font Family**: Inter (system fallbacks)
- **Headings**: Bold with gold accent
- **Body**: Clean, readable text

### Components
- **Cards**: Rounded corners with subtle shadows
- **Buttons**: Primary (gold) and secondary (outline) variants
- **Inputs**: Dark theme with gold focus states

## 🔄 Data Persistence

All data is stored in browser localStorage:
- Tasks
- Class schedule
- Notes
- Subject grades
- Theme preference

## 🌐 API Integration

- **Motivational Quotes**: Fetches from [quotable.io](https://api.quotable.io)
- **Fallback**: Default quote if API is unavailable

## 📱 Responsive Design

- **Mobile**: Single column layouts, touch-friendly buttons
- **Tablet**: Two-column grids for better space utilization
- **Desktop**: Full multi-column layouts with hover effects

## 🚀 Deployment

The app is production-ready and can be deployed to:

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Upload dist folder to Netlify
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is built for the CodeZen Innovate Challenge.

## 🙏 Acknowledgments

- **CodeZen**: For the innovation challenge opportunity
- **React Team**: For the amazing framework
- **Tailwind CSS**: For the utility-first CSS framework
- **Framer Motion**: For smooth animations
- **Lucide**: For beautiful icons

---

**Built with ❤️ for CodeZen Innovate Challenge**
