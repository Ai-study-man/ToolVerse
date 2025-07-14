<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# ToolVerse - AI Tools Directory

This is a Next.js 14 application built with TypeScript and Tailwind CSS for discovering AI tools.

## Project Guidelines

### Code Style
- Use TypeScript for all new files
- Follow functional component patterns with hooks
- Use Tailwind CSS for styling (no CSS modules or styled-components)
- Prefer modern ES6+ syntax
- Use proper TypeScript interfaces and types

### Component Structure
- Keep components in `src/components/`
- Use 'use client' directive for client-side components
- Export components as default exports
- Use descriptive prop interfaces

### Design System
- Primary color: #2563eb (blue)
- Secondary color: #7c3aed (purple)  
- Accent color: #10b981 (green)
- Use Inter font family
- Follow mobile-first responsive design

### Data Management
- Mock data is in `src/data/mockData.ts`
- Type definitions in `src/types/index.ts`
- Follow the Tool and Category interfaces strictly

### Best Practices
- Use semantic HTML elements
- Ensure accessibility with proper ARIA labels
- Optimize images with Next.js Image component
- Use loading states for better UX
- Implement proper error handling

### File Naming
- Use PascalCase for component files
- Use camelCase for utility functions
- Use kebab-case for page routes
- Include descriptive names for better readability
