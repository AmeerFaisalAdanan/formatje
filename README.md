# formatje

A modern, client-side web application for formatting and comparing JSON, XML, and GraphQL with a beautiful, responsive interface.

## ✨ Features

### 🎨 Formatter
- **JSON formatting** with Prettier - Beautiful syntax highlighting and error handling
- **XML formatting** with xml-formatter - Clean, indented XML output
- **GraphQL formatting** with Prettier - Query and schema formatting
- **Real-time formatting** with async loading states
- **Error display** with helpful error messages
- **Copy to clipboard** with visual feedback

### 🔍 Compare Tool
- **Side-by-side text comparison** for any content type
- **Diff visualization** with added/removed line indicators
- **Live comparison** with instant results
- **Copy diff results** to clipboard

### 🚀 Modern UI/UX
- **Tab-based navigation** between Formatter and Compare tools
- **Gradient purple background** with card-based layout
- **Responsive design** that works on mobile and desktop
- **Loading states** with emoji indicators
- **Hover effects** and smooth transitions
- **Accessible UI components** with focus states

### ⚡ Performance
- **Code splitting** with dynamic imports for optimal loading
- **Lazy loading** of formatters (only load what you use)
- **Optimized chunking** for faster initial page load
- **Async formatting** to prevent UI blocking

### 🛠 Technical
- **100% browser-based** - No server required
- **Modern React** with hooks and functional components
- **Custom CSS** with utility classes
- **Dockerized** for easy deployment

## Getting Started

### Local Development
```bash
npm install
npm run dev
```
App runs at http://localhost:3000

### Docker Development
```bash
docker-compose -f docker-compose.dev.yml up --build
docker-compose -f docker-compose.dev.yml down
```

### Production Build
```bash
npm run build
```

### Docker Production
```bash
docker build -t formatje .
docker run -p 80:80 formatje
# OR
docker-compose up --build
```
App runs at http://localhost

## 📁 Project Structure
- `/src/components/` - React UI components
  - `/ui/` - Reusable UI components (Button, Textarea, etc.)
  - `FormatterSection.jsx` - Main formatting interface
  - `CompareSection.jsx` - Text comparison interface
- `/src/utils/` - Core utilities
  - `formatters.js` - JSON/XML/GraphQL formatting logic
  - `diffUtils.js` - Text comparison logic
- `/docker/` - Docker configuration
- `/dist/` - Built production files

## 🔧 Tech Stack
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool with HMR
- **Prettier** - JSON & GraphQL formatting
- **xml-formatter** - XML formatting
- **diff** - Text comparison
- **Custom CSS** - Modern styling with gradients
- **Docker** - Containerized deployment

## License
MIT
