'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.printModule = printModule;

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function printModule(scope) {
  var debug = (0, _debug2.default)(scope);

  var print = function print(string) {
    if (process.env.NODE_ENV !== 'production') {
      debug((0, _moment2.default)().format('YYYY/MM/DD HH:mm:ss'), string);
    }
  };

  return print;
}
//# sourceMappingURL=debug.js.map