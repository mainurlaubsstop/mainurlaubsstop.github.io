# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

### Development
- `npm run dev` - Start Hugo development server (alias for `hugo server`)
- `hugo server` - Start Hugo development server with live reload
- `hugo server -D` - Start development server including draft content

### Building
- `npm run build` - Build production site with optimizations
- `hugo --gc --minify` - Build with garbage collection and minification
- `npm run preview` - Preview production build locally

### Dependencies and Modules
- `npm install` - Install Node.js dependencies (Tailwind CSS, Prettier)
- `npm run update-modules` - Update Hugo modules
- `hugo mod get -u ./...` - Update all Hugo modules
- `hugo mod tidy` - Clean up module dependencies

### Code Formatting
- `npm run format` - Format code with Prettier (Go templates, CSS, JS)
- `prettier -w .` - Format all files with Prettier

### Theme Management
- `npm run theme-setup` - Set up theme configuration
- `npm run update-theme` - Update Hugoplate theme
- `npm run remove-darkmode` - Remove dark mode features

## Architecture

This is a multilingual Hugo static site for MainUrlaubsStop vacation rental, built with the Hugoplate theme and modular Hugo components.

### Core Structure

**Hugo Configuration (`hugo.toml`)**
- Base URL: https://mainurlaubsstop.github.io
- Multilingual setup: German (default) and English
- Module-based theme architecture with 20+ Hugo modules
- Production-ready with optimized image processing

**Content Organization**
- `content/german/` - German content (primary language)
- `content/english/` - English content (secondary language) 
- Markdown-based content with front matter configuration
- Structured sections: apartment, amenities, booking, contact, location

**Theme System (Hugoplate-based)**
- Modular Hugo modules from gethugothemes
- Components: preloader, social-share, cookie-consent, announcement
- SEO tools: basic-seo, site-verifications, Google Tag Manager
- UI components: accordion, modal, search, PWA support

### Key Components

**Multilingual Setup**
- German: `de-de` (weight: 1, primary)
- English: `en-us` (weight: 2, secondary)
- Language switcher component in navigation
- Separate content directories and menu configurations

**WhatsApp Integration (`layouts/partials/whatsapp-chat.html`)**
- Fixed floating WhatsApp button with pulse animation
- Direct booking integration via WhatsApp API
- Phone: +49 163 245 5504
- Mobile-optimized responsive design

**Image Management**
- Apartment images in `static/images/apartment/`
- Optimized image processing with WebP generation
- Gallery images with responsive sizing
- Logo variants for light/dark themes

**Deployment (GitHub Actions)**
- Automated deployment to GitHub Pages
- Hugo Extended v0.148.1
- Node.js 18 for Tailwind CSS compilation
- Production builds with `--gc --minify` optimization

### Configuration Files

**Hugo Configuration**
- `hugo.toml` - Main Hugo configuration
- `config/_default/params.toml` - Theme parameters and site settings
- `config/_default/languages.toml` - Multilingual configuration
- `config/_default/menus.de.toml` / `menus.en.toml` - Navigation menus

**Build Configuration**
- `package.json` - Node.js dependencies (Tailwind CSS, Prettier)
- `go.mod` - Hugo modules dependencies
- `.github/workflows/hugo.yml` - GitHub Actions deployment
- `tailwind-plugin/` - Custom Tailwind CSS plugins

### Content Structure

**Page Types**
- Landing pages with banner and features sections
- Apartment showcase with image galleries
- Booking forms with WhatsApp integration
- Contact pages with Google Maps integration
- Blog system (unused but available)

**SEO and Analytics**
- OpenGraph and Twitter Card metadata
- Google Maps integration (API key configured)
- Site verification support (Google, Bing, Baidu)
- Structured data and schema markup

### Development Workflow

**Local Development**
1. Run `npm install` to install Tailwind CSS dependencies
2. Use `npm run dev` or `hugo server` for live development
3. Content changes auto-reload via Hugo's fast build system
4. Tailwind CSS compiled automatically

**Content Management**
- Markdown files with YAML front matter
- Image assets in `static/images/` directory
- Multi-language content in separate directories
- Menu configuration per language

**Deployment Process**
- GitHub Actions triggered on main branch push
- Automated Hugo build with Node.js dependencies
- Direct deployment to GitHub Pages
- Production optimization with minification

### Important Notes

- **Language Priority**: German is the primary language (weight: 1)
- **WhatsApp Booking**: Main booking method via WhatsApp integration
- **Image Optimization**: WebP generation enabled for performance
- **Theme Updates**: Use `npm run update-theme` for Hugoplate updates
- **Module System**: Hugo modules provide extensive functionality without custom code
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **SEO Ready**: Comprehensive meta tags and structured data