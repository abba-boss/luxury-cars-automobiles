const redis = require('redis');

class CacheManager {
  constructor() {
    this.client = null;
    this.isEnabled = process.env.REDIS_URL ? true : false;
    
    if (this.isEnabled) {
      this.client = redis.createClient({
        url: process.env.REDIS_URL
      });
      
      this.client.on('error', (err) => {
        console.error('Redis Client Error:', err);
        this.isEnabled = false; // Disable caching if Redis is unavailable
      });
      
      this.client.connect();
    }
  }

  /**
   * Get value from cache
   * @param {string} key - Cache key
   * @returns {Promise<any>} Cached value or null
   */
  async get(key) {
    if (!this.isEnabled || !this.client) {
      return null;
    }
    
    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  /**
   * Set value in cache
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} ttl - Time to live in seconds (default: 3600 = 1 hour)
   * @returns {Promise<boolean>} Success status
   */
  async set(key, value, ttl = 3600) {
    if (!this.isEnabled || !this.client) {
      return false;
    }
    
    try {
      await this.client.setEx(key, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  /**
   * Delete value from cache
   * @param {string} key - Cache key
   * @returns {Promise<boolean>} Success status
   */
  async del(key) {
    if (!this.isEnabled || !this.client) {
      return false;
    }
    
    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  /**
   * Clear all cache
   * @returns {Promise<boolean>} Success status
   */
  async flush() {
    if (!this.isEnabled || !this.client) {
      return false;
    }
    
    try {
      await this.client.flushAll();
      return true;
    } catch (error) {
      console.error('Cache flush error:', error);
      return false;
    }
  }

  /**
   * Generate cache key
   * @param {string} prefix - Key prefix
   * @param {string|number} id - Identifier
   * @returns {string} Generated cache key
   */
  generateKey(prefix, id) {
    return `${prefix}:${id}`;
  }

  /**
   * Get multiple values from cache
   * @param {string[]} keys - Array of cache keys
   * @returns {Promise<Array>} Array of cached values
   */
  async mget(keys) {
    if (!this.isEnabled || !this.client) {
      return Array(keys.length).fill(null);
    }
    
    try {
      const values = await this.client.MGET(keys);
      return values.map(val => val ? JSON.parse(val) : null);
    } catch (error) {
      console.error('Cache mget error:', error);
      return Array(keys.length).fill(null);
    }
  }
}

module.exports = new CacheManager();