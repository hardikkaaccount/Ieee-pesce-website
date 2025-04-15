import React, { FC } from 'react';

interface OrganizationProps {
  name: string;
  url: string;
  logo: string;
  description?: string;
  sameAs?: string[];
}

export const OrganizationJsonLd: FC<OrganizationProps> = ({ name, url, logo, description, sameAs }) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ieeepescesb.org';
  const logoUrl = logo.startsWith('http') ? logo : `${baseUrl}${logo}`;
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    logo: logoUrl,
    ...(description && { description }),
    ...(sameAs && { sameAs }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface EventProps {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location: string;
  image?: string;
  url?: string;
  organizer: {
    name: string;
    url: string;
  };
}

export const EventJsonLd: FC<EventProps> = ({ name, description, startDate, endDate, location, image, url, organizer }) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ieeepescesb.org';
  const imageUrl = image && (image.startsWith('http') ? image : `${baseUrl}${image}`);
  const eventUrl = url ? (url.startsWith('http') ? url : `${baseUrl}${url}`) : baseUrl;
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name,
    description,
    startDate,
    ...(endDate && { endDate }),
    location: {
      '@type': 'Place',
      name: location,
      address: location
    },
    ...(imageUrl && { image: imageUrl }),
    url: eventUrl,
    organizer: {
      '@type': 'Organization',
      name: organizer.name,
      url: organizer.url
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface WebPageJsonLdProps {
  url: string;
  title: string;
  description: string;
  image?: string;
}

export const WebPageJsonLd: FC<WebPageJsonLdProps> = ({ url, title, description, image }) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ieeepescesb.org';
  const imageUrl = image && (image.startsWith('http') ? image : `${baseUrl}${image}`);
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": title,
    "description": description,
    "url": url,
    ...(imageUrl && { "image": imageUrl }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

interface BlogJsonLdProps {
  url: string;
  title: string;
  images: string[];
  datePublished: string;
  dateModified: string;
  authorName: string;
  description: string;
}

export const BlogJsonLd: FC<BlogJsonLdProps> = ({
  url,
  title,
  images,
  datePublished,
  dateModified,
  authorName,
  description,
}) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url,
    },
    "headline": title,
    "description": description,
    "image": images,
    "datePublished": datePublished,
    "dateModified": dateModified || datePublished,
    "author": {
      "@type": "Person",
      "name": authorName,
    },
    "publisher": {
      "@type": "Organization",
      "name": "IEEE PESCE Student Branch",
      "logo": {
        "@type": "ImageObject",
        "url": "/images/ieee-logo.png",
      },
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
} 