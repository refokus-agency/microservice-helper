'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateElement = exports.validateModel = undefined;

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _joiObjectid = require('joi-objectid');

var _joiObjectid2 = _interopRequireDefault(_joiObjectid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var JoiObjectId = (0, _joiObjectid2.default)(_joi2.default);

function validateModel(incomingObject, schema, callback) {
  _joi2.default.validate(incomingObject, schema, callback);
}

function validateElement(element, type, callback) {
  if (type === 'ObjectId') return _joi2.default.validate(element, JoiObjectId(), callback);

  if (typeof _joi2.default[type] === 'function') _joi2.default.validate(element, _joi2.default[type](), callback);
}

exports.validateModel = validateModel;
exports.validateElement = validateElement;
exports.default = { validateModel: validateModel, validateElement: validateElement };
//# sourceMappingURL=validate.js.map