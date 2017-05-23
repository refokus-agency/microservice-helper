'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *  Microservices pipeline.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @module
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

// NOTE: we need to remove no-labels for this project, try to avoid this kind of fixes
/* eslint-disable no-labels */

exports.doFn = doFn;

var _debug = require('./debug');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var $pipePromise = function () {
  /**
   * Basic Promise object that is transported across de pipeline
   * @param {Function} fnc - Function to execute in the pipeline
   * @param {Object} state - Current state of the App
   * @param {boolean} [critical] - When $critical is present, an exception stop de pipe execution
   */
  function $pipePromise(fnc, state, critical) {
    var _this = this;

    _classCallCheck(this, $pipePromise);

    this.state = state;
    this.promise = new Promise(function (resolve, reject) {
      try {
        var fncCalled = fnc(_this.state);

        if (!(typeof fncCalled.then === 'function')) {
          return _this._successHandler(fncCalled, resolve);
        }

        return fncCalled.then(function (fncState) {
          return _this._successHandler(fncState, resolve);
        }).catch(function (error) {
          return _this._errorHandler(error, critical, reject, resolve);
        });
      } catch (error) {
        return _this._errorHandler(error, critical, reject, resolve);
      }
    });
  }

  _createClass($pipePromise, [{
    key: '_successHandler',
    value: function _successHandler(nState, resolve) {
      this.state = Object.assign({}, this.state, nState);
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
      this.state = Object.assign({}, this.state, { error: error });
      return resolve(this.state);
    }
  }, {
    key: 'then',
    value: function then(fnc, critical) {
      var _this2 = this;

      this.promise = this.promise.then(fnc).then(function (nState) {
        _this2.state = Object.assign({}, _this2.state, nState);

        return _this2.state;
      }).catch(function (error) {
        if (critical || _this2.critical) {
          _this2.critical = true;
          throw error;
        }
        if (process.env.NODE_ENV === 'production' || process.env.DEBUG) console.warn(error);
        _this2.state = Object.assign({}, _this2.state, { error: error });
        return _this2.state;
      });

      return this;
    }
  }, {
    key: 'debug',
    value: function debug() {
      var scope = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'default';

      return this.then((0, _debug.printModule)(scope));
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

function _generateState(seneca, msg) {
  var notAllowedKeys = ['caller$', 'meta$', 'plugin$', 'tx$'];
  var nMsg = {};

  for (var key in msg) {
    if (notAllowedKeys.indexOf(key) > -1) continue;
    nMsg[key] = msg[key];
  }

  return Object.assign({}, { seneca: seneca }, nMsg);
}
/**
 * Wrapper function. If all is ok, the result will be { ok : true , data : {result} }
 * When is an error in business logic, the result will be { ok : false, err : Error }.
 * @param {Function} fnc Command function that must be executed.
 * @returns {Object}
 */
function doFn(fnc) {
  return function (msg, done) {
    var state = _generateState(this, msg);

    var returnData = {};

    tryFnc: try {
      var finalState = fnc($pipe, true, state);

      if (!(finalState instanceof $pipePromise)) {
        returnData = { ok: true, data: finalState };
        break tryFnc;
      }

      finalState.promise.then(function (finalState) {
        done(null, { ok: true, data: finalState });
      }).catch(function (err) {
        if (process.env.NODE_ENV === 'production' || process.env.DEBUG) console.error(err);
        done(null, { ok: false, error: err });
      });
      return;
    } catch (err) {
      returnData = { ok: false, error: err };
    }

    done(null, returnData);
  };
}
//# sourceMappingURL=microservice.js.map