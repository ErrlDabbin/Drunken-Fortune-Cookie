/**
 * Simple in-memory storage for users and their fortunes
 * This can be replaced with a database in production
 */
class Storage {
  constructor() {
    this.users = new Map();
    this.userFortunes = new Map();
    this.userIdCounter = 1;
    this.fortuneIdCounter = 1;
  }

  /**
   * Get a user by ID
   */
  getUser(userId) {
    return this.users.get(userId);
  }

  /**
   * Create or update a user
   */
  createOrUpdateUser(insertUser) {
    const existingUser = this.users.get(insertUser.userId);
    
    if (existingUser) {
      // Update existing user
      const updatedUser = { 
        ...existingUser,
        ...insertUser,
        lastFortuneAt: new Date()
      };
      this.users.set(insertUser.userId, updatedUser);
      return updatedUser;
    }
    
    // Create new user
    const newUser = { 
      id: this.userIdCounter++,
      ...insertUser,
      lastFortuneAt: new Date()
    };
    this.users.set(insertUser.userId, newUser);
    return newUser;
  }

  /**
   * Get a user's most recent fortune
   */
  getUserFortune(userId) {
    return this.userFortunes.get(userId);
  }

  /**
   * Create a new fortune for a user
   */
  createUserFortune(fortune) {
    const newFortune = {
      id: this.fortuneIdCounter++,
      ...fortune,
      createdAt: new Date()
    };
    
    // Save the fortune
    this.userFortunes.set(fortune.userId, newFortune);
    
    // Update the user's last fortune time
    this.createOrUpdateUser({ userId: fortune.userId });
    
    return newFortune;
  }

  /**
   * Check if a user can get a new fortune today
   * Users can only get one fortune per the configured cooldown period (default: 24 hours)
   */
  canUserGetFortune(userId) {
    const user = this.users.get(userId);
    
    if (!user || !user.lastFortuneAt) {
      return true;
    }
    
    // Get cooldown hours from environment variable or use default (24 hours)
    const cooldownHours = process.env.FORTUNE_COOLDOWN_HOURS
      ? parseInt(process.env.FORTUNE_COOLDOWN_HOURS, 10)
      : 24;
    
    const lastFortuneTime = new Date(user.lastFortuneAt).getTime();
    const currentTime = new Date().getTime();
    const hoursSinceLastFortune = (currentTime - lastFortuneTime) / (1000 * 60 * 60);
    
    // Check if enough time has passed since the last fortune
    return hoursSinceLastFortune >= cooldownHours;
  }
}

module.exports = {
  Storage
};