import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Breadcrumb = ({ items }) => {
  return (
    <nav className="mb-4 sm:mb-6 text-xs sm:text-sm text-gray-600">
      <ol className="flex flex-wrap items-center gap-1 sm:gap-2">
        {items.map((item, index) => {
          const isLastItem = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-1 sm:gap-2">
              {index > 0 && <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />}
              {item.path && !isLastItem ? (
                <Link to={item.path} className="hover:text-[#5C4977] transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-900 font-bold">{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;

