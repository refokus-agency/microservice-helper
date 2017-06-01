'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.doFn = doFn;

var _pipePromise = require('./pipePromise');

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
/**
 *  Microservices pipeline.
 * @module
 */

// NOTE: we need to remove no-labels for this project, try to avoid this kind of fixes
/* eslint-disable no-labels */
function doFn(fnc) {
  return function (msg, done) {
    var state = _generateState(this, msg);

    var returnData = {};

    tryFnc: try {
      var finalState = fnc(_pipePromise.$pipe, true, state);

      if (!(finalState instanceof _pipePromise.$pipePromise)) {
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