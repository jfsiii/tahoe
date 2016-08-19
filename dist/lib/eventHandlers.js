'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var handlers = {};
handlers.open = function (_ref) {
  var options = _ref.options;
  var dispatch = _ref.dispatch;
  return dispatch({
    type: 'tahoe.tail.open',
    meta: options
  });
};

handlers.insert = function (_ref2) {
  var options = _ref2.options;
  var dispatch = _ref2.dispatch;
  var next = _ref2.data.next;
  return dispatch({
    type: 'tahoe.tail.insert',
    meta: options,
    payload: {
      raw: next
    }
  });
};

handlers.update = function (_ref3) {
  var options = _ref3.options;
  var dispatch = _ref3.dispatch;
  var _ref3$data = _ref3.data;
  var prev = _ref3$data.prev;
  var next = _ref3$data.next;
  return dispatch({
    type: 'tahoe.tail.update',
    meta: options,
    payload: {
      raw: {
        prev: prev,
        next: next
      }
    }
  });
};

handlers.delete = function (_ref4) {
  var options = _ref4.options;
  var dispatch = _ref4.dispatch;
  var prev = _ref4.data.prev;
  return dispatch({
    type: 'tahoe.tail.delete',
    meta: options,
    payload: {
      raw: prev
    }
  });
};

exports.default = handlers;
module.exports = exports['default'];