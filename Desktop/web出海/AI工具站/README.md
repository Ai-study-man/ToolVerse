# ToolVerse - AI Tools Directory

A modern, responsive web application for discovering and exploring AI tools. Built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Modern Design**: Clean, professional interface with responsive design
- **Tool Discovery**: Browse and search through a curated collection of AI tools
- **Advanced Filtering**: Filter by category, pricing model, and ratings
- **Detailed Tool Pages**: Comprehensive information for each tool
- **Fast Search**: Real-time search functionality
- **Mobile Responsive**: Optimized for all device sizes

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Database**: Supabase (for production)
- **Deployment**: Vercel

## 📦 Installation

1. **Prerequisites**: Make sure you have Node.js 18+ installed

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and visit [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js 14 App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   └── tools/             # Tools pages
├── components/            # Reusable components
│   ├── Header.tsx
│   ├── SearchBar.tsx
│   └── ToolCard.tsx
├── data/                  # Mock data
│   └── mockData.ts
├── lib/                   # Utility functions
│   └── utils.ts
└── types/                 # TypeScript type definitions
    └── index.ts
```

## 🎨 Design System

### Colors
- **Primary**: Blue (#2563eb)
- **Secondary**: Purple (#7c3aed)
- **Accent**: Green (#10b981)

### Typography
- **Font**: Inter (from Google Fonts)
- **Hierarchy**: Consistent heading and text sizes

## 📱 Pages

1. **Homepage** (`/`): Hero section, categories, featured tools
2. **Tools Listing** (`/tools`): Searchable and filterable tool directory
3. **Tool Detail** (`/tools/[id]`): Detailed information about specific tools

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Tools

1. Add tool data to `src/data/mockData.ts`
2. Follow the `Tool` interface defined in `src/types/index.ts`
3. Tools will automatically appear in listings

### Customizing Design

- Modify colors in `tailwind.config.js`
- Update global styles in `src/app/globals.css`
- Component styles use Tailwind CSS classes

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically with each push

### Manual Deployment

1. Build the project: `npm run build`
2. Deploy the `.next` folder to your hosting provider

## 🔮 Future Enhancements

- User authentication and profiles
- Tool submission system
- Review and rating system
- Advanced search with AI
- Tool comparison feature
- API integration for live data
- Analytics dashboard

## 📄 License

This project is for demonstration purposes. Feel free to use as a starting point for your own projects.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

Built with ❤️ for the AI community
