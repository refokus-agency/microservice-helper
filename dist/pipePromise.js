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
      process.nextTick(function () {
        try {
          var _state = JSON.parse(JSON.stringify(_this.state));
          _state.seneca = _this.state.seneca;
          for (var key in _this.state) {
            if (!key.match(/raw$/i)) continue;
            _state[key] = _this.state[key];
          }

          var fncReturn = fnc(_state);

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
    key: 'if',
    value: function _if(conditionalFnc, successPipeFnc, failPipeFnc, critical) {
      critical = typeof failPipeFnc !== 'function' ? failPipeFnc : critical;
      failPipeFnc = typeof failPipeFnc === 'function' ? failPipeFnc : function () {};

      return this.then(function (state) {
        if (conditionalFnc(state)) return successPipeFnc(state);

        return failPipeFnc(state);
      }, critical);
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
  }, {
    key: 'return',
    value: function _return() {
      var _this4 = this;

      for (var _len2 = arguments.length, params = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        params[_key2] = arguments[_key2];
      }

      this.promise = this.promise.then(function () {
        params.push('error');
        var state = {};

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = params[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var param = _step2.value;

            if (!_this4.state.hasOwnProperty(param)) continue;

            state[param] = _lodash2.default.get(_this4.state, param);
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

        _this4.state = state;
        return state;
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