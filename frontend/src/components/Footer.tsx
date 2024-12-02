// src/components/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-gray-400 py-4">
      <div className="container mx-auto text-center">
        <p>
          &copy; {new Date().getFullYear()} MyFitnessApp. All rights reserved.
        </p>
        <div className="space-x-4 mt-2">
          <a
            href="https://github.com/your-repo"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-400"
          >
            GitHub
          </a>
          <a
            href="/privacy-policy"
            className="hover:text-indigo-400"
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
