# formatje

A modern, client-side web app that formats and compares JSON, XML, and GraphQL through a clean, responsive interface. Also includes a JSON to cURL converter for API testing. Built with React, with assistance from Copilot as a learning tool to help me understand and practice React development.

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

### 🌀 JSON to cURL Converter
- **Convert JSON to cURL commands** for REST API testing
- **Customizable options**: verbose, insecure, headers, silent, follow redirects
- **Sensitive data masking** for safe sharing
- **Pre-built example templates** for common API patterns
- **Copy to clipboard** with one-click
- **Perfect for API development** and documentation

### 🚀 Modern UI/UX
- **Tab-based navigation** between Formatter, Compare, and JSON to cURL tools
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

## 🚀 Quick Start

### Option 1: Use Pre-built Docker Image (Recommended)

**No installation needed!** Just pull and run the pre-built image:

#### Using Docker Compose:
```bash
# Clone repository for docker-compose file
git clone https://github.com/AamirFaisal-Adanan/formatje.git
cd formatje

# Run with docker-compose
docker-compose up -d

# Access the app at http://localhost:9111
```

#### Using Docker directly:
```bash
docker pull ghcr.io/aamirfaisaladanan/formatje:latest
docker run -p 9111:8080 ghcr.io/aamirfaisaladanan/formatje:latest

# Access the app at http://localhost:9111
```

---

### Option 2: Build from Source

Clone the repository to build and develop:

```bash
git clone https://github.com/AamirFaisal-Adanan/formatje.git
cd formatje
npm install
```

#### Development with hot reload:
```bash
npm run dev

# Access the app at http://localhost:3000
```

#### Build production bundle:
```bash
npm run build
```

#### Run production build with Docker:

**Build locally:**
```bash
docker build -t formatje:latest .
docker run -p 9111:8080 formatje:latest

# Access the app at http://localhost:9111
```

**Or with docker-compose:**
```bash
docker-compose up --build -d

# Access the app at http://localhost:9111
```

---

### Development Environment

For development with docker:
```bash
docker-compose -f docker-compose.dev.yml up --build
docker-compose -f docker-compose.dev.yml down
```

### Production Deployment

The Docker image includes enterprise-grade features:
- Multi-stage build for optimized image size (45MB final)
- Alpine Linux base for minimal attack surface
- Non-root user execution (security best practice)
- Health checks with automatic restart
- Security headers (HSTS, CSP, X-Frame-Options, etc.)
- Read-only filesystem with tmpfs for nginx temp files
- Resource limits and structured logging
- Capability dropping for enhanced security

See [SECURITY.md](SECURITY.md) for comprehensive security documentation.

### Push to GitHub Container Registry

Build and push your own image:
```bash
# Authenticate with GitHub
docker login ghcr.io -u YOUR_USERNAME -p YOUR_GITHUB_TOKEN

# Build and push
./build-and-push.sh
```

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
