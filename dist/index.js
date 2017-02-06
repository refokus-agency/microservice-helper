'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validate = exports.db = exports.console = undefined;

var _console = require('./console');

var console = _interopRequireWildcard(_console);

var _db = require('./db');

var db = _interopRequireWildcard(_db);

var _validate = require('./validate');

var validate = _interopRequireWildcard(_validate);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.console = console;
exports.db = db;
exports.validate = validate;
//# sourceMappingURL=index.js.map