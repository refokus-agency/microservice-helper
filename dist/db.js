'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.savePromisified = savePromisified;
exports.findPromisified = findPromisified;
exports.findOrPromisified = findOrPromisified;
exports.updatePromisified = updatePromisified;
exports.updateNativePromisified = updateNativePromisified;
exports.removeNativePromisified = removeNativePromisified;
exports.removePromisified = removePromisified;
exports.populatePromisified = populatePromisified;

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
}

function _getFieldValue(object, field) {
  var fieldKey = void 0;
  var fieldValue = void 0;

  //If field name has a period use lodash
  //for dot notation access
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

function findPromisified(where, collection) {

  var seneca = this;

  return new Promise(function (resolve, reject) {
    var query = seneca.make$(collection);

    query.load$(where, function (err, ret) {
      if (err) return reject(err);

      var data = ret ? ret.data$() : {};
      var dataRaw = ret || {};

      resolve({ dataRaw: dataRaw, data: data });
    });
  });
}

function findOrPromisified(where, collection) {

  var seneca = this;

  return new Promise(function (resolve, reject) {
    var query = seneca.make$(collection);

    var conditionsTasks = where.map(function (cond) {
      function runQuery(next) {
        query.list$(cond, function (err, data) {
          next(null, data);
        });
      }

      return runQuery;
    });

    _async2.default.series(conditionsTasks, function (err, values) {

      //Bundle all together the raw and object data
      //in order to extract them later.
      var listResult = _lodash2.default.reduce(values, function (acc, v) {
        var objs = v.map(function (e) {
          return Object.assign({}, { d: e.data$() }, { r: e });
        });
        return acc.concat(objs);
      }, []);

      //Merge the list by the id
      var listMerged = _lodash2.default.uniqBy(listResult, 'd.id');

      //Extract the raw and object data
      var listDataRaw = listMerged.map(function (r) {
        return r.r;
      });
      var listData = listMerged.map(function (r) {
        return r.d;
      });

      var dataRaw = listDataRaw || {};
      var data = listData || {};

      resolve({ dataRaw: dataRaw, data: data });
    });
  });
}

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

function updateNativePromisified(where, opFields, collection) {

  var seneca = this;

  return new Promise(function (resolve, reject) {
    var query = seneca.make$(collection);

    query.native$(function (err, db) {
      var forms = db.collection(collection);
      db.collection(collection).findAndModify(where, [['_id', 'asc']], opFields, { new: true }, function (err, result) {
        if (err) return reject(err);
        resolve(result.value);
      });
    });
  });
}

function removeNativePromisified(where, collection) {

  var seneca = this;

  return new Promise(function (resolve, reject) {
    var query = seneca.make$(collection);

    query.native$(function (err, db) {
      db.collection(collection).remove(where, function (err, result) {
        if (err) return reject(err);
        resolve(result.result);
      });
    });
  });
}

function removePromisified(where, collection) {
  var seneca = this;

  return new Promise(function (resolve, reject) {
    var query = seneca.make$(collection);

    query.remove$(where, function (err, data) {
      if (err) return reject(err);
      if (!data) return reject(err);

      //It can only remove when value at a time.
      //So if it wasn't errors it means it deleted one element.
      resolve(1);
    });
  });
}

function populatePromisified(object, keyString, select, collection) {

  var seneca = this;

  return new Promise(function (resolve, reject) {

    var query = seneca.make$(collection);

    //Lodash 'at' function always returns an array.
    //That's why head is invoked, it gets the first
    //element of the array, in fact, the only one.
    var subtree = _lodash2.default.chain(object).at(keyString).head().value();

    _async2.default.map(subtree, function (id, next) {
      return _load(id, query, next);
    }, function (err, values) {

      var validValues = values.filter(function (v) {
        return v != undefined;
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

exports.default = {
  savePromisified: savePromisified,
  findPromisified: findPromisified,
  findOrPromisified: findOrPromisified,
  updatePromisified: updatePromisified,
  updateNativePromisified: updateNativePromisified,
  removePromisified: removePromisified,
  removeNativePromisified: removeNativePromisified,
  populatePromisified: populatePromisified
};
//# sourceMappingURL=db.js.map