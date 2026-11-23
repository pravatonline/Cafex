/**
 * CAFEX - LOYALTY REWARDS SERVICE ("Cafex Rewards")
 * Points calculation, tier promotion & points redemption rules.
 * Rule: $1 spent = 10 loyalty points.
 * 100 points = $1.00 discount voucher.
 */

const { memoryStore } = require('../config/db');

class LoyaltyService {
  /**
   * Calculate points earned for given monetary spend
   */
  static calculatePointsEarned(subtotal) {
    return Math.floor(subtotal * 10);
  }

  /**
   * Determine tier based on lifetime points
   */
  static determineTier(lifetimePoints) {
    if (lifetimePoints >= 2500) return 'Platinum';
    if (lifetimePoints >= 1000) return 'Gold';
    if (lifetimePoints >= 300) return 'Silver';
    return 'Bronze';
  }

  /**
   * Credit points to user account upon successful order completion
   */
  static creditPoints(userId, pointsEarned) {
    if (!userId) return null;

    if (!memoryStore.loyalty_accounts[userId]) {
      memoryStore.loyalty_accounts[userId] = {
        user_id: userId,
        points_balance: 0,
        lifetime_points: 0,
        tier: 'Bronze'
      };
    }

    const account = memoryStore.loyalty_accounts[userId];
    account.points_balance += pointsEarned;
    account.lifetime_points += pointsEarned;
    account.tier = this.determineTier(account.lifetime_points);

    return account;
  }

  /**
   * Deduct points redeemed for instant cart discount
   */
  static redeemPoints(userId, pointsToRedeem) {
    if (!userId || pointsToRedeem <= 0) return { discount: 0, success: false };

    const account = memoryStore.loyalty_accounts[userId];
    if (!account || account.points_balance < pointsToRedeem) {
      throw new Error(`Insufficient loyalty balance. Available: ${account ? account.points_balance : 0}`);
    }

    account.points_balance -= pointsToRedeem;
    // 100 points = $1.00
    const discount = Number((pointsToRedeem / 100).toFixed(2));

    return {
      discount,
      remainingPoints: account.points_balance,
      success: true
    };
  }

  static getAccount(userId) {
    return memoryStore.loyalty_accounts[userId] || {
      user_id: userId,
      points_balance: 0,
      lifetime_points: 0,
      tier: 'Bronze'
    };
  }
}

module.exports = LoyaltyService;
