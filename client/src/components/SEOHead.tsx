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
  customSchemas?: Record<string, any>[];
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
  noindex = false,
  customSchemas
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
      "contactType": "customer service",
      "email": "support@perfectdayreset.com"
    }
  };

  // Structured data for the product (on product pages)
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Perfect Day Reset Program",
    "description": "Complete 24-hour transformation protocol and interactive web companion including morning activation, midday recharge, 5 customizable meal tracks, 1-tap delay rescheduler, and evening reflection.",
    "image": [
      "https://perfectdayreset.com/og-image.png",
      "https://perfectdayreset.com/logo.png"
    ],
    "sku": "PDR-24H-CORE",
    "brand": {
      "@type": "Brand",
      "name": "Perfect Day Reset"
    },
    "offers": {
      "@type": "Offer",
      "url": "https://perfectdayreset.com/what-you-get",
      "price": "19.00",
      "priceCurrency": "USD",
      "priceValidUntil": "2027-12-31",
      "availability": "https://schema.org/InStock",
      "hasMerchantReturnPolicy": {
        "@type": "MerchantReturnPolicy",
        "applicableCountry": ["US", "GB", "CA", "AU", "EE", "DE", "FI", "SE"],
        "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
        "merchantReturnDays": 14,
        "returnMethod": "https://schema.org/ReturnByMail",
        "returnFees": "https://schema.org/FreeReturn",
        "merchantReturnLink": "https://perfectdayreset.com/refund-policy"
      },
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": "0.00",
          "currency": "USD"
        },
        "shippingDestination": {
          "@type": "DefinedRegion",
          "addressCountry": ["US", "GB", "CA", "AU", "EE", "DE", "FI", "SE"]
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": 0,
            "maxValue": 0,
            "unitCode": "DAY"
          },
          "transitTime": {
            "@type": "QuantitativeValue",
            "minValue": 0,
            "maxValue": 0,
            "unitCode": "DAY"
          }
        }
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127"
    }
  };

  // FAQPage structured data for homepage and product overview
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How does a 24-hour burnout reset work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The Perfect Day Reset is a structured, hour-by-hour 24-hour neuro-biological protocol that synchronizes four biological anchors in a single day: morning cortisol-hydration sequencing, a 90-minute adenosine-caffeine delay, metabolic glycemic stabilization at lunch with an optic-flow walk, and a 90-minute evening digital sunset with cognitive offload journaling."
        }
      },
      {
        "@type": "Question",
        "name": "What happens if I run late or get interrupted during my reset day?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Unlike rigid PDF schedules that fail the moment a meeting runs over or a family need arises, the interactive Perfect Day Reset Web Companion includes a 1-Tap Delay Rescheduler (+15m, +30m, +60m) that dynamically recalculates your remaining meal, movement, and wind-down timestamps without guilt."
        }
      },
      {
        "@type": "Question",
        "name": "How do the 5 customizable nutrition tracks work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Inside the interactive portal, you can switch with one click between 5 whole-food metabolic tracks: Omnivore, Vegetarian, Ketogenic, Paleo, and Vegan. Each track provides exact breakfast, lunch, afternoon stabilizer, and dinner combinations calibrated to prevent post-meal glucose crashes without calorie counting."
        }
      },
      {
        "@type": "Question",
        "name": "What is the 14-day money-back guarantee?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Your $19 one-time purchase is backed by a 14-day 100% money-back guarantee. If you complete the 24-Hour Reset Protocol and do not feel a measurable improvement in morning alertness, afternoon focus, and evening calm, simply email support@perfectdayreset.com within 14 days for a full refund."
        }
      }
    ]
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

    // Add structured data for product & FAQ (on product/what-you-get and home pages)
    if (location === '/what-you-get' || location === '/') {
      let productScript = document.querySelector('script[data-type="product-schema"]');
      if (!productScript) {
        productScript = document.createElement('script');
        productScript.setAttribute('type', 'application/ld+json');
        productScript.setAttribute('data-type', 'product-schema');
        document.head.appendChild(productScript);
      }
      productScript.textContent = JSON.stringify(productSchema);

      let faqScript = document.querySelector('script[data-type="faq-schema"]');
      if (!faqScript) {
        faqScript = document.createElement('script');
        faqScript.setAttribute('type', 'application/ld+json');
        faqScript.setAttribute('data-type', 'faq-schema');
        document.head.appendChild(faqScript);
      }
      faqScript.textContent = JSON.stringify(faqSchema);
    }

    // Add custom route schemas if provided
    document.querySelectorAll('script[data-type="custom-schema"]').forEach((el) => el.remove());
    if (customSchemas && customSchemas.length > 0) {
      customSchemas.forEach((schemaObj) => {
        const script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        script.setAttribute('data-type', 'custom-schema');
        script.textContent = JSON.stringify(schemaObj);
        document.head.appendChild(script);
      });
    }

  }, [title, description, canonical, ogTitle, ogDescription, ogImage, twitterTitle, twitterDescription, noindex, location, customSchemas]);

  return null;
}