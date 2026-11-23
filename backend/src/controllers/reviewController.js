const { memoryStore } = require('../config/db');

class ReviewController {
  /**
   * Submit a new customer review
   */
  static async createReview(req, res, next) {
    try {
      const { productId, reviewerName, rating, title, comment } = req.body;

      if (!productId || !reviewerName || !rating || !comment) {
        return res.status(400).json({
          success: false,
          message: 'Product, reviewer name, rating (1-5), and comment are required.'
        });
      }

      const parsedRating = Math.max(1, Math.min(5, Number(rating)));

      const newReview = {
        id: `rev-${Date.now()}`,
        product_id: productId,
        user_id: req.user ? req.user.id : null,
        reviewer_name: reviewerName.trim(),
        rating: parsedRating,
        title: title || '',
        comment: comment.trim(),
        is_verified_purchase: true,
        is_approved: true, // auto-approved or pending moderation
        created_at: new Date().toISOString()
      };

      memoryStore.reviews.unshift(newReview);

      // Recompute product average rating
      const product = memoryStore.products.find(p => p.id === productId);
      if (product) {
        const prodReviews = memoryStore.reviews.filter(r => r.product_id === productId && r.is_approved);
        const sum = prodReviews.reduce((acc, r) => acc + r.rating, 0);
        product.rating_avg = Number((sum / prodReviews.length).toFixed(2));
        product.rating_count = prodReviews.length;
      }

      res.status(201).json({
        success: true,
        message: 'Thank you for your feedback! Your review has been published.',
        review: newReview
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get reviews for product
   */
  static async getProductReviews(req, res, next) {
    try {
      const { productId } = req.params;
      const reviews = memoryStore.reviews.filter(r => r.product_id === productId && r.is_approved);

      res.status(200).json({
        success: true,
        count: reviews.length,
        reviews
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Admin: Moderate all reviews
   */
  static async getAllReviewsAdmin(req, res, next) {
    try {
      res.status(200).json({
        success: true,
        count: memoryStore.reviews.length,
        reviews: memoryStore.reviews
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Admin: Delete/Flag review
   */
  static async deleteReview(req, res, next) {
    try {
      const { id } = req.params;
      const index = memoryStore.reviews.findIndex(r => r.id === id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Review not found.' });
      }

      memoryStore.reviews.splice(index, 1);
      res.status(200).json({ success: true, message: 'Review removed successfully.' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ReviewController;
