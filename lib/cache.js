/**
 * @module
 */
import redis from 'redis'

/**
 * Add key to Redis cache.
 * IMPORTANT!
 * The key must include correct namespace to prevent data collisions
 *
 * @param {String} key Key to store
 * @param {String} value Value to store
 * @param {int} timeout timeout to expire keys
 */
export function addKey (key, value, timeout = 0) {
  const redisClient = redis.createClient()
  const redisValue = JSON.stringify(value)

  redisClient.set(key, redisValue, 'EX', timeout)
}

/**
 * Get value from Redis cache.
 *
 * @param {String}  Key to obtain value.
 * @return {Object}
 */
export function getValue (key) {
  const redisClient = redis.createClient()

  return new Promise((resolve, reject) => {
    redisClient.get(key, (err, reply) => {
      if (err) {
        reject(err)
      }
      resolve(JSON.parse(reply))
    })
  })
}

/**
 * Remove key from Redis cache.
 *
 * @param {String} key Key to remove.
 * @return {Int}
 */
export function removeKey (key) {
  const redisClient = redis.createClient()

  return new Promise((resolve, reject) => {
    redisClient.del(key, (err, reply) => {
      if (err) {
        reject(err)
      }
      resolve(JSON.parse(reply))
    })
  })
}
