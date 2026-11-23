/**
 * CAFEX - AI RECOMMENDATION ENGINE
 * Generates intelligent smart pairing recommendations:
 * - Coffee pairs with French Bakery & Pastries
 * - Healthy bowls pair with Matcha & Botanical teas
 * - Sandwiches pair with Cold Brew & Nitro
 */

const { memoryStore } = require('../config/db');

class RecommendationService {
  /**
   * Returns "Pairs perfectly with..." items based on current product slug
   */
  static getSmartPairings(productSlug) {
    const currentProduct = memoryStore.products.find(p => p.slug === productSlug);
    if (!currentProduct) {
      return memoryStore.products.slice(0, 3);
    }

    const currentCat = currentProduct.category_name;

    let targetCategories = [];
    if (currentCat.includes('Coffee') || currentCat.includes('Cold Brew')) {
      targetCategories = ['Artisan Bakery & Pastries', 'Decadent Desserts'];
    } else if (currentCat.includes('Bakery') || currentCat.includes('Desserts')) {
      targetCategories = ['Artisan Coffee', 'Cold Brew & Nitro'];
    } else if (currentCat.includes('Sandwiches')) {
      targetCategories = ['Cold Brew & Nitro', 'Artisan Coffee'];
    } else {
      targetCategories = ['Organic Teas & Infusions', 'Artisan Bakery & Pastries'];
    }

    const recommendations = memoryStore.products.filter(
      p => targetCategories.includes(p.category_name) && p.id !== currentProduct.id
    );

    return recommendations.length > 0 ? recommendations.slice(0, 3) : memoryStore.products.slice(0, 3);
  }

  /**
   * Chef's and AI Top Recommended picks
   */
  static getTopRecommendations() {
    return memoryStore.products.filter(p => p.is_featured || p.is_chef_special).slice(0, 4);
  }
}

module.exports = RecommendationService;
