# 🎮 LevelList - Video Game Collection Tracker

![Next.js](https://img.shields.io/badge/Next.js-15+-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4+-38B2AC?style=flat-square&logo=tailwind-css)
![Production Ready](https://img.shields.io/badge/Status-Production_Ready-green?style=flat-square)

A comprehensive personal video game collection tracker built with modern web technologies. Track, organize, and analyze your gaming library with style.

## ✨ Features

### 🎯 **Core Functionality**
- **Complete CRUD Operations**: Add, view, edit, and delete games
- **Smart Collection Management**: Organize your entire gaming library
- **Advanced Search & Filters**: Find games by title, genre, platform, status, and rating
- **Comprehensive Statistics**: Track your gaming habits with detailed analytics

### 🎨 **Modern UI/UX**
- **Responsive Design**: Perfect on desktop, tablet, and mobile
- **Dark/Light Theme**: Automatic system detection with manual override
- **Smooth Animations**: Polished interactions and transitions
- **Accessibility**: WCAG compliant with keyboard navigation

### 📊 **Analytics & Insights**
- **Gaming Statistics**: Hours played, completion rates, average ratings
- **Collection Overview**: Games by status, top genres, and platforms
- **Progress Tracking**: Monitor your gaming journey over time

### 🔧 **Technical Excellence**
- **TypeScript**: Full type safety with zero errors
- **Modern Architecture**: Next.js 15 with App Router
- **State Management**: Context API with localStorage persistence
- **Performance**: Optimized builds and fast loading

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ 
- **npm**, yarn, or pnpm

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/EEnez/levelist.git
cd levelist
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

## 📱 How to Use

### **Getting Started**
1. **Add Your First Game**: Click "Add Game" to start building your collection
2. **Explore Features**: Use filters and search to organize your library
3. **Track Progress**: Update game status as you play and complete games
4. **View Statistics**: Check your gaming analytics on the Statistics page

### **Managing Your Collection**
- **Add Games**: Complete form with title, genres, platforms, and more
- **Edit Games**: Update any game information including progress and ratings
- **Filter & Search**: Find games quickly with advanced filtering options
- **Track Status**: Mark games as Want to Play, Playing, Completed, On Hold, or Dropped

### **Understanding Statistics**
- **Overview Cards**: Total games, hours played, average rating, completion rate
- **Status Breakdown**: Visual representation of your gaming progress
- **Top Lists**: Most played genres and platforms in your collection

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS 4+
- **State Management**: React Context API
- **Persistence**: localStorage with automatic sync

### **Development**
- **Linting**: ESLint with strict rules
- **Type Checking**: TypeScript strict mode
- **Build Tool**: Next.js built-in bundler
- **Package Manager**: npm

## 📁 Project Structure

```
levelist/
├── app/                    # Next.js App Router
│   ├── games/             # Game-related pages
│   │   ├── add/           # Add new game
│   │   ├── [id]/          # Game details & edit
│   │   └── page.tsx       # Games collection
│   ├── statistics/        # Analytics dashboard
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Homepage
├── components/            # Reusable components
│   ├── GameCard/         # Game display card
│   ├── FilterPanel/      # Advanced filtering
│   ├── Layout/           # Navigation & header
│   └── ThemeToggle/      # Theme switching
├── contexts/             # React Context providers
│   └── GameContext.tsx   # Global game state
├── hooks/                # Custom React hooks
│   ├── useTheme.ts       # Theme management
│   ├── useGameFilters.ts # Filtering logic
│   └── useFilterPreferences.ts # Filter persistence
├── types/                # TypeScript definitions
│   ├── game.ts           # Game interfaces
│   ├── enums.ts          # Status, genre, platform enums
│   └── index.ts          # Type exports
├── data/                 # Sample data
└── public/               # Static assets
```

## 🎮 Game Status Types

- **🎯 Want to Play**: Games on your wishlist
- **🎮 Currently Playing**: Games you're actively playing
- **✅ Completed**: Finished games
- **⏸️ On Hold**: Temporarily paused games
- **❌ Dropped**: Games you've stopped playing

## 🎨 Themes

- **🌅 Light Mode**: Clean, professional light theme
- **🌙 Dark Mode**: Easy-on-eyes dark theme
- **🔄 System**: Automatically follows your system preference
- **⏰ Auto**: Smart time-based switching (6AM-6PM light, 6PM-6AM dark)

## 🔧 Configuration

### **Local Storage**
The app automatically saves your data to browser localStorage:
- **Games Collection**: All your game data
- **Theme Preference**: Your chosen theme
- **Filter Settings**: Your preferred filters and sorting

### **Data Persistence**
- ✅ **Automatic Save**: Changes saved instantly
- ✅ **Data Validation**: Type-safe data handling
- ✅ **Error Recovery**: Graceful handling of storage issues

## 🚀 Deployment

### **Vercel (Recommended)**
```bash
npm install -g vercel
vercel
```

### **Netlify**
```bash
npm run build
# Upload 'out' folder to Netlify
```

### **Docker**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📈 Performance

- **⚡ Fast Loading**: Optimized Next.js builds
- **📱 Mobile Optimized**: Responsive design for all devices
- **🔄 Smooth Animations**: 60fps transitions
- **💾 Efficient Storage**: Minimal localStorage usage

## 🤝 Contributing

This is a personal project, but feedback and suggestions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is for personal use. Feel free to fork and adapt for your own needs.

## 🙏 Acknowledgments

- **Next.js Team**
- **Tailwind CSS**
- **TypeScript**
- **Gaming Community**

---

*Last updated: May 2025*
