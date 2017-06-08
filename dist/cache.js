'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addKey = addKey;
exports.getValue = getValue;
exports.removeKey = removeKey;

var _redis = require('redis');

var _redis2 = _interopRequireDefault(_redis);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Add key to Redis cache.
 * IMPORTANT!
 * The key must include correct namespace to prevent data collisions
 *
 * @param {String} key Key to store
 * @param {String} value Value to store
 * @param {int} timeout timeout to expire keys
 */
function addKey(key, value) {
  var timeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  var redisClient = _redis2.default.createClient();
  var redisValue = JSON.stringify(value);

  redisClient.set(key, redisValue, 'EX', timeout);
}

/**
 * Get value from Redis cache.
 *
 * @param {String}  Key to obtain value.
 * @return {Object}
 */
/**
 * @module
 */
function getValue(key) {
  var redisClient = _redis2.default.createClient();

  return new Promise(function (resolve, reject) {
    redisClient.get(key, function (err, reply) {
      if (err) {
        reject(err);
      }
      resolve(JSON.parse(reply));
    });
  });
}

/**
 * Remove key from Redis cache.
 *
 * @param {String} key Key to remove.
 * @return {Int}
 */
function removeKey(key) {
  var redisClient = _redis2.default.createClient();

  return new Promise(function (resolve, reject) {
    redisClient.del(key, function (err, reply) {
      if (err) {
        reject(err);
      }
      resolve(JSON.parse(reply));
    });
  });
}
//# sourceMappingURL=cache.js.map