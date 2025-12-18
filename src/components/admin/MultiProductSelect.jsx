import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Check, ChevronDown } from 'lucide-react';

const MultiProductSelect = ({ products = [], selectedProducts = [], onChange, placeholder = "Məhsulları seçin..." }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter products based on search
  const filteredProducts = products.filter(product => {
    const searchLower = searchTerm.toLowerCase();
    return (
      product.name?.toLowerCase().includes(searchLower) ||
      product.brand?.toLowerCase().includes(searchLower) ||
      product.model?.toLowerCase().includes(searchLower)
    );
  });

  // Toggle product selection
  const toggleProduct = (productId) => {
    const newSelected = selectedProducts.includes(productId)
      ? selectedProducts.filter(id => id !== productId)
      : [...selectedProducts, productId];
    onChange(newSelected);
  };

  // Remove selected product
  const removeProduct = (e, productId) => {
    e.stopPropagation();
    const newSelected = selectedProducts.filter(id => id !== productId);
    onChange(newSelected);
  };

  // Clear all selections
  const clearAll = (e) => {
    e.stopPropagation();
    onChange([]);
  };

  const selectedProductsData = products.filter(p => selectedProducts.includes(p._id));

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selected Products Display */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full min-h-[48px] p-3 border border-[#5C4977]/20 rounded-xl focus-within:ring-2 focus-within:ring-[#5C4977] focus-within:border-transparent transition-colors cursor-pointer bg-white"
      >
        {selectedProducts.length === 0 ? (
          <div className="flex items-center justify-between text-gray-400">
            <span>{placeholder}</span>
            <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 items-center">
            {selectedProductsData.slice(0, 3).map((product) => (
              <span
                key={product._id}
                className="inline-flex items-center gap-1.5 bg-[#5C4977]/10 text-[#5C4977] px-2.5 py-1 rounded-lg text-sm font-medium"
              >
                <span className="truncate max-w-[150px]">{product.name}</span>
                <button
                  type="button"
                  onClick={(e) => removeProduct(e, product._id)}
                  className="hover:bg-[#5C4977]/20 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
            {selectedProducts.length > 3 && (
              <span className="text-sm text-[#5C4977] font-medium">
                +{selectedProducts.length - 3} daha
              </span>
            )}
            <button
              type="button"
              onClick={clearAll}
              className="ml-auto text-gray-400 hover:text-red-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-[#5C4977]/20 rounded-xl shadow-xl max-h-[400px] flex flex-col">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Məhsul axtar..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5C4977] focus:border-transparent outline-none"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          {/* Products List */}
          <div className="overflow-y-auto flex-1">
            {filteredProducts.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {searchTerm ? 'Məhsul tapılmadı' : 'Məhsul yoxdur'}
              </div>
            ) : (
              <div className="p-2">
                {filteredProducts.map((product) => {
                  const isSelected = selectedProducts.includes(product._id);
                  return (
                    <label
                      key={product._id}
                      className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-[#5C4977]/5 select-none ${
                        isSelected ? 'bg-[#5C4977]/10' : ''
                      }`}
                      onClick={(e) => {
                        // Checkbox'a direkt tıklanmadıysa toggle et
                        if (e.target.type !== 'checkbox') {
                          toggleProduct(product._id);
                        }
                      }}
                    >
                      <div className="flex items-center mt-0.5">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleProduct(product._id)}
                          className="w-4 h-4 text-[#5C4977] border-gray-300 rounded focus:ring-[#5C4977] cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{product.name}</p>
                            <p className="text-sm text-gray-500">
                              {product.brand} {product.model && `- ${product.model}`}
                            </p>
                            <p className="text-sm font-semibold text-[#5C4977] mt-1">
                              {product.price} ₼
                            </p>
                          </div>
                          {isSelected && (
                            <Check className="w-5 h-5 text-[#5C4977] flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer with count */}
          {selectedProducts.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  <span className="font-semibold text-[#5C4977]">{selectedProducts.length}</span> məhsul seçildi
                </span>
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-red-500 hover:text-red-600 font-medium transition-colors"
                >
                  Hamısını sil
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiProductSelect;
