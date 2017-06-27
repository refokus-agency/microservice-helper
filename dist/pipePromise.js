'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.$pipePromise = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *  $pipePromise.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @module
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


exports.$pipe = $pipe;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var $pipePromise = exports.$pipePromise = function () {
  /**
   * Basic Promise object that is transported across de pipeline
   * @param {Function} fnc - Function to execute in the pipeline
   * @param {Object} state - Current state of the App
   * @param {boolean} [critical] - When $critical is present, an exception stop de pipe execution
   */
  function $pipePromise(fnc, state, critical) {
    var _this = this;

    _classCallCheck(this, $pipePromise);

    this.state = _lodash2.default.cloneDeep(state);
    this.promise = new Promise(function (resolve, reject) {
      setTimeout(function () {
        try {
          var fncReturn = fnc(_lodash2.default.cloneDeep(_this.state));

          if (!fncReturn || typeof fncReturn.then !== 'function' || typeof fncReturn.catch !== 'function') {
            return _this._successHandler(fncReturn, resolve);
          }

          return fncReturn.then(function (fncState) {
            return _this._successHandler(fncState, resolve);
          }).catch(function (error) {
            return _this._errorHandler(error, critical, reject, resolve);
          });
        } catch (error) {
          return _this._errorHandler(error, critical, reject, resolve);
        }
      });
    });
  }

  _createClass($pipePromise, [{
    key: '_successHandler',
    value: function _successHandler(nState, resolve) {
      this.state = _lodash2.default.merge(this.state, nState);
      return resolve(this.state);
    }
  }, {
    key: '_errorHandler',
    value: function _errorHandler(error, critical, reject, resolve) {
      if (critical || this.critical) {
        this.critical = true;
        return reject(error);
      }

      if (process.env.NODE_ENV === 'production' || process.env.DEBUG) console.warn(error);

      this.state.error = error;
      return resolve(this.state);
    }
  }, {
    key: 'then',
    value: function then(fnc, critical) {
      var _this2 = this;

      this.promise = this.promise.then(function (state) {
        return new $pipePromise(fnc, state, critical).promise;
      }).then(function (nState) {
        _this2.state = _lodash2.default.merge(_this2.state, nState);

        return _this2.state;
      }).catch(function (error) {
        if (critical || _this2.critical) {
          _this2.critical = true;
          throw error;
        }

        if (process.env.NODE_ENV === 'production' || process.env.DEBUG) console.warn(error);
        _this2.state.error = error;
        return _this2.state;
      });

      return this;
    }
  }, {
    key: 'use',
    value: function use(pipeFnc, critical) {
      return this.then(function (state) {
        return pipeFnc($pipe, true, state).promise;
      }, critical);
    }
  }, {
    key: 'debug',
    value: function debug() {
      for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
        params[_key] = arguments[_key];
      }

      return this.then(function (state) {
        if (params.length === 0) {
          console.dir(state);
          return {};
        }

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = params[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var param = _step.value;

            console.dir(_lodash2.default.get(state, param));
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

        return {};
      });
    }
  }, {
    key: 'finally',
    value: function _finally(fnc) {
      var _this3 = this;

      var err = void 0;

      this.promise = this.promise.catch(function (error) {
        err = error;
        return error;
      }).then(function () {
        return new $pipePromise(fnc, _this3.state, true).promise.then(function () {
          if (err) throw err;

          return _this3.state;
        });
      });

      return this;
    }
  }]);

  return $pipePromise;
}();

/**
 *
 * @param {Function} fnc Function to execute in the pipeline.
 * @param {Object} state Current state of the App.
 * @param {boolean} [critical] When $critical is present, an exception stop de pipe execution.
 * @returns {$pipePromise}
 */


function $pipe(fnc, state, critical) {
  return new $pipePromise(fnc, state, critical);
}
//# sourceMappingURL=pipePromise.js.map