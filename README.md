# 🚀 FlowDesk - AI Productivity Hub

## Overview

**FlowDesk** is a modern, AI-powered productivity application designed to help professionals streamline their workflow. Built with cutting-edge technologies, FlowDesk provides an intuitive interface for managing tasks, calendar events, notes, and receiving AI-powered assistance through an integrated Copilot panel.

### What Problem Does It Solve?

FlowDesk addresses the challenge of scattered productivity tools by providing a unified platform that combines:
- **Task Management** - Organize and track your to-do items with priority levels
- **Calendar Integration** - Manage events and stay on top of your schedule
- **Note-Taking** - Capture ideas and create organized notes with tags and colors
- **AI Copilot** - Get intelligent suggestions and assistance powered by AI
- **Dashboard** - Get a complete overview of your productivity metrics
- **Settings** - Customize your experience

## ✨ Features

- 📋 **Task Management** - Create, organize, and prioritize tasks with different priority levels (High, Medium, Low)
- 📅 **Calendar** - View and manage events with visual calendar interface
- 📝 **Notes** - Create and organize notes with custom tags and color coding
- 🤖 **AI Copilot** - Integrated AI assistant for productivity suggestions (Cmd+K or Ctrl+K)
- 🎨 **Beautiful UI** - Modern, dark-themed interface with smooth animations
- 🔐 **Authentication** - Secure login and signup with Supabase
- 📱 **Responsive Design** - Works seamlessly on desktop and tablet devices
- 🌓 **Dark Mode** - Eye-friendly dark theme by default
- ⚡ **Real-time Sync** - Synchronization with Supabase backend

## 🛠️ Technologies Used

This project is built with:

- **Frontend Framework**: React 18+ with TypeScript
- **Build Tool**: Vite (Fast build and development server)
- **Styling**: Tailwind CSS (Utility-first CSS framework)
- **UI Components**: shadcn/ui (High-quality React components)
- **State Management**: React Context API
- **Database & Auth**: Supabase (PostgreSQL + Authentication)
- **HTTP Client**: React Query (@tanstack/react-query)
- **Form Handling**: React Hook Form
- **Routing**: React Router
- **Testing**: Vitest
- **Linting**: ESLint

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download Node.js](https://nodejs.org/)
- **npm** (comes with Node.js) or **bun** package manager
- **Git** - [Download Git](https://git-scm.com/)

To check if Node.js is installed, run:
```bash
node --version
npm --version
```

## 📥 Installation & Setup

### Step 1: Clone the Repository

```bash
git clone <YOUR_GIT_URL>
cd Flowdesk
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required dependencies listed in `package.json`.

### Step 3: Configure Environment Variables

Create a `.env` file in the root directory with your Supabase credentials:

```env
VITE_SUPABASE_URL="your_supabase_url"
VITE_SUPABASE_PUBLISHABLE_KEY="your_supabase_publishable_key"
VITE_SUPABASE_PROJECT_ID="your_supabase_project_id"
```

**How to get these credentials:**
1. Go to [Supabase](https://supabase.com/) and create a new project
2. Navigate to Project Settings > API
3. Copy the `URL` and `Publishable Key` (anon key)
4. Copy the Project ID from the URL or settings

## 🚀 Running the Application

### Development Mode

Start the development server with hot reload:

```bash
npm run dev
```

The application will be available at `http://localhost:8081/`

### Production Build

Create an optimized production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## 📦 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Build with development mode
npm run build:dev

# Preview production build
npm run preview

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Lint code with ESLint
npm run lint
```

## 📁 Project Structure

```
Flowdesk/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── Sidebar.tsx      # Navigation sidebar
│   │   ├── Topbar.tsx       # Top navigation bar
│   │   ├── CopilotPanel.tsx # AI assistant panel
│   │   └── ...
│   ├── pages/              # Page components
│   │   ├── Index.tsx        # Main layout
│   │   ├── DashboardPage.tsx
│   │   ├── TasksPage.tsx
│   │   ├── CalendarPage.tsx
│   │   ├── NotesPage.tsx
│   │   ├── SettingsPage.tsx
│   │   └── LoginPage.tsx
│   ├── context/            # React Context for state
│   │   └── AppContext.tsx   # Global app state
│   ├── integrations_supabase/  # Supabase integration
│   │   ├── client.ts        # Supabase client
│   │   └── types.ts         # Database types
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   ├── App.tsx             # Main App component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── index.html              # HTML template
├── package.json            # Dependencies
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.ts      # Tailwind CSS config
└── README.md               # This file
```

## 🔑 Key Features Explained

### Dashboard
- Get an overview of your tasks, events, and notes
- Quick statistics and insights about your productivity

### Task Management
- Create tasks with priority levels (High, Medium, Low)
- Mark tasks as complete/incomplete
- Add notes to tasks
- Filter tasks by priority

### Calendar
- View events in a calendar interface
- Create and manage events
- Color-coded events for better visibility

### Notes
- Create notes with titles and content
- Add tags to categorize notes
- Color-code notes for visual organization
- Search and filter notes

### AI Copilot
- Access AI suggestions with Cmd+K (Mac) or Ctrl+K (Windows/Linux)
- Get productivity tips and task recommendations
- Integrated chat interface

### Authentication
- Secure user registration
- Email/password authentication via Supabase
- Persistent session management
- Automatic logout on inactivity

## 🐛 Troubleshooting

### Blank Page on Startup
**Issue**: The application shows a blank page when accessing localhost

**Solution**:
1. Ensure the `.env` file is properly configured with valid Supabase credentials
2. Clear browser cache and hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. Check browser console for errors (F12)
4. Restart the dev server: `npm run dev`

### Import Path Errors
**Issue**: Module not found errors for `@/integrations/supabase/client`

**Solution**:
- Ensure the folder structure matches the path aliases in `tsconfig.json`
- The alias `@/*` points to `./src/*`

### Supabase Connection Issues
**Issue**: Cannot connect to Supabase

**Solution**:
1. Verify your credentials in the `.env` file
2. Check that your Supabase project is active
3. Ensure your IP is whitelisted in Supabase settings
4. Check Supabase console for any alerts or issues

### Port Already in Use
**Issue**: "Port 8080 is in use" error

**Solution**:
- The app automatically tries port 8081
- To use a specific port: `npm run dev -- --port 3000`

## 🔒 Security Notes

- Never commit the `.env` file to version control
- Keep your Supabase credentials confidential
- Use environment variables for sensitive data
- Regularly update dependencies: `npm audit fix`

## 📈 Performance

- Built with Vite for extremely fast development and build times
- Optimized React components with proper memoization
- Lazy loading of pages for better performance
- Tailwind CSS for efficient styling

## 🤝 Contributing

To contribute to FlowDesk:

1. Create a new branch for your feature
2. Make your changes
3. Test thoroughly
4. Submit a pull request with a clear description

## 📝 Notes for Developers

- The app uses React Context for state management
- Supabase is configured with PostgreSQL database
- All UI components are from shadcn/ui
- Tailwind CSS is used for all styling
- TypeScript is enforced for type safety

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review browser console for error messages
3. Check Supabase dashboard for backend issues
4. Create an issue in the repository

## 📜 License

This project is open source and available under the MIT License.

---

**Happy Productivity! 🎉**
