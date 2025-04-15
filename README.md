# IEEE PESCE Student Branch Website

This is the official website for the IEEE PESCE Student Branch at PES College of Engineering, Mandya.

## Features

- Responsive design for all devices
- Dark and light mode support
- Dynamic content management
- Admin dashboard for easy updates
- Event management system
- Blog posting capabilities
- Gallery showcase
- Chapter information
- Team members showcase
- Resources section

## SEO Features

The website has been optimized for search engines with the following features:

- Next.js 14 App Router with built-in SEO capabilities
- Dynamic metadata generation for all pages
- Open Graph tags for social media sharing
- Twitter cards for Twitter sharing
- JSON-LD structured data for better search engine understanding
- Sitemap.xml generation
- Robots.txt configuration
- Web app manifest for PWA support
- Favicon and touch icons
- Custom 404 page
- Custom error handling
- Loading state UI

## Tech Stack

- Next.js 14
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- Shadcn UI

## Deployment Instructions

### Prerequisites

- Node.js 18+ and npm
- Git

### Local Development

```bash
# Clone the repository
git clone <repository-url>
cd ieee-pesce-website

# Install dependencies
npm install

# Create a .env.local file with required environment variables
# See .env.example for reference

# Run development server
npm run dev
```

### Environment Setup

Create a `.env.local` file in the root of the project with the following variables:

```
# EmailJS Configuration (for contact form)
NEXT_PUBLIC_EMAILJS_USER_ID=your_emailjs_user_id
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_emailjs_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_emailjs_template_id

# Google Maps API Key (for contact page map)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Authentication (Admin login)
JWT_SECRET=generate_a_strong_random_string_here
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_secure_admin_password
```

⚠️ **IMPORTANT**: 
- Never commit `.env.local` to your repository
- Use a strong password for the admin account
- Generate a secure random string for JWT_SECRET

### Production Deployment

1. Update the environment variables on your hosting platform (Vercel, Netlify, etc.)
2. Configure the build settings according to your hosting platform
3. Deploy the application

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Recommended Hosting Platforms

- **Vercel**: Best option for Next.js applications
- **Netlify**: Good alternative with similar capabilities
- **AWS Amplify**: Great for enterprise deployments

## Admin Access

After deployment, you can access the admin panel at `/admin` and log in with the credentials set in your environment variables.

## Structured Data Validation

During development, a structured data validator component is available at the bottom right of each page. This allows you to validate the structured data on each page using Google's Structured Data Testing Tool.

## SEO Components

- `app/lib/metadata.ts` - Contains base metadata and functions for generating dynamic metadata
- `app/sitemap.ts` - Generates a sitemap.xml file
- `app/robots.ts` - Generates a robots.txt file
- `app/manifest.ts` - Generates a web app manifest file
- `components/seo/json-ld.tsx` - Contains components for generating JSON-LD structured data

## License

© 2024 IEEE PESCE Student Branch. All rights reserved. 