import { useEffect } from 'react';
import { useLocation } from 'wouter';

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  noindex?: boolean;
}

export default function SEOHead({
  title,
  description,
  canonical,
  ogTitle,
  ogDescription,
  ogImage,
  twitterTitle,
  twitterDescription,
  noindex = false
}: SEOHeadProps) {
  const [location] = useLocation();

  // Structured data for the organization
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Perfect Day Reset",
    "description": "Science-backed wellness transformation platform providing personalized daily protocols for holistic well-being.",
    "url": "https://perfectdayreset.com",
    "logo": "https://perfectdayreset.com/og-image.png",
    "sameAs": [
      "https://facebook.com/perfectdayreset",
      "https://instagram.com/perfectdayreset"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-555-0123",
      "contactType": "customer service",
      "email": "support@perfectdayreset.com"
    }
  };

  // Structured data for the product (on product pages)
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Perfect Day Reset Program",
    "description": "Complete 24-hour transformation guide including morning routines, midday recharge protocols, and evening reflection practices.",
    "brand": {
      "@type": "Brand",
      "name": "Perfect Day Reset"
    },
    "offers": {
      "@type": "Offer",
      "price": "19",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "url": "https://perfectdayreset.com/what-you-get"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127"
    }
  };

  useEffect(() => {
    // Update document title
    if (title) {
      document.title = title;
    }

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (description && metaDescription) {
      metaDescription.setAttribute('content', description);
    }

    // Update canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', canonical);
    }

    // Update robots meta tag
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.setAttribute('name', 'robots');
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.setAttribute('content', noindex ? 'noindex, nofollow' : 'index, follow');

    // Update Open Graph tags
    const updateMetaProperty = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    if (ogTitle) updateMetaProperty('og:title', ogTitle);
    if (ogDescription) updateMetaProperty('og:description', ogDescription);
    if (ogImage) updateMetaProperty('og:image', ogImage);
    if (canonical) updateMetaProperty('og:url', canonical);

    // Update Twitter Card tags
    if (twitterTitle) updateMetaProperty('twitter:title', twitterTitle);
    if (twitterDescription) updateMetaProperty('twitter:description', twitterDescription);
    if (ogImage) updateMetaProperty('twitter:image', ogImage);

    // Add structured data for organization
    let organizationScript = document.querySelector('script[data-type="organization-schema"]');
    if (!organizationScript) {
      organizationScript = document.createElement('script');
      organizationScript.setAttribute('type', 'application/ld+json');
      organizationScript.setAttribute('data-type', 'organization-schema');
      document.head.appendChild(organizationScript);
    }
    organizationScript.textContent = JSON.stringify(organizationSchema);

    // Add structured data for product (on product/what-you-get pages)
    if (location === '/what-you-get' || location === '/') {
      let productScript = document.querySelector('script[data-type="product-schema"]');
      if (!productScript) {
        productScript = document.createElement('script');
        productScript.setAttribute('type', 'application/ld+json');
        productScript.setAttribute('data-type', 'product-schema');
        document.head.appendChild(productScript);
      }
      productScript.textContent = JSON.stringify(productSchema);
    }

  }, [title, description, canonical, ogTitle, ogDescription, ogImage, twitterTitle, twitterDescription, noindex, location]);

  return null;
}