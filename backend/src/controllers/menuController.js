const { memoryStore } = require('../config/db');
const RecommendationService = require('../services/recommendationService');

class MenuController {
  /**
   * Get all menu categories
   */
  static async getCategories(req, res, next) {
    try {
      const categories = memoryStore.categories
        .filter(c => c.is_active)
        .sort((a, b) => a.display_order - b.display_order);

      res.status(200).json({
        success: true,
        count: categories.length,
        categories
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get products with rich search, dietary filtering, category and sorting
   */
  static async getProducts(req, res, next) {
    try {
      const { category, search, diet, featured, chef_special, sort } = req.query;

      let items = [...memoryStore.products];

      // Filter by category slug or category ID
      if (category && category !== 'all') {
        const catObj = memoryStore.categories.find(c => c.slug === category || c.id === category);
        if (catObj) {
          items = items.filter(p => p.category_id === catObj.id);
        }
      }

      // Filter by text search
      if (search && search.trim() !== '') {
        const q = search.toLowerCase().trim();
        items = items.filter(p =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.short_description && p.short_description.toLowerCase().includes(q))
        );
      }

      // Filter by dietary flags (vegan, gluten_free, dairy_free, keto)
      if (diet) {
        if (diet === 'vegan') items = items.filter(p => p.dietary_flags && p.dietary_flags.is_vegan);
        if (diet === 'gluten_free') items = items.filter(p => p.dietary_flags && p.dietary_flags.is_gluten_free);
        if (diet === 'dairy_free') items = items.filter(p => p.dietary_flags && p.dietary_flags.is_dairy_free);
        if (diet === 'keto') items = items.filter(p => p.dietary_flags && p.dietary_flags.is_keto);
      }

      // Filter by featured / chef special
      if (featured === 'true') items = items.filter(p => p.is_featured);
      if (chef_special === 'true') items = items.filter(p => p.is_chef_special);

      // Sorting
      if (sort === 'price_asc') {
        items.sort((a, b) => (a.sale_price || a.base_price) - (b.sale_price || b.base_price));
      } else if (sort === 'price_desc') {
        items.sort((a, b) => (b.sale_price || b.base_price) - (a.sale_price || a.base_price));
      } else if (sort === 'rating') {
        items.sort((a, b) => b.rating_avg - a.rating_avg);
      } else if (sort === 'popular') {
        items.sort((a, b) => b.rating_count - a.rating_count);
      }

      res.status(200).json({
        success: true,
        count: items.length,
        products: items
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get product details by slug
   */
  static async getProductBySlug(req, res, next) {
    try {
      const { slug } = req.params;
      const product = memoryStore.products.find(p => p.slug === slug || p.id === slug);

      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found.' });
      }

      // Addons relevant to this product
      const addons = memoryStore.addons;
      // Approved reviews
      const reviews = memoryStore.reviews.filter(r => r.product_id === product.id && r.is_approved);
      // Smart Pairings recommendation
      const smartPairings = RecommendationService.getSmartPairings(product.slug);

      res.status(200).json({
        success: true,
        product,
        addons,
        reviews,
        smartPairings
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Admin: Create product
   */
  static async createProduct(req, res, next) {
    try {
      const {
        name,
        categoryId,
        description,
        shortDescription,
        basePrice,
        salePrice,
        imageUrl,
        isFeatured,
        isChefSpecial,
        prepTime,
        calories,
        dietaryFlags,
        nutritionFacts,
        allergens,
        roastLevel
      } = req.body;

      if (!name || !categoryId || !basePrice || !imageUrl) {
        return res.status(400).json({ success: false, message: 'Name, Category, Base Price, and Image are required.' });
      }

      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const category = memoryStore.categories.find(c => c.id === categoryId);

      const newProduct = {
        id: `p-${Date.now()}`,
        category_id: categoryId,
        category_name: category ? category.name : 'Specialty',
        name,
        slug,
        description: description || name,
        short_description: shortDescription || '',
        base_price: Number(basePrice),
        sale_price: salePrice ? Number(salePrice) : null,
        sku: `CFX-ITEM-${Date.now().toString().slice(-4)}`,
        image_url: imageUrl,
        is_available: true,
        is_featured: Boolean(isFeatured),
        is_chef_special: Boolean(isChefSpecial),
        preparation_time_minutes: Number(prepTime) || 10,
        calories: Number(calories) || 150,
        dietary_flags: dietaryFlags || { is_vegan: false, is_gluten_free: false, is_dairy_free: false, is_keto: false, is_vegetarian: true },
        nutrition_facts: nutritionFacts || { fat: '0g', carbs: '0g', protein: '0g', sugar: '0g' },
        allergens: allergens || [],
        roast_level: roastLevel || null,
        rating_avg: 5.0,
        rating_count: 0
      };

      memoryStore.products.unshift(newProduct);

      res.status(201).json({
        success: true,
        message: 'Product created successfully.',
        product: newProduct
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Admin: Update product
   */
  static async updateProduct(req, res, next) {
    try {
      const { id } = req.params;
      const index = memoryStore.products.findIndex(p => p.id === id);

      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Product not found.' });
      }

      const existing = memoryStore.products[index];
      const updated = {
        ...existing,
        ...req.body,
        base_price: req.body.basePrice ? Number(req.body.basePrice) : existing.base_price,
        sale_price: req.body.salePrice !== undefined ? (req.body.salePrice ? Number(req.body.salePrice) : null) : existing.sale_price,
        is_available: req.body.isAvailable !== undefined ? Boolean(req.body.isAvailable) : existing.is_available,
        is_featured: req.body.isFeatured !== undefined ? Boolean(req.body.isFeatured) : existing.is_featured
      };

      memoryStore.products[index] = updated;

      res.status(200).json({
        success: true,
        message: 'Product updated successfully.',
        product: updated
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Admin: Delete/Archive product
   */
  static async deleteProduct(req, res, next) {
    try {
      const { id } = req.params;
      const index = memoryStore.products.findIndex(p => p.id === id);

      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Product not found.' });
      }

      memoryStore.products.splice(index, 1);

      res.status(200).json({
        success: true,
        message: 'Product deleted successfully.'
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = MenuController;
