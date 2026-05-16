import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client/react/index.js";
import { GET_CATEGORIES } from "@/gql/Product";

const DummyIcon = () => <div style={{ width: 18, height: 18, background: 'gray', borderRadius: '50%' }} />;

const FooterLogo = () => (
  <svg viewBox="0 0 120 40" className="h-10">
    <text x="0" y="28" fontFamily="Arial" fontSize="24" fontWeight="bold" fill="currentColor">Zentro</text>
  </svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { data: categoriesData } = useQuery(GET_CATEGORIES);
  const categories = categoriesData?.categories || [];
  const footerCategories = categories.slice(0, 6);

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            <FooterLogo />
            <p className="text-gray-400 mt-4">Premium E-Commerce Platform</p>
          </div>
          <div>
            <h3 className="font-bold mb-4">Categories</h3>
            <ul className="space-y-2">
              {footerCategories.map(cat => (
                <li key={cat.id}><Link to={`/shop?categoryId=${cat.id}`} className="text-gray-400 hover:text-white">{cat.name}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/help" className="text-gray-400 hover:text-white">Help Center</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 flex justify-between items-center">
          <p className="text-gray-500 text-sm">© {currentYear} Zentro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
