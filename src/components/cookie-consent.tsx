'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Show banner after a short delay for better UX
      setTimeout(() => setShowBanner(true), 1000);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setShowBanner(false);
    // Here you can enable analytics, tracking, etc.
  };

  const declineCookies = () => {
    localStorage.setItem('cookie-consent', 'declined');
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setShowBanner(false);
    // Here you should disable non-essential cookies
  };

  const closeBanner = () => {
    // Closing without choice is treated as declined
    declineCookies();
  };

  if (!showBanner) return null;

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg"
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
    >
      <div className="container mx-auto max-w-7xl p-4 md:p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 
              id="cookie-consent-title" 
              className="text-lg font-semibold mb-2"
            >
              Cookie Consent
            </h3>
            <p 
              id="cookie-consent-description" 
              className="text-sm text-gray-600 leading-relaxed"
            >
              We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
              By clicking "Accept All", you consent to our use of cookies. You can manage your preferences at any time.{' '}
              <a 
                href="/privacy-policy" 
                className="text-blue-600 hover:underline font-medium"
              >
                Learn more in our Privacy Policy
              </a>.
            </p>
          </div>
          
          <div className="flex items-center gap-3 flex-shrink-0">
            <Button 
              variant="outline" 
              onClick={declineCookies}
              className="whitespace-nowrap"
              aria-label="Decline cookies"
            >
              Decline
            </Button>
            <Button 
              onClick={acceptCookies}
              className="whitespace-nowrap"
              aria-label="Accept all cookies"
            >
              Accept All
            </Button>
            <button
              onClick={closeBanner}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close cookie banner"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
