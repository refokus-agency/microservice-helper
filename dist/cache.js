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
function addKey(_ref) {
  var key = _ref.key,
      value = _ref.value,
      options = _ref.options,
      _ref$timeout = _ref.timeout,
      timeout = _ref$timeout === undefined ? 0 : _ref$timeout;

  var redisClient = _redis2.default.createClient(options);
  var redisValue = JSON.stringify(value);

  return new Promise(function (resolve, reject) {
    redisClient.set(key, redisValue, 'EX', timeout, function (err) {
      redisClient.quit();

      if (err) reject(err);
      resolve();
    });
  });
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
function getValue(_ref2) {
  var key = _ref2.key,
      options = _ref2.options;

  var redisClient = _redis2.default.createClient(options);

  return new Promise(function (resolve, reject) {
    redisClient.get(key, function (err, reply) {
      redisClient.quit();

      if (err) {
        console.log(err);
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
function removeKey(_ref3) {
  var key = _ref3.key,
      options = _ref3.options;

  var redisClient = _redis2.default.createClient(options);

  return new Promise(function (resolve, reject) {
    redisClient.del(key, function (err, reply) {
      redisClient.quit();

      if (err) {
        reject(err);
      }
      resolve(JSON.parse(reply));
    });
  });
}
//# sourceMappingURL=cache.js.map