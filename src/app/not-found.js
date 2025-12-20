import React from 'react';
import Link from 'next/link'; // Assuming you are using Next.js/React Router for navigation

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#faf9f5] p-4">
      <div className="text-center">
        
        {/* Large, attention-grabbing 404 number */}
        <h1 className="text-9xl font-extrabold text-indigo-600 tracking-wider mb-4">
          404
        </h1>
        
        {/* Separator Line */}
        <div className="w-24 h-1 bg-gray-300 mx-auto my-6"></div>

        {/* Main Heading/Message */}
        <h2 className="text-4xl font-semibold text-gray-800 mb-2">
          Page Not Found
        </h2>
        
        {/* Subtitle/Explanation */}
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          Oops! It looks like you've followed a broken link or entered a URL that doesn't exist on this site.
        </p>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          
          {/* Primary Button: Go Home */}
          {/* Adjust the Link component based on your router (e.g., Next.js Link or React Router Link) */}
          <Link href="/">
            <div className="inline-block px-6 py-3 text-sm font-medium leading-5 shadow text-white transition-colors duration-200 transform bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-300 focus:ring-opacity-50 cursor-pointer">
              Go to Homepage
            </div>
          </Link>
          
          {/* Secondary Button: Contact Support/Help */}
          <Link href="/contact">
            <div className="inline-block px-6 py-3 text-sm font-medium leading-5 shadow text-indigo-600 transition-colors duration-200 transform bg-white border border-indigo-600 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring focus:ring-indigo-300 focus:ring-opacity-50 cursor-pointer">
              Contact Support
            </div>
          </Link>
          
        </div>

      </div>
    </div>
  )
}