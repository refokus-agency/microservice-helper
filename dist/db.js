'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.savePromisified = savePromisified;
exports.findPromisified = findPromisified;
exports.findOnePromisified = findOnePromisified;
exports.findOrPromisified = findOrPromisified;
exports.updatePromisified = updatePromisified;
exports.updateNativePromisified = updateNativePromisified;
exports.removeNativePromisified = removeNativePromisified;
exports.removePromisified = removePromisified;
exports.populatePromisified = populatePromisified;
exports.mongoObjectId = mongoObjectId;

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _fp = require('lodash/fp');

var _fp2 = _interopRequireDefault(_fp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _load(id, senecaQuery, next) {
  senecaQuery.load$(id, function (err, data) {
    if (err) return next(err);
    if (!data) return next(new Error('#notFound'));

    next(null, data.data$());
  });
} /**
   * @module
   */


function _getFieldValue(object, field) {
  var fieldKey = void 0;
  var fieldValue = void 0;

  // If field name has a period use lodash
  // for dot notation access
  if (field.indexOf('.') > 0) {
    var keyRaw = field.split(/[\s.]+/);

    fieldKey = keyRaw[keyRaw.length - 1];
    fieldValue = _lodash2.default.chain(object).at(field).head().value();
  } else {
    fieldKey = field;
    fieldValue = object[field];
  }

  return { fieldKey: fieldKey, fieldValue: fieldValue };
}
/**
 *
 * @param {Obecjt} element - Element to be stored in MongoDB
 * @param {String} collection - Collection where the element will be stored
 * @returns {Promise}
 */
function savePromisified(element, collection) {
  var seneca = this;

  return new Promise(function (resolve, reject) {
    var query = Object.assign(seneca.make$(collection), element);

    query.save$(function (err, dataRaw) {
      if (err) return reject(err);

      var data = dataRaw.data$();
      resolve({ dataRaw: dataRaw, data: data });
    });
  });
}
/**
 *
 * @param {Object} where - Query to be executed
 * @param {String} collection - Collection to be used
 * @returns {Promise} { dataRaw, data }
 */
function findPromisified(where, collection) {
  var seneca = this;

  return new Promise(function (resolve, reject) {
    var query = seneca.make$(collection);

    query.list$(where, function (err, ret) {
      if (err) return reject(err);

      var data = ret ? ret.map(function (e) {
        return e.data$();
      }) : [];
      var dataRaw = ret || [];

      resolve({ dataRaw: dataRaw, data: data });
    });
  });
}
/**
 *
 * @param {Object} where - Query to be executed
 * @param {String} collection - Collection to be used
 * @returns {Promise} { dataRaw, data }
 */
function findOnePromisified(where, collection) {
  var seneca = this;

  return new Promise(function (resolve, reject) {
    var query = seneca.make$(collection);

    query.load$(where, function (err, ret) {
      if (err) return reject(err);

      var data = ret ? ret.data$() : undefined;
      var dataRaw = ret || undefined;

      resolve({ dataRaw: dataRaw, data: data });
    });
  });
}
/**
 *
 * @param {Object} where - Query to be executed
 * @param {String} collection - Collection to be used
 * @returns {Promise} { dataRaw, data }
 */
function findOrPromisified(where, collection) {
  var seneca = this;

  return new Promise(function (resolve, reject) {
    var query = seneca.make$(collection);

    var conditionsTasks = where.or$.map(function (cond) {
      function runQuery(next) {
        query.list$(cond, next);
      }

      return runQuery;
    });

    _async2.default.series(conditionsTasks, function (err, values) {
      if (err) return reject(err);
      // Bundle all together the raw and object data
      // in order to extract them later.
      var listResult = _lodash2.default.reduce(values, function (acc, v) {
        var objs = v.map(function (e) {
          return Object.assign({}, { d: e.data$() }, { r: e });
        });
        return acc.concat(objs);
      }, []);

      // Merge the list by the id
      var listMerged = _lodash2.default.uniqBy(listResult, 'd.id');

      // Extract the raw and object data
      var listDataRaw = listMerged.map(function (r) {
        return r.r;
      });
      var listData = listMerged.map(function (r) {
        return r.d;
      });

      var dataRaw = listDataRaw || {};
      var data = listData || {};

      if (where.skip$) {
        dataRaw.splice(0, where.skip$);
        data.splice(0, where.skip$);
      }

      if (where.limit$) {
        dataRaw = dataRaw.slice(0, where.limit$);
        data = data.slice(0, where.limit$);
      }

      if (where.sort$) {
        data.sort(_sort(where.sort$));
      }
      resolve({ dataRaw: dataRaw, data: data });
    });
  });
}

function _sort(condition) {
  return function (a, b) {
    var order = 0;

    var keys = Object.keys(condition);

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var k = _step.value;

        if (typeof a[k] === 'string') {
          order = a[k].localeCompare(b[k]) * condition[k];
        } else {
          order = a[k] * condition[k] - b[k] * condition[k];
        }

        if (order !== 0) break;
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return order;
  };
}
/**
 *
 * @param dataRaw
 * @param bundle
 * @param fields
 * @returns {Promise}
 */
function updatePromisified(dataRaw, bundle, fields) {
  return new Promise(function (resolve, reject) {
    var originalDoc = dataRaw.data$();

    var updatedDoc = _lodash2.default.reduce(fields, function (acc, f) {
      var fieldToUpdate = _fp2.default.set(f, _lodash2.default.get(bundle, f), acc);

      var merged = _lodash2.default.mergeWith(originalDoc, fieldToUpdate, function (origValue, newValue) {
        if (f.indexOf('.') > 0) {
          return Object.assign({}, origValue, newValue);
        }

        if (_lodash2.default.isArray(origValue) || _lodash2.default.isPlainObject(origValue)) {
          return newValue;
        }
      });

      return merged;
    }, {});

    dataRaw.data$(updatedDoc).save$(function (err, dataRaw) {
      if (err) return reject(err);

      var data = dataRaw.data$();
      resolve({ dataRaw: dataRaw, data: data });
    });
  });
}
/**
 *
 * @param where
 * @param opFields
 * @param collection
 * @returns {Promise}
 */
function updateNativePromisified(where, opFields, collection) {
  var seneca = this;

  return new Promise(function (resolve, reject) {
    var query = seneca.make$(collection);

    query.native$(function (err, db) {
      if (err) return reject(err);

      db.collection(collection).findAndModify(where, [['_id', 'asc']], opFields, { new: true }, function (err, result) {
        if (err) return reject(err);
        resolve(result.value);
      });
    });
  });
}
/**
 *
 * @param {Object} where - Query to be executed
 * @param {String} collection - Collection to be used
 * @returns {Promise} { dataRaw, data }
 */
function removeNativePromisified(where, collection) {
  var seneca = this;

  return new Promise(function (resolve, reject) {
    var query = seneca.make$(collection);

    query.native$(function (err, db) {
      if (err) return reject(err);

      db.collection(collection).remove(where, function (err, result) {
        if (err) return reject(err);
        resolve(result.result);
      });
    });
  });
}
/**
 *
 * @param {Object} where - Query to be executed
 * @param {String} collection - Collection to be used
 * @returns {Promise} { dataRaw, data }
 */
function removePromisified(where, collection) {
  var seneca = this;

  return new Promise(function (resolve, reject) {
    var query = seneca.make$(collection);

    query.remove$(where, function (err, data) {
      if (err) return reject(err);
      if (!data) return reject(err);

      // It can only remove when value at a time.
      // So if it wasn't errors it means it deleted one element.
      resolve(1);
    });
  });
}
/**
 *
 * @param object
 * @param keyString
 * @param select
 * @param collection
 * @returns {Promise}
 */
function populatePromisified(object, keyString, select, collection) {
  var seneca = this;

  return new Promise(function (resolve, reject) {
    var query = seneca.make$(collection);

    // Lodash 'at' function always returns an array.
    // That's why head is invoked, it gets the first
    // element of the array, in fact, the only one.
    var subtree = _lodash2.default.chain(object).at(keyString).head().value();

    _async2.default.map(subtree, function (id, next) {
      return _load(id, query, next);
    }, function (err, values) {
      if (err) return reject(err);
      var validValues = values.filter(function (v) {
        return v !== undefined;
      });

      var toMerge = validValues;

      if (select.length > 0) {
        toMerge = _lodash2.default.reduce(validValues, function (result, v) {
          var elements = _lodash2.default.reduce(select, function (acc, s) {
            var _getFieldValue2 = _getFieldValue(v, s),
                fieldKey = _getFieldValue2.fieldKey,
                fieldValue = _getFieldValue2.fieldValue;

            return _fp2.default.set(fieldKey, fieldValue, acc);
          }, {});

          return result.concat(elements);
        }, []);
      }

      resolve(_fp2.default.set(keyString, toMerge, object));
    });
  });
}
/**
 *
 * @returns {string} - Generate a mongoObjectId
 */
function mongoObjectId() {
  var timestamp = (new Date().getTime() / 1000 | 0).toString(16);
  return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function () {
    return (Math.random() * 16 | 0).toString(16);
  }).toLowerCase();
}
//# sourceMappingURL=db.js.map