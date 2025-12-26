/**
 * Pricing visibility utility based on user tiers
 * - normal: Prices may be hidden or shown as "Contact for price"
 * - promoted: Full prices are visible
 */

/**
 * Check if user can see prices
 * @param {Object} user - User object from Redux state
 * @returns {boolean} - True if user can see prices
 */
export const canSeePrices = (user) => {
  if (!user) return false; // Not logged in - no prices
  
  const userTier = user?.user?.tier || user?.tier || "normal";
  return userTier === "promoted";
};

/**
 * Get price display text based on user tier
 * @param {number|string} price - Product price
 * @param {Object} user - User object from Redux state
 * @returns {string} - Price text or "Contact for price"
 */
export const getPriceDisplay = (price, user) => {
  if (canSeePrices(user)) {
    const priceNum = typeof price === 'number' ? price : parseFloat(price) || 0;
    return `${priceNum.toFixed(2)} ₼`;
  }
  return "Qiymət üçün əlaqə saxlayın";
};

/**
 * Get price display with fallback for non-logged users
 * @param {number|string} price - Product price
 * @param {Object} user - User object from Redux state
 * @param {boolean} showForNonLogged - Whether to show prices for non-logged users
 * @returns {string} - Price text
 */
export const getPriceDisplayWithFallback = (price, user, showForNonLogged = false) => {
  if (!user && showForNonLogged) {
    const priceNum = typeof price === 'number' ? price : parseFloat(price) || 0;
    return `${priceNum.toFixed(2)} ₼`;
  }
  return getPriceDisplay(price, user);
};

