# Agency Ignition Tools

A suite of professional tools for cold email lead gen agencies. Built with Next.js, TypeScript, and shadcn/ui.

## Tools

### 🧹 Company Name & Job Title Formatter
Standardize company names and job titles with two modes:
- **Free Mode**: Rule-based cleaning (removes suffixes, standardizes formatting)
- **AI-Powered Mode**: OpenAI API integration for intelligent normalization (user provides API key)
- Supports CSV upload or text paste
- Preview before/after results
- Export formatted data as CSV

### 📈 TAM Calculator
Calculate Total Addressable Market based on:
- Industry selection (multiple industries supported)
- Target roles/job titles
- Company size filters
- Geographic filters
- Data source selection
- Visual breakdowns with charts

### 💰 ROI Calculator
Estimate ROI for outreach/lead gen campaigns:
- Campaign volume inputs
- Conversion funnel metrics (open rate, reply rate, meeting booked, show rate, close rate)
- Deal metrics (ACV, contract length, LTV)
- Cost breakdown (CPL, tool costs, time costs, other expenses)
- Comprehensive ROI metrics and visualizations
- Funnel visualization showing drop-off at each stage

## Tech Stack

- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **CSV Processing**: PapaParse
- **File Compression**: JSZip

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Building for Production

```bash
npm run build
npm start
```

## Deployment

### Deploying to Coolify

This project includes a Dockerfile for easy deployment to Coolify (or any Docker-compatible platform).

**Steps to deploy on Coolify:**

1. **Push your code to a Git repository** (GitHub, GitLab, etc.)

2. **In your Coolify dashboard:**
   - Click "New Resource" → "Application"
   - Connect your Git repository
   - Coolify will auto-detect the Dockerfile
   - Configure:
     - **Port**: `3000` (default Next.js port)
     - **Build Pack**: Docker (or let it auto-detect)
   - Add a domain/subdomain if desired
   - Click "Deploy"

3. **Coolify will automatically:**
   - Build the Docker image
   - Run the container
   - Set up networking and SSL (if domain configured)

**Alternative: Manual VPS Deployment**

If deploying manually on a VPS:

1. Build the application: `npm run build`
2. Start the production server: `npm start`
3. Consider using PM2 or similar process manager for production

## Project Structure

```
/app
  /(tools)
    /formatter
    /tam-calculator
    /roi-calculator
/components
  /tools
    CompanyFormatter.tsx
    TAMCalculator.tsx
    ROICalculator.tsx
    Navigation.tsx
  /ui (shadcn components)
/lib
  /utils
    csvProcessor.ts
    formatter.ts
    calculations.ts
  constants.ts
```

## Features

- ✅ Client-side processing (no backend required)
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Type-safe with TypeScript
- ✅ Modern UI with shadcn/ui components
- ✅ Data visualizations with charts
- ✅ File upload and download capabilities

## License

Private project - All rights reserved
