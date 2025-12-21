// Favorileri localStorage'da yönetmek için utility fonksiyonları

const FAVORITES_KEY = 'magazam_favorites';

// Favorileri localStorage'dan al
export const getFavorites = () => {
  try {
    const favorites = localStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error getting favorites from localStorage:', error);
    return [];
  }
};

// Favorilere ürün ekle
export const addToFavorites = (productId) => {
  try {
    const favorites = getFavorites();
    if (!favorites.includes(productId)) {
      const updatedFavorites = [...favorites, productId];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
      return updatedFavorites;
    }
    return favorites;
  } catch (error) {
    console.error('Error adding to favorites:', error);
    return getFavorites();
  }
};

// Favorilerden ürün çıkar
export const removeFromFavorites = (productId) => {
  try {
    const favorites = getFavorites();
    const updatedFavorites = favorites.filter(id => id !== productId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    return updatedFavorites;
  } catch (error) {
    console.error('Error removing from favorites:', error);
    return getFavorites();
  }
};

// Ürünün favorilerde olup olmadığını kontrol et
export const isFavorite = (productId) => {
  const favorites = getFavorites();
  return favorites.includes(productId);
};

// Tüm favorileri temizle
export const clearFavorites = () => {
  try {
    localStorage.removeItem(FAVORITES_KEY);
    return [];
  } catch (error) {
    console.error('Error clearing favorites:', error);
    return [];
  }
};


