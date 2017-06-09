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
export function addKey ({key, value, options, timeout = 0}) {
  const redisClient = redis.createClient(options)
  const redisValue = JSON.stringify(value)

  return new Promise((resolve, reject) => {
    redisClient.set(key, redisValue, 'EX', timeout, (err) => {
      redisClient.quit()

      if (err) reject(err)
      resolve()
    })
  })
}

/**
 * Get value from Redis cache.
 *
 * @param {String}  Key to obtain value.
 * @return {Object}
 */
export function getValue ({key, options}) {
  const redisClient = redis.createClient(options)

  return new Promise((resolve, reject) => {
    redisClient.get(key, (err, reply) => {
      redisClient.quit()

      if (err) {
        console.log(err)
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
export function removeKey ({key, options}) {
  const redisClient = redis.createClient(options)

  return new Promise((resolve, reject) => {
    redisClient.del(key, (err, reply) => {
      redisClient.quit()

      if (err) {
        reject(err)
      }
      resolve(JSON.parse(reply))
    })
  })
}
