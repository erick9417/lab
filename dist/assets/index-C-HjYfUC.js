function _mergeNamespaces(n2, m2) {
  for (var i2 = 0; i2 < m2.length; i2++) {
    const e2 = m2[i2];
    if (typeof e2 !== "string" && !Array.isArray(e2)) {
      for (const k2 in e2) {
        if (k2 !== "default" && !(k2 in n2)) {
          const d2 = Object.getOwnPropertyDescriptor(e2, k2);
          if (d2) {
            Object.defineProperty(n2, k2, d2.get ? d2 : {
              enumerable: true,
              get: () => e2[k2]
            });
          }
        }
      }
    }
  }
  return Object.freeze(Object.defineProperty(n2, Symbol.toStringTag, { value: "Module" }));
}
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
function getDefaultExportFromCjs(x2) {
  return x2 && x2.__esModule && Object.prototype.hasOwnProperty.call(x2, "default") ? x2["default"] : x2;
}
var jsxRuntime = { exports: {} };
var reactJsxRuntime_production_min = {};
var react = { exports: {} };
var react_production_min = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var l$6 = Symbol.for("react.element"), n$8 = Symbol.for("react.portal"), p$6 = Symbol.for("react.fragment"), q$1 = Symbol.for("react.strict_mode"), r$6 = Symbol.for("react.profiler"), t$6 = Symbol.for("react.provider"), u$8 = Symbol.for("react.context"), v$3 = Symbol.for("react.forward_ref"), w$5 = Symbol.for("react.suspense"), x$5 = Symbol.for("react.memo"), y$3 = Symbol.for("react.lazy"), z$2 = Symbol.iterator;
function A$4(a3) {
  if (null === a3 || "object" !== typeof a3) return null;
  a3 = z$2 && a3[z$2] || a3["@@iterator"];
  return "function" === typeof a3 ? a3 : null;
}
var B$1 = { isMounted: function() {
  return false;
}, enqueueForceUpdate: function() {
}, enqueueReplaceState: function() {
}, enqueueSetState: function() {
} }, C$6 = Object.assign, D$4 = {};
function E$3(a3, b2, e2) {
  this.props = a3;
  this.context = b2;
  this.refs = D$4;
  this.updater = e2 || B$1;
}
E$3.prototype.isReactComponent = {};
E$3.prototype.setState = function(a3, b2) {
  if ("object" !== typeof a3 && "function" !== typeof a3 && null != a3) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
  this.updater.enqueueSetState(this, a3, b2, "setState");
};
E$3.prototype.forceUpdate = function(a3) {
  this.updater.enqueueForceUpdate(this, a3, "forceUpdate");
};
function F$1() {
}
F$1.prototype = E$3.prototype;
function G$3(a3, b2, e2) {
  this.props = a3;
  this.context = b2;
  this.refs = D$4;
  this.updater = e2 || B$1;
}
var H$4 = G$3.prototype = new F$1();
H$4.constructor = G$3;
C$6(H$4, E$3.prototype);
H$4.isPureReactComponent = true;
var I$7 = Array.isArray, J$1 = Object.prototype.hasOwnProperty, K$2 = { current: null }, L$1 = { key: true, ref: true, __self: true, __source: true };
function M$4(a3, b2, e2) {
  var d2, c2 = {}, k2 = null, h2 = null;
  if (null != b2) for (d2 in void 0 !== b2.ref && (h2 = b2.ref), void 0 !== b2.key && (k2 = "" + b2.key), b2) J$1.call(b2, d2) && !L$1.hasOwnProperty(d2) && (c2[d2] = b2[d2]);
  var g2 = arguments.length - 2;
  if (1 === g2) c2.children = e2;
  else if (1 < g2) {
    for (var f2 = Array(g2), m2 = 0; m2 < g2; m2++) f2[m2] = arguments[m2 + 2];
    c2.children = f2;
  }
  if (a3 && a3.defaultProps) for (d2 in g2 = a3.defaultProps, g2) void 0 === c2[d2] && (c2[d2] = g2[d2]);
  return { $$typeof: l$6, type: a3, key: k2, ref: h2, props: c2, _owner: K$2.current };
}
function N$2(a3, b2) {
  return { $$typeof: l$6, type: a3.type, key: b2, ref: a3.ref, props: a3.props, _owner: a3._owner };
}
function O$3(a3) {
  return "object" === typeof a3 && null !== a3 && a3.$$typeof === l$6;
}
function escape(a3) {
  var b2 = { "=": "=0", ":": "=2" };
  return "$" + a3.replace(/[=:]/g, function(a4) {
    return b2[a4];
  });
}
var P$3 = /\/+/g;
function Q$1(a3, b2) {
  return "object" === typeof a3 && null !== a3 && null != a3.key ? escape("" + a3.key) : b2.toString(36);
}
function R$1(a3, b2, e2, d2, c2) {
  var k2 = typeof a3;
  if ("undefined" === k2 || "boolean" === k2) a3 = null;
  var h2 = false;
  if (null === a3) h2 = true;
  else switch (k2) {
    case "string":
    case "number":
      h2 = true;
      break;
    case "object":
      switch (a3.$$typeof) {
        case l$6:
        case n$8:
          h2 = true;
      }
  }
  if (h2) return h2 = a3, c2 = c2(h2), a3 = "" === d2 ? "." + Q$1(h2, 0) : d2, I$7(c2) ? (e2 = "", null != a3 && (e2 = a3.replace(P$3, "$&/") + "/"), R$1(c2, b2, e2, "", function(a4) {
    return a4;
  })) : null != c2 && (O$3(c2) && (c2 = N$2(c2, e2 + (!c2.key || h2 && h2.key === c2.key ? "" : ("" + c2.key).replace(P$3, "$&/") + "/") + a3)), b2.push(c2)), 1;
  h2 = 0;
  d2 = "" === d2 ? "." : d2 + ":";
  if (I$7(a3)) for (var g2 = 0; g2 < a3.length; g2++) {
    k2 = a3[g2];
    var f2 = d2 + Q$1(k2, g2);
    h2 += R$1(k2, b2, e2, f2, c2);
  }
  else if (f2 = A$4(a3), "function" === typeof f2) for (a3 = f2.call(a3), g2 = 0; !(k2 = a3.next()).done; ) k2 = k2.value, f2 = d2 + Q$1(k2, g2++), h2 += R$1(k2, b2, e2, f2, c2);
  else if ("object" === k2) throw b2 = String(a3), Error("Objects are not valid as a React child (found: " + ("[object Object]" === b2 ? "object with keys {" + Object.keys(a3).join(", ") + "}" : b2) + "). If you meant to render a collection of children, use an array instead.");
  return h2;
}
function S$7(a3, b2, e2) {
  if (null == a3) return a3;
  var d2 = [], c2 = 0;
  R$1(a3, d2, "", "", function(a4) {
    return b2.call(e2, a4, c2++);
  });
  return d2;
}
function T$5(a3) {
  if (-1 === a3._status) {
    var b2 = a3._result;
    b2 = b2();
    b2.then(function(b3) {
      if (0 === a3._status || -1 === a3._status) a3._status = 1, a3._result = b3;
    }, function(b3) {
      if (0 === a3._status || -1 === a3._status) a3._status = 2, a3._result = b3;
    });
    -1 === a3._status && (a3._status = 0, a3._result = b2);
  }
  if (1 === a3._status) return a3._result.default;
  throw a3._result;
}
var U$2 = { current: null }, V$2 = { transition: null }, W$2 = { ReactCurrentDispatcher: U$2, ReactCurrentBatchConfig: V$2, ReactCurrentOwner: K$2 };
function X$3() {
  throw Error("act(...) is not supported in production builds of React.");
}
react_production_min.Children = { map: S$7, forEach: function(a3, b2, e2) {
  S$7(a3, function() {
    b2.apply(this, arguments);
  }, e2);
}, count: function(a3) {
  var b2 = 0;
  S$7(a3, function() {
    b2++;
  });
  return b2;
}, toArray: function(a3) {
  return S$7(a3, function(a4) {
    return a4;
  }) || [];
}, only: function(a3) {
  if (!O$3(a3)) throw Error("React.Children.only expected to receive a single React element child.");
  return a3;
} };
react_production_min.Component = E$3;
react_production_min.Fragment = p$6;
react_production_min.Profiler = r$6;
react_production_min.PureComponent = G$3;
react_production_min.StrictMode = q$1;
react_production_min.Suspense = w$5;
react_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = W$2;
react_production_min.act = X$3;
react_production_min.cloneElement = function(a3, b2, e2) {
  if (null === a3 || void 0 === a3) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + a3 + ".");
  var d2 = C$6({}, a3.props), c2 = a3.key, k2 = a3.ref, h2 = a3._owner;
  if (null != b2) {
    void 0 !== b2.ref && (k2 = b2.ref, h2 = K$2.current);
    void 0 !== b2.key && (c2 = "" + b2.key);
    if (a3.type && a3.type.defaultProps) var g2 = a3.type.defaultProps;
    for (f2 in b2) J$1.call(b2, f2) && !L$1.hasOwnProperty(f2) && (d2[f2] = void 0 === b2[f2] && void 0 !== g2 ? g2[f2] : b2[f2]);
  }
  var f2 = arguments.length - 2;
  if (1 === f2) d2.children = e2;
  else if (1 < f2) {
    g2 = Array(f2);
    for (var m2 = 0; m2 < f2; m2++) g2[m2] = arguments[m2 + 2];
    d2.children = g2;
  }
  return { $$typeof: l$6, type: a3.type, key: c2, ref: k2, props: d2, _owner: h2 };
};
react_production_min.createContext = function(a3) {
  a3 = { $$typeof: u$8, _currentValue: a3, _currentValue2: a3, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null };
  a3.Provider = { $$typeof: t$6, _context: a3 };
  return a3.Consumer = a3;
};
react_production_min.createElement = M$4;
react_production_min.createFactory = function(a3) {
  var b2 = M$4.bind(null, a3);
  b2.type = a3;
  return b2;
};
react_production_min.createRef = function() {
  return { current: null };
};
react_production_min.forwardRef = function(a3) {
  return { $$typeof: v$3, render: a3 };
};
react_production_min.isValidElement = O$3;
react_production_min.lazy = function(a3) {
  return { $$typeof: y$3, _payload: { _status: -1, _result: a3 }, _init: T$5 };
};
react_production_min.memo = function(a3, b2) {
  return { $$typeof: x$5, type: a3, compare: void 0 === b2 ? null : b2 };
};
react_production_min.startTransition = function(a3) {
  var b2 = V$2.transition;
  V$2.transition = {};
  try {
    a3();
  } finally {
    V$2.transition = b2;
  }
};
react_production_min.unstable_act = X$3;
react_production_min.useCallback = function(a3, b2) {
  return U$2.current.useCallback(a3, b2);
};
react_production_min.useContext = function(a3) {
  return U$2.current.useContext(a3);
};
react_production_min.useDebugValue = function() {
};
react_production_min.useDeferredValue = function(a3) {
  return U$2.current.useDeferredValue(a3);
};
react_production_min.useEffect = function(a3, b2) {
  return U$2.current.useEffect(a3, b2);
};
react_production_min.useId = function() {
  return U$2.current.useId();
};
react_production_min.useImperativeHandle = function(a3, b2, e2) {
  return U$2.current.useImperativeHandle(a3, b2, e2);
};
react_production_min.useInsertionEffect = function(a3, b2) {
  return U$2.current.useInsertionEffect(a3, b2);
};
react_production_min.useLayoutEffect = function(a3, b2) {
  return U$2.current.useLayoutEffect(a3, b2);
};
react_production_min.useMemo = function(a3, b2) {
  return U$2.current.useMemo(a3, b2);
};
react_production_min.useReducer = function(a3, b2, e2) {
  return U$2.current.useReducer(a3, b2, e2);
};
react_production_min.useRef = function(a3) {
  return U$2.current.useRef(a3);
};
react_production_min.useState = function(a3) {
  return U$2.current.useState(a3);
};
react_production_min.useSyncExternalStore = function(a3, b2, e2) {
  return U$2.current.useSyncExternalStore(a3, b2, e2);
};
react_production_min.useTransition = function() {
  return U$2.current.useTransition();
};
react_production_min.version = "18.3.1";
{
  react.exports = react_production_min;
}
var reactExports = react.exports;
const React$1 = /* @__PURE__ */ getDefaultExportFromCjs(reactExports);
const t$5 = /* @__PURE__ */ _mergeNamespaces({
  __proto__: null,
  default: React$1
}, [reactExports]);
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var f$7 = reactExports, k$2 = Symbol.for("react.element"), l$5 = Symbol.for("react.fragment"), m$5 = Object.prototype.hasOwnProperty, n$7 = f$7.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p$5 = { key: true, ref: true, __self: true, __source: true };
function q(c2, a3, g2) {
  var b2, d2 = {}, e2 = null, h2 = null;
  void 0 !== g2 && (e2 = "" + g2);
  void 0 !== a3.key && (e2 = "" + a3.key);
  void 0 !== a3.ref && (h2 = a3.ref);
  for (b2 in a3) m$5.call(a3, b2) && !p$5.hasOwnProperty(b2) && (d2[b2] = a3[b2]);
  if (c2 && c2.defaultProps) for (b2 in a3 = c2.defaultProps, a3) void 0 === d2[b2] && (d2[b2] = a3[b2]);
  return { $$typeof: k$2, type: c2, key: e2, ref: h2, props: d2, _owner: n$7.current };
}
reactJsxRuntime_production_min.Fragment = l$5;
reactJsxRuntime_production_min.jsx = q;
reactJsxRuntime_production_min.jsxs = q;
{
  jsxRuntime.exports = reactJsxRuntime_production_min;
}
var jsxRuntimeExports = jsxRuntime.exports;
var client = {};
var reactDom = { exports: {} };
var reactDom_production_min = {};
var scheduler = { exports: {} };
var scheduler_production_min = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(function(exports$1) {
  function f2(a3, b2) {
    var c2 = a3.length;
    a3.push(b2);
    a: for (; 0 < c2; ) {
      var d2 = c2 - 1 >>> 1, e2 = a3[d2];
      if (0 < g2(e2, b2)) a3[d2] = b2, a3[c2] = e2, c2 = d2;
      else break a;
    }
  }
  function h2(a3) {
    return 0 === a3.length ? null : a3[0];
  }
  function k2(a3) {
    if (0 === a3.length) return null;
    var b2 = a3[0], c2 = a3.pop();
    if (c2 !== b2) {
      a3[0] = c2;
      a: for (var d2 = 0, e2 = a3.length, w2 = e2 >>> 1; d2 < w2; ) {
        var m2 = 2 * (d2 + 1) - 1, C2 = a3[m2], n2 = m2 + 1, x2 = a3[n2];
        if (0 > g2(C2, c2)) n2 < e2 && 0 > g2(x2, C2) ? (a3[d2] = x2, a3[n2] = c2, d2 = n2) : (a3[d2] = C2, a3[m2] = c2, d2 = m2);
        else if (n2 < e2 && 0 > g2(x2, c2)) a3[d2] = x2, a3[n2] = c2, d2 = n2;
        else break a;
      }
    }
    return b2;
  }
  function g2(a3, b2) {
    var c2 = a3.sortIndex - b2.sortIndex;
    return 0 !== c2 ? c2 : a3.id - b2.id;
  }
  if ("object" === typeof performance && "function" === typeof performance.now) {
    var l2 = performance;
    exports$1.unstable_now = function() {
      return l2.now();
    };
  } else {
    var p2 = Date, q2 = p2.now();
    exports$1.unstable_now = function() {
      return p2.now() - q2;
    };
  }
  var r2 = [], t2 = [], u2 = 1, v2 = null, y2 = 3, z2 = false, A2 = false, B2 = false, D2 = "function" === typeof setTimeout ? setTimeout : null, E2 = "function" === typeof clearTimeout ? clearTimeout : null, F2 = "undefined" !== typeof setImmediate ? setImmediate : null;
  "undefined" !== typeof navigator && void 0 !== navigator.scheduling && void 0 !== navigator.scheduling.isInputPending && navigator.scheduling.isInputPending.bind(navigator.scheduling);
  function G2(a3) {
    for (var b2 = h2(t2); null !== b2; ) {
      if (null === b2.callback) k2(t2);
      else if (b2.startTime <= a3) k2(t2), b2.sortIndex = b2.expirationTime, f2(r2, b2);
      else break;
      b2 = h2(t2);
    }
  }
  function H2(a3) {
    B2 = false;
    G2(a3);
    if (!A2) if (null !== h2(r2)) A2 = true, I2(J2);
    else {
      var b2 = h2(t2);
      null !== b2 && K2(H2, b2.startTime - a3);
    }
  }
  function J2(a3, b2) {
    A2 = false;
    B2 && (B2 = false, E2(L2), L2 = -1);
    z2 = true;
    var c2 = y2;
    try {
      G2(b2);
      for (v2 = h2(r2); null !== v2 && (!(v2.expirationTime > b2) || a3 && !M2()); ) {
        var d2 = v2.callback;
        if ("function" === typeof d2) {
          v2.callback = null;
          y2 = v2.priorityLevel;
          var e2 = d2(v2.expirationTime <= b2);
          b2 = exports$1.unstable_now();
          "function" === typeof e2 ? v2.callback = e2 : v2 === h2(r2) && k2(r2);
          G2(b2);
        } else k2(r2);
        v2 = h2(r2);
      }
      if (null !== v2) var w2 = true;
      else {
        var m2 = h2(t2);
        null !== m2 && K2(H2, m2.startTime - b2);
        w2 = false;
      }
      return w2;
    } finally {
      v2 = null, y2 = c2, z2 = false;
    }
  }
  var N2 = false, O2 = null, L2 = -1, P2 = 5, Q2 = -1;
  function M2() {
    return exports$1.unstable_now() - Q2 < P2 ? false : true;
  }
  function R2() {
    if (null !== O2) {
      var a3 = exports$1.unstable_now();
      Q2 = a3;
      var b2 = true;
      try {
        b2 = O2(true, a3);
      } finally {
        b2 ? S2() : (N2 = false, O2 = null);
      }
    } else N2 = false;
  }
  var S2;
  if ("function" === typeof F2) S2 = function() {
    F2(R2);
  };
  else if ("undefined" !== typeof MessageChannel) {
    var T3 = new MessageChannel(), U2 = T3.port2;
    T3.port1.onmessage = R2;
    S2 = function() {
      U2.postMessage(null);
    };
  } else S2 = function() {
    D2(R2, 0);
  };
  function I2(a3) {
    O2 = a3;
    N2 || (N2 = true, S2());
  }
  function K2(a3, b2) {
    L2 = D2(function() {
      a3(exports$1.unstable_now());
    }, b2);
  }
  exports$1.unstable_IdlePriority = 5;
  exports$1.unstable_ImmediatePriority = 1;
  exports$1.unstable_LowPriority = 4;
  exports$1.unstable_NormalPriority = 3;
  exports$1.unstable_Profiling = null;
  exports$1.unstable_UserBlockingPriority = 2;
  exports$1.unstable_cancelCallback = function(a3) {
    a3.callback = null;
  };
  exports$1.unstable_continueExecution = function() {
    A2 || z2 || (A2 = true, I2(J2));
  };
  exports$1.unstable_forceFrameRate = function(a3) {
    0 > a3 || 125 < a3 ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : P2 = 0 < a3 ? Math.floor(1e3 / a3) : 5;
  };
  exports$1.unstable_getCurrentPriorityLevel = function() {
    return y2;
  };
  exports$1.unstable_getFirstCallbackNode = function() {
    return h2(r2);
  };
  exports$1.unstable_next = function(a3) {
    switch (y2) {
      case 1:
      case 2:
      case 3:
        var b2 = 3;
        break;
      default:
        b2 = y2;
    }
    var c2 = y2;
    y2 = b2;
    try {
      return a3();
    } finally {
      y2 = c2;
    }
  };
  exports$1.unstable_pauseExecution = function() {
  };
  exports$1.unstable_requestPaint = function() {
  };
  exports$1.unstable_runWithPriority = function(a3, b2) {
    switch (a3) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        break;
      default:
        a3 = 3;
    }
    var c2 = y2;
    y2 = a3;
    try {
      return b2();
    } finally {
      y2 = c2;
    }
  };
  exports$1.unstable_scheduleCallback = function(a3, b2, c2) {
    var d2 = exports$1.unstable_now();
    "object" === typeof c2 && null !== c2 ? (c2 = c2.delay, c2 = "number" === typeof c2 && 0 < c2 ? d2 + c2 : d2) : c2 = d2;
    switch (a3) {
      case 1:
        var e2 = -1;
        break;
      case 2:
        e2 = 250;
        break;
      case 5:
        e2 = 1073741823;
        break;
      case 4:
        e2 = 1e4;
        break;
      default:
        e2 = 5e3;
    }
    e2 = c2 + e2;
    a3 = { id: u2++, callback: b2, priorityLevel: a3, startTime: c2, expirationTime: e2, sortIndex: -1 };
    c2 > d2 ? (a3.sortIndex = c2, f2(t2, a3), null === h2(r2) && a3 === h2(t2) && (B2 ? (E2(L2), L2 = -1) : B2 = true, K2(H2, c2 - d2))) : (a3.sortIndex = e2, f2(r2, a3), A2 || z2 || (A2 = true, I2(J2)));
    return a3;
  };
  exports$1.unstable_shouldYield = M2;
  exports$1.unstable_wrapCallback = function(a3) {
    var b2 = y2;
    return function() {
      var c2 = y2;
      y2 = b2;
      try {
        return a3.apply(this, arguments);
      } finally {
        y2 = c2;
      }
    };
  };
})(scheduler_production_min);
{
  scheduler.exports = scheduler_production_min;
}
var schedulerExports = scheduler.exports;
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var aa = reactExports, ca = schedulerExports;
function p$4(a3) {
  for (var b2 = "https://reactjs.org/docs/error-decoder.html?invariant=" + a3, c2 = 1; c2 < arguments.length; c2++) b2 += "&args[]=" + encodeURIComponent(arguments[c2]);
  return "Minified React error #" + a3 + "; visit " + b2 + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
}
var da = /* @__PURE__ */ new Set(), ea = {};
function fa(a3, b2) {
  ha(a3, b2);
  ha(a3 + "Capture", b2);
}
function ha(a3, b2) {
  ea[a3] = b2;
  for (a3 = 0; a3 < b2.length; a3++) da.add(b2[a3]);
}
var ia = !("undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement), ja = Object.prototype.hasOwnProperty, ka = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, la = {}, ma = {};
function oa(a3) {
  if (ja.call(ma, a3)) return true;
  if (ja.call(la, a3)) return false;
  if (ka.test(a3)) return ma[a3] = true;
  la[a3] = true;
  return false;
}
function pa(a3, b2, c2, d2) {
  if (null !== c2 && 0 === c2.type) return false;
  switch (typeof b2) {
    case "function":
    case "symbol":
      return true;
    case "boolean":
      if (d2) return false;
      if (null !== c2) return !c2.acceptsBooleans;
      a3 = a3.toLowerCase().slice(0, 5);
      return "data-" !== a3 && "aria-" !== a3;
    default:
      return false;
  }
}
function qa(a3, b2, c2, d2) {
  if (null === b2 || "undefined" === typeof b2 || pa(a3, b2, c2, d2)) return true;
  if (d2) return false;
  if (null !== c2) switch (c2.type) {
    case 3:
      return !b2;
    case 4:
      return false === b2;
    case 5:
      return isNaN(b2);
    case 6:
      return isNaN(b2) || 1 > b2;
  }
  return false;
}
function v$2(a3, b2, c2, d2, e2, f2, g2) {
  this.acceptsBooleans = 2 === b2 || 3 === b2 || 4 === b2;
  this.attributeName = d2;
  this.attributeNamespace = e2;
  this.mustUseProperty = c2;
  this.propertyName = a3;
  this.type = b2;
  this.sanitizeURL = f2;
  this.removeEmptyString = g2;
}
var z$1 = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a3) {
  z$1[a3] = new v$2(a3, 0, false, a3, null, false, false);
});
[["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(a3) {
  var b2 = a3[0];
  z$1[b2] = new v$2(b2, 1, false, a3[1], null, false, false);
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function(a3) {
  z$1[a3] = new v$2(a3, 2, false, a3.toLowerCase(), null, false, false);
});
["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(a3) {
  z$1[a3] = new v$2(a3, 2, false, a3, null, false, false);
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a3) {
  z$1[a3] = new v$2(a3, 3, false, a3.toLowerCase(), null, false, false);
});
["checked", "multiple", "muted", "selected"].forEach(function(a3) {
  z$1[a3] = new v$2(a3, 3, true, a3, null, false, false);
});
["capture", "download"].forEach(function(a3) {
  z$1[a3] = new v$2(a3, 4, false, a3, null, false, false);
});
["cols", "rows", "size", "span"].forEach(function(a3) {
  z$1[a3] = new v$2(a3, 6, false, a3, null, false, false);
});
["rowSpan", "start"].forEach(function(a3) {
  z$1[a3] = new v$2(a3, 5, false, a3.toLowerCase(), null, false, false);
});
var ra = /[\-:]([a-z])/g;
function sa(a3) {
  return a3[1].toUpperCase();
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a3) {
  var b2 = a3.replace(
    ra,
    sa
  );
  z$1[b2] = new v$2(b2, 1, false, a3, null, false, false);
});
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a3) {
  var b2 = a3.replace(ra, sa);
  z$1[b2] = new v$2(b2, 1, false, a3, "http://www.w3.org/1999/xlink", false, false);
});
["xml:base", "xml:lang", "xml:space"].forEach(function(a3) {
  var b2 = a3.replace(ra, sa);
  z$1[b2] = new v$2(b2, 1, false, a3, "http://www.w3.org/XML/1998/namespace", false, false);
});
["tabIndex", "crossOrigin"].forEach(function(a3) {
  z$1[a3] = new v$2(a3, 1, false, a3.toLowerCase(), null, false, false);
});
z$1.xlinkHref = new v$2("xlinkHref", 1, false, "xlink:href", "http://www.w3.org/1999/xlink", true, false);
["src", "href", "action", "formAction"].forEach(function(a3) {
  z$1[a3] = new v$2(a3, 1, false, a3.toLowerCase(), null, true, true);
});
function ta(a3, b2, c2, d2) {
  var e2 = z$1.hasOwnProperty(b2) ? z$1[b2] : null;
  if (null !== e2 ? 0 !== e2.type : d2 || !(2 < b2.length) || "o" !== b2[0] && "O" !== b2[0] || "n" !== b2[1] && "N" !== b2[1]) qa(b2, c2, e2, d2) && (c2 = null), d2 || null === e2 ? oa(b2) && (null === c2 ? a3.removeAttribute(b2) : a3.setAttribute(b2, "" + c2)) : e2.mustUseProperty ? a3[e2.propertyName] = null === c2 ? 3 === e2.type ? false : "" : c2 : (b2 = e2.attributeName, d2 = e2.attributeNamespace, null === c2 ? a3.removeAttribute(b2) : (e2 = e2.type, c2 = 3 === e2 || 4 === e2 && true === c2 ? "" : "" + c2, d2 ? a3.setAttributeNS(d2, b2, c2) : a3.setAttribute(b2, c2)));
}
var ua = aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, va = Symbol.for("react.element"), wa = Symbol.for("react.portal"), ya = Symbol.for("react.fragment"), za = Symbol.for("react.strict_mode"), Aa = Symbol.for("react.profiler"), Ba = Symbol.for("react.provider"), Ca = Symbol.for("react.context"), Da = Symbol.for("react.forward_ref"), Ea = Symbol.for("react.suspense"), Fa = Symbol.for("react.suspense_list"), Ga = Symbol.for("react.memo"), Ha = Symbol.for("react.lazy");
var Ia = Symbol.for("react.offscreen");
var Ja = Symbol.iterator;
function Ka(a3) {
  if (null === a3 || "object" !== typeof a3) return null;
  a3 = Ja && a3[Ja] || a3["@@iterator"];
  return "function" === typeof a3 ? a3 : null;
}
var A$3 = Object.assign, La;
function Ma(a3) {
  if (void 0 === La) try {
    throw Error();
  } catch (c2) {
    var b2 = c2.stack.trim().match(/\n( *(at )?)/);
    La = b2 && b2[1] || "";
  }
  return "\n" + La + a3;
}
var Na = false;
function Oa(a3, b2) {
  if (!a3 || Na) return "";
  Na = true;
  var c2 = Error.prepareStackTrace;
  Error.prepareStackTrace = void 0;
  try {
    if (b2) if (b2 = function() {
      throw Error();
    }, Object.defineProperty(b2.prototype, "props", { set: function() {
      throw Error();
    } }), "object" === typeof Reflect && Reflect.construct) {
      try {
        Reflect.construct(b2, []);
      } catch (l2) {
        var d2 = l2;
      }
      Reflect.construct(a3, [], b2);
    } else {
      try {
        b2.call();
      } catch (l2) {
        d2 = l2;
      }
      a3.call(b2.prototype);
    }
    else {
      try {
        throw Error();
      } catch (l2) {
        d2 = l2;
      }
      a3();
    }
  } catch (l2) {
    if (l2 && d2 && "string" === typeof l2.stack) {
      for (var e2 = l2.stack.split("\n"), f2 = d2.stack.split("\n"), g2 = e2.length - 1, h2 = f2.length - 1; 1 <= g2 && 0 <= h2 && e2[g2] !== f2[h2]; ) h2--;
      for (; 1 <= g2 && 0 <= h2; g2--, h2--) if (e2[g2] !== f2[h2]) {
        if (1 !== g2 || 1 !== h2) {
          do
            if (g2--, h2--, 0 > h2 || e2[g2] !== f2[h2]) {
              var k2 = "\n" + e2[g2].replace(" at new ", " at ");
              a3.displayName && k2.includes("<anonymous>") && (k2 = k2.replace("<anonymous>", a3.displayName));
              return k2;
            }
          while (1 <= g2 && 0 <= h2);
        }
        break;
      }
    }
  } finally {
    Na = false, Error.prepareStackTrace = c2;
  }
  return (a3 = a3 ? a3.displayName || a3.name : "") ? Ma(a3) : "";
}
function Pa(a3) {
  switch (a3.tag) {
    case 5:
      return Ma(a3.type);
    case 16:
      return Ma("Lazy");
    case 13:
      return Ma("Suspense");
    case 19:
      return Ma("SuspenseList");
    case 0:
    case 2:
    case 15:
      return a3 = Oa(a3.type, false), a3;
    case 11:
      return a3 = Oa(a3.type.render, false), a3;
    case 1:
      return a3 = Oa(a3.type, true), a3;
    default:
      return "";
  }
}
function Qa(a3) {
  if (null == a3) return null;
  if ("function" === typeof a3) return a3.displayName || a3.name || null;
  if ("string" === typeof a3) return a3;
  switch (a3) {
    case ya:
      return "Fragment";
    case wa:
      return "Portal";
    case Aa:
      return "Profiler";
    case za:
      return "StrictMode";
    case Ea:
      return "Suspense";
    case Fa:
      return "SuspenseList";
  }
  if ("object" === typeof a3) switch (a3.$$typeof) {
    case Ca:
      return (a3.displayName || "Context") + ".Consumer";
    case Ba:
      return (a3._context.displayName || "Context") + ".Provider";
    case Da:
      var b2 = a3.render;
      a3 = a3.displayName;
      a3 || (a3 = b2.displayName || b2.name || "", a3 = "" !== a3 ? "ForwardRef(" + a3 + ")" : "ForwardRef");
      return a3;
    case Ga:
      return b2 = a3.displayName || null, null !== b2 ? b2 : Qa(a3.type) || "Memo";
    case Ha:
      b2 = a3._payload;
      a3 = a3._init;
      try {
        return Qa(a3(b2));
      } catch (c2) {
      }
  }
  return null;
}
function Ra(a3) {
  var b2 = a3.type;
  switch (a3.tag) {
    case 24:
      return "Cache";
    case 9:
      return (b2.displayName || "Context") + ".Consumer";
    case 10:
      return (b2._context.displayName || "Context") + ".Provider";
    case 18:
      return "DehydratedFragment";
    case 11:
      return a3 = b2.render, a3 = a3.displayName || a3.name || "", b2.displayName || ("" !== a3 ? "ForwardRef(" + a3 + ")" : "ForwardRef");
    case 7:
      return "Fragment";
    case 5:
      return b2;
    case 4:
      return "Portal";
    case 3:
      return "Root";
    case 6:
      return "Text";
    case 16:
      return Qa(b2);
    case 8:
      return b2 === za ? "StrictMode" : "Mode";
    case 22:
      return "Offscreen";
    case 12:
      return "Profiler";
    case 21:
      return "Scope";
    case 13:
      return "Suspense";
    case 19:
      return "SuspenseList";
    case 25:
      return "TracingMarker";
    case 1:
    case 0:
    case 17:
    case 2:
    case 14:
    case 15:
      if ("function" === typeof b2) return b2.displayName || b2.name || null;
      if ("string" === typeof b2) return b2;
  }
  return null;
}
function Sa(a3) {
  switch (typeof a3) {
    case "boolean":
    case "number":
    case "string":
    case "undefined":
      return a3;
    case "object":
      return a3;
    default:
      return "";
  }
}
function Ta(a3) {
  var b2 = a3.type;
  return (a3 = a3.nodeName) && "input" === a3.toLowerCase() && ("checkbox" === b2 || "radio" === b2);
}
function Ua(a3) {
  var b2 = Ta(a3) ? "checked" : "value", c2 = Object.getOwnPropertyDescriptor(a3.constructor.prototype, b2), d2 = "" + a3[b2];
  if (!a3.hasOwnProperty(b2) && "undefined" !== typeof c2 && "function" === typeof c2.get && "function" === typeof c2.set) {
    var e2 = c2.get, f2 = c2.set;
    Object.defineProperty(a3, b2, { configurable: true, get: function() {
      return e2.call(this);
    }, set: function(a4) {
      d2 = "" + a4;
      f2.call(this, a4);
    } });
    Object.defineProperty(a3, b2, { enumerable: c2.enumerable });
    return { getValue: function() {
      return d2;
    }, setValue: function(a4) {
      d2 = "" + a4;
    }, stopTracking: function() {
      a3._valueTracker = null;
      delete a3[b2];
    } };
  }
}
function Va(a3) {
  a3._valueTracker || (a3._valueTracker = Ua(a3));
}
function Wa(a3) {
  if (!a3) return false;
  var b2 = a3._valueTracker;
  if (!b2) return true;
  var c2 = b2.getValue();
  var d2 = "";
  a3 && (d2 = Ta(a3) ? a3.checked ? "true" : "false" : a3.value);
  a3 = d2;
  return a3 !== c2 ? (b2.setValue(a3), true) : false;
}
function Xa(a3) {
  a3 = a3 || ("undefined" !== typeof document ? document : void 0);
  if ("undefined" === typeof a3) return null;
  try {
    return a3.activeElement || a3.body;
  } catch (b2) {
    return a3.body;
  }
}
function Ya(a3, b2) {
  var c2 = b2.checked;
  return A$3({}, b2, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: null != c2 ? c2 : a3._wrapperState.initialChecked });
}
function Za(a3, b2) {
  var c2 = null == b2.defaultValue ? "" : b2.defaultValue, d2 = null != b2.checked ? b2.checked : b2.defaultChecked;
  c2 = Sa(null != b2.value ? b2.value : c2);
  a3._wrapperState = { initialChecked: d2, initialValue: c2, controlled: "checkbox" === b2.type || "radio" === b2.type ? null != b2.checked : null != b2.value };
}
function ab(a3, b2) {
  b2 = b2.checked;
  null != b2 && ta(a3, "checked", b2, false);
}
function bb(a3, b2) {
  ab(a3, b2);
  var c2 = Sa(b2.value), d2 = b2.type;
  if (null != c2) if ("number" === d2) {
    if (0 === c2 && "" === a3.value || a3.value != c2) a3.value = "" + c2;
  } else a3.value !== "" + c2 && (a3.value = "" + c2);
  else if ("submit" === d2 || "reset" === d2) {
    a3.removeAttribute("value");
    return;
  }
  b2.hasOwnProperty("value") ? cb(a3, b2.type, c2) : b2.hasOwnProperty("defaultValue") && cb(a3, b2.type, Sa(b2.defaultValue));
  null == b2.checked && null != b2.defaultChecked && (a3.defaultChecked = !!b2.defaultChecked);
}
function db(a3, b2, c2) {
  if (b2.hasOwnProperty("value") || b2.hasOwnProperty("defaultValue")) {
    var d2 = b2.type;
    if (!("submit" !== d2 && "reset" !== d2 || void 0 !== b2.value && null !== b2.value)) return;
    b2 = "" + a3._wrapperState.initialValue;
    c2 || b2 === a3.value || (a3.value = b2);
    a3.defaultValue = b2;
  }
  c2 = a3.name;
  "" !== c2 && (a3.name = "");
  a3.defaultChecked = !!a3._wrapperState.initialChecked;
  "" !== c2 && (a3.name = c2);
}
function cb(a3, b2, c2) {
  if ("number" !== b2 || Xa(a3.ownerDocument) !== a3) null == c2 ? a3.defaultValue = "" + a3._wrapperState.initialValue : a3.defaultValue !== "" + c2 && (a3.defaultValue = "" + c2);
}
var eb = Array.isArray;
function fb(a3, b2, c2, d2) {
  a3 = a3.options;
  if (b2) {
    b2 = {};
    for (var e2 = 0; e2 < c2.length; e2++) b2["$" + c2[e2]] = true;
    for (c2 = 0; c2 < a3.length; c2++) e2 = b2.hasOwnProperty("$" + a3[c2].value), a3[c2].selected !== e2 && (a3[c2].selected = e2), e2 && d2 && (a3[c2].defaultSelected = true);
  } else {
    c2 = "" + Sa(c2);
    b2 = null;
    for (e2 = 0; e2 < a3.length; e2++) {
      if (a3[e2].value === c2) {
        a3[e2].selected = true;
        d2 && (a3[e2].defaultSelected = true);
        return;
      }
      null !== b2 || a3[e2].disabled || (b2 = a3[e2]);
    }
    null !== b2 && (b2.selected = true);
  }
}
function gb(a3, b2) {
  if (null != b2.dangerouslySetInnerHTML) throw Error(p$4(91));
  return A$3({}, b2, { value: void 0, defaultValue: void 0, children: "" + a3._wrapperState.initialValue });
}
function hb(a3, b2) {
  var c2 = b2.value;
  if (null == c2) {
    c2 = b2.children;
    b2 = b2.defaultValue;
    if (null != c2) {
      if (null != b2) throw Error(p$4(92));
      if (eb(c2)) {
        if (1 < c2.length) throw Error(p$4(93));
        c2 = c2[0];
      }
      b2 = c2;
    }
    null == b2 && (b2 = "");
    c2 = b2;
  }
  a3._wrapperState = { initialValue: Sa(c2) };
}
function ib(a3, b2) {
  var c2 = Sa(b2.value), d2 = Sa(b2.defaultValue);
  null != c2 && (c2 = "" + c2, c2 !== a3.value && (a3.value = c2), null == b2.defaultValue && a3.defaultValue !== c2 && (a3.defaultValue = c2));
  null != d2 && (a3.defaultValue = "" + d2);
}
function jb(a3) {
  var b2 = a3.textContent;
  b2 === a3._wrapperState.initialValue && "" !== b2 && null !== b2 && (a3.value = b2);
}
function kb(a3) {
  switch (a3) {
    case "svg":
      return "http://www.w3.org/2000/svg";
    case "math":
      return "http://www.w3.org/1998/Math/MathML";
    default:
      return "http://www.w3.org/1999/xhtml";
  }
}
function lb(a3, b2) {
  return null == a3 || "http://www.w3.org/1999/xhtml" === a3 ? kb(b2) : "http://www.w3.org/2000/svg" === a3 && "foreignObject" === b2 ? "http://www.w3.org/1999/xhtml" : a3;
}
var mb, nb = function(a3) {
  return "undefined" !== typeof MSApp && MSApp.execUnsafeLocalFunction ? function(b2, c2, d2, e2) {
    MSApp.execUnsafeLocalFunction(function() {
      return a3(b2, c2, d2, e2);
    });
  } : a3;
}(function(a3, b2) {
  if ("http://www.w3.org/2000/svg" !== a3.namespaceURI || "innerHTML" in a3) a3.innerHTML = b2;
  else {
    mb = mb || document.createElement("div");
    mb.innerHTML = "<svg>" + b2.valueOf().toString() + "</svg>";
    for (b2 = mb.firstChild; a3.firstChild; ) a3.removeChild(a3.firstChild);
    for (; b2.firstChild; ) a3.appendChild(b2.firstChild);
  }
});
function ob(a3, b2) {
  if (b2) {
    var c2 = a3.firstChild;
    if (c2 && c2 === a3.lastChild && 3 === c2.nodeType) {
      c2.nodeValue = b2;
      return;
    }
  }
  a3.textContent = b2;
}
var pb = {
  animationIterationCount: true,
  aspectRatio: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  columns: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridArea: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowSpan: true,
  gridRowStart: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnSpan: true,
  gridColumnStart: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,
  fillOpacity: true,
  floodOpacity: true,
  stopOpacity: true,
  strokeDasharray: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true
}, qb = ["Webkit", "ms", "Moz", "O"];
Object.keys(pb).forEach(function(a3) {
  qb.forEach(function(b2) {
    b2 = b2 + a3.charAt(0).toUpperCase() + a3.substring(1);
    pb[b2] = pb[a3];
  });
});
function rb(a3, b2, c2) {
  return null == b2 || "boolean" === typeof b2 || "" === b2 ? "" : c2 || "number" !== typeof b2 || 0 === b2 || pb.hasOwnProperty(a3) && pb[a3] ? ("" + b2).trim() : b2 + "px";
}
function sb(a3, b2) {
  a3 = a3.style;
  for (var c2 in b2) if (b2.hasOwnProperty(c2)) {
    var d2 = 0 === c2.indexOf("--"), e2 = rb(c2, b2[c2], d2);
    "float" === c2 && (c2 = "cssFloat");
    d2 ? a3.setProperty(c2, e2) : a3[c2] = e2;
  }
}
var tb = A$3({ menuitem: true }, { area: true, base: true, br: true, col: true, embed: true, hr: true, img: true, input: true, keygen: true, link: true, meta: true, param: true, source: true, track: true, wbr: true });
function ub(a3, b2) {
  if (b2) {
    if (tb[a3] && (null != b2.children || null != b2.dangerouslySetInnerHTML)) throw Error(p$4(137, a3));
    if (null != b2.dangerouslySetInnerHTML) {
      if (null != b2.children) throw Error(p$4(60));
      if ("object" !== typeof b2.dangerouslySetInnerHTML || !("__html" in b2.dangerouslySetInnerHTML)) throw Error(p$4(61));
    }
    if (null != b2.style && "object" !== typeof b2.style) throw Error(p$4(62));
  }
}
function vb(a3, b2) {
  if (-1 === a3.indexOf("-")) return "string" === typeof b2.is;
  switch (a3) {
    case "annotation-xml":
    case "color-profile":
    case "font-face":
    case "font-face-src":
    case "font-face-uri":
    case "font-face-format":
    case "font-face-name":
    case "missing-glyph":
      return false;
    default:
      return true;
  }
}
var wb = null;
function xb(a3) {
  a3 = a3.target || a3.srcElement || window;
  a3.correspondingUseElement && (a3 = a3.correspondingUseElement);
  return 3 === a3.nodeType ? a3.parentNode : a3;
}
var yb = null, zb = null, Ab = null;
function Bb(a3) {
  if (a3 = Cb(a3)) {
    if ("function" !== typeof yb) throw Error(p$4(280));
    var b2 = a3.stateNode;
    b2 && (b2 = Db(b2), yb(a3.stateNode, a3.type, b2));
  }
}
function Eb(a3) {
  zb ? Ab ? Ab.push(a3) : Ab = [a3] : zb = a3;
}
function Fb() {
  if (zb) {
    var a3 = zb, b2 = Ab;
    Ab = zb = null;
    Bb(a3);
    if (b2) for (a3 = 0; a3 < b2.length; a3++) Bb(b2[a3]);
  }
}
function Gb(a3, b2) {
  return a3(b2);
}
function Hb() {
}
var Ib = false;
function Jb(a3, b2, c2) {
  if (Ib) return a3(b2, c2);
  Ib = true;
  try {
    return Gb(a3, b2, c2);
  } finally {
    if (Ib = false, null !== zb || null !== Ab) Hb(), Fb();
  }
}
function Kb(a3, b2) {
  var c2 = a3.stateNode;
  if (null === c2) return null;
  var d2 = Db(c2);
  if (null === d2) return null;
  c2 = d2[b2];
  a: switch (b2) {
    case "onClick":
    case "onClickCapture":
    case "onDoubleClick":
    case "onDoubleClickCapture":
    case "onMouseDown":
    case "onMouseDownCapture":
    case "onMouseMove":
    case "onMouseMoveCapture":
    case "onMouseUp":
    case "onMouseUpCapture":
    case "onMouseEnter":
      (d2 = !d2.disabled) || (a3 = a3.type, d2 = !("button" === a3 || "input" === a3 || "select" === a3 || "textarea" === a3));
      a3 = !d2;
      break a;
    default:
      a3 = false;
  }
  if (a3) return null;
  if (c2 && "function" !== typeof c2) throw Error(p$4(231, b2, typeof c2));
  return c2;
}
var Lb = false;
if (ia) try {
  var Mb = {};
  Object.defineProperty(Mb, "passive", { get: function() {
    Lb = true;
  } });
  window.addEventListener("test", Mb, Mb);
  window.removeEventListener("test", Mb, Mb);
} catch (a3) {
  Lb = false;
}
function Nb(a3, b2, c2, d2, e2, f2, g2, h2, k2) {
  var l2 = Array.prototype.slice.call(arguments, 3);
  try {
    b2.apply(c2, l2);
  } catch (m2) {
    this.onError(m2);
  }
}
var Ob = false, Pb = null, Qb = false, Rb = null, Sb = { onError: function(a3) {
  Ob = true;
  Pb = a3;
} };
function Tb(a3, b2, c2, d2, e2, f2, g2, h2, k2) {
  Ob = false;
  Pb = null;
  Nb.apply(Sb, arguments);
}
function Ub(a3, b2, c2, d2, e2, f2, g2, h2, k2) {
  Tb.apply(this, arguments);
  if (Ob) {
    if (Ob) {
      var l2 = Pb;
      Ob = false;
      Pb = null;
    } else throw Error(p$4(198));
    Qb || (Qb = true, Rb = l2);
  }
}
function Vb(a3) {
  var b2 = a3, c2 = a3;
  if (a3.alternate) for (; b2.return; ) b2 = b2.return;
  else {
    a3 = b2;
    do
      b2 = a3, 0 !== (b2.flags & 4098) && (c2 = b2.return), a3 = b2.return;
    while (a3);
  }
  return 3 === b2.tag ? c2 : null;
}
function Wb(a3) {
  if (13 === a3.tag) {
    var b2 = a3.memoizedState;
    null === b2 && (a3 = a3.alternate, null !== a3 && (b2 = a3.memoizedState));
    if (null !== b2) return b2.dehydrated;
  }
  return null;
}
function Xb(a3) {
  if (Vb(a3) !== a3) throw Error(p$4(188));
}
function Yb(a3) {
  var b2 = a3.alternate;
  if (!b2) {
    b2 = Vb(a3);
    if (null === b2) throw Error(p$4(188));
    return b2 !== a3 ? null : a3;
  }
  for (var c2 = a3, d2 = b2; ; ) {
    var e2 = c2.return;
    if (null === e2) break;
    var f2 = e2.alternate;
    if (null === f2) {
      d2 = e2.return;
      if (null !== d2) {
        c2 = d2;
        continue;
      }
      break;
    }
    if (e2.child === f2.child) {
      for (f2 = e2.child; f2; ) {
        if (f2 === c2) return Xb(e2), a3;
        if (f2 === d2) return Xb(e2), b2;
        f2 = f2.sibling;
      }
      throw Error(p$4(188));
    }
    if (c2.return !== d2.return) c2 = e2, d2 = f2;
    else {
      for (var g2 = false, h2 = e2.child; h2; ) {
        if (h2 === c2) {
          g2 = true;
          c2 = e2;
          d2 = f2;
          break;
        }
        if (h2 === d2) {
          g2 = true;
          d2 = e2;
          c2 = f2;
          break;
        }
        h2 = h2.sibling;
      }
      if (!g2) {
        for (h2 = f2.child; h2; ) {
          if (h2 === c2) {
            g2 = true;
            c2 = f2;
            d2 = e2;
            break;
          }
          if (h2 === d2) {
            g2 = true;
            d2 = f2;
            c2 = e2;
            break;
          }
          h2 = h2.sibling;
        }
        if (!g2) throw Error(p$4(189));
      }
    }
    if (c2.alternate !== d2) throw Error(p$4(190));
  }
  if (3 !== c2.tag) throw Error(p$4(188));
  return c2.stateNode.current === c2 ? a3 : b2;
}
function Zb(a3) {
  a3 = Yb(a3);
  return null !== a3 ? $b(a3) : null;
}
function $b(a3) {
  if (5 === a3.tag || 6 === a3.tag) return a3;
  for (a3 = a3.child; null !== a3; ) {
    var b2 = $b(a3);
    if (null !== b2) return b2;
    a3 = a3.sibling;
  }
  return null;
}
var ac = ca.unstable_scheduleCallback, bc = ca.unstable_cancelCallback, cc = ca.unstable_shouldYield, dc = ca.unstable_requestPaint, B = ca.unstable_now, ec = ca.unstable_getCurrentPriorityLevel, fc = ca.unstable_ImmediatePriority, gc = ca.unstable_UserBlockingPriority, hc = ca.unstable_NormalPriority, ic = ca.unstable_LowPriority, jc = ca.unstable_IdlePriority, kc = null, lc = null;
function mc(a3) {
  if (lc && "function" === typeof lc.onCommitFiberRoot) try {
    lc.onCommitFiberRoot(kc, a3, void 0, 128 === (a3.current.flags & 128));
  } catch (b2) {
  }
}
var oc = Math.clz32 ? Math.clz32 : nc, pc = Math.log, qc = Math.LN2;
function nc(a3) {
  a3 >>>= 0;
  return 0 === a3 ? 32 : 31 - (pc(a3) / qc | 0) | 0;
}
var rc = 64, sc = 4194304;
function tc(a3) {
  switch (a3 & -a3) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 4:
      return 4;
    case 8:
      return 8;
    case 16:
      return 16;
    case 32:
      return 32;
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return a3 & 4194240;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return a3 & 130023424;
    case 134217728:
      return 134217728;
    case 268435456:
      return 268435456;
    case 536870912:
      return 536870912;
    case 1073741824:
      return 1073741824;
    default:
      return a3;
  }
}
function uc(a3, b2) {
  var c2 = a3.pendingLanes;
  if (0 === c2) return 0;
  var d2 = 0, e2 = a3.suspendedLanes, f2 = a3.pingedLanes, g2 = c2 & 268435455;
  if (0 !== g2) {
    var h2 = g2 & ~e2;
    0 !== h2 ? d2 = tc(h2) : (f2 &= g2, 0 !== f2 && (d2 = tc(f2)));
  } else g2 = c2 & ~e2, 0 !== g2 ? d2 = tc(g2) : 0 !== f2 && (d2 = tc(f2));
  if (0 === d2) return 0;
  if (0 !== b2 && b2 !== d2 && 0 === (b2 & e2) && (e2 = d2 & -d2, f2 = b2 & -b2, e2 >= f2 || 16 === e2 && 0 !== (f2 & 4194240))) return b2;
  0 !== (d2 & 4) && (d2 |= c2 & 16);
  b2 = a3.entangledLanes;
  if (0 !== b2) for (a3 = a3.entanglements, b2 &= d2; 0 < b2; ) c2 = 31 - oc(b2), e2 = 1 << c2, d2 |= a3[c2], b2 &= ~e2;
  return d2;
}
function vc(a3, b2) {
  switch (a3) {
    case 1:
    case 2:
    case 4:
      return b2 + 250;
    case 8:
    case 16:
    case 32:
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return b2 + 5e3;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return -1;
    case 134217728:
    case 268435456:
    case 536870912:
    case 1073741824:
      return -1;
    default:
      return -1;
  }
}
function wc(a3, b2) {
  for (var c2 = a3.suspendedLanes, d2 = a3.pingedLanes, e2 = a3.expirationTimes, f2 = a3.pendingLanes; 0 < f2; ) {
    var g2 = 31 - oc(f2), h2 = 1 << g2, k2 = e2[g2];
    if (-1 === k2) {
      if (0 === (h2 & c2) || 0 !== (h2 & d2)) e2[g2] = vc(h2, b2);
    } else k2 <= b2 && (a3.expiredLanes |= h2);
    f2 &= ~h2;
  }
}
function xc(a3) {
  a3 = a3.pendingLanes & -1073741825;
  return 0 !== a3 ? a3 : a3 & 1073741824 ? 1073741824 : 0;
}
function yc() {
  var a3 = rc;
  rc <<= 1;
  0 === (rc & 4194240) && (rc = 64);
  return a3;
}
function zc(a3) {
  for (var b2 = [], c2 = 0; 31 > c2; c2++) b2.push(a3);
  return b2;
}
function Ac(a3, b2, c2) {
  a3.pendingLanes |= b2;
  536870912 !== b2 && (a3.suspendedLanes = 0, a3.pingedLanes = 0);
  a3 = a3.eventTimes;
  b2 = 31 - oc(b2);
  a3[b2] = c2;
}
function Bc(a3, b2) {
  var c2 = a3.pendingLanes & ~b2;
  a3.pendingLanes = b2;
  a3.suspendedLanes = 0;
  a3.pingedLanes = 0;
  a3.expiredLanes &= b2;
  a3.mutableReadLanes &= b2;
  a3.entangledLanes &= b2;
  b2 = a3.entanglements;
  var d2 = a3.eventTimes;
  for (a3 = a3.expirationTimes; 0 < c2; ) {
    var e2 = 31 - oc(c2), f2 = 1 << e2;
    b2[e2] = 0;
    d2[e2] = -1;
    a3[e2] = -1;
    c2 &= ~f2;
  }
}
function Cc(a3, b2) {
  var c2 = a3.entangledLanes |= b2;
  for (a3 = a3.entanglements; c2; ) {
    var d2 = 31 - oc(c2), e2 = 1 << d2;
    e2 & b2 | a3[d2] & b2 && (a3[d2] |= b2);
    c2 &= ~e2;
  }
}
var C$5 = 0;
function Dc(a3) {
  a3 &= -a3;
  return 1 < a3 ? 4 < a3 ? 0 !== (a3 & 268435455) ? 16 : 536870912 : 4 : 1;
}
var Ec, Fc, Gc, Hc, Ic, Jc = false, Kc = [], Lc = null, Mc = null, Nc = null, Oc = /* @__PURE__ */ new Map(), Pc = /* @__PURE__ */ new Map(), Qc = [], Rc = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
function Sc(a3, b2) {
  switch (a3) {
    case "focusin":
    case "focusout":
      Lc = null;
      break;
    case "dragenter":
    case "dragleave":
      Mc = null;
      break;
    case "mouseover":
    case "mouseout":
      Nc = null;
      break;
    case "pointerover":
    case "pointerout":
      Oc.delete(b2.pointerId);
      break;
    case "gotpointercapture":
    case "lostpointercapture":
      Pc.delete(b2.pointerId);
  }
}
function Tc(a3, b2, c2, d2, e2, f2) {
  if (null === a3 || a3.nativeEvent !== f2) return a3 = { blockedOn: b2, domEventName: c2, eventSystemFlags: d2, nativeEvent: f2, targetContainers: [e2] }, null !== b2 && (b2 = Cb(b2), null !== b2 && Fc(b2)), a3;
  a3.eventSystemFlags |= d2;
  b2 = a3.targetContainers;
  null !== e2 && -1 === b2.indexOf(e2) && b2.push(e2);
  return a3;
}
function Uc(a3, b2, c2, d2, e2) {
  switch (b2) {
    case "focusin":
      return Lc = Tc(Lc, a3, b2, c2, d2, e2), true;
    case "dragenter":
      return Mc = Tc(Mc, a3, b2, c2, d2, e2), true;
    case "mouseover":
      return Nc = Tc(Nc, a3, b2, c2, d2, e2), true;
    case "pointerover":
      var f2 = e2.pointerId;
      Oc.set(f2, Tc(Oc.get(f2) || null, a3, b2, c2, d2, e2));
      return true;
    case "gotpointercapture":
      return f2 = e2.pointerId, Pc.set(f2, Tc(Pc.get(f2) || null, a3, b2, c2, d2, e2)), true;
  }
  return false;
}
function Vc(a3) {
  var b2 = Wc(a3.target);
  if (null !== b2) {
    var c2 = Vb(b2);
    if (null !== c2) {
      if (b2 = c2.tag, 13 === b2) {
        if (b2 = Wb(c2), null !== b2) {
          a3.blockedOn = b2;
          Ic(a3.priority, function() {
            Gc(c2);
          });
          return;
        }
      } else if (3 === b2 && c2.stateNode.current.memoizedState.isDehydrated) {
        a3.blockedOn = 3 === c2.tag ? c2.stateNode.containerInfo : null;
        return;
      }
    }
  }
  a3.blockedOn = null;
}
function Xc(a3) {
  if (null !== a3.blockedOn) return false;
  for (var b2 = a3.targetContainers; 0 < b2.length; ) {
    var c2 = Yc(a3.domEventName, a3.eventSystemFlags, b2[0], a3.nativeEvent);
    if (null === c2) {
      c2 = a3.nativeEvent;
      var d2 = new c2.constructor(c2.type, c2);
      wb = d2;
      c2.target.dispatchEvent(d2);
      wb = null;
    } else return b2 = Cb(c2), null !== b2 && Fc(b2), a3.blockedOn = c2, false;
    b2.shift();
  }
  return true;
}
function Zc(a3, b2, c2) {
  Xc(a3) && c2.delete(b2);
}
function $c() {
  Jc = false;
  null !== Lc && Xc(Lc) && (Lc = null);
  null !== Mc && Xc(Mc) && (Mc = null);
  null !== Nc && Xc(Nc) && (Nc = null);
  Oc.forEach(Zc);
  Pc.forEach(Zc);
}
function ad(a3, b2) {
  a3.blockedOn === b2 && (a3.blockedOn = null, Jc || (Jc = true, ca.unstable_scheduleCallback(ca.unstable_NormalPriority, $c)));
}
function bd(a3) {
  function b2(b3) {
    return ad(b3, a3);
  }
  if (0 < Kc.length) {
    ad(Kc[0], a3);
    for (var c2 = 1; c2 < Kc.length; c2++) {
      var d2 = Kc[c2];
      d2.blockedOn === a3 && (d2.blockedOn = null);
    }
  }
  null !== Lc && ad(Lc, a3);
  null !== Mc && ad(Mc, a3);
  null !== Nc && ad(Nc, a3);
  Oc.forEach(b2);
  Pc.forEach(b2);
  for (c2 = 0; c2 < Qc.length; c2++) d2 = Qc[c2], d2.blockedOn === a3 && (d2.blockedOn = null);
  for (; 0 < Qc.length && (c2 = Qc[0], null === c2.blockedOn); ) Vc(c2), null === c2.blockedOn && Qc.shift();
}
var cd = ua.ReactCurrentBatchConfig, dd = true;
function ed(a3, b2, c2, d2) {
  var e2 = C$5, f2 = cd.transition;
  cd.transition = null;
  try {
    C$5 = 1, fd(a3, b2, c2, d2);
  } finally {
    C$5 = e2, cd.transition = f2;
  }
}
function gd(a3, b2, c2, d2) {
  var e2 = C$5, f2 = cd.transition;
  cd.transition = null;
  try {
    C$5 = 4, fd(a3, b2, c2, d2);
  } finally {
    C$5 = e2, cd.transition = f2;
  }
}
function fd(a3, b2, c2, d2) {
  if (dd) {
    var e2 = Yc(a3, b2, c2, d2);
    if (null === e2) hd(a3, b2, d2, id, c2), Sc(a3, d2);
    else if (Uc(e2, a3, b2, c2, d2)) d2.stopPropagation();
    else if (Sc(a3, d2), b2 & 4 && -1 < Rc.indexOf(a3)) {
      for (; null !== e2; ) {
        var f2 = Cb(e2);
        null !== f2 && Ec(f2);
        f2 = Yc(a3, b2, c2, d2);
        null === f2 && hd(a3, b2, d2, id, c2);
        if (f2 === e2) break;
        e2 = f2;
      }
      null !== e2 && d2.stopPropagation();
    } else hd(a3, b2, d2, null, c2);
  }
}
var id = null;
function Yc(a3, b2, c2, d2) {
  id = null;
  a3 = xb(d2);
  a3 = Wc(a3);
  if (null !== a3) if (b2 = Vb(a3), null === b2) a3 = null;
  else if (c2 = b2.tag, 13 === c2) {
    a3 = Wb(b2);
    if (null !== a3) return a3;
    a3 = null;
  } else if (3 === c2) {
    if (b2.stateNode.current.memoizedState.isDehydrated) return 3 === b2.tag ? b2.stateNode.containerInfo : null;
    a3 = null;
  } else b2 !== a3 && (a3 = null);
  id = a3;
  return null;
}
function jd(a3) {
  switch (a3) {
    case "cancel":
    case "click":
    case "close":
    case "contextmenu":
    case "copy":
    case "cut":
    case "auxclick":
    case "dblclick":
    case "dragend":
    case "dragstart":
    case "drop":
    case "focusin":
    case "focusout":
    case "input":
    case "invalid":
    case "keydown":
    case "keypress":
    case "keyup":
    case "mousedown":
    case "mouseup":
    case "paste":
    case "pause":
    case "play":
    case "pointercancel":
    case "pointerdown":
    case "pointerup":
    case "ratechange":
    case "reset":
    case "resize":
    case "seeked":
    case "submit":
    case "touchcancel":
    case "touchend":
    case "touchstart":
    case "volumechange":
    case "change":
    case "selectionchange":
    case "textInput":
    case "compositionstart":
    case "compositionend":
    case "compositionupdate":
    case "beforeblur":
    case "afterblur":
    case "beforeinput":
    case "blur":
    case "fullscreenchange":
    case "focus":
    case "hashchange":
    case "popstate":
    case "select":
    case "selectstart":
      return 1;
    case "drag":
    case "dragenter":
    case "dragexit":
    case "dragleave":
    case "dragover":
    case "mousemove":
    case "mouseout":
    case "mouseover":
    case "pointermove":
    case "pointerout":
    case "pointerover":
    case "scroll":
    case "toggle":
    case "touchmove":
    case "wheel":
    case "mouseenter":
    case "mouseleave":
    case "pointerenter":
    case "pointerleave":
      return 4;
    case "message":
      switch (ec()) {
        case fc:
          return 1;
        case gc:
          return 4;
        case hc:
        case ic:
          return 16;
        case jc:
          return 536870912;
        default:
          return 16;
      }
    default:
      return 16;
  }
}
var kd = null, ld = null, md = null;
function nd() {
  if (md) return md;
  var a3, b2 = ld, c2 = b2.length, d2, e2 = "value" in kd ? kd.value : kd.textContent, f2 = e2.length;
  for (a3 = 0; a3 < c2 && b2[a3] === e2[a3]; a3++) ;
  var g2 = c2 - a3;
  for (d2 = 1; d2 <= g2 && b2[c2 - d2] === e2[f2 - d2]; d2++) ;
  return md = e2.slice(a3, 1 < d2 ? 1 - d2 : void 0);
}
function od(a3) {
  var b2 = a3.keyCode;
  "charCode" in a3 ? (a3 = a3.charCode, 0 === a3 && 13 === b2 && (a3 = 13)) : a3 = b2;
  10 === a3 && (a3 = 13);
  return 32 <= a3 || 13 === a3 ? a3 : 0;
}
function pd() {
  return true;
}
function qd() {
  return false;
}
function rd(a3) {
  function b2(b3, d2, e2, f2, g2) {
    this._reactName = b3;
    this._targetInst = e2;
    this.type = d2;
    this.nativeEvent = f2;
    this.target = g2;
    this.currentTarget = null;
    for (var c2 in a3) a3.hasOwnProperty(c2) && (b3 = a3[c2], this[c2] = b3 ? b3(f2) : f2[c2]);
    this.isDefaultPrevented = (null != f2.defaultPrevented ? f2.defaultPrevented : false === f2.returnValue) ? pd : qd;
    this.isPropagationStopped = qd;
    return this;
  }
  A$3(b2.prototype, { preventDefault: function() {
    this.defaultPrevented = true;
    var a4 = this.nativeEvent;
    a4 && (a4.preventDefault ? a4.preventDefault() : "unknown" !== typeof a4.returnValue && (a4.returnValue = false), this.isDefaultPrevented = pd);
  }, stopPropagation: function() {
    var a4 = this.nativeEvent;
    a4 && (a4.stopPropagation ? a4.stopPropagation() : "unknown" !== typeof a4.cancelBubble && (a4.cancelBubble = true), this.isPropagationStopped = pd);
  }, persist: function() {
  }, isPersistent: pd });
  return b2;
}
var sd = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(a3) {
  return a3.timeStamp || Date.now();
}, defaultPrevented: 0, isTrusted: 0 }, td = rd(sd), ud = A$3({}, sd, { view: 0, detail: 0 }), vd = rd(ud), wd, xd, yd, Ad = A$3({}, ud, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: zd, button: 0, buttons: 0, relatedTarget: function(a3) {
  return void 0 === a3.relatedTarget ? a3.fromElement === a3.srcElement ? a3.toElement : a3.fromElement : a3.relatedTarget;
}, movementX: function(a3) {
  if ("movementX" in a3) return a3.movementX;
  a3 !== yd && (yd && "mousemove" === a3.type ? (wd = a3.screenX - yd.screenX, xd = a3.screenY - yd.screenY) : xd = wd = 0, yd = a3);
  return wd;
}, movementY: function(a3) {
  return "movementY" in a3 ? a3.movementY : xd;
} }), Bd = rd(Ad), Cd = A$3({}, Ad, { dataTransfer: 0 }), Dd = rd(Cd), Ed = A$3({}, ud, { relatedTarget: 0 }), Fd = rd(Ed), Gd = A$3({}, sd, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), Hd = rd(Gd), Id = A$3({}, sd, { clipboardData: function(a3) {
  return "clipboardData" in a3 ? a3.clipboardData : window.clipboardData;
} }), Jd = rd(Id), Kd = A$3({}, sd, { data: 0 }), Ld = rd(Kd), Md = {
  Esc: "Escape",
  Spacebar: " ",
  Left: "ArrowLeft",
  Up: "ArrowUp",
  Right: "ArrowRight",
  Down: "ArrowDown",
  Del: "Delete",
  Win: "OS",
  Menu: "ContextMenu",
  Apps: "ContextMenu",
  Scroll: "ScrollLock",
  MozPrintableKey: "Unidentified"
}, Nd = {
  8: "Backspace",
  9: "Tab",
  12: "Clear",
  13: "Enter",
  16: "Shift",
  17: "Control",
  18: "Alt",
  19: "Pause",
  20: "CapsLock",
  27: "Escape",
  32: " ",
  33: "PageUp",
  34: "PageDown",
  35: "End",
  36: "Home",
  37: "ArrowLeft",
  38: "ArrowUp",
  39: "ArrowRight",
  40: "ArrowDown",
  45: "Insert",
  46: "Delete",
  112: "F1",
  113: "F2",
  114: "F3",
  115: "F4",
  116: "F5",
  117: "F6",
  118: "F7",
  119: "F8",
  120: "F9",
  121: "F10",
  122: "F11",
  123: "F12",
  144: "NumLock",
  145: "ScrollLock",
  224: "Meta"
}, Od = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
function Pd(a3) {
  var b2 = this.nativeEvent;
  return b2.getModifierState ? b2.getModifierState(a3) : (a3 = Od[a3]) ? !!b2[a3] : false;
}
function zd() {
  return Pd;
}
var Qd = A$3({}, ud, { key: function(a3) {
  if (a3.key) {
    var b2 = Md[a3.key] || a3.key;
    if ("Unidentified" !== b2) return b2;
  }
  return "keypress" === a3.type ? (a3 = od(a3), 13 === a3 ? "Enter" : String.fromCharCode(a3)) : "keydown" === a3.type || "keyup" === a3.type ? Nd[a3.keyCode] || "Unidentified" : "";
}, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: zd, charCode: function(a3) {
  return "keypress" === a3.type ? od(a3) : 0;
}, keyCode: function(a3) {
  return "keydown" === a3.type || "keyup" === a3.type ? a3.keyCode : 0;
}, which: function(a3) {
  return "keypress" === a3.type ? od(a3) : "keydown" === a3.type || "keyup" === a3.type ? a3.keyCode : 0;
} }), Rd = rd(Qd), Sd = A$3({}, Ad, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Td = rd(Sd), Ud = A$3({}, ud, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: zd }), Vd = rd(Ud), Wd = A$3({}, sd, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Xd = rd(Wd), Yd = A$3({}, Ad, {
  deltaX: function(a3) {
    return "deltaX" in a3 ? a3.deltaX : "wheelDeltaX" in a3 ? -a3.wheelDeltaX : 0;
  },
  deltaY: function(a3) {
    return "deltaY" in a3 ? a3.deltaY : "wheelDeltaY" in a3 ? -a3.wheelDeltaY : "wheelDelta" in a3 ? -a3.wheelDelta : 0;
  },
  deltaZ: 0,
  deltaMode: 0
}), Zd = rd(Yd), $d = [9, 13, 27, 32], ae = ia && "CompositionEvent" in window, be = null;
ia && "documentMode" in document && (be = document.documentMode);
var ce = ia && "TextEvent" in window && !be, de$1 = ia && (!ae || be && 8 < be && 11 >= be), ee$2 = String.fromCharCode(32), fe$1 = false;
function ge$1(a3, b2) {
  switch (a3) {
    case "keyup":
      return -1 !== $d.indexOf(b2.keyCode);
    case "keydown":
      return 229 !== b2.keyCode;
    case "keypress":
    case "mousedown":
    case "focusout":
      return true;
    default:
      return false;
  }
}
function he(a3) {
  a3 = a3.detail;
  return "object" === typeof a3 && "data" in a3 ? a3.data : null;
}
var ie = false;
function je$1(a3, b2) {
  switch (a3) {
    case "compositionend":
      return he(b2);
    case "keypress":
      if (32 !== b2.which) return null;
      fe$1 = true;
      return ee$2;
    case "textInput":
      return a3 = b2.data, a3 === ee$2 && fe$1 ? null : a3;
    default:
      return null;
  }
}
function ke(a3, b2) {
  if (ie) return "compositionend" === a3 || !ae && ge$1(a3, b2) ? (a3 = nd(), md = ld = kd = null, ie = false, a3) : null;
  switch (a3) {
    case "paste":
      return null;
    case "keypress":
      if (!(b2.ctrlKey || b2.altKey || b2.metaKey) || b2.ctrlKey && b2.altKey) {
        if (b2.char && 1 < b2.char.length) return b2.char;
        if (b2.which) return String.fromCharCode(b2.which);
      }
      return null;
    case "compositionend":
      return de$1 && "ko" !== b2.locale ? null : b2.data;
    default:
      return null;
  }
}
var le = { color: true, date: true, datetime: true, "datetime-local": true, email: true, month: true, number: true, password: true, range: true, search: true, tel: true, text: true, time: true, url: true, week: true };
function me$1(a3) {
  var b2 = a3 && a3.nodeName && a3.nodeName.toLowerCase();
  return "input" === b2 ? !!le[a3.type] : "textarea" === b2 ? true : false;
}
function ne$1(a3, b2, c2, d2) {
  Eb(d2);
  b2 = oe$1(b2, "onChange");
  0 < b2.length && (c2 = new td("onChange", "change", null, c2, d2), a3.push({ event: c2, listeners: b2 }));
}
var pe = null, qe$1 = null;
function re$1(a3) {
  se(a3, 0);
}
function te$2(a3) {
  var b2 = ue$1(a3);
  if (Wa(b2)) return a3;
}
function ve(a3, b2) {
  if ("change" === a3) return b2;
}
var we$1 = false;
if (ia) {
  var xe;
  if (ia) {
    var ye = "oninput" in document;
    if (!ye) {
      var ze$1 = document.createElement("div");
      ze$1.setAttribute("oninput", "return;");
      ye = "function" === typeof ze$1.oninput;
    }
    xe = ye;
  } else xe = false;
  we$1 = xe && (!document.documentMode || 9 < document.documentMode);
}
function Ae$1() {
  pe && (pe.detachEvent("onpropertychange", Be$1), qe$1 = pe = null);
}
function Be$1(a3) {
  if ("value" === a3.propertyName && te$2(qe$1)) {
    var b2 = [];
    ne$1(b2, qe$1, a3, xb(a3));
    Jb(re$1, b2);
  }
}
function Ce(a3, b2, c2) {
  "focusin" === a3 ? (Ae$1(), pe = b2, qe$1 = c2, pe.attachEvent("onpropertychange", Be$1)) : "focusout" === a3 && Ae$1();
}
function De$1(a3) {
  if ("selectionchange" === a3 || "keyup" === a3 || "keydown" === a3) return te$2(qe$1);
}
function Ee(a3, b2) {
  if ("click" === a3) return te$2(b2);
}
function Fe$1(a3, b2) {
  if ("input" === a3 || "change" === a3) return te$2(b2);
}
function Ge(a3, b2) {
  return a3 === b2 && (0 !== a3 || 1 / a3 === 1 / b2) || a3 !== a3 && b2 !== b2;
}
var He$2 = "function" === typeof Object.is ? Object.is : Ge;
function Ie$1(a3, b2) {
  if (He$2(a3, b2)) return true;
  if ("object" !== typeof a3 || null === a3 || "object" !== typeof b2 || null === b2) return false;
  var c2 = Object.keys(a3), d2 = Object.keys(b2);
  if (c2.length !== d2.length) return false;
  for (d2 = 0; d2 < c2.length; d2++) {
    var e2 = c2[d2];
    if (!ja.call(b2, e2) || !He$2(a3[e2], b2[e2])) return false;
  }
  return true;
}
function Je$1(a3) {
  for (; a3 && a3.firstChild; ) a3 = a3.firstChild;
  return a3;
}
function Ke$2(a3, b2) {
  var c2 = Je$1(a3);
  a3 = 0;
  for (var d2; c2; ) {
    if (3 === c2.nodeType) {
      d2 = a3 + c2.textContent.length;
      if (a3 <= b2 && d2 >= b2) return { node: c2, offset: b2 - a3 };
      a3 = d2;
    }
    a: {
      for (; c2; ) {
        if (c2.nextSibling) {
          c2 = c2.nextSibling;
          break a;
        }
        c2 = c2.parentNode;
      }
      c2 = void 0;
    }
    c2 = Je$1(c2);
  }
}
function Le$1(a3, b2) {
  return a3 && b2 ? a3 === b2 ? true : a3 && 3 === a3.nodeType ? false : b2 && 3 === b2.nodeType ? Le$1(a3, b2.parentNode) : "contains" in a3 ? a3.contains(b2) : a3.compareDocumentPosition ? !!(a3.compareDocumentPosition(b2) & 16) : false : false;
}
function Me() {
  for (var a3 = window, b2 = Xa(); b2 instanceof a3.HTMLIFrameElement; ) {
    try {
      var c2 = "string" === typeof b2.contentWindow.location.href;
    } catch (d2) {
      c2 = false;
    }
    if (c2) a3 = b2.contentWindow;
    else break;
    b2 = Xa(a3.document);
  }
  return b2;
}
function Ne$1(a3) {
  var b2 = a3 && a3.nodeName && a3.nodeName.toLowerCase();
  return b2 && ("input" === b2 && ("text" === a3.type || "search" === a3.type || "tel" === a3.type || "url" === a3.type || "password" === a3.type) || "textarea" === b2 || "true" === a3.contentEditable);
}
function Oe$1(a3) {
  var b2 = Me(), c2 = a3.focusedElem, d2 = a3.selectionRange;
  if (b2 !== c2 && c2 && c2.ownerDocument && Le$1(c2.ownerDocument.documentElement, c2)) {
    if (null !== d2 && Ne$1(c2)) {
      if (b2 = d2.start, a3 = d2.end, void 0 === a3 && (a3 = b2), "selectionStart" in c2) c2.selectionStart = b2, c2.selectionEnd = Math.min(a3, c2.value.length);
      else if (a3 = (b2 = c2.ownerDocument || document) && b2.defaultView || window, a3.getSelection) {
        a3 = a3.getSelection();
        var e2 = c2.textContent.length, f2 = Math.min(d2.start, e2);
        d2 = void 0 === d2.end ? f2 : Math.min(d2.end, e2);
        !a3.extend && f2 > d2 && (e2 = d2, d2 = f2, f2 = e2);
        e2 = Ke$2(c2, f2);
        var g2 = Ke$2(
          c2,
          d2
        );
        e2 && g2 && (1 !== a3.rangeCount || a3.anchorNode !== e2.node || a3.anchorOffset !== e2.offset || a3.focusNode !== g2.node || a3.focusOffset !== g2.offset) && (b2 = b2.createRange(), b2.setStart(e2.node, e2.offset), a3.removeAllRanges(), f2 > d2 ? (a3.addRange(b2), a3.extend(g2.node, g2.offset)) : (b2.setEnd(g2.node, g2.offset), a3.addRange(b2)));
      }
    }
    b2 = [];
    for (a3 = c2; a3 = a3.parentNode; ) 1 === a3.nodeType && b2.push({ element: a3, left: a3.scrollLeft, top: a3.scrollTop });
    "function" === typeof c2.focus && c2.focus();
    for (c2 = 0; c2 < b2.length; c2++) a3 = b2[c2], a3.element.scrollLeft = a3.left, a3.element.scrollTop = a3.top;
  }
}
var Pe = ia && "documentMode" in document && 11 >= document.documentMode, Qe$1 = null, Re = null, Se = null, Te$1 = false;
function Ue$1(a3, b2, c2) {
  var d2 = c2.window === c2 ? c2.document : 9 === c2.nodeType ? c2 : c2.ownerDocument;
  Te$1 || null == Qe$1 || Qe$1 !== Xa(d2) || (d2 = Qe$1, "selectionStart" in d2 && Ne$1(d2) ? d2 = { start: d2.selectionStart, end: d2.selectionEnd } : (d2 = (d2.ownerDocument && d2.ownerDocument.defaultView || window).getSelection(), d2 = { anchorNode: d2.anchorNode, anchorOffset: d2.anchorOffset, focusNode: d2.focusNode, focusOffset: d2.focusOffset }), Se && Ie$1(Se, d2) || (Se = d2, d2 = oe$1(Re, "onSelect"), 0 < d2.length && (b2 = new td("onSelect", "select", null, b2, c2), a3.push({ event: b2, listeners: d2 }), b2.target = Qe$1)));
}
function Ve$1(a3, b2) {
  var c2 = {};
  c2[a3.toLowerCase()] = b2.toLowerCase();
  c2["Webkit" + a3] = "webkit" + b2;
  c2["Moz" + a3] = "moz" + b2;
  return c2;
}
var We$1 = { animationend: Ve$1("Animation", "AnimationEnd"), animationiteration: Ve$1("Animation", "AnimationIteration"), animationstart: Ve$1("Animation", "AnimationStart"), transitionend: Ve$1("Transition", "TransitionEnd") }, Xe$1 = {}, Ye$1 = {};
ia && (Ye$1 = document.createElement("div").style, "AnimationEvent" in window || (delete We$1.animationend.animation, delete We$1.animationiteration.animation, delete We$1.animationstart.animation), "TransitionEvent" in window || delete We$1.transitionend.transition);
function Ze(a3) {
  if (Xe$1[a3]) return Xe$1[a3];
  if (!We$1[a3]) return a3;
  var b2 = We$1[a3], c2;
  for (c2 in b2) if (b2.hasOwnProperty(c2) && c2 in Ye$1) return Xe$1[a3] = b2[c2];
  return a3;
}
var $e$1 = Ze("animationend"), af = Ze("animationiteration"), bf = Ze("animationstart"), cf = Ze("transitionend"), df = /* @__PURE__ */ new Map(), ef = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
function ff(a3, b2) {
  df.set(a3, b2);
  fa(b2, [a3]);
}
for (var gf = 0; gf < ef.length; gf++) {
  var hf = ef[gf], jf = hf.toLowerCase(), kf = hf[0].toUpperCase() + hf.slice(1);
  ff(jf, "on" + kf);
}
ff($e$1, "onAnimationEnd");
ff(af, "onAnimationIteration");
ff(bf, "onAnimationStart");
ff("dblclick", "onDoubleClick");
ff("focusin", "onFocus");
ff("focusout", "onBlur");
ff(cf, "onTransitionEnd");
ha("onMouseEnter", ["mouseout", "mouseover"]);
ha("onMouseLeave", ["mouseout", "mouseover"]);
ha("onPointerEnter", ["pointerout", "pointerover"]);
ha("onPointerLeave", ["pointerout", "pointerover"]);
fa("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
fa("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
fa("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
fa("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
fa("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
fa("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
var lf = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), mf = new Set("cancel close invalid load scroll toggle".split(" ").concat(lf));
function nf(a3, b2, c2) {
  var d2 = a3.type || "unknown-event";
  a3.currentTarget = c2;
  Ub(d2, b2, void 0, a3);
  a3.currentTarget = null;
}
function se(a3, b2) {
  b2 = 0 !== (b2 & 4);
  for (var c2 = 0; c2 < a3.length; c2++) {
    var d2 = a3[c2], e2 = d2.event;
    d2 = d2.listeners;
    a: {
      var f2 = void 0;
      if (b2) for (var g2 = d2.length - 1; 0 <= g2; g2--) {
        var h2 = d2[g2], k2 = h2.instance, l2 = h2.currentTarget;
        h2 = h2.listener;
        if (k2 !== f2 && e2.isPropagationStopped()) break a;
        nf(e2, h2, l2);
        f2 = k2;
      }
      else for (g2 = 0; g2 < d2.length; g2++) {
        h2 = d2[g2];
        k2 = h2.instance;
        l2 = h2.currentTarget;
        h2 = h2.listener;
        if (k2 !== f2 && e2.isPropagationStopped()) break a;
        nf(e2, h2, l2);
        f2 = k2;
      }
    }
  }
  if (Qb) throw a3 = Rb, Qb = false, Rb = null, a3;
}
function D$3(a3, b2) {
  var c2 = b2[of];
  void 0 === c2 && (c2 = b2[of] = /* @__PURE__ */ new Set());
  var d2 = a3 + "__bubble";
  c2.has(d2) || (pf(b2, a3, 2, false), c2.add(d2));
}
function qf(a3, b2, c2) {
  var d2 = 0;
  b2 && (d2 |= 4);
  pf(c2, a3, d2, b2);
}
var rf = "_reactListening" + Math.random().toString(36).slice(2);
function sf(a3) {
  if (!a3[rf]) {
    a3[rf] = true;
    da.forEach(function(b3) {
      "selectionchange" !== b3 && (mf.has(b3) || qf(b3, false, a3), qf(b3, true, a3));
    });
    var b2 = 9 === a3.nodeType ? a3 : a3.ownerDocument;
    null === b2 || b2[rf] || (b2[rf] = true, qf("selectionchange", false, b2));
  }
}
function pf(a3, b2, c2, d2) {
  switch (jd(b2)) {
    case 1:
      var e2 = ed;
      break;
    case 4:
      e2 = gd;
      break;
    default:
      e2 = fd;
  }
  c2 = e2.bind(null, b2, c2, a3);
  e2 = void 0;
  !Lb || "touchstart" !== b2 && "touchmove" !== b2 && "wheel" !== b2 || (e2 = true);
  d2 ? void 0 !== e2 ? a3.addEventListener(b2, c2, { capture: true, passive: e2 }) : a3.addEventListener(b2, c2, true) : void 0 !== e2 ? a3.addEventListener(b2, c2, { passive: e2 }) : a3.addEventListener(b2, c2, false);
}
function hd(a3, b2, c2, d2, e2) {
  var f2 = d2;
  if (0 === (b2 & 1) && 0 === (b2 & 2) && null !== d2) a: for (; ; ) {
    if (null === d2) return;
    var g2 = d2.tag;
    if (3 === g2 || 4 === g2) {
      var h2 = d2.stateNode.containerInfo;
      if (h2 === e2 || 8 === h2.nodeType && h2.parentNode === e2) break;
      if (4 === g2) for (g2 = d2.return; null !== g2; ) {
        var k2 = g2.tag;
        if (3 === k2 || 4 === k2) {
          if (k2 = g2.stateNode.containerInfo, k2 === e2 || 8 === k2.nodeType && k2.parentNode === e2) return;
        }
        g2 = g2.return;
      }
      for (; null !== h2; ) {
        g2 = Wc(h2);
        if (null === g2) return;
        k2 = g2.tag;
        if (5 === k2 || 6 === k2) {
          d2 = f2 = g2;
          continue a;
        }
        h2 = h2.parentNode;
      }
    }
    d2 = d2.return;
  }
  Jb(function() {
    var d3 = f2, e3 = xb(c2), g3 = [];
    a: {
      var h3 = df.get(a3);
      if (void 0 !== h3) {
        var k3 = td, n2 = a3;
        switch (a3) {
          case "keypress":
            if (0 === od(c2)) break a;
          case "keydown":
          case "keyup":
            k3 = Rd;
            break;
          case "focusin":
            n2 = "focus";
            k3 = Fd;
            break;
          case "focusout":
            n2 = "blur";
            k3 = Fd;
            break;
          case "beforeblur":
          case "afterblur":
            k3 = Fd;
            break;
          case "click":
            if (2 === c2.button) break a;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            k3 = Bd;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            k3 = Dd;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            k3 = Vd;
            break;
          case $e$1:
          case af:
          case bf:
            k3 = Hd;
            break;
          case cf:
            k3 = Xd;
            break;
          case "scroll":
            k3 = vd;
            break;
          case "wheel":
            k3 = Zd;
            break;
          case "copy":
          case "cut":
          case "paste":
            k3 = Jd;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            k3 = Td;
        }
        var t2 = 0 !== (b2 & 4), J2 = !t2 && "scroll" === a3, x2 = t2 ? null !== h3 ? h3 + "Capture" : null : h3;
        t2 = [];
        for (var w2 = d3, u2; null !== w2; ) {
          u2 = w2;
          var F2 = u2.stateNode;
          5 === u2.tag && null !== F2 && (u2 = F2, null !== x2 && (F2 = Kb(w2, x2), null != F2 && t2.push(tf(w2, F2, u2))));
          if (J2) break;
          w2 = w2.return;
        }
        0 < t2.length && (h3 = new k3(h3, n2, null, c2, e3), g3.push({ event: h3, listeners: t2 }));
      }
    }
    if (0 === (b2 & 7)) {
      a: {
        h3 = "mouseover" === a3 || "pointerover" === a3;
        k3 = "mouseout" === a3 || "pointerout" === a3;
        if (h3 && c2 !== wb && (n2 = c2.relatedTarget || c2.fromElement) && (Wc(n2) || n2[uf])) break a;
        if (k3 || h3) {
          h3 = e3.window === e3 ? e3 : (h3 = e3.ownerDocument) ? h3.defaultView || h3.parentWindow : window;
          if (k3) {
            if (n2 = c2.relatedTarget || c2.toElement, k3 = d3, n2 = n2 ? Wc(n2) : null, null !== n2 && (J2 = Vb(n2), n2 !== J2 || 5 !== n2.tag && 6 !== n2.tag)) n2 = null;
          } else k3 = null, n2 = d3;
          if (k3 !== n2) {
            t2 = Bd;
            F2 = "onMouseLeave";
            x2 = "onMouseEnter";
            w2 = "mouse";
            if ("pointerout" === a3 || "pointerover" === a3) t2 = Td, F2 = "onPointerLeave", x2 = "onPointerEnter", w2 = "pointer";
            J2 = null == k3 ? h3 : ue$1(k3);
            u2 = null == n2 ? h3 : ue$1(n2);
            h3 = new t2(F2, w2 + "leave", k3, c2, e3);
            h3.target = J2;
            h3.relatedTarget = u2;
            F2 = null;
            Wc(e3) === d3 && (t2 = new t2(x2, w2 + "enter", n2, c2, e3), t2.target = u2, t2.relatedTarget = J2, F2 = t2);
            J2 = F2;
            if (k3 && n2) b: {
              t2 = k3;
              x2 = n2;
              w2 = 0;
              for (u2 = t2; u2; u2 = vf(u2)) w2++;
              u2 = 0;
              for (F2 = x2; F2; F2 = vf(F2)) u2++;
              for (; 0 < w2 - u2; ) t2 = vf(t2), w2--;
              for (; 0 < u2 - w2; ) x2 = vf(x2), u2--;
              for (; w2--; ) {
                if (t2 === x2 || null !== x2 && t2 === x2.alternate) break b;
                t2 = vf(t2);
                x2 = vf(x2);
              }
              t2 = null;
            }
            else t2 = null;
            null !== k3 && wf(g3, h3, k3, t2, false);
            null !== n2 && null !== J2 && wf(g3, J2, n2, t2, true);
          }
        }
      }
      a: {
        h3 = d3 ? ue$1(d3) : window;
        k3 = h3.nodeName && h3.nodeName.toLowerCase();
        if ("select" === k3 || "input" === k3 && "file" === h3.type) var na = ve;
        else if (me$1(h3)) if (we$1) na = Fe$1;
        else {
          na = De$1;
          var xa = Ce;
        }
        else (k3 = h3.nodeName) && "input" === k3.toLowerCase() && ("checkbox" === h3.type || "radio" === h3.type) && (na = Ee);
        if (na && (na = na(a3, d3))) {
          ne$1(g3, na, c2, e3);
          break a;
        }
        xa && xa(a3, h3, d3);
        "focusout" === a3 && (xa = h3._wrapperState) && xa.controlled && "number" === h3.type && cb(h3, "number", h3.value);
      }
      xa = d3 ? ue$1(d3) : window;
      switch (a3) {
        case "focusin":
          if (me$1(xa) || "true" === xa.contentEditable) Qe$1 = xa, Re = d3, Se = null;
          break;
        case "focusout":
          Se = Re = Qe$1 = null;
          break;
        case "mousedown":
          Te$1 = true;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          Te$1 = false;
          Ue$1(g3, c2, e3);
          break;
        case "selectionchange":
          if (Pe) break;
        case "keydown":
        case "keyup":
          Ue$1(g3, c2, e3);
      }
      var $a;
      if (ae) b: {
        switch (a3) {
          case "compositionstart":
            var ba = "onCompositionStart";
            break b;
          case "compositionend":
            ba = "onCompositionEnd";
            break b;
          case "compositionupdate":
            ba = "onCompositionUpdate";
            break b;
        }
        ba = void 0;
      }
      else ie ? ge$1(a3, c2) && (ba = "onCompositionEnd") : "keydown" === a3 && 229 === c2.keyCode && (ba = "onCompositionStart");
      ba && (de$1 && "ko" !== c2.locale && (ie || "onCompositionStart" !== ba ? "onCompositionEnd" === ba && ie && ($a = nd()) : (kd = e3, ld = "value" in kd ? kd.value : kd.textContent, ie = true)), xa = oe$1(d3, ba), 0 < xa.length && (ba = new Ld(ba, a3, null, c2, e3), g3.push({ event: ba, listeners: xa }), $a ? ba.data = $a : ($a = he(c2), null !== $a && (ba.data = $a))));
      if ($a = ce ? je$1(a3, c2) : ke(a3, c2)) d3 = oe$1(d3, "onBeforeInput"), 0 < d3.length && (e3 = new Ld("onBeforeInput", "beforeinput", null, c2, e3), g3.push({ event: e3, listeners: d3 }), e3.data = $a);
    }
    se(g3, b2);
  });
}
function tf(a3, b2, c2) {
  return { instance: a3, listener: b2, currentTarget: c2 };
}
function oe$1(a3, b2) {
  for (var c2 = b2 + "Capture", d2 = []; null !== a3; ) {
    var e2 = a3, f2 = e2.stateNode;
    5 === e2.tag && null !== f2 && (e2 = f2, f2 = Kb(a3, c2), null != f2 && d2.unshift(tf(a3, f2, e2)), f2 = Kb(a3, b2), null != f2 && d2.push(tf(a3, f2, e2)));
    a3 = a3.return;
  }
  return d2;
}
function vf(a3) {
  if (null === a3) return null;
  do
    a3 = a3.return;
  while (a3 && 5 !== a3.tag);
  return a3 ? a3 : null;
}
function wf(a3, b2, c2, d2, e2) {
  for (var f2 = b2._reactName, g2 = []; null !== c2 && c2 !== d2; ) {
    var h2 = c2, k2 = h2.alternate, l2 = h2.stateNode;
    if (null !== k2 && k2 === d2) break;
    5 === h2.tag && null !== l2 && (h2 = l2, e2 ? (k2 = Kb(c2, f2), null != k2 && g2.unshift(tf(c2, k2, h2))) : e2 || (k2 = Kb(c2, f2), null != k2 && g2.push(tf(c2, k2, h2))));
    c2 = c2.return;
  }
  0 !== g2.length && a3.push({ event: b2, listeners: g2 });
}
var xf = /\r\n?/g, yf = /\u0000|\uFFFD/g;
function zf(a3) {
  return ("string" === typeof a3 ? a3 : "" + a3).replace(xf, "\n").replace(yf, "");
}
function Af(a3, b2, c2) {
  b2 = zf(b2);
  if (zf(a3) !== b2 && c2) throw Error(p$4(425));
}
function Bf() {
}
var Cf = null, Df = null;
function Ef(a3, b2) {
  return "textarea" === a3 || "noscript" === a3 || "string" === typeof b2.children || "number" === typeof b2.children || "object" === typeof b2.dangerouslySetInnerHTML && null !== b2.dangerouslySetInnerHTML && null != b2.dangerouslySetInnerHTML.__html;
}
var Ff = "function" === typeof setTimeout ? setTimeout : void 0, Gf = "function" === typeof clearTimeout ? clearTimeout : void 0, Hf = "function" === typeof Promise ? Promise : void 0, Jf = "function" === typeof queueMicrotask ? queueMicrotask : "undefined" !== typeof Hf ? function(a3) {
  return Hf.resolve(null).then(a3).catch(If);
} : Ff;
function If(a3) {
  setTimeout(function() {
    throw a3;
  });
}
function Kf(a3, b2) {
  var c2 = b2, d2 = 0;
  do {
    var e2 = c2.nextSibling;
    a3.removeChild(c2);
    if (e2 && 8 === e2.nodeType) if (c2 = e2.data, "/$" === c2) {
      if (0 === d2) {
        a3.removeChild(e2);
        bd(b2);
        return;
      }
      d2--;
    } else "$" !== c2 && "$?" !== c2 && "$!" !== c2 || d2++;
    c2 = e2;
  } while (c2);
  bd(b2);
}
function Lf(a3) {
  for (; null != a3; a3 = a3.nextSibling) {
    var b2 = a3.nodeType;
    if (1 === b2 || 3 === b2) break;
    if (8 === b2) {
      b2 = a3.data;
      if ("$" === b2 || "$!" === b2 || "$?" === b2) break;
      if ("/$" === b2) return null;
    }
  }
  return a3;
}
function Mf(a3) {
  a3 = a3.previousSibling;
  for (var b2 = 0; a3; ) {
    if (8 === a3.nodeType) {
      var c2 = a3.data;
      if ("$" === c2 || "$!" === c2 || "$?" === c2) {
        if (0 === b2) return a3;
        b2--;
      } else "/$" === c2 && b2++;
    }
    a3 = a3.previousSibling;
  }
  return null;
}
var Nf = Math.random().toString(36).slice(2), Of = "__reactFiber$" + Nf, Pf = "__reactProps$" + Nf, uf = "__reactContainer$" + Nf, of = "__reactEvents$" + Nf, Qf = "__reactListeners$" + Nf, Rf = "__reactHandles$" + Nf;
function Wc(a3) {
  var b2 = a3[Of];
  if (b2) return b2;
  for (var c2 = a3.parentNode; c2; ) {
    if (b2 = c2[uf] || c2[Of]) {
      c2 = b2.alternate;
      if (null !== b2.child || null !== c2 && null !== c2.child) for (a3 = Mf(a3); null !== a3; ) {
        if (c2 = a3[Of]) return c2;
        a3 = Mf(a3);
      }
      return b2;
    }
    a3 = c2;
    c2 = a3.parentNode;
  }
  return null;
}
function Cb(a3) {
  a3 = a3[Of] || a3[uf];
  return !a3 || 5 !== a3.tag && 6 !== a3.tag && 13 !== a3.tag && 3 !== a3.tag ? null : a3;
}
function ue$1(a3) {
  if (5 === a3.tag || 6 === a3.tag) return a3.stateNode;
  throw Error(p$4(33));
}
function Db(a3) {
  return a3[Pf] || null;
}
var Sf = [], Tf = -1;
function Uf(a3) {
  return { current: a3 };
}
function E$2(a3) {
  0 > Tf || (a3.current = Sf[Tf], Sf[Tf] = null, Tf--);
}
function G$2(a3, b2) {
  Tf++;
  Sf[Tf] = a3.current;
  a3.current = b2;
}
var Vf = {}, H$3 = Uf(Vf), Wf = Uf(false), Xf = Vf;
function Yf(a3, b2) {
  var c2 = a3.type.contextTypes;
  if (!c2) return Vf;
  var d2 = a3.stateNode;
  if (d2 && d2.__reactInternalMemoizedUnmaskedChildContext === b2) return d2.__reactInternalMemoizedMaskedChildContext;
  var e2 = {}, f2;
  for (f2 in c2) e2[f2] = b2[f2];
  d2 && (a3 = a3.stateNode, a3.__reactInternalMemoizedUnmaskedChildContext = b2, a3.__reactInternalMemoizedMaskedChildContext = e2);
  return e2;
}
function Zf(a3) {
  a3 = a3.childContextTypes;
  return null !== a3 && void 0 !== a3;
}
function $f() {
  E$2(Wf);
  E$2(H$3);
}
function ag(a3, b2, c2) {
  if (H$3.current !== Vf) throw Error(p$4(168));
  G$2(H$3, b2);
  G$2(Wf, c2);
}
function bg(a3, b2, c2) {
  var d2 = a3.stateNode;
  b2 = b2.childContextTypes;
  if ("function" !== typeof d2.getChildContext) return c2;
  d2 = d2.getChildContext();
  for (var e2 in d2) if (!(e2 in b2)) throw Error(p$4(108, Ra(a3) || "Unknown", e2));
  return A$3({}, c2, d2);
}
function cg(a3) {
  a3 = (a3 = a3.stateNode) && a3.__reactInternalMemoizedMergedChildContext || Vf;
  Xf = H$3.current;
  G$2(H$3, a3);
  G$2(Wf, Wf.current);
  return true;
}
function dg(a3, b2, c2) {
  var d2 = a3.stateNode;
  if (!d2) throw Error(p$4(169));
  c2 ? (a3 = bg(a3, b2, Xf), d2.__reactInternalMemoizedMergedChildContext = a3, E$2(Wf), E$2(H$3), G$2(H$3, a3)) : E$2(Wf);
  G$2(Wf, c2);
}
var eg = null, fg = false, gg = false;
function hg(a3) {
  null === eg ? eg = [a3] : eg.push(a3);
}
function ig(a3) {
  fg = true;
  hg(a3);
}
function jg() {
  if (!gg && null !== eg) {
    gg = true;
    var a3 = 0, b2 = C$5;
    try {
      var c2 = eg;
      for (C$5 = 1; a3 < c2.length; a3++) {
        var d2 = c2[a3];
        do
          d2 = d2(true);
        while (null !== d2);
      }
      eg = null;
      fg = false;
    } catch (e2) {
      throw null !== eg && (eg = eg.slice(a3 + 1)), ac(fc, jg), e2;
    } finally {
      C$5 = b2, gg = false;
    }
  }
  return null;
}
var kg = [], lg = 0, mg = null, ng = 0, og = [], pg = 0, qg = null, rg = 1, sg = "";
function tg(a3, b2) {
  kg[lg++] = ng;
  kg[lg++] = mg;
  mg = a3;
  ng = b2;
}
function ug(a3, b2, c2) {
  og[pg++] = rg;
  og[pg++] = sg;
  og[pg++] = qg;
  qg = a3;
  var d2 = rg;
  a3 = sg;
  var e2 = 32 - oc(d2) - 1;
  d2 &= ~(1 << e2);
  c2 += 1;
  var f2 = 32 - oc(b2) + e2;
  if (30 < f2) {
    var g2 = e2 - e2 % 5;
    f2 = (d2 & (1 << g2) - 1).toString(32);
    d2 >>= g2;
    e2 -= g2;
    rg = 1 << 32 - oc(b2) + e2 | c2 << e2 | d2;
    sg = f2 + a3;
  } else rg = 1 << f2 | c2 << e2 | d2, sg = a3;
}
function vg(a3) {
  null !== a3.return && (tg(a3, 1), ug(a3, 1, 0));
}
function wg(a3) {
  for (; a3 === mg; ) mg = kg[--lg], kg[lg] = null, ng = kg[--lg], kg[lg] = null;
  for (; a3 === qg; ) qg = og[--pg], og[pg] = null, sg = og[--pg], og[pg] = null, rg = og[--pg], og[pg] = null;
}
var xg = null, yg = null, I$6 = false, zg = null;
function Ag(a3, b2) {
  var c2 = Bg(5, null, null, 0);
  c2.elementType = "DELETED";
  c2.stateNode = b2;
  c2.return = a3;
  b2 = a3.deletions;
  null === b2 ? (a3.deletions = [c2], a3.flags |= 16) : b2.push(c2);
}
function Cg(a3, b2) {
  switch (a3.tag) {
    case 5:
      var c2 = a3.type;
      b2 = 1 !== b2.nodeType || c2.toLowerCase() !== b2.nodeName.toLowerCase() ? null : b2;
      return null !== b2 ? (a3.stateNode = b2, xg = a3, yg = Lf(b2.firstChild), true) : false;
    case 6:
      return b2 = "" === a3.pendingProps || 3 !== b2.nodeType ? null : b2, null !== b2 ? (a3.stateNode = b2, xg = a3, yg = null, true) : false;
    case 13:
      return b2 = 8 !== b2.nodeType ? null : b2, null !== b2 ? (c2 = null !== qg ? { id: rg, overflow: sg } : null, a3.memoizedState = { dehydrated: b2, treeContext: c2, retryLane: 1073741824 }, c2 = Bg(18, null, null, 0), c2.stateNode = b2, c2.return = a3, a3.child = c2, xg = a3, yg = null, true) : false;
    default:
      return false;
  }
}
function Dg(a3) {
  return 0 !== (a3.mode & 1) && 0 === (a3.flags & 128);
}
function Eg(a3) {
  if (I$6) {
    var b2 = yg;
    if (b2) {
      var c2 = b2;
      if (!Cg(a3, b2)) {
        if (Dg(a3)) throw Error(p$4(418));
        b2 = Lf(c2.nextSibling);
        var d2 = xg;
        b2 && Cg(a3, b2) ? Ag(d2, c2) : (a3.flags = a3.flags & -4097 | 2, I$6 = false, xg = a3);
      }
    } else {
      if (Dg(a3)) throw Error(p$4(418));
      a3.flags = a3.flags & -4097 | 2;
      I$6 = false;
      xg = a3;
    }
  }
}
function Fg(a3) {
  for (a3 = a3.return; null !== a3 && 5 !== a3.tag && 3 !== a3.tag && 13 !== a3.tag; ) a3 = a3.return;
  xg = a3;
}
function Gg(a3) {
  if (a3 !== xg) return false;
  if (!I$6) return Fg(a3), I$6 = true, false;
  var b2;
  (b2 = 3 !== a3.tag) && !(b2 = 5 !== a3.tag) && (b2 = a3.type, b2 = "head" !== b2 && "body" !== b2 && !Ef(a3.type, a3.memoizedProps));
  if (b2 && (b2 = yg)) {
    if (Dg(a3)) throw Hg(), Error(p$4(418));
    for (; b2; ) Ag(a3, b2), b2 = Lf(b2.nextSibling);
  }
  Fg(a3);
  if (13 === a3.tag) {
    a3 = a3.memoizedState;
    a3 = null !== a3 ? a3.dehydrated : null;
    if (!a3) throw Error(p$4(317));
    a: {
      a3 = a3.nextSibling;
      for (b2 = 0; a3; ) {
        if (8 === a3.nodeType) {
          var c2 = a3.data;
          if ("/$" === c2) {
            if (0 === b2) {
              yg = Lf(a3.nextSibling);
              break a;
            }
            b2--;
          } else "$" !== c2 && "$!" !== c2 && "$?" !== c2 || b2++;
        }
        a3 = a3.nextSibling;
      }
      yg = null;
    }
  } else yg = xg ? Lf(a3.stateNode.nextSibling) : null;
  return true;
}
function Hg() {
  for (var a3 = yg; a3; ) a3 = Lf(a3.nextSibling);
}
function Ig() {
  yg = xg = null;
  I$6 = false;
}
function Jg(a3) {
  null === zg ? zg = [a3] : zg.push(a3);
}
var Kg = ua.ReactCurrentBatchConfig;
function Lg(a3, b2, c2) {
  a3 = c2.ref;
  if (null !== a3 && "function" !== typeof a3 && "object" !== typeof a3) {
    if (c2._owner) {
      c2 = c2._owner;
      if (c2) {
        if (1 !== c2.tag) throw Error(p$4(309));
        var d2 = c2.stateNode;
      }
      if (!d2) throw Error(p$4(147, a3));
      var e2 = d2, f2 = "" + a3;
      if (null !== b2 && null !== b2.ref && "function" === typeof b2.ref && b2.ref._stringRef === f2) return b2.ref;
      b2 = function(a4) {
        var b3 = e2.refs;
        null === a4 ? delete b3[f2] : b3[f2] = a4;
      };
      b2._stringRef = f2;
      return b2;
    }
    if ("string" !== typeof a3) throw Error(p$4(284));
    if (!c2._owner) throw Error(p$4(290, a3));
  }
  return a3;
}
function Mg(a3, b2) {
  a3 = Object.prototype.toString.call(b2);
  throw Error(p$4(31, "[object Object]" === a3 ? "object with keys {" + Object.keys(b2).join(", ") + "}" : a3));
}
function Ng(a3) {
  var b2 = a3._init;
  return b2(a3._payload);
}
function Og(a3) {
  function b2(b3, c3) {
    if (a3) {
      var d3 = b3.deletions;
      null === d3 ? (b3.deletions = [c3], b3.flags |= 16) : d3.push(c3);
    }
  }
  function c2(c3, d3) {
    if (!a3) return null;
    for (; null !== d3; ) b2(c3, d3), d3 = d3.sibling;
    return null;
  }
  function d2(a4, b3) {
    for (a4 = /* @__PURE__ */ new Map(); null !== b3; ) null !== b3.key ? a4.set(b3.key, b3) : a4.set(b3.index, b3), b3 = b3.sibling;
    return a4;
  }
  function e2(a4, b3) {
    a4 = Pg(a4, b3);
    a4.index = 0;
    a4.sibling = null;
    return a4;
  }
  function f2(b3, c3, d3) {
    b3.index = d3;
    if (!a3) return b3.flags |= 1048576, c3;
    d3 = b3.alternate;
    if (null !== d3) return d3 = d3.index, d3 < c3 ? (b3.flags |= 2, c3) : d3;
    b3.flags |= 2;
    return c3;
  }
  function g2(b3) {
    a3 && null === b3.alternate && (b3.flags |= 2);
    return b3;
  }
  function h2(a4, b3, c3, d3) {
    if (null === b3 || 6 !== b3.tag) return b3 = Qg(c3, a4.mode, d3), b3.return = a4, b3;
    b3 = e2(b3, c3);
    b3.return = a4;
    return b3;
  }
  function k2(a4, b3, c3, d3) {
    var f3 = c3.type;
    if (f3 === ya) return m2(a4, b3, c3.props.children, d3, c3.key);
    if (null !== b3 && (b3.elementType === f3 || "object" === typeof f3 && null !== f3 && f3.$$typeof === Ha && Ng(f3) === b3.type)) return d3 = e2(b3, c3.props), d3.ref = Lg(a4, b3, c3), d3.return = a4, d3;
    d3 = Rg(c3.type, c3.key, c3.props, null, a4.mode, d3);
    d3.ref = Lg(a4, b3, c3);
    d3.return = a4;
    return d3;
  }
  function l2(a4, b3, c3, d3) {
    if (null === b3 || 4 !== b3.tag || b3.stateNode.containerInfo !== c3.containerInfo || b3.stateNode.implementation !== c3.implementation) return b3 = Sg(c3, a4.mode, d3), b3.return = a4, b3;
    b3 = e2(b3, c3.children || []);
    b3.return = a4;
    return b3;
  }
  function m2(a4, b3, c3, d3, f3) {
    if (null === b3 || 7 !== b3.tag) return b3 = Tg(c3, a4.mode, d3, f3), b3.return = a4, b3;
    b3 = e2(b3, c3);
    b3.return = a4;
    return b3;
  }
  function q2(a4, b3, c3) {
    if ("string" === typeof b3 && "" !== b3 || "number" === typeof b3) return b3 = Qg("" + b3, a4.mode, c3), b3.return = a4, b3;
    if ("object" === typeof b3 && null !== b3) {
      switch (b3.$$typeof) {
        case va:
          return c3 = Rg(b3.type, b3.key, b3.props, null, a4.mode, c3), c3.ref = Lg(a4, null, b3), c3.return = a4, c3;
        case wa:
          return b3 = Sg(b3, a4.mode, c3), b3.return = a4, b3;
        case Ha:
          var d3 = b3._init;
          return q2(a4, d3(b3._payload), c3);
      }
      if (eb(b3) || Ka(b3)) return b3 = Tg(b3, a4.mode, c3, null), b3.return = a4, b3;
      Mg(a4, b3);
    }
    return null;
  }
  function r2(a4, b3, c3, d3) {
    var e3 = null !== b3 ? b3.key : null;
    if ("string" === typeof c3 && "" !== c3 || "number" === typeof c3) return null !== e3 ? null : h2(a4, b3, "" + c3, d3);
    if ("object" === typeof c3 && null !== c3) {
      switch (c3.$$typeof) {
        case va:
          return c3.key === e3 ? k2(a4, b3, c3, d3) : null;
        case wa:
          return c3.key === e3 ? l2(a4, b3, c3, d3) : null;
        case Ha:
          return e3 = c3._init, r2(
            a4,
            b3,
            e3(c3._payload),
            d3
          );
      }
      if (eb(c3) || Ka(c3)) return null !== e3 ? null : m2(a4, b3, c3, d3, null);
      Mg(a4, c3);
    }
    return null;
  }
  function y2(a4, b3, c3, d3, e3) {
    if ("string" === typeof d3 && "" !== d3 || "number" === typeof d3) return a4 = a4.get(c3) || null, h2(b3, a4, "" + d3, e3);
    if ("object" === typeof d3 && null !== d3) {
      switch (d3.$$typeof) {
        case va:
          return a4 = a4.get(null === d3.key ? c3 : d3.key) || null, k2(b3, a4, d3, e3);
        case wa:
          return a4 = a4.get(null === d3.key ? c3 : d3.key) || null, l2(b3, a4, d3, e3);
        case Ha:
          var f3 = d3._init;
          return y2(a4, b3, c3, f3(d3._payload), e3);
      }
      if (eb(d3) || Ka(d3)) return a4 = a4.get(c3) || null, m2(b3, a4, d3, e3, null);
      Mg(b3, d3);
    }
    return null;
  }
  function n2(e3, g3, h3, k3) {
    for (var l3 = null, m3 = null, u2 = g3, w2 = g3 = 0, x2 = null; null !== u2 && w2 < h3.length; w2++) {
      u2.index > w2 ? (x2 = u2, u2 = null) : x2 = u2.sibling;
      var n3 = r2(e3, u2, h3[w2], k3);
      if (null === n3) {
        null === u2 && (u2 = x2);
        break;
      }
      a3 && u2 && null === n3.alternate && b2(e3, u2);
      g3 = f2(n3, g3, w2);
      null === m3 ? l3 = n3 : m3.sibling = n3;
      m3 = n3;
      u2 = x2;
    }
    if (w2 === h3.length) return c2(e3, u2), I$6 && tg(e3, w2), l3;
    if (null === u2) {
      for (; w2 < h3.length; w2++) u2 = q2(e3, h3[w2], k3), null !== u2 && (g3 = f2(u2, g3, w2), null === m3 ? l3 = u2 : m3.sibling = u2, m3 = u2);
      I$6 && tg(e3, w2);
      return l3;
    }
    for (u2 = d2(e3, u2); w2 < h3.length; w2++) x2 = y2(u2, e3, w2, h3[w2], k3), null !== x2 && (a3 && null !== x2.alternate && u2.delete(null === x2.key ? w2 : x2.key), g3 = f2(x2, g3, w2), null === m3 ? l3 = x2 : m3.sibling = x2, m3 = x2);
    a3 && u2.forEach(function(a4) {
      return b2(e3, a4);
    });
    I$6 && tg(e3, w2);
    return l3;
  }
  function t2(e3, g3, h3, k3) {
    var l3 = Ka(h3);
    if ("function" !== typeof l3) throw Error(p$4(150));
    h3 = l3.call(h3);
    if (null == h3) throw Error(p$4(151));
    for (var u2 = l3 = null, m3 = g3, w2 = g3 = 0, x2 = null, n3 = h3.next(); null !== m3 && !n3.done; w2++, n3 = h3.next()) {
      m3.index > w2 ? (x2 = m3, m3 = null) : x2 = m3.sibling;
      var t3 = r2(e3, m3, n3.value, k3);
      if (null === t3) {
        null === m3 && (m3 = x2);
        break;
      }
      a3 && m3 && null === t3.alternate && b2(e3, m3);
      g3 = f2(t3, g3, w2);
      null === u2 ? l3 = t3 : u2.sibling = t3;
      u2 = t3;
      m3 = x2;
    }
    if (n3.done) return c2(
      e3,
      m3
    ), I$6 && tg(e3, w2), l3;
    if (null === m3) {
      for (; !n3.done; w2++, n3 = h3.next()) n3 = q2(e3, n3.value, k3), null !== n3 && (g3 = f2(n3, g3, w2), null === u2 ? l3 = n3 : u2.sibling = n3, u2 = n3);
      I$6 && tg(e3, w2);
      return l3;
    }
    for (m3 = d2(e3, m3); !n3.done; w2++, n3 = h3.next()) n3 = y2(m3, e3, w2, n3.value, k3), null !== n3 && (a3 && null !== n3.alternate && m3.delete(null === n3.key ? w2 : n3.key), g3 = f2(n3, g3, w2), null === u2 ? l3 = n3 : u2.sibling = n3, u2 = n3);
    a3 && m3.forEach(function(a4) {
      return b2(e3, a4);
    });
    I$6 && tg(e3, w2);
    return l3;
  }
  function J2(a4, d3, f3, h3) {
    "object" === typeof f3 && null !== f3 && f3.type === ya && null === f3.key && (f3 = f3.props.children);
    if ("object" === typeof f3 && null !== f3) {
      switch (f3.$$typeof) {
        case va:
          a: {
            for (var k3 = f3.key, l3 = d3; null !== l3; ) {
              if (l3.key === k3) {
                k3 = f3.type;
                if (k3 === ya) {
                  if (7 === l3.tag) {
                    c2(a4, l3.sibling);
                    d3 = e2(l3, f3.props.children);
                    d3.return = a4;
                    a4 = d3;
                    break a;
                  }
                } else if (l3.elementType === k3 || "object" === typeof k3 && null !== k3 && k3.$$typeof === Ha && Ng(k3) === l3.type) {
                  c2(a4, l3.sibling);
                  d3 = e2(l3, f3.props);
                  d3.ref = Lg(a4, l3, f3);
                  d3.return = a4;
                  a4 = d3;
                  break a;
                }
                c2(a4, l3);
                break;
              } else b2(a4, l3);
              l3 = l3.sibling;
            }
            f3.type === ya ? (d3 = Tg(f3.props.children, a4.mode, h3, f3.key), d3.return = a4, a4 = d3) : (h3 = Rg(f3.type, f3.key, f3.props, null, a4.mode, h3), h3.ref = Lg(a4, d3, f3), h3.return = a4, a4 = h3);
          }
          return g2(a4);
        case wa:
          a: {
            for (l3 = f3.key; null !== d3; ) {
              if (d3.key === l3) if (4 === d3.tag && d3.stateNode.containerInfo === f3.containerInfo && d3.stateNode.implementation === f3.implementation) {
                c2(a4, d3.sibling);
                d3 = e2(d3, f3.children || []);
                d3.return = a4;
                a4 = d3;
                break a;
              } else {
                c2(a4, d3);
                break;
              }
              else b2(a4, d3);
              d3 = d3.sibling;
            }
            d3 = Sg(f3, a4.mode, h3);
            d3.return = a4;
            a4 = d3;
          }
          return g2(a4);
        case Ha:
          return l3 = f3._init, J2(a4, d3, l3(f3._payload), h3);
      }
      if (eb(f3)) return n2(a4, d3, f3, h3);
      if (Ka(f3)) return t2(a4, d3, f3, h3);
      Mg(a4, f3);
    }
    return "string" === typeof f3 && "" !== f3 || "number" === typeof f3 ? (f3 = "" + f3, null !== d3 && 6 === d3.tag ? (c2(a4, d3.sibling), d3 = e2(d3, f3), d3.return = a4, a4 = d3) : (c2(a4, d3), d3 = Qg(f3, a4.mode, h3), d3.return = a4, a4 = d3), g2(a4)) : c2(a4, d3);
  }
  return J2;
}
var Ug = Og(true), Vg = Og(false), Wg = Uf(null), Xg = null, Yg = null, Zg = null;
function $g() {
  Zg = Yg = Xg = null;
}
function ah(a3) {
  var b2 = Wg.current;
  E$2(Wg);
  a3._currentValue = b2;
}
function bh(a3, b2, c2) {
  for (; null !== a3; ) {
    var d2 = a3.alternate;
    (a3.childLanes & b2) !== b2 ? (a3.childLanes |= b2, null !== d2 && (d2.childLanes |= b2)) : null !== d2 && (d2.childLanes & b2) !== b2 && (d2.childLanes |= b2);
    if (a3 === c2) break;
    a3 = a3.return;
  }
}
function ch(a3, b2) {
  Xg = a3;
  Zg = Yg = null;
  a3 = a3.dependencies;
  null !== a3 && null !== a3.firstContext && (0 !== (a3.lanes & b2) && (dh = true), a3.firstContext = null);
}
function eh(a3) {
  var b2 = a3._currentValue;
  if (Zg !== a3) if (a3 = { context: a3, memoizedValue: b2, next: null }, null === Yg) {
    if (null === Xg) throw Error(p$4(308));
    Yg = a3;
    Xg.dependencies = { lanes: 0, firstContext: a3 };
  } else Yg = Yg.next = a3;
  return b2;
}
var fh = null;
function gh(a3) {
  null === fh ? fh = [a3] : fh.push(a3);
}
function hh(a3, b2, c2, d2) {
  var e2 = b2.interleaved;
  null === e2 ? (c2.next = c2, gh(b2)) : (c2.next = e2.next, e2.next = c2);
  b2.interleaved = c2;
  return ih(a3, d2);
}
function ih(a3, b2) {
  a3.lanes |= b2;
  var c2 = a3.alternate;
  null !== c2 && (c2.lanes |= b2);
  c2 = a3;
  for (a3 = a3.return; null !== a3; ) a3.childLanes |= b2, c2 = a3.alternate, null !== c2 && (c2.childLanes |= b2), c2 = a3, a3 = a3.return;
  return 3 === c2.tag ? c2.stateNode : null;
}
var jh = false;
function kh(a3) {
  a3.updateQueue = { baseState: a3.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
}
function lh(a3, b2) {
  a3 = a3.updateQueue;
  b2.updateQueue === a3 && (b2.updateQueue = { baseState: a3.baseState, firstBaseUpdate: a3.firstBaseUpdate, lastBaseUpdate: a3.lastBaseUpdate, shared: a3.shared, effects: a3.effects });
}
function mh(a3, b2) {
  return { eventTime: a3, lane: b2, tag: 0, payload: null, callback: null, next: null };
}
function nh(a3, b2, c2) {
  var d2 = a3.updateQueue;
  if (null === d2) return null;
  d2 = d2.shared;
  if (0 !== (K$1 & 2)) {
    var e2 = d2.pending;
    null === e2 ? b2.next = b2 : (b2.next = e2.next, e2.next = b2);
    d2.pending = b2;
    return ih(a3, c2);
  }
  e2 = d2.interleaved;
  null === e2 ? (b2.next = b2, gh(d2)) : (b2.next = e2.next, e2.next = b2);
  d2.interleaved = b2;
  return ih(a3, c2);
}
function oh(a3, b2, c2) {
  b2 = b2.updateQueue;
  if (null !== b2 && (b2 = b2.shared, 0 !== (c2 & 4194240))) {
    var d2 = b2.lanes;
    d2 &= a3.pendingLanes;
    c2 |= d2;
    b2.lanes = c2;
    Cc(a3, c2);
  }
}
function ph(a3, b2) {
  var c2 = a3.updateQueue, d2 = a3.alternate;
  if (null !== d2 && (d2 = d2.updateQueue, c2 === d2)) {
    var e2 = null, f2 = null;
    c2 = c2.firstBaseUpdate;
    if (null !== c2) {
      do {
        var g2 = { eventTime: c2.eventTime, lane: c2.lane, tag: c2.tag, payload: c2.payload, callback: c2.callback, next: null };
        null === f2 ? e2 = f2 = g2 : f2 = f2.next = g2;
        c2 = c2.next;
      } while (null !== c2);
      null === f2 ? e2 = f2 = b2 : f2 = f2.next = b2;
    } else e2 = f2 = b2;
    c2 = { baseState: d2.baseState, firstBaseUpdate: e2, lastBaseUpdate: f2, shared: d2.shared, effects: d2.effects };
    a3.updateQueue = c2;
    return;
  }
  a3 = c2.lastBaseUpdate;
  null === a3 ? c2.firstBaseUpdate = b2 : a3.next = b2;
  c2.lastBaseUpdate = b2;
}
function qh(a3, b2, c2, d2) {
  var e2 = a3.updateQueue;
  jh = false;
  var f2 = e2.firstBaseUpdate, g2 = e2.lastBaseUpdate, h2 = e2.shared.pending;
  if (null !== h2) {
    e2.shared.pending = null;
    var k2 = h2, l2 = k2.next;
    k2.next = null;
    null === g2 ? f2 = l2 : g2.next = l2;
    g2 = k2;
    var m2 = a3.alternate;
    null !== m2 && (m2 = m2.updateQueue, h2 = m2.lastBaseUpdate, h2 !== g2 && (null === h2 ? m2.firstBaseUpdate = l2 : h2.next = l2, m2.lastBaseUpdate = k2));
  }
  if (null !== f2) {
    var q2 = e2.baseState;
    g2 = 0;
    m2 = l2 = k2 = null;
    h2 = f2;
    do {
      var r2 = h2.lane, y2 = h2.eventTime;
      if ((d2 & r2) === r2) {
        null !== m2 && (m2 = m2.next = {
          eventTime: y2,
          lane: 0,
          tag: h2.tag,
          payload: h2.payload,
          callback: h2.callback,
          next: null
        });
        a: {
          var n2 = a3, t2 = h2;
          r2 = b2;
          y2 = c2;
          switch (t2.tag) {
            case 1:
              n2 = t2.payload;
              if ("function" === typeof n2) {
                q2 = n2.call(y2, q2, r2);
                break a;
              }
              q2 = n2;
              break a;
            case 3:
              n2.flags = n2.flags & -65537 | 128;
            case 0:
              n2 = t2.payload;
              r2 = "function" === typeof n2 ? n2.call(y2, q2, r2) : n2;
              if (null === r2 || void 0 === r2) break a;
              q2 = A$3({}, q2, r2);
              break a;
            case 2:
              jh = true;
          }
        }
        null !== h2.callback && 0 !== h2.lane && (a3.flags |= 64, r2 = e2.effects, null === r2 ? e2.effects = [h2] : r2.push(h2));
      } else y2 = { eventTime: y2, lane: r2, tag: h2.tag, payload: h2.payload, callback: h2.callback, next: null }, null === m2 ? (l2 = m2 = y2, k2 = q2) : m2 = m2.next = y2, g2 |= r2;
      h2 = h2.next;
      if (null === h2) if (h2 = e2.shared.pending, null === h2) break;
      else r2 = h2, h2 = r2.next, r2.next = null, e2.lastBaseUpdate = r2, e2.shared.pending = null;
    } while (1);
    null === m2 && (k2 = q2);
    e2.baseState = k2;
    e2.firstBaseUpdate = l2;
    e2.lastBaseUpdate = m2;
    b2 = e2.shared.interleaved;
    if (null !== b2) {
      e2 = b2;
      do
        g2 |= e2.lane, e2 = e2.next;
      while (e2 !== b2);
    } else null === f2 && (e2.shared.lanes = 0);
    rh |= g2;
    a3.lanes = g2;
    a3.memoizedState = q2;
  }
}
function sh(a3, b2, c2) {
  a3 = b2.effects;
  b2.effects = null;
  if (null !== a3) for (b2 = 0; b2 < a3.length; b2++) {
    var d2 = a3[b2], e2 = d2.callback;
    if (null !== e2) {
      d2.callback = null;
      d2 = c2;
      if ("function" !== typeof e2) throw Error(p$4(191, e2));
      e2.call(d2);
    }
  }
}
var th = {}, uh = Uf(th), vh = Uf(th), wh = Uf(th);
function xh(a3) {
  if (a3 === th) throw Error(p$4(174));
  return a3;
}
function yh(a3, b2) {
  G$2(wh, b2);
  G$2(vh, a3);
  G$2(uh, th);
  a3 = b2.nodeType;
  switch (a3) {
    case 9:
    case 11:
      b2 = (b2 = b2.documentElement) ? b2.namespaceURI : lb(null, "");
      break;
    default:
      a3 = 8 === a3 ? b2.parentNode : b2, b2 = a3.namespaceURI || null, a3 = a3.tagName, b2 = lb(b2, a3);
  }
  E$2(uh);
  G$2(uh, b2);
}
function zh() {
  E$2(uh);
  E$2(vh);
  E$2(wh);
}
function Ah(a3) {
  xh(wh.current);
  var b2 = xh(uh.current);
  var c2 = lb(b2, a3.type);
  b2 !== c2 && (G$2(vh, a3), G$2(uh, c2));
}
function Bh(a3) {
  vh.current === a3 && (E$2(uh), E$2(vh));
}
var L = Uf(0);
function Ch(a3) {
  for (var b2 = a3; null !== b2; ) {
    if (13 === b2.tag) {
      var c2 = b2.memoizedState;
      if (null !== c2 && (c2 = c2.dehydrated, null === c2 || "$?" === c2.data || "$!" === c2.data)) return b2;
    } else if (19 === b2.tag && void 0 !== b2.memoizedProps.revealOrder) {
      if (0 !== (b2.flags & 128)) return b2;
    } else if (null !== b2.child) {
      b2.child.return = b2;
      b2 = b2.child;
      continue;
    }
    if (b2 === a3) break;
    for (; null === b2.sibling; ) {
      if (null === b2.return || b2.return === a3) return null;
      b2 = b2.return;
    }
    b2.sibling.return = b2.return;
    b2 = b2.sibling;
  }
  return null;
}
var Dh = [];
function Eh() {
  for (var a3 = 0; a3 < Dh.length; a3++) Dh[a3]._workInProgressVersionPrimary = null;
  Dh.length = 0;
}
var Fh = ua.ReactCurrentDispatcher, Gh = ua.ReactCurrentBatchConfig, Hh = 0, M$3 = null, N$1 = null, O$2 = null, Ih = false, Jh = false, Kh = 0, Lh = 0;
function P$2() {
  throw Error(p$4(321));
}
function Mh(a3, b2) {
  if (null === b2) return false;
  for (var c2 = 0; c2 < b2.length && c2 < a3.length; c2++) if (!He$2(a3[c2], b2[c2])) return false;
  return true;
}
function Nh(a3, b2, c2, d2, e2, f2) {
  Hh = f2;
  M$3 = b2;
  b2.memoizedState = null;
  b2.updateQueue = null;
  b2.lanes = 0;
  Fh.current = null === a3 || null === a3.memoizedState ? Oh : Ph;
  a3 = c2(d2, e2);
  if (Jh) {
    f2 = 0;
    do {
      Jh = false;
      Kh = 0;
      if (25 <= f2) throw Error(p$4(301));
      f2 += 1;
      O$2 = N$1 = null;
      b2.updateQueue = null;
      Fh.current = Qh;
      a3 = c2(d2, e2);
    } while (Jh);
  }
  Fh.current = Rh;
  b2 = null !== N$1 && null !== N$1.next;
  Hh = 0;
  O$2 = N$1 = M$3 = null;
  Ih = false;
  if (b2) throw Error(p$4(300));
  return a3;
}
function Sh() {
  var a3 = 0 !== Kh;
  Kh = 0;
  return a3;
}
function Th() {
  var a3 = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
  null === O$2 ? M$3.memoizedState = O$2 = a3 : O$2 = O$2.next = a3;
  return O$2;
}
function Uh() {
  if (null === N$1) {
    var a3 = M$3.alternate;
    a3 = null !== a3 ? a3.memoizedState : null;
  } else a3 = N$1.next;
  var b2 = null === O$2 ? M$3.memoizedState : O$2.next;
  if (null !== b2) O$2 = b2, N$1 = a3;
  else {
    if (null === a3) throw Error(p$4(310));
    N$1 = a3;
    a3 = { memoizedState: N$1.memoizedState, baseState: N$1.baseState, baseQueue: N$1.baseQueue, queue: N$1.queue, next: null };
    null === O$2 ? M$3.memoizedState = O$2 = a3 : O$2 = O$2.next = a3;
  }
  return O$2;
}
function Vh(a3, b2) {
  return "function" === typeof b2 ? b2(a3) : b2;
}
function Wh(a3) {
  var b2 = Uh(), c2 = b2.queue;
  if (null === c2) throw Error(p$4(311));
  c2.lastRenderedReducer = a3;
  var d2 = N$1, e2 = d2.baseQueue, f2 = c2.pending;
  if (null !== f2) {
    if (null !== e2) {
      var g2 = e2.next;
      e2.next = f2.next;
      f2.next = g2;
    }
    d2.baseQueue = e2 = f2;
    c2.pending = null;
  }
  if (null !== e2) {
    f2 = e2.next;
    d2 = d2.baseState;
    var h2 = g2 = null, k2 = null, l2 = f2;
    do {
      var m2 = l2.lane;
      if ((Hh & m2) === m2) null !== k2 && (k2 = k2.next = { lane: 0, action: l2.action, hasEagerState: l2.hasEagerState, eagerState: l2.eagerState, next: null }), d2 = l2.hasEagerState ? l2.eagerState : a3(d2, l2.action);
      else {
        var q2 = {
          lane: m2,
          action: l2.action,
          hasEagerState: l2.hasEagerState,
          eagerState: l2.eagerState,
          next: null
        };
        null === k2 ? (h2 = k2 = q2, g2 = d2) : k2 = k2.next = q2;
        M$3.lanes |= m2;
        rh |= m2;
      }
      l2 = l2.next;
    } while (null !== l2 && l2 !== f2);
    null === k2 ? g2 = d2 : k2.next = h2;
    He$2(d2, b2.memoizedState) || (dh = true);
    b2.memoizedState = d2;
    b2.baseState = g2;
    b2.baseQueue = k2;
    c2.lastRenderedState = d2;
  }
  a3 = c2.interleaved;
  if (null !== a3) {
    e2 = a3;
    do
      f2 = e2.lane, M$3.lanes |= f2, rh |= f2, e2 = e2.next;
    while (e2 !== a3);
  } else null === e2 && (c2.lanes = 0);
  return [b2.memoizedState, c2.dispatch];
}
function Xh(a3) {
  var b2 = Uh(), c2 = b2.queue;
  if (null === c2) throw Error(p$4(311));
  c2.lastRenderedReducer = a3;
  var d2 = c2.dispatch, e2 = c2.pending, f2 = b2.memoizedState;
  if (null !== e2) {
    c2.pending = null;
    var g2 = e2 = e2.next;
    do
      f2 = a3(f2, g2.action), g2 = g2.next;
    while (g2 !== e2);
    He$2(f2, b2.memoizedState) || (dh = true);
    b2.memoizedState = f2;
    null === b2.baseQueue && (b2.baseState = f2);
    c2.lastRenderedState = f2;
  }
  return [f2, d2];
}
function Yh() {
}
function Zh(a3, b2) {
  var c2 = M$3, d2 = Uh(), e2 = b2(), f2 = !He$2(d2.memoizedState, e2);
  f2 && (d2.memoizedState = e2, dh = true);
  d2 = d2.queue;
  $h(ai.bind(null, c2, d2, a3), [a3]);
  if (d2.getSnapshot !== b2 || f2 || null !== O$2 && O$2.memoizedState.tag & 1) {
    c2.flags |= 2048;
    bi(9, ci.bind(null, c2, d2, e2, b2), void 0, null);
    if (null === Q) throw Error(p$4(349));
    0 !== (Hh & 30) || di(c2, b2, e2);
  }
  return e2;
}
function di(a3, b2, c2) {
  a3.flags |= 16384;
  a3 = { getSnapshot: b2, value: c2 };
  b2 = M$3.updateQueue;
  null === b2 ? (b2 = { lastEffect: null, stores: null }, M$3.updateQueue = b2, b2.stores = [a3]) : (c2 = b2.stores, null === c2 ? b2.stores = [a3] : c2.push(a3));
}
function ci(a3, b2, c2, d2) {
  b2.value = c2;
  b2.getSnapshot = d2;
  ei(b2) && fi(a3);
}
function ai(a3, b2, c2) {
  return c2(function() {
    ei(b2) && fi(a3);
  });
}
function ei(a3) {
  var b2 = a3.getSnapshot;
  a3 = a3.value;
  try {
    var c2 = b2();
    return !He$2(a3, c2);
  } catch (d2) {
    return true;
  }
}
function fi(a3) {
  var b2 = ih(a3, 1);
  null !== b2 && gi(b2, a3, 1, -1);
}
function hi(a3) {
  var b2 = Th();
  "function" === typeof a3 && (a3 = a3());
  b2.memoizedState = b2.baseState = a3;
  a3 = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Vh, lastRenderedState: a3 };
  b2.queue = a3;
  a3 = a3.dispatch = ii.bind(null, M$3, a3);
  return [b2.memoizedState, a3];
}
function bi(a3, b2, c2, d2) {
  a3 = { tag: a3, create: b2, destroy: c2, deps: d2, next: null };
  b2 = M$3.updateQueue;
  null === b2 ? (b2 = { lastEffect: null, stores: null }, M$3.updateQueue = b2, b2.lastEffect = a3.next = a3) : (c2 = b2.lastEffect, null === c2 ? b2.lastEffect = a3.next = a3 : (d2 = c2.next, c2.next = a3, a3.next = d2, b2.lastEffect = a3));
  return a3;
}
function ji() {
  return Uh().memoizedState;
}
function ki(a3, b2, c2, d2) {
  var e2 = Th();
  M$3.flags |= a3;
  e2.memoizedState = bi(1 | b2, c2, void 0, void 0 === d2 ? null : d2);
}
function li(a3, b2, c2, d2) {
  var e2 = Uh();
  d2 = void 0 === d2 ? null : d2;
  var f2 = void 0;
  if (null !== N$1) {
    var g2 = N$1.memoizedState;
    f2 = g2.destroy;
    if (null !== d2 && Mh(d2, g2.deps)) {
      e2.memoizedState = bi(b2, c2, f2, d2);
      return;
    }
  }
  M$3.flags |= a3;
  e2.memoizedState = bi(1 | b2, c2, f2, d2);
}
function mi(a3, b2) {
  return ki(8390656, 8, a3, b2);
}
function $h(a3, b2) {
  return li(2048, 8, a3, b2);
}
function ni(a3, b2) {
  return li(4, 2, a3, b2);
}
function oi(a3, b2) {
  return li(4, 4, a3, b2);
}
function pi(a3, b2) {
  if ("function" === typeof b2) return a3 = a3(), b2(a3), function() {
    b2(null);
  };
  if (null !== b2 && void 0 !== b2) return a3 = a3(), b2.current = a3, function() {
    b2.current = null;
  };
}
function qi(a3, b2, c2) {
  c2 = null !== c2 && void 0 !== c2 ? c2.concat([a3]) : null;
  return li(4, 4, pi.bind(null, b2, a3), c2);
}
function ri() {
}
function si(a3, b2) {
  var c2 = Uh();
  b2 = void 0 === b2 ? null : b2;
  var d2 = c2.memoizedState;
  if (null !== d2 && null !== b2 && Mh(b2, d2[1])) return d2[0];
  c2.memoizedState = [a3, b2];
  return a3;
}
function ti(a3, b2) {
  var c2 = Uh();
  b2 = void 0 === b2 ? null : b2;
  var d2 = c2.memoizedState;
  if (null !== d2 && null !== b2 && Mh(b2, d2[1])) return d2[0];
  a3 = a3();
  c2.memoizedState = [a3, b2];
  return a3;
}
function ui(a3, b2, c2) {
  if (0 === (Hh & 21)) return a3.baseState && (a3.baseState = false, dh = true), a3.memoizedState = c2;
  He$2(c2, b2) || (c2 = yc(), M$3.lanes |= c2, rh |= c2, a3.baseState = true);
  return b2;
}
function vi(a3, b2) {
  var c2 = C$5;
  C$5 = 0 !== c2 && 4 > c2 ? c2 : 4;
  a3(true);
  var d2 = Gh.transition;
  Gh.transition = {};
  try {
    a3(false), b2();
  } finally {
    C$5 = c2, Gh.transition = d2;
  }
}
function wi() {
  return Uh().memoizedState;
}
function xi(a3, b2, c2) {
  var d2 = yi(a3);
  c2 = { lane: d2, action: c2, hasEagerState: false, eagerState: null, next: null };
  if (zi(a3)) Ai(b2, c2);
  else if (c2 = hh(a3, b2, c2, d2), null !== c2) {
    var e2 = R();
    gi(c2, a3, d2, e2);
    Bi(c2, b2, d2);
  }
}
function ii(a3, b2, c2) {
  var d2 = yi(a3), e2 = { lane: d2, action: c2, hasEagerState: false, eagerState: null, next: null };
  if (zi(a3)) Ai(b2, e2);
  else {
    var f2 = a3.alternate;
    if (0 === a3.lanes && (null === f2 || 0 === f2.lanes) && (f2 = b2.lastRenderedReducer, null !== f2)) try {
      var g2 = b2.lastRenderedState, h2 = f2(g2, c2);
      e2.hasEagerState = true;
      e2.eagerState = h2;
      if (He$2(h2, g2)) {
        var k2 = b2.interleaved;
        null === k2 ? (e2.next = e2, gh(b2)) : (e2.next = k2.next, k2.next = e2);
        b2.interleaved = e2;
        return;
      }
    } catch (l2) {
    } finally {
    }
    c2 = hh(a3, b2, e2, d2);
    null !== c2 && (e2 = R(), gi(c2, a3, d2, e2), Bi(c2, b2, d2));
  }
}
function zi(a3) {
  var b2 = a3.alternate;
  return a3 === M$3 || null !== b2 && b2 === M$3;
}
function Ai(a3, b2) {
  Jh = Ih = true;
  var c2 = a3.pending;
  null === c2 ? b2.next = b2 : (b2.next = c2.next, c2.next = b2);
  a3.pending = b2;
}
function Bi(a3, b2, c2) {
  if (0 !== (c2 & 4194240)) {
    var d2 = b2.lanes;
    d2 &= a3.pendingLanes;
    c2 |= d2;
    b2.lanes = c2;
    Cc(a3, c2);
  }
}
var Rh = { readContext: eh, useCallback: P$2, useContext: P$2, useEffect: P$2, useImperativeHandle: P$2, useInsertionEffect: P$2, useLayoutEffect: P$2, useMemo: P$2, useReducer: P$2, useRef: P$2, useState: P$2, useDebugValue: P$2, useDeferredValue: P$2, useTransition: P$2, useMutableSource: P$2, useSyncExternalStore: P$2, useId: P$2, unstable_isNewReconciler: false }, Oh = { readContext: eh, useCallback: function(a3, b2) {
  Th().memoizedState = [a3, void 0 === b2 ? null : b2];
  return a3;
}, useContext: eh, useEffect: mi, useImperativeHandle: function(a3, b2, c2) {
  c2 = null !== c2 && void 0 !== c2 ? c2.concat([a3]) : null;
  return ki(
    4194308,
    4,
    pi.bind(null, b2, a3),
    c2
  );
}, useLayoutEffect: function(a3, b2) {
  return ki(4194308, 4, a3, b2);
}, useInsertionEffect: function(a3, b2) {
  return ki(4, 2, a3, b2);
}, useMemo: function(a3, b2) {
  var c2 = Th();
  b2 = void 0 === b2 ? null : b2;
  a3 = a3();
  c2.memoizedState = [a3, b2];
  return a3;
}, useReducer: function(a3, b2, c2) {
  var d2 = Th();
  b2 = void 0 !== c2 ? c2(b2) : b2;
  d2.memoizedState = d2.baseState = b2;
  a3 = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: a3, lastRenderedState: b2 };
  d2.queue = a3;
  a3 = a3.dispatch = xi.bind(null, M$3, a3);
  return [d2.memoizedState, a3];
}, useRef: function(a3) {
  var b2 = Th();
  a3 = { current: a3 };
  return b2.memoizedState = a3;
}, useState: hi, useDebugValue: ri, useDeferredValue: function(a3) {
  return Th().memoizedState = a3;
}, useTransition: function() {
  var a3 = hi(false), b2 = a3[0];
  a3 = vi.bind(null, a3[1]);
  Th().memoizedState = a3;
  return [b2, a3];
}, useMutableSource: function() {
}, useSyncExternalStore: function(a3, b2, c2) {
  var d2 = M$3, e2 = Th();
  if (I$6) {
    if (void 0 === c2) throw Error(p$4(407));
    c2 = c2();
  } else {
    c2 = b2();
    if (null === Q) throw Error(p$4(349));
    0 !== (Hh & 30) || di(d2, b2, c2);
  }
  e2.memoizedState = c2;
  var f2 = { value: c2, getSnapshot: b2 };
  e2.queue = f2;
  mi(ai.bind(
    null,
    d2,
    f2,
    a3
  ), [a3]);
  d2.flags |= 2048;
  bi(9, ci.bind(null, d2, f2, c2, b2), void 0, null);
  return c2;
}, useId: function() {
  var a3 = Th(), b2 = Q.identifierPrefix;
  if (I$6) {
    var c2 = sg;
    var d2 = rg;
    c2 = (d2 & ~(1 << 32 - oc(d2) - 1)).toString(32) + c2;
    b2 = ":" + b2 + "R" + c2;
    c2 = Kh++;
    0 < c2 && (b2 += "H" + c2.toString(32));
    b2 += ":";
  } else c2 = Lh++, b2 = ":" + b2 + "r" + c2.toString(32) + ":";
  return a3.memoizedState = b2;
}, unstable_isNewReconciler: false }, Ph = {
  readContext: eh,
  useCallback: si,
  useContext: eh,
  useEffect: $h,
  useImperativeHandle: qi,
  useInsertionEffect: ni,
  useLayoutEffect: oi,
  useMemo: ti,
  useReducer: Wh,
  useRef: ji,
  useState: function() {
    return Wh(Vh);
  },
  useDebugValue: ri,
  useDeferredValue: function(a3) {
    var b2 = Uh();
    return ui(b2, N$1.memoizedState, a3);
  },
  useTransition: function() {
    var a3 = Wh(Vh)[0], b2 = Uh().memoizedState;
    return [a3, b2];
  },
  useMutableSource: Yh,
  useSyncExternalStore: Zh,
  useId: wi,
  unstable_isNewReconciler: false
}, Qh = { readContext: eh, useCallback: si, useContext: eh, useEffect: $h, useImperativeHandle: qi, useInsertionEffect: ni, useLayoutEffect: oi, useMemo: ti, useReducer: Xh, useRef: ji, useState: function() {
  return Xh(Vh);
}, useDebugValue: ri, useDeferredValue: function(a3) {
  var b2 = Uh();
  return null === N$1 ? b2.memoizedState = a3 : ui(b2, N$1.memoizedState, a3);
}, useTransition: function() {
  var a3 = Xh(Vh)[0], b2 = Uh().memoizedState;
  return [a3, b2];
}, useMutableSource: Yh, useSyncExternalStore: Zh, useId: wi, unstable_isNewReconciler: false };
function Ci(a3, b2) {
  if (a3 && a3.defaultProps) {
    b2 = A$3({}, b2);
    a3 = a3.defaultProps;
    for (var c2 in a3) void 0 === b2[c2] && (b2[c2] = a3[c2]);
    return b2;
  }
  return b2;
}
function Di(a3, b2, c2, d2) {
  b2 = a3.memoizedState;
  c2 = c2(d2, b2);
  c2 = null === c2 || void 0 === c2 ? b2 : A$3({}, b2, c2);
  a3.memoizedState = c2;
  0 === a3.lanes && (a3.updateQueue.baseState = c2);
}
var Ei = { isMounted: function(a3) {
  return (a3 = a3._reactInternals) ? Vb(a3) === a3 : false;
}, enqueueSetState: function(a3, b2, c2) {
  a3 = a3._reactInternals;
  var d2 = R(), e2 = yi(a3), f2 = mh(d2, e2);
  f2.payload = b2;
  void 0 !== c2 && null !== c2 && (f2.callback = c2);
  b2 = nh(a3, f2, e2);
  null !== b2 && (gi(b2, a3, e2, d2), oh(b2, a3, e2));
}, enqueueReplaceState: function(a3, b2, c2) {
  a3 = a3._reactInternals;
  var d2 = R(), e2 = yi(a3), f2 = mh(d2, e2);
  f2.tag = 1;
  f2.payload = b2;
  void 0 !== c2 && null !== c2 && (f2.callback = c2);
  b2 = nh(a3, f2, e2);
  null !== b2 && (gi(b2, a3, e2, d2), oh(b2, a3, e2));
}, enqueueForceUpdate: function(a3, b2) {
  a3 = a3._reactInternals;
  var c2 = R(), d2 = yi(a3), e2 = mh(c2, d2);
  e2.tag = 2;
  void 0 !== b2 && null !== b2 && (e2.callback = b2);
  b2 = nh(a3, e2, d2);
  null !== b2 && (gi(b2, a3, d2, c2), oh(b2, a3, d2));
} };
function Fi(a3, b2, c2, d2, e2, f2, g2) {
  a3 = a3.stateNode;
  return "function" === typeof a3.shouldComponentUpdate ? a3.shouldComponentUpdate(d2, f2, g2) : b2.prototype && b2.prototype.isPureReactComponent ? !Ie$1(c2, d2) || !Ie$1(e2, f2) : true;
}
function Gi(a3, b2, c2) {
  var d2 = false, e2 = Vf;
  var f2 = b2.contextType;
  "object" === typeof f2 && null !== f2 ? f2 = eh(f2) : (e2 = Zf(b2) ? Xf : H$3.current, d2 = b2.contextTypes, f2 = (d2 = null !== d2 && void 0 !== d2) ? Yf(a3, e2) : Vf);
  b2 = new b2(c2, f2);
  a3.memoizedState = null !== b2.state && void 0 !== b2.state ? b2.state : null;
  b2.updater = Ei;
  a3.stateNode = b2;
  b2._reactInternals = a3;
  d2 && (a3 = a3.stateNode, a3.__reactInternalMemoizedUnmaskedChildContext = e2, a3.__reactInternalMemoizedMaskedChildContext = f2);
  return b2;
}
function Hi(a3, b2, c2, d2) {
  a3 = b2.state;
  "function" === typeof b2.componentWillReceiveProps && b2.componentWillReceiveProps(c2, d2);
  "function" === typeof b2.UNSAFE_componentWillReceiveProps && b2.UNSAFE_componentWillReceiveProps(c2, d2);
  b2.state !== a3 && Ei.enqueueReplaceState(b2, b2.state, null);
}
function Ii(a3, b2, c2, d2) {
  var e2 = a3.stateNode;
  e2.props = c2;
  e2.state = a3.memoizedState;
  e2.refs = {};
  kh(a3);
  var f2 = b2.contextType;
  "object" === typeof f2 && null !== f2 ? e2.context = eh(f2) : (f2 = Zf(b2) ? Xf : H$3.current, e2.context = Yf(a3, f2));
  e2.state = a3.memoizedState;
  f2 = b2.getDerivedStateFromProps;
  "function" === typeof f2 && (Di(a3, b2, f2, c2), e2.state = a3.memoizedState);
  "function" === typeof b2.getDerivedStateFromProps || "function" === typeof e2.getSnapshotBeforeUpdate || "function" !== typeof e2.UNSAFE_componentWillMount && "function" !== typeof e2.componentWillMount || (b2 = e2.state, "function" === typeof e2.componentWillMount && e2.componentWillMount(), "function" === typeof e2.UNSAFE_componentWillMount && e2.UNSAFE_componentWillMount(), b2 !== e2.state && Ei.enqueueReplaceState(e2, e2.state, null), qh(a3, c2, e2, d2), e2.state = a3.memoizedState);
  "function" === typeof e2.componentDidMount && (a3.flags |= 4194308);
}
function Ji(a3, b2) {
  try {
    var c2 = "", d2 = b2;
    do
      c2 += Pa(d2), d2 = d2.return;
    while (d2);
    var e2 = c2;
  } catch (f2) {
    e2 = "\nError generating stack: " + f2.message + "\n" + f2.stack;
  }
  return { value: a3, source: b2, stack: e2, digest: null };
}
function Ki(a3, b2, c2) {
  return { value: a3, source: null, stack: null != c2 ? c2 : null, digest: null != b2 ? b2 : null };
}
function Li(a3, b2) {
  try {
    console.error(b2.value);
  } catch (c2) {
    setTimeout(function() {
      throw c2;
    });
  }
}
var Mi = "function" === typeof WeakMap ? WeakMap : Map;
function Ni(a3, b2, c2) {
  c2 = mh(-1, c2);
  c2.tag = 3;
  c2.payload = { element: null };
  var d2 = b2.value;
  c2.callback = function() {
    Oi || (Oi = true, Pi = d2);
    Li(a3, b2);
  };
  return c2;
}
function Qi(a3, b2, c2) {
  c2 = mh(-1, c2);
  c2.tag = 3;
  var d2 = a3.type.getDerivedStateFromError;
  if ("function" === typeof d2) {
    var e2 = b2.value;
    c2.payload = function() {
      return d2(e2);
    };
    c2.callback = function() {
      Li(a3, b2);
    };
  }
  var f2 = a3.stateNode;
  null !== f2 && "function" === typeof f2.componentDidCatch && (c2.callback = function() {
    Li(a3, b2);
    "function" !== typeof d2 && (null === Ri ? Ri = /* @__PURE__ */ new Set([this]) : Ri.add(this));
    var c3 = b2.stack;
    this.componentDidCatch(b2.value, { componentStack: null !== c3 ? c3 : "" });
  });
  return c2;
}
function Si(a3, b2, c2) {
  var d2 = a3.pingCache;
  if (null === d2) {
    d2 = a3.pingCache = new Mi();
    var e2 = /* @__PURE__ */ new Set();
    d2.set(b2, e2);
  } else e2 = d2.get(b2), void 0 === e2 && (e2 = /* @__PURE__ */ new Set(), d2.set(b2, e2));
  e2.has(c2) || (e2.add(c2), a3 = Ti.bind(null, a3, b2, c2), b2.then(a3, a3));
}
function Ui(a3) {
  do {
    var b2;
    if (b2 = 13 === a3.tag) b2 = a3.memoizedState, b2 = null !== b2 ? null !== b2.dehydrated ? true : false : true;
    if (b2) return a3;
    a3 = a3.return;
  } while (null !== a3);
  return null;
}
function Vi(a3, b2, c2, d2, e2) {
  if (0 === (a3.mode & 1)) return a3 === b2 ? a3.flags |= 65536 : (a3.flags |= 128, c2.flags |= 131072, c2.flags &= -52805, 1 === c2.tag && (null === c2.alternate ? c2.tag = 17 : (b2 = mh(-1, 1), b2.tag = 2, nh(c2, b2, 1))), c2.lanes |= 1), a3;
  a3.flags |= 65536;
  a3.lanes = e2;
  return a3;
}
var Wi = ua.ReactCurrentOwner, dh = false;
function Xi(a3, b2, c2, d2) {
  b2.child = null === a3 ? Vg(b2, null, c2, d2) : Ug(b2, a3.child, c2, d2);
}
function Yi(a3, b2, c2, d2, e2) {
  c2 = c2.render;
  var f2 = b2.ref;
  ch(b2, e2);
  d2 = Nh(a3, b2, c2, d2, f2, e2);
  c2 = Sh();
  if (null !== a3 && !dh) return b2.updateQueue = a3.updateQueue, b2.flags &= -2053, a3.lanes &= ~e2, Zi(a3, b2, e2);
  I$6 && c2 && vg(b2);
  b2.flags |= 1;
  Xi(a3, b2, d2, e2);
  return b2.child;
}
function $i(a3, b2, c2, d2, e2) {
  if (null === a3) {
    var f2 = c2.type;
    if ("function" === typeof f2 && !aj(f2) && void 0 === f2.defaultProps && null === c2.compare && void 0 === c2.defaultProps) return b2.tag = 15, b2.type = f2, bj(a3, b2, f2, d2, e2);
    a3 = Rg(c2.type, null, d2, b2, b2.mode, e2);
    a3.ref = b2.ref;
    a3.return = b2;
    return b2.child = a3;
  }
  f2 = a3.child;
  if (0 === (a3.lanes & e2)) {
    var g2 = f2.memoizedProps;
    c2 = c2.compare;
    c2 = null !== c2 ? c2 : Ie$1;
    if (c2(g2, d2) && a3.ref === b2.ref) return Zi(a3, b2, e2);
  }
  b2.flags |= 1;
  a3 = Pg(f2, d2);
  a3.ref = b2.ref;
  a3.return = b2;
  return b2.child = a3;
}
function bj(a3, b2, c2, d2, e2) {
  if (null !== a3) {
    var f2 = a3.memoizedProps;
    if (Ie$1(f2, d2) && a3.ref === b2.ref) if (dh = false, b2.pendingProps = d2 = f2, 0 !== (a3.lanes & e2)) 0 !== (a3.flags & 131072) && (dh = true);
    else return b2.lanes = a3.lanes, Zi(a3, b2, e2);
  }
  return cj(a3, b2, c2, d2, e2);
}
function dj(a3, b2, c2) {
  var d2 = b2.pendingProps, e2 = d2.children, f2 = null !== a3 ? a3.memoizedState : null;
  if ("hidden" === d2.mode) if (0 === (b2.mode & 1)) b2.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, G$2(ej, fj), fj |= c2;
  else {
    if (0 === (c2 & 1073741824)) return a3 = null !== f2 ? f2.baseLanes | c2 : c2, b2.lanes = b2.childLanes = 1073741824, b2.memoizedState = { baseLanes: a3, cachePool: null, transitions: null }, b2.updateQueue = null, G$2(ej, fj), fj |= a3, null;
    b2.memoizedState = { baseLanes: 0, cachePool: null, transitions: null };
    d2 = null !== f2 ? f2.baseLanes : c2;
    G$2(ej, fj);
    fj |= d2;
  }
  else null !== f2 ? (d2 = f2.baseLanes | c2, b2.memoizedState = null) : d2 = c2, G$2(ej, fj), fj |= d2;
  Xi(a3, b2, e2, c2);
  return b2.child;
}
function gj(a3, b2) {
  var c2 = b2.ref;
  if (null === a3 && null !== c2 || null !== a3 && a3.ref !== c2) b2.flags |= 512, b2.flags |= 2097152;
}
function cj(a3, b2, c2, d2, e2) {
  var f2 = Zf(c2) ? Xf : H$3.current;
  f2 = Yf(b2, f2);
  ch(b2, e2);
  c2 = Nh(a3, b2, c2, d2, f2, e2);
  d2 = Sh();
  if (null !== a3 && !dh) return b2.updateQueue = a3.updateQueue, b2.flags &= -2053, a3.lanes &= ~e2, Zi(a3, b2, e2);
  I$6 && d2 && vg(b2);
  b2.flags |= 1;
  Xi(a3, b2, c2, e2);
  return b2.child;
}
function hj(a3, b2, c2, d2, e2) {
  if (Zf(c2)) {
    var f2 = true;
    cg(b2);
  } else f2 = false;
  ch(b2, e2);
  if (null === b2.stateNode) ij(a3, b2), Gi(b2, c2, d2), Ii(b2, c2, d2, e2), d2 = true;
  else if (null === a3) {
    var g2 = b2.stateNode, h2 = b2.memoizedProps;
    g2.props = h2;
    var k2 = g2.context, l2 = c2.contextType;
    "object" === typeof l2 && null !== l2 ? l2 = eh(l2) : (l2 = Zf(c2) ? Xf : H$3.current, l2 = Yf(b2, l2));
    var m2 = c2.getDerivedStateFromProps, q2 = "function" === typeof m2 || "function" === typeof g2.getSnapshotBeforeUpdate;
    q2 || "function" !== typeof g2.UNSAFE_componentWillReceiveProps && "function" !== typeof g2.componentWillReceiveProps || (h2 !== d2 || k2 !== l2) && Hi(b2, g2, d2, l2);
    jh = false;
    var r2 = b2.memoizedState;
    g2.state = r2;
    qh(b2, d2, g2, e2);
    k2 = b2.memoizedState;
    h2 !== d2 || r2 !== k2 || Wf.current || jh ? ("function" === typeof m2 && (Di(b2, c2, m2, d2), k2 = b2.memoizedState), (h2 = jh || Fi(b2, c2, h2, d2, r2, k2, l2)) ? (q2 || "function" !== typeof g2.UNSAFE_componentWillMount && "function" !== typeof g2.componentWillMount || ("function" === typeof g2.componentWillMount && g2.componentWillMount(), "function" === typeof g2.UNSAFE_componentWillMount && g2.UNSAFE_componentWillMount()), "function" === typeof g2.componentDidMount && (b2.flags |= 4194308)) : ("function" === typeof g2.componentDidMount && (b2.flags |= 4194308), b2.memoizedProps = d2, b2.memoizedState = k2), g2.props = d2, g2.state = k2, g2.context = l2, d2 = h2) : ("function" === typeof g2.componentDidMount && (b2.flags |= 4194308), d2 = false);
  } else {
    g2 = b2.stateNode;
    lh(a3, b2);
    h2 = b2.memoizedProps;
    l2 = b2.type === b2.elementType ? h2 : Ci(b2.type, h2);
    g2.props = l2;
    q2 = b2.pendingProps;
    r2 = g2.context;
    k2 = c2.contextType;
    "object" === typeof k2 && null !== k2 ? k2 = eh(k2) : (k2 = Zf(c2) ? Xf : H$3.current, k2 = Yf(b2, k2));
    var y2 = c2.getDerivedStateFromProps;
    (m2 = "function" === typeof y2 || "function" === typeof g2.getSnapshotBeforeUpdate) || "function" !== typeof g2.UNSAFE_componentWillReceiveProps && "function" !== typeof g2.componentWillReceiveProps || (h2 !== q2 || r2 !== k2) && Hi(b2, g2, d2, k2);
    jh = false;
    r2 = b2.memoizedState;
    g2.state = r2;
    qh(b2, d2, g2, e2);
    var n2 = b2.memoizedState;
    h2 !== q2 || r2 !== n2 || Wf.current || jh ? ("function" === typeof y2 && (Di(b2, c2, y2, d2), n2 = b2.memoizedState), (l2 = jh || Fi(b2, c2, l2, d2, r2, n2, k2) || false) ? (m2 || "function" !== typeof g2.UNSAFE_componentWillUpdate && "function" !== typeof g2.componentWillUpdate || ("function" === typeof g2.componentWillUpdate && g2.componentWillUpdate(d2, n2, k2), "function" === typeof g2.UNSAFE_componentWillUpdate && g2.UNSAFE_componentWillUpdate(d2, n2, k2)), "function" === typeof g2.componentDidUpdate && (b2.flags |= 4), "function" === typeof g2.getSnapshotBeforeUpdate && (b2.flags |= 1024)) : ("function" !== typeof g2.componentDidUpdate || h2 === a3.memoizedProps && r2 === a3.memoizedState || (b2.flags |= 4), "function" !== typeof g2.getSnapshotBeforeUpdate || h2 === a3.memoizedProps && r2 === a3.memoizedState || (b2.flags |= 1024), b2.memoizedProps = d2, b2.memoizedState = n2), g2.props = d2, g2.state = n2, g2.context = k2, d2 = l2) : ("function" !== typeof g2.componentDidUpdate || h2 === a3.memoizedProps && r2 === a3.memoizedState || (b2.flags |= 4), "function" !== typeof g2.getSnapshotBeforeUpdate || h2 === a3.memoizedProps && r2 === a3.memoizedState || (b2.flags |= 1024), d2 = false);
  }
  return jj(a3, b2, c2, d2, f2, e2);
}
function jj(a3, b2, c2, d2, e2, f2) {
  gj(a3, b2);
  var g2 = 0 !== (b2.flags & 128);
  if (!d2 && !g2) return e2 && dg(b2, c2, false), Zi(a3, b2, f2);
  d2 = b2.stateNode;
  Wi.current = b2;
  var h2 = g2 && "function" !== typeof c2.getDerivedStateFromError ? null : d2.render();
  b2.flags |= 1;
  null !== a3 && g2 ? (b2.child = Ug(b2, a3.child, null, f2), b2.child = Ug(b2, null, h2, f2)) : Xi(a3, b2, h2, f2);
  b2.memoizedState = d2.state;
  e2 && dg(b2, c2, true);
  return b2.child;
}
function kj(a3) {
  var b2 = a3.stateNode;
  b2.pendingContext ? ag(a3, b2.pendingContext, b2.pendingContext !== b2.context) : b2.context && ag(a3, b2.context, false);
  yh(a3, b2.containerInfo);
}
function lj(a3, b2, c2, d2, e2) {
  Ig();
  Jg(e2);
  b2.flags |= 256;
  Xi(a3, b2, c2, d2);
  return b2.child;
}
var mj = { dehydrated: null, treeContext: null, retryLane: 0 };
function nj(a3) {
  return { baseLanes: a3, cachePool: null, transitions: null };
}
function oj(a3, b2, c2) {
  var d2 = b2.pendingProps, e2 = L.current, f2 = false, g2 = 0 !== (b2.flags & 128), h2;
  (h2 = g2) || (h2 = null !== a3 && null === a3.memoizedState ? false : 0 !== (e2 & 2));
  if (h2) f2 = true, b2.flags &= -129;
  else if (null === a3 || null !== a3.memoizedState) e2 |= 1;
  G$2(L, e2 & 1);
  if (null === a3) {
    Eg(b2);
    a3 = b2.memoizedState;
    if (null !== a3 && (a3 = a3.dehydrated, null !== a3)) return 0 === (b2.mode & 1) ? b2.lanes = 1 : "$!" === a3.data ? b2.lanes = 8 : b2.lanes = 1073741824, null;
    g2 = d2.children;
    a3 = d2.fallback;
    return f2 ? (d2 = b2.mode, f2 = b2.child, g2 = { mode: "hidden", children: g2 }, 0 === (d2 & 1) && null !== f2 ? (f2.childLanes = 0, f2.pendingProps = g2) : f2 = pj(g2, d2, 0, null), a3 = Tg(a3, d2, c2, null), f2.return = b2, a3.return = b2, f2.sibling = a3, b2.child = f2, b2.child.memoizedState = nj(c2), b2.memoizedState = mj, a3) : qj(b2, g2);
  }
  e2 = a3.memoizedState;
  if (null !== e2 && (h2 = e2.dehydrated, null !== h2)) return rj(a3, b2, g2, d2, h2, e2, c2);
  if (f2) {
    f2 = d2.fallback;
    g2 = b2.mode;
    e2 = a3.child;
    h2 = e2.sibling;
    var k2 = { mode: "hidden", children: d2.children };
    0 === (g2 & 1) && b2.child !== e2 ? (d2 = b2.child, d2.childLanes = 0, d2.pendingProps = k2, b2.deletions = null) : (d2 = Pg(e2, k2), d2.subtreeFlags = e2.subtreeFlags & 14680064);
    null !== h2 ? f2 = Pg(h2, f2) : (f2 = Tg(f2, g2, c2, null), f2.flags |= 2);
    f2.return = b2;
    d2.return = b2;
    d2.sibling = f2;
    b2.child = d2;
    d2 = f2;
    f2 = b2.child;
    g2 = a3.child.memoizedState;
    g2 = null === g2 ? nj(c2) : { baseLanes: g2.baseLanes | c2, cachePool: null, transitions: g2.transitions };
    f2.memoizedState = g2;
    f2.childLanes = a3.childLanes & ~c2;
    b2.memoizedState = mj;
    return d2;
  }
  f2 = a3.child;
  a3 = f2.sibling;
  d2 = Pg(f2, { mode: "visible", children: d2.children });
  0 === (b2.mode & 1) && (d2.lanes = c2);
  d2.return = b2;
  d2.sibling = null;
  null !== a3 && (c2 = b2.deletions, null === c2 ? (b2.deletions = [a3], b2.flags |= 16) : c2.push(a3));
  b2.child = d2;
  b2.memoizedState = null;
  return d2;
}
function qj(a3, b2) {
  b2 = pj({ mode: "visible", children: b2 }, a3.mode, 0, null);
  b2.return = a3;
  return a3.child = b2;
}
function sj(a3, b2, c2, d2) {
  null !== d2 && Jg(d2);
  Ug(b2, a3.child, null, c2);
  a3 = qj(b2, b2.pendingProps.children);
  a3.flags |= 2;
  b2.memoizedState = null;
  return a3;
}
function rj(a3, b2, c2, d2, e2, f2, g2) {
  if (c2) {
    if (b2.flags & 256) return b2.flags &= -257, d2 = Ki(Error(p$4(422))), sj(a3, b2, g2, d2);
    if (null !== b2.memoizedState) return b2.child = a3.child, b2.flags |= 128, null;
    f2 = d2.fallback;
    e2 = b2.mode;
    d2 = pj({ mode: "visible", children: d2.children }, e2, 0, null);
    f2 = Tg(f2, e2, g2, null);
    f2.flags |= 2;
    d2.return = b2;
    f2.return = b2;
    d2.sibling = f2;
    b2.child = d2;
    0 !== (b2.mode & 1) && Ug(b2, a3.child, null, g2);
    b2.child.memoizedState = nj(g2);
    b2.memoizedState = mj;
    return f2;
  }
  if (0 === (b2.mode & 1)) return sj(a3, b2, g2, null);
  if ("$!" === e2.data) {
    d2 = e2.nextSibling && e2.nextSibling.dataset;
    if (d2) var h2 = d2.dgst;
    d2 = h2;
    f2 = Error(p$4(419));
    d2 = Ki(f2, d2, void 0);
    return sj(a3, b2, g2, d2);
  }
  h2 = 0 !== (g2 & a3.childLanes);
  if (dh || h2) {
    d2 = Q;
    if (null !== d2) {
      switch (g2 & -g2) {
        case 4:
          e2 = 2;
          break;
        case 16:
          e2 = 8;
          break;
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
          e2 = 32;
          break;
        case 536870912:
          e2 = 268435456;
          break;
        default:
          e2 = 0;
      }
      e2 = 0 !== (e2 & (d2.suspendedLanes | g2)) ? 0 : e2;
      0 !== e2 && e2 !== f2.retryLane && (f2.retryLane = e2, ih(a3, e2), gi(d2, a3, e2, -1));
    }
    tj();
    d2 = Ki(Error(p$4(421)));
    return sj(a3, b2, g2, d2);
  }
  if ("$?" === e2.data) return b2.flags |= 128, b2.child = a3.child, b2 = uj.bind(null, a3), e2._reactRetry = b2, null;
  a3 = f2.treeContext;
  yg = Lf(e2.nextSibling);
  xg = b2;
  I$6 = true;
  zg = null;
  null !== a3 && (og[pg++] = rg, og[pg++] = sg, og[pg++] = qg, rg = a3.id, sg = a3.overflow, qg = b2);
  b2 = qj(b2, d2.children);
  b2.flags |= 4096;
  return b2;
}
function vj(a3, b2, c2) {
  a3.lanes |= b2;
  var d2 = a3.alternate;
  null !== d2 && (d2.lanes |= b2);
  bh(a3.return, b2, c2);
}
function wj(a3, b2, c2, d2, e2) {
  var f2 = a3.memoizedState;
  null === f2 ? a3.memoizedState = { isBackwards: b2, rendering: null, renderingStartTime: 0, last: d2, tail: c2, tailMode: e2 } : (f2.isBackwards = b2, f2.rendering = null, f2.renderingStartTime = 0, f2.last = d2, f2.tail = c2, f2.tailMode = e2);
}
function xj(a3, b2, c2) {
  var d2 = b2.pendingProps, e2 = d2.revealOrder, f2 = d2.tail;
  Xi(a3, b2, d2.children, c2);
  d2 = L.current;
  if (0 !== (d2 & 2)) d2 = d2 & 1 | 2, b2.flags |= 128;
  else {
    if (null !== a3 && 0 !== (a3.flags & 128)) a: for (a3 = b2.child; null !== a3; ) {
      if (13 === a3.tag) null !== a3.memoizedState && vj(a3, c2, b2);
      else if (19 === a3.tag) vj(a3, c2, b2);
      else if (null !== a3.child) {
        a3.child.return = a3;
        a3 = a3.child;
        continue;
      }
      if (a3 === b2) break a;
      for (; null === a3.sibling; ) {
        if (null === a3.return || a3.return === b2) break a;
        a3 = a3.return;
      }
      a3.sibling.return = a3.return;
      a3 = a3.sibling;
    }
    d2 &= 1;
  }
  G$2(L, d2);
  if (0 === (b2.mode & 1)) b2.memoizedState = null;
  else switch (e2) {
    case "forwards":
      c2 = b2.child;
      for (e2 = null; null !== c2; ) a3 = c2.alternate, null !== a3 && null === Ch(a3) && (e2 = c2), c2 = c2.sibling;
      c2 = e2;
      null === c2 ? (e2 = b2.child, b2.child = null) : (e2 = c2.sibling, c2.sibling = null);
      wj(b2, false, e2, c2, f2);
      break;
    case "backwards":
      c2 = null;
      e2 = b2.child;
      for (b2.child = null; null !== e2; ) {
        a3 = e2.alternate;
        if (null !== a3 && null === Ch(a3)) {
          b2.child = e2;
          break;
        }
        a3 = e2.sibling;
        e2.sibling = c2;
        c2 = e2;
        e2 = a3;
      }
      wj(b2, true, c2, null, f2);
      break;
    case "together":
      wj(b2, false, null, null, void 0);
      break;
    default:
      b2.memoizedState = null;
  }
  return b2.child;
}
function ij(a3, b2) {
  0 === (b2.mode & 1) && null !== a3 && (a3.alternate = null, b2.alternate = null, b2.flags |= 2);
}
function Zi(a3, b2, c2) {
  null !== a3 && (b2.dependencies = a3.dependencies);
  rh |= b2.lanes;
  if (0 === (c2 & b2.childLanes)) return null;
  if (null !== a3 && b2.child !== a3.child) throw Error(p$4(153));
  if (null !== b2.child) {
    a3 = b2.child;
    c2 = Pg(a3, a3.pendingProps);
    b2.child = c2;
    for (c2.return = b2; null !== a3.sibling; ) a3 = a3.sibling, c2 = c2.sibling = Pg(a3, a3.pendingProps), c2.return = b2;
    c2.sibling = null;
  }
  return b2.child;
}
function yj(a3, b2, c2) {
  switch (b2.tag) {
    case 3:
      kj(b2);
      Ig();
      break;
    case 5:
      Ah(b2);
      break;
    case 1:
      Zf(b2.type) && cg(b2);
      break;
    case 4:
      yh(b2, b2.stateNode.containerInfo);
      break;
    case 10:
      var d2 = b2.type._context, e2 = b2.memoizedProps.value;
      G$2(Wg, d2._currentValue);
      d2._currentValue = e2;
      break;
    case 13:
      d2 = b2.memoizedState;
      if (null !== d2) {
        if (null !== d2.dehydrated) return G$2(L, L.current & 1), b2.flags |= 128, null;
        if (0 !== (c2 & b2.child.childLanes)) return oj(a3, b2, c2);
        G$2(L, L.current & 1);
        a3 = Zi(a3, b2, c2);
        return null !== a3 ? a3.sibling : null;
      }
      G$2(L, L.current & 1);
      break;
    case 19:
      d2 = 0 !== (c2 & b2.childLanes);
      if (0 !== (a3.flags & 128)) {
        if (d2) return xj(a3, b2, c2);
        b2.flags |= 128;
      }
      e2 = b2.memoizedState;
      null !== e2 && (e2.rendering = null, e2.tail = null, e2.lastEffect = null);
      G$2(L, L.current);
      if (d2) break;
      else return null;
    case 22:
    case 23:
      return b2.lanes = 0, dj(a3, b2, c2);
  }
  return Zi(a3, b2, c2);
}
var zj, Aj, Bj, Cj;
zj = function(a3, b2) {
  for (var c2 = b2.child; null !== c2; ) {
    if (5 === c2.tag || 6 === c2.tag) a3.appendChild(c2.stateNode);
    else if (4 !== c2.tag && null !== c2.child) {
      c2.child.return = c2;
      c2 = c2.child;
      continue;
    }
    if (c2 === b2) break;
    for (; null === c2.sibling; ) {
      if (null === c2.return || c2.return === b2) return;
      c2 = c2.return;
    }
    c2.sibling.return = c2.return;
    c2 = c2.sibling;
  }
};
Aj = function() {
};
Bj = function(a3, b2, c2, d2) {
  var e2 = a3.memoizedProps;
  if (e2 !== d2) {
    a3 = b2.stateNode;
    xh(uh.current);
    var f2 = null;
    switch (c2) {
      case "input":
        e2 = Ya(a3, e2);
        d2 = Ya(a3, d2);
        f2 = [];
        break;
      case "select":
        e2 = A$3({}, e2, { value: void 0 });
        d2 = A$3({}, d2, { value: void 0 });
        f2 = [];
        break;
      case "textarea":
        e2 = gb(a3, e2);
        d2 = gb(a3, d2);
        f2 = [];
        break;
      default:
        "function" !== typeof e2.onClick && "function" === typeof d2.onClick && (a3.onclick = Bf);
    }
    ub(c2, d2);
    var g2;
    c2 = null;
    for (l2 in e2) if (!d2.hasOwnProperty(l2) && e2.hasOwnProperty(l2) && null != e2[l2]) if ("style" === l2) {
      var h2 = e2[l2];
      for (g2 in h2) h2.hasOwnProperty(g2) && (c2 || (c2 = {}), c2[g2] = "");
    } else "dangerouslySetInnerHTML" !== l2 && "children" !== l2 && "suppressContentEditableWarning" !== l2 && "suppressHydrationWarning" !== l2 && "autoFocus" !== l2 && (ea.hasOwnProperty(l2) ? f2 || (f2 = []) : (f2 = f2 || []).push(l2, null));
    for (l2 in d2) {
      var k2 = d2[l2];
      h2 = null != e2 ? e2[l2] : void 0;
      if (d2.hasOwnProperty(l2) && k2 !== h2 && (null != k2 || null != h2)) if ("style" === l2) if (h2) {
        for (g2 in h2) !h2.hasOwnProperty(g2) || k2 && k2.hasOwnProperty(g2) || (c2 || (c2 = {}), c2[g2] = "");
        for (g2 in k2) k2.hasOwnProperty(g2) && h2[g2] !== k2[g2] && (c2 || (c2 = {}), c2[g2] = k2[g2]);
      } else c2 || (f2 || (f2 = []), f2.push(
        l2,
        c2
      )), c2 = k2;
      else "dangerouslySetInnerHTML" === l2 ? (k2 = k2 ? k2.__html : void 0, h2 = h2 ? h2.__html : void 0, null != k2 && h2 !== k2 && (f2 = f2 || []).push(l2, k2)) : "children" === l2 ? "string" !== typeof k2 && "number" !== typeof k2 || (f2 = f2 || []).push(l2, "" + k2) : "suppressContentEditableWarning" !== l2 && "suppressHydrationWarning" !== l2 && (ea.hasOwnProperty(l2) ? (null != k2 && "onScroll" === l2 && D$3("scroll", a3), f2 || h2 === k2 || (f2 = [])) : (f2 = f2 || []).push(l2, k2));
    }
    c2 && (f2 = f2 || []).push("style", c2);
    var l2 = f2;
    if (b2.updateQueue = l2) b2.flags |= 4;
  }
};
Cj = function(a3, b2, c2, d2) {
  c2 !== d2 && (b2.flags |= 4);
};
function Dj(a3, b2) {
  if (!I$6) switch (a3.tailMode) {
    case "hidden":
      b2 = a3.tail;
      for (var c2 = null; null !== b2; ) null !== b2.alternate && (c2 = b2), b2 = b2.sibling;
      null === c2 ? a3.tail = null : c2.sibling = null;
      break;
    case "collapsed":
      c2 = a3.tail;
      for (var d2 = null; null !== c2; ) null !== c2.alternate && (d2 = c2), c2 = c2.sibling;
      null === d2 ? b2 || null === a3.tail ? a3.tail = null : a3.tail.sibling = null : d2.sibling = null;
  }
}
function S$6(a3) {
  var b2 = null !== a3.alternate && a3.alternate.child === a3.child, c2 = 0, d2 = 0;
  if (b2) for (var e2 = a3.child; null !== e2; ) c2 |= e2.lanes | e2.childLanes, d2 |= e2.subtreeFlags & 14680064, d2 |= e2.flags & 14680064, e2.return = a3, e2 = e2.sibling;
  else for (e2 = a3.child; null !== e2; ) c2 |= e2.lanes | e2.childLanes, d2 |= e2.subtreeFlags, d2 |= e2.flags, e2.return = a3, e2 = e2.sibling;
  a3.subtreeFlags |= d2;
  a3.childLanes = c2;
  return b2;
}
function Ej(a3, b2, c2) {
  var d2 = b2.pendingProps;
  wg(b2);
  switch (b2.tag) {
    case 2:
    case 16:
    case 15:
    case 0:
    case 11:
    case 7:
    case 8:
    case 12:
    case 9:
    case 14:
      return S$6(b2), null;
    case 1:
      return Zf(b2.type) && $f(), S$6(b2), null;
    case 3:
      d2 = b2.stateNode;
      zh();
      E$2(Wf);
      E$2(H$3);
      Eh();
      d2.pendingContext && (d2.context = d2.pendingContext, d2.pendingContext = null);
      if (null === a3 || null === a3.child) Gg(b2) ? b2.flags |= 4 : null === a3 || a3.memoizedState.isDehydrated && 0 === (b2.flags & 256) || (b2.flags |= 1024, null !== zg && (Fj(zg), zg = null));
      Aj(a3, b2);
      S$6(b2);
      return null;
    case 5:
      Bh(b2);
      var e2 = xh(wh.current);
      c2 = b2.type;
      if (null !== a3 && null != b2.stateNode) Bj(a3, b2, c2, d2, e2), a3.ref !== b2.ref && (b2.flags |= 512, b2.flags |= 2097152);
      else {
        if (!d2) {
          if (null === b2.stateNode) throw Error(p$4(166));
          S$6(b2);
          return null;
        }
        a3 = xh(uh.current);
        if (Gg(b2)) {
          d2 = b2.stateNode;
          c2 = b2.type;
          var f2 = b2.memoizedProps;
          d2[Of] = b2;
          d2[Pf] = f2;
          a3 = 0 !== (b2.mode & 1);
          switch (c2) {
            case "dialog":
              D$3("cancel", d2);
              D$3("close", d2);
              break;
            case "iframe":
            case "object":
            case "embed":
              D$3("load", d2);
              break;
            case "video":
            case "audio":
              for (e2 = 0; e2 < lf.length; e2++) D$3(lf[e2], d2);
              break;
            case "source":
              D$3("error", d2);
              break;
            case "img":
            case "image":
            case "link":
              D$3(
                "error",
                d2
              );
              D$3("load", d2);
              break;
            case "details":
              D$3("toggle", d2);
              break;
            case "input":
              Za(d2, f2);
              D$3("invalid", d2);
              break;
            case "select":
              d2._wrapperState = { wasMultiple: !!f2.multiple };
              D$3("invalid", d2);
              break;
            case "textarea":
              hb(d2, f2), D$3("invalid", d2);
          }
          ub(c2, f2);
          e2 = null;
          for (var g2 in f2) if (f2.hasOwnProperty(g2)) {
            var h2 = f2[g2];
            "children" === g2 ? "string" === typeof h2 ? d2.textContent !== h2 && (true !== f2.suppressHydrationWarning && Af(d2.textContent, h2, a3), e2 = ["children", h2]) : "number" === typeof h2 && d2.textContent !== "" + h2 && (true !== f2.suppressHydrationWarning && Af(
              d2.textContent,
              h2,
              a3
            ), e2 = ["children", "" + h2]) : ea.hasOwnProperty(g2) && null != h2 && "onScroll" === g2 && D$3("scroll", d2);
          }
          switch (c2) {
            case "input":
              Va(d2);
              db(d2, f2, true);
              break;
            case "textarea":
              Va(d2);
              jb(d2);
              break;
            case "select":
            case "option":
              break;
            default:
              "function" === typeof f2.onClick && (d2.onclick = Bf);
          }
          d2 = e2;
          b2.updateQueue = d2;
          null !== d2 && (b2.flags |= 4);
        } else {
          g2 = 9 === e2.nodeType ? e2 : e2.ownerDocument;
          "http://www.w3.org/1999/xhtml" === a3 && (a3 = kb(c2));
          "http://www.w3.org/1999/xhtml" === a3 ? "script" === c2 ? (a3 = g2.createElement("div"), a3.innerHTML = "<script><\/script>", a3 = a3.removeChild(a3.firstChild)) : "string" === typeof d2.is ? a3 = g2.createElement(c2, { is: d2.is }) : (a3 = g2.createElement(c2), "select" === c2 && (g2 = a3, d2.multiple ? g2.multiple = true : d2.size && (g2.size = d2.size))) : a3 = g2.createElementNS(a3, c2);
          a3[Of] = b2;
          a3[Pf] = d2;
          zj(a3, b2, false, false);
          b2.stateNode = a3;
          a: {
            g2 = vb(c2, d2);
            switch (c2) {
              case "dialog":
                D$3("cancel", a3);
                D$3("close", a3);
                e2 = d2;
                break;
              case "iframe":
              case "object":
              case "embed":
                D$3("load", a3);
                e2 = d2;
                break;
              case "video":
              case "audio":
                for (e2 = 0; e2 < lf.length; e2++) D$3(lf[e2], a3);
                e2 = d2;
                break;
              case "source":
                D$3("error", a3);
                e2 = d2;
                break;
              case "img":
              case "image":
              case "link":
                D$3(
                  "error",
                  a3
                );
                D$3("load", a3);
                e2 = d2;
                break;
              case "details":
                D$3("toggle", a3);
                e2 = d2;
                break;
              case "input":
                Za(a3, d2);
                e2 = Ya(a3, d2);
                D$3("invalid", a3);
                break;
              case "option":
                e2 = d2;
                break;
              case "select":
                a3._wrapperState = { wasMultiple: !!d2.multiple };
                e2 = A$3({}, d2, { value: void 0 });
                D$3("invalid", a3);
                break;
              case "textarea":
                hb(a3, d2);
                e2 = gb(a3, d2);
                D$3("invalid", a3);
                break;
              default:
                e2 = d2;
            }
            ub(c2, e2);
            h2 = e2;
            for (f2 in h2) if (h2.hasOwnProperty(f2)) {
              var k2 = h2[f2];
              "style" === f2 ? sb(a3, k2) : "dangerouslySetInnerHTML" === f2 ? (k2 = k2 ? k2.__html : void 0, null != k2 && nb(a3, k2)) : "children" === f2 ? "string" === typeof k2 ? ("textarea" !== c2 || "" !== k2) && ob(a3, k2) : "number" === typeof k2 && ob(a3, "" + k2) : "suppressContentEditableWarning" !== f2 && "suppressHydrationWarning" !== f2 && "autoFocus" !== f2 && (ea.hasOwnProperty(f2) ? null != k2 && "onScroll" === f2 && D$3("scroll", a3) : null != k2 && ta(a3, f2, k2, g2));
            }
            switch (c2) {
              case "input":
                Va(a3);
                db(a3, d2, false);
                break;
              case "textarea":
                Va(a3);
                jb(a3);
                break;
              case "option":
                null != d2.value && a3.setAttribute("value", "" + Sa(d2.value));
                break;
              case "select":
                a3.multiple = !!d2.multiple;
                f2 = d2.value;
                null != f2 ? fb(a3, !!d2.multiple, f2, false) : null != d2.defaultValue && fb(
                  a3,
                  !!d2.multiple,
                  d2.defaultValue,
                  true
                );
                break;
              default:
                "function" === typeof e2.onClick && (a3.onclick = Bf);
            }
            switch (c2) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                d2 = !!d2.autoFocus;
                break a;
              case "img":
                d2 = true;
                break a;
              default:
                d2 = false;
            }
          }
          d2 && (b2.flags |= 4);
        }
        null !== b2.ref && (b2.flags |= 512, b2.flags |= 2097152);
      }
      S$6(b2);
      return null;
    case 6:
      if (a3 && null != b2.stateNode) Cj(a3, b2, a3.memoizedProps, d2);
      else {
        if ("string" !== typeof d2 && null === b2.stateNode) throw Error(p$4(166));
        c2 = xh(wh.current);
        xh(uh.current);
        if (Gg(b2)) {
          d2 = b2.stateNode;
          c2 = b2.memoizedProps;
          d2[Of] = b2;
          if (f2 = d2.nodeValue !== c2) {
            if (a3 = xg, null !== a3) switch (a3.tag) {
              case 3:
                Af(d2.nodeValue, c2, 0 !== (a3.mode & 1));
                break;
              case 5:
                true !== a3.memoizedProps.suppressHydrationWarning && Af(d2.nodeValue, c2, 0 !== (a3.mode & 1));
            }
          }
          f2 && (b2.flags |= 4);
        } else d2 = (9 === c2.nodeType ? c2 : c2.ownerDocument).createTextNode(d2), d2[Of] = b2, b2.stateNode = d2;
      }
      S$6(b2);
      return null;
    case 13:
      E$2(L);
      d2 = b2.memoizedState;
      if (null === a3 || null !== a3.memoizedState && null !== a3.memoizedState.dehydrated) {
        if (I$6 && null !== yg && 0 !== (b2.mode & 1) && 0 === (b2.flags & 128)) Hg(), Ig(), b2.flags |= 98560, f2 = false;
        else if (f2 = Gg(b2), null !== d2 && null !== d2.dehydrated) {
          if (null === a3) {
            if (!f2) throw Error(p$4(318));
            f2 = b2.memoizedState;
            f2 = null !== f2 ? f2.dehydrated : null;
            if (!f2) throw Error(p$4(317));
            f2[Of] = b2;
          } else Ig(), 0 === (b2.flags & 128) && (b2.memoizedState = null), b2.flags |= 4;
          S$6(b2);
          f2 = false;
        } else null !== zg && (Fj(zg), zg = null), f2 = true;
        if (!f2) return b2.flags & 65536 ? b2 : null;
      }
      if (0 !== (b2.flags & 128)) return b2.lanes = c2, b2;
      d2 = null !== d2;
      d2 !== (null !== a3 && null !== a3.memoizedState) && d2 && (b2.child.flags |= 8192, 0 !== (b2.mode & 1) && (null === a3 || 0 !== (L.current & 1) ? 0 === T$4 && (T$4 = 3) : tj()));
      null !== b2.updateQueue && (b2.flags |= 4);
      S$6(b2);
      return null;
    case 4:
      return zh(), Aj(a3, b2), null === a3 && sf(b2.stateNode.containerInfo), S$6(b2), null;
    case 10:
      return ah(b2.type._context), S$6(b2), null;
    case 17:
      return Zf(b2.type) && $f(), S$6(b2), null;
    case 19:
      E$2(L);
      f2 = b2.memoizedState;
      if (null === f2) return S$6(b2), null;
      d2 = 0 !== (b2.flags & 128);
      g2 = f2.rendering;
      if (null === g2) if (d2) Dj(f2, false);
      else {
        if (0 !== T$4 || null !== a3 && 0 !== (a3.flags & 128)) for (a3 = b2.child; null !== a3; ) {
          g2 = Ch(a3);
          if (null !== g2) {
            b2.flags |= 128;
            Dj(f2, false);
            d2 = g2.updateQueue;
            null !== d2 && (b2.updateQueue = d2, b2.flags |= 4);
            b2.subtreeFlags = 0;
            d2 = c2;
            for (c2 = b2.child; null !== c2; ) f2 = c2, a3 = d2, f2.flags &= 14680066, g2 = f2.alternate, null === g2 ? (f2.childLanes = 0, f2.lanes = a3, f2.child = null, f2.subtreeFlags = 0, f2.memoizedProps = null, f2.memoizedState = null, f2.updateQueue = null, f2.dependencies = null, f2.stateNode = null) : (f2.childLanes = g2.childLanes, f2.lanes = g2.lanes, f2.child = g2.child, f2.subtreeFlags = 0, f2.deletions = null, f2.memoizedProps = g2.memoizedProps, f2.memoizedState = g2.memoizedState, f2.updateQueue = g2.updateQueue, f2.type = g2.type, a3 = g2.dependencies, f2.dependencies = null === a3 ? null : { lanes: a3.lanes, firstContext: a3.firstContext }), c2 = c2.sibling;
            G$2(L, L.current & 1 | 2);
            return b2.child;
          }
          a3 = a3.sibling;
        }
        null !== f2.tail && B() > Gj && (b2.flags |= 128, d2 = true, Dj(f2, false), b2.lanes = 4194304);
      }
      else {
        if (!d2) if (a3 = Ch(g2), null !== a3) {
          if (b2.flags |= 128, d2 = true, c2 = a3.updateQueue, null !== c2 && (b2.updateQueue = c2, b2.flags |= 4), Dj(f2, true), null === f2.tail && "hidden" === f2.tailMode && !g2.alternate && !I$6) return S$6(b2), null;
        } else 2 * B() - f2.renderingStartTime > Gj && 1073741824 !== c2 && (b2.flags |= 128, d2 = true, Dj(f2, false), b2.lanes = 4194304);
        f2.isBackwards ? (g2.sibling = b2.child, b2.child = g2) : (c2 = f2.last, null !== c2 ? c2.sibling = g2 : b2.child = g2, f2.last = g2);
      }
      if (null !== f2.tail) return b2 = f2.tail, f2.rendering = b2, f2.tail = b2.sibling, f2.renderingStartTime = B(), b2.sibling = null, c2 = L.current, G$2(L, d2 ? c2 & 1 | 2 : c2 & 1), b2;
      S$6(b2);
      return null;
    case 22:
    case 23:
      return Hj(), d2 = null !== b2.memoizedState, null !== a3 && null !== a3.memoizedState !== d2 && (b2.flags |= 8192), d2 && 0 !== (b2.mode & 1) ? 0 !== (fj & 1073741824) && (S$6(b2), b2.subtreeFlags & 6 && (b2.flags |= 8192)) : S$6(b2), null;
    case 24:
      return null;
    case 25:
      return null;
  }
  throw Error(p$4(156, b2.tag));
}
function Ij(a3, b2) {
  wg(b2);
  switch (b2.tag) {
    case 1:
      return Zf(b2.type) && $f(), a3 = b2.flags, a3 & 65536 ? (b2.flags = a3 & -65537 | 128, b2) : null;
    case 3:
      return zh(), E$2(Wf), E$2(H$3), Eh(), a3 = b2.flags, 0 !== (a3 & 65536) && 0 === (a3 & 128) ? (b2.flags = a3 & -65537 | 128, b2) : null;
    case 5:
      return Bh(b2), null;
    case 13:
      E$2(L);
      a3 = b2.memoizedState;
      if (null !== a3 && null !== a3.dehydrated) {
        if (null === b2.alternate) throw Error(p$4(340));
        Ig();
      }
      a3 = b2.flags;
      return a3 & 65536 ? (b2.flags = a3 & -65537 | 128, b2) : null;
    case 19:
      return E$2(L), null;
    case 4:
      return zh(), null;
    case 10:
      return ah(b2.type._context), null;
    case 22:
    case 23:
      return Hj(), null;
    case 24:
      return null;
    default:
      return null;
  }
}
var Jj = false, U$1 = false, Kj = "function" === typeof WeakSet ? WeakSet : Set, V$1 = null;
function Lj(a3, b2) {
  var c2 = a3.ref;
  if (null !== c2) if ("function" === typeof c2) try {
    c2(null);
  } catch (d2) {
    W$1(a3, b2, d2);
  }
  else c2.current = null;
}
function Mj(a3, b2, c2) {
  try {
    c2();
  } catch (d2) {
    W$1(a3, b2, d2);
  }
}
var Nj = false;
function Oj(a3, b2) {
  Cf = dd;
  a3 = Me();
  if (Ne$1(a3)) {
    if ("selectionStart" in a3) var c2 = { start: a3.selectionStart, end: a3.selectionEnd };
    else a: {
      c2 = (c2 = a3.ownerDocument) && c2.defaultView || window;
      var d2 = c2.getSelection && c2.getSelection();
      if (d2 && 0 !== d2.rangeCount) {
        c2 = d2.anchorNode;
        var e2 = d2.anchorOffset, f2 = d2.focusNode;
        d2 = d2.focusOffset;
        try {
          c2.nodeType, f2.nodeType;
        } catch (F2) {
          c2 = null;
          break a;
        }
        var g2 = 0, h2 = -1, k2 = -1, l2 = 0, m2 = 0, q2 = a3, r2 = null;
        b: for (; ; ) {
          for (var y2; ; ) {
            q2 !== c2 || 0 !== e2 && 3 !== q2.nodeType || (h2 = g2 + e2);
            q2 !== f2 || 0 !== d2 && 3 !== q2.nodeType || (k2 = g2 + d2);
            3 === q2.nodeType && (g2 += q2.nodeValue.length);
            if (null === (y2 = q2.firstChild)) break;
            r2 = q2;
            q2 = y2;
          }
          for (; ; ) {
            if (q2 === a3) break b;
            r2 === c2 && ++l2 === e2 && (h2 = g2);
            r2 === f2 && ++m2 === d2 && (k2 = g2);
            if (null !== (y2 = q2.nextSibling)) break;
            q2 = r2;
            r2 = q2.parentNode;
          }
          q2 = y2;
        }
        c2 = -1 === h2 || -1 === k2 ? null : { start: h2, end: k2 };
      } else c2 = null;
    }
    c2 = c2 || { start: 0, end: 0 };
  } else c2 = null;
  Df = { focusedElem: a3, selectionRange: c2 };
  dd = false;
  for (V$1 = b2; null !== V$1; ) if (b2 = V$1, a3 = b2.child, 0 !== (b2.subtreeFlags & 1028) && null !== a3) a3.return = b2, V$1 = a3;
  else for (; null !== V$1; ) {
    b2 = V$1;
    try {
      var n2 = b2.alternate;
      if (0 !== (b2.flags & 1024)) switch (b2.tag) {
        case 0:
        case 11:
        case 15:
          break;
        case 1:
          if (null !== n2) {
            var t2 = n2.memoizedProps, J2 = n2.memoizedState, x2 = b2.stateNode, w2 = x2.getSnapshotBeforeUpdate(b2.elementType === b2.type ? t2 : Ci(b2.type, t2), J2);
            x2.__reactInternalSnapshotBeforeUpdate = w2;
          }
          break;
        case 3:
          var u2 = b2.stateNode.containerInfo;
          1 === u2.nodeType ? u2.textContent = "" : 9 === u2.nodeType && u2.documentElement && u2.removeChild(u2.documentElement);
          break;
        case 5:
        case 6:
        case 4:
        case 17:
          break;
        default:
          throw Error(p$4(163));
      }
    } catch (F2) {
      W$1(b2, b2.return, F2);
    }
    a3 = b2.sibling;
    if (null !== a3) {
      a3.return = b2.return;
      V$1 = a3;
      break;
    }
    V$1 = b2.return;
  }
  n2 = Nj;
  Nj = false;
  return n2;
}
function Pj(a3, b2, c2) {
  var d2 = b2.updateQueue;
  d2 = null !== d2 ? d2.lastEffect : null;
  if (null !== d2) {
    var e2 = d2 = d2.next;
    do {
      if ((e2.tag & a3) === a3) {
        var f2 = e2.destroy;
        e2.destroy = void 0;
        void 0 !== f2 && Mj(b2, c2, f2);
      }
      e2 = e2.next;
    } while (e2 !== d2);
  }
}
function Qj(a3, b2) {
  b2 = b2.updateQueue;
  b2 = null !== b2 ? b2.lastEffect : null;
  if (null !== b2) {
    var c2 = b2 = b2.next;
    do {
      if ((c2.tag & a3) === a3) {
        var d2 = c2.create;
        c2.destroy = d2();
      }
      c2 = c2.next;
    } while (c2 !== b2);
  }
}
function Rj(a3) {
  var b2 = a3.ref;
  if (null !== b2) {
    var c2 = a3.stateNode;
    switch (a3.tag) {
      case 5:
        a3 = c2;
        break;
      default:
        a3 = c2;
    }
    "function" === typeof b2 ? b2(a3) : b2.current = a3;
  }
}
function Sj(a3) {
  var b2 = a3.alternate;
  null !== b2 && (a3.alternate = null, Sj(b2));
  a3.child = null;
  a3.deletions = null;
  a3.sibling = null;
  5 === a3.tag && (b2 = a3.stateNode, null !== b2 && (delete b2[Of], delete b2[Pf], delete b2[of], delete b2[Qf], delete b2[Rf]));
  a3.stateNode = null;
  a3.return = null;
  a3.dependencies = null;
  a3.memoizedProps = null;
  a3.memoizedState = null;
  a3.pendingProps = null;
  a3.stateNode = null;
  a3.updateQueue = null;
}
function Tj(a3) {
  return 5 === a3.tag || 3 === a3.tag || 4 === a3.tag;
}
function Uj(a3) {
  a: for (; ; ) {
    for (; null === a3.sibling; ) {
      if (null === a3.return || Tj(a3.return)) return null;
      a3 = a3.return;
    }
    a3.sibling.return = a3.return;
    for (a3 = a3.sibling; 5 !== a3.tag && 6 !== a3.tag && 18 !== a3.tag; ) {
      if (a3.flags & 2) continue a;
      if (null === a3.child || 4 === a3.tag) continue a;
      else a3.child.return = a3, a3 = a3.child;
    }
    if (!(a3.flags & 2)) return a3.stateNode;
  }
}
function Vj(a3, b2, c2) {
  var d2 = a3.tag;
  if (5 === d2 || 6 === d2) a3 = a3.stateNode, b2 ? 8 === c2.nodeType ? c2.parentNode.insertBefore(a3, b2) : c2.insertBefore(a3, b2) : (8 === c2.nodeType ? (b2 = c2.parentNode, b2.insertBefore(a3, c2)) : (b2 = c2, b2.appendChild(a3)), c2 = c2._reactRootContainer, null !== c2 && void 0 !== c2 || null !== b2.onclick || (b2.onclick = Bf));
  else if (4 !== d2 && (a3 = a3.child, null !== a3)) for (Vj(a3, b2, c2), a3 = a3.sibling; null !== a3; ) Vj(a3, b2, c2), a3 = a3.sibling;
}
function Wj(a3, b2, c2) {
  var d2 = a3.tag;
  if (5 === d2 || 6 === d2) a3 = a3.stateNode, b2 ? c2.insertBefore(a3, b2) : c2.appendChild(a3);
  else if (4 !== d2 && (a3 = a3.child, null !== a3)) for (Wj(a3, b2, c2), a3 = a3.sibling; null !== a3; ) Wj(a3, b2, c2), a3 = a3.sibling;
}
var X$2 = null, Xj = false;
function Yj(a3, b2, c2) {
  for (c2 = c2.child; null !== c2; ) Zj(a3, b2, c2), c2 = c2.sibling;
}
function Zj(a3, b2, c2) {
  if (lc && "function" === typeof lc.onCommitFiberUnmount) try {
    lc.onCommitFiberUnmount(kc, c2);
  } catch (h2) {
  }
  switch (c2.tag) {
    case 5:
      U$1 || Lj(c2, b2);
    case 6:
      var d2 = X$2, e2 = Xj;
      X$2 = null;
      Yj(a3, b2, c2);
      X$2 = d2;
      Xj = e2;
      null !== X$2 && (Xj ? (a3 = X$2, c2 = c2.stateNode, 8 === a3.nodeType ? a3.parentNode.removeChild(c2) : a3.removeChild(c2)) : X$2.removeChild(c2.stateNode));
      break;
    case 18:
      null !== X$2 && (Xj ? (a3 = X$2, c2 = c2.stateNode, 8 === a3.nodeType ? Kf(a3.parentNode, c2) : 1 === a3.nodeType && Kf(a3, c2), bd(a3)) : Kf(X$2, c2.stateNode));
      break;
    case 4:
      d2 = X$2;
      e2 = Xj;
      X$2 = c2.stateNode.containerInfo;
      Xj = true;
      Yj(a3, b2, c2);
      X$2 = d2;
      Xj = e2;
      break;
    case 0:
    case 11:
    case 14:
    case 15:
      if (!U$1 && (d2 = c2.updateQueue, null !== d2 && (d2 = d2.lastEffect, null !== d2))) {
        e2 = d2 = d2.next;
        do {
          var f2 = e2, g2 = f2.destroy;
          f2 = f2.tag;
          void 0 !== g2 && (0 !== (f2 & 2) ? Mj(c2, b2, g2) : 0 !== (f2 & 4) && Mj(c2, b2, g2));
          e2 = e2.next;
        } while (e2 !== d2);
      }
      Yj(a3, b2, c2);
      break;
    case 1:
      if (!U$1 && (Lj(c2, b2), d2 = c2.stateNode, "function" === typeof d2.componentWillUnmount)) try {
        d2.props = c2.memoizedProps, d2.state = c2.memoizedState, d2.componentWillUnmount();
      } catch (h2) {
        W$1(c2, b2, h2);
      }
      Yj(a3, b2, c2);
      break;
    case 21:
      Yj(a3, b2, c2);
      break;
    case 22:
      c2.mode & 1 ? (U$1 = (d2 = U$1) || null !== c2.memoizedState, Yj(a3, b2, c2), U$1 = d2) : Yj(a3, b2, c2);
      break;
    default:
      Yj(a3, b2, c2);
  }
}
function ak(a3) {
  var b2 = a3.updateQueue;
  if (null !== b2) {
    a3.updateQueue = null;
    var c2 = a3.stateNode;
    null === c2 && (c2 = a3.stateNode = new Kj());
    b2.forEach(function(b3) {
      var d2 = bk.bind(null, a3, b3);
      c2.has(b3) || (c2.add(b3), b3.then(d2, d2));
    });
  }
}
function ck(a3, b2) {
  var c2 = b2.deletions;
  if (null !== c2) for (var d2 = 0; d2 < c2.length; d2++) {
    var e2 = c2[d2];
    try {
      var f2 = a3, g2 = b2, h2 = g2;
      a: for (; null !== h2; ) {
        switch (h2.tag) {
          case 5:
            X$2 = h2.stateNode;
            Xj = false;
            break a;
          case 3:
            X$2 = h2.stateNode.containerInfo;
            Xj = true;
            break a;
          case 4:
            X$2 = h2.stateNode.containerInfo;
            Xj = true;
            break a;
        }
        h2 = h2.return;
      }
      if (null === X$2) throw Error(p$4(160));
      Zj(f2, g2, e2);
      X$2 = null;
      Xj = false;
      var k2 = e2.alternate;
      null !== k2 && (k2.return = null);
      e2.return = null;
    } catch (l2) {
      W$1(e2, b2, l2);
    }
  }
  if (b2.subtreeFlags & 12854) for (b2 = b2.child; null !== b2; ) dk(b2, a3), b2 = b2.sibling;
}
function dk(a3, b2) {
  var c2 = a3.alternate, d2 = a3.flags;
  switch (a3.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      ck(b2, a3);
      ek(a3);
      if (d2 & 4) {
        try {
          Pj(3, a3, a3.return), Qj(3, a3);
        } catch (t2) {
          W$1(a3, a3.return, t2);
        }
        try {
          Pj(5, a3, a3.return);
        } catch (t2) {
          W$1(a3, a3.return, t2);
        }
      }
      break;
    case 1:
      ck(b2, a3);
      ek(a3);
      d2 & 512 && null !== c2 && Lj(c2, c2.return);
      break;
    case 5:
      ck(b2, a3);
      ek(a3);
      d2 & 512 && null !== c2 && Lj(c2, c2.return);
      if (a3.flags & 32) {
        var e2 = a3.stateNode;
        try {
          ob(e2, "");
        } catch (t2) {
          W$1(a3, a3.return, t2);
        }
      }
      if (d2 & 4 && (e2 = a3.stateNode, null != e2)) {
        var f2 = a3.memoizedProps, g2 = null !== c2 ? c2.memoizedProps : f2, h2 = a3.type, k2 = a3.updateQueue;
        a3.updateQueue = null;
        if (null !== k2) try {
          "input" === h2 && "radio" === f2.type && null != f2.name && ab(e2, f2);
          vb(h2, g2);
          var l2 = vb(h2, f2);
          for (g2 = 0; g2 < k2.length; g2 += 2) {
            var m2 = k2[g2], q2 = k2[g2 + 1];
            "style" === m2 ? sb(e2, q2) : "dangerouslySetInnerHTML" === m2 ? nb(e2, q2) : "children" === m2 ? ob(e2, q2) : ta(e2, m2, q2, l2);
          }
          switch (h2) {
            case "input":
              bb(e2, f2);
              break;
            case "textarea":
              ib(e2, f2);
              break;
            case "select":
              var r2 = e2._wrapperState.wasMultiple;
              e2._wrapperState.wasMultiple = !!f2.multiple;
              var y2 = f2.value;
              null != y2 ? fb(e2, !!f2.multiple, y2, false) : r2 !== !!f2.multiple && (null != f2.defaultValue ? fb(
                e2,
                !!f2.multiple,
                f2.defaultValue,
                true
              ) : fb(e2, !!f2.multiple, f2.multiple ? [] : "", false));
          }
          e2[Pf] = f2;
        } catch (t2) {
          W$1(a3, a3.return, t2);
        }
      }
      break;
    case 6:
      ck(b2, a3);
      ek(a3);
      if (d2 & 4) {
        if (null === a3.stateNode) throw Error(p$4(162));
        e2 = a3.stateNode;
        f2 = a3.memoizedProps;
        try {
          e2.nodeValue = f2;
        } catch (t2) {
          W$1(a3, a3.return, t2);
        }
      }
      break;
    case 3:
      ck(b2, a3);
      ek(a3);
      if (d2 & 4 && null !== c2 && c2.memoizedState.isDehydrated) try {
        bd(b2.containerInfo);
      } catch (t2) {
        W$1(a3, a3.return, t2);
      }
      break;
    case 4:
      ck(b2, a3);
      ek(a3);
      break;
    case 13:
      ck(b2, a3);
      ek(a3);
      e2 = a3.child;
      e2.flags & 8192 && (f2 = null !== e2.memoizedState, e2.stateNode.isHidden = f2, !f2 || null !== e2.alternate && null !== e2.alternate.memoizedState || (fk = B()));
      d2 & 4 && ak(a3);
      break;
    case 22:
      m2 = null !== c2 && null !== c2.memoizedState;
      a3.mode & 1 ? (U$1 = (l2 = U$1) || m2, ck(b2, a3), U$1 = l2) : ck(b2, a3);
      ek(a3);
      if (d2 & 8192) {
        l2 = null !== a3.memoizedState;
        if ((a3.stateNode.isHidden = l2) && !m2 && 0 !== (a3.mode & 1)) for (V$1 = a3, m2 = a3.child; null !== m2; ) {
          for (q2 = V$1 = m2; null !== V$1; ) {
            r2 = V$1;
            y2 = r2.child;
            switch (r2.tag) {
              case 0:
              case 11:
              case 14:
              case 15:
                Pj(4, r2, r2.return);
                break;
              case 1:
                Lj(r2, r2.return);
                var n2 = r2.stateNode;
                if ("function" === typeof n2.componentWillUnmount) {
                  d2 = r2;
                  c2 = r2.return;
                  try {
                    b2 = d2, n2.props = b2.memoizedProps, n2.state = b2.memoizedState, n2.componentWillUnmount();
                  } catch (t2) {
                    W$1(d2, c2, t2);
                  }
                }
                break;
              case 5:
                Lj(r2, r2.return);
                break;
              case 22:
                if (null !== r2.memoizedState) {
                  gk(q2);
                  continue;
                }
            }
            null !== y2 ? (y2.return = r2, V$1 = y2) : gk(q2);
          }
          m2 = m2.sibling;
        }
        a: for (m2 = null, q2 = a3; ; ) {
          if (5 === q2.tag) {
            if (null === m2) {
              m2 = q2;
              try {
                e2 = q2.stateNode, l2 ? (f2 = e2.style, "function" === typeof f2.setProperty ? f2.setProperty("display", "none", "important") : f2.display = "none") : (h2 = q2.stateNode, k2 = q2.memoizedProps.style, g2 = void 0 !== k2 && null !== k2 && k2.hasOwnProperty("display") ? k2.display : null, h2.style.display = rb("display", g2));
              } catch (t2) {
                W$1(a3, a3.return, t2);
              }
            }
          } else if (6 === q2.tag) {
            if (null === m2) try {
              q2.stateNode.nodeValue = l2 ? "" : q2.memoizedProps;
            } catch (t2) {
              W$1(a3, a3.return, t2);
            }
          } else if ((22 !== q2.tag && 23 !== q2.tag || null === q2.memoizedState || q2 === a3) && null !== q2.child) {
            q2.child.return = q2;
            q2 = q2.child;
            continue;
          }
          if (q2 === a3) break a;
          for (; null === q2.sibling; ) {
            if (null === q2.return || q2.return === a3) break a;
            m2 === q2 && (m2 = null);
            q2 = q2.return;
          }
          m2 === q2 && (m2 = null);
          q2.sibling.return = q2.return;
          q2 = q2.sibling;
        }
      }
      break;
    case 19:
      ck(b2, a3);
      ek(a3);
      d2 & 4 && ak(a3);
      break;
    case 21:
      break;
    default:
      ck(
        b2,
        a3
      ), ek(a3);
  }
}
function ek(a3) {
  var b2 = a3.flags;
  if (b2 & 2) {
    try {
      a: {
        for (var c2 = a3.return; null !== c2; ) {
          if (Tj(c2)) {
            var d2 = c2;
            break a;
          }
          c2 = c2.return;
        }
        throw Error(p$4(160));
      }
      switch (d2.tag) {
        case 5:
          var e2 = d2.stateNode;
          d2.flags & 32 && (ob(e2, ""), d2.flags &= -33);
          var f2 = Uj(a3);
          Wj(a3, f2, e2);
          break;
        case 3:
        case 4:
          var g2 = d2.stateNode.containerInfo, h2 = Uj(a3);
          Vj(a3, h2, g2);
          break;
        default:
          throw Error(p$4(161));
      }
    } catch (k2) {
      W$1(a3, a3.return, k2);
    }
    a3.flags &= -3;
  }
  b2 & 4096 && (a3.flags &= -4097);
}
function hk(a3, b2, c2) {
  V$1 = a3;
  ik(a3);
}
function ik(a3, b2, c2) {
  for (var d2 = 0 !== (a3.mode & 1); null !== V$1; ) {
    var e2 = V$1, f2 = e2.child;
    if (22 === e2.tag && d2) {
      var g2 = null !== e2.memoizedState || Jj;
      if (!g2) {
        var h2 = e2.alternate, k2 = null !== h2 && null !== h2.memoizedState || U$1;
        h2 = Jj;
        var l2 = U$1;
        Jj = g2;
        if ((U$1 = k2) && !l2) for (V$1 = e2; null !== V$1; ) g2 = V$1, k2 = g2.child, 22 === g2.tag && null !== g2.memoizedState ? jk(e2) : null !== k2 ? (k2.return = g2, V$1 = k2) : jk(e2);
        for (; null !== f2; ) V$1 = f2, ik(f2), f2 = f2.sibling;
        V$1 = e2;
        Jj = h2;
        U$1 = l2;
      }
      kk(a3);
    } else 0 !== (e2.subtreeFlags & 8772) && null !== f2 ? (f2.return = e2, V$1 = f2) : kk(a3);
  }
}
function kk(a3) {
  for (; null !== V$1; ) {
    var b2 = V$1;
    if (0 !== (b2.flags & 8772)) {
      var c2 = b2.alternate;
      try {
        if (0 !== (b2.flags & 8772)) switch (b2.tag) {
          case 0:
          case 11:
          case 15:
            U$1 || Qj(5, b2);
            break;
          case 1:
            var d2 = b2.stateNode;
            if (b2.flags & 4 && !U$1) if (null === c2) d2.componentDidMount();
            else {
              var e2 = b2.elementType === b2.type ? c2.memoizedProps : Ci(b2.type, c2.memoizedProps);
              d2.componentDidUpdate(e2, c2.memoizedState, d2.__reactInternalSnapshotBeforeUpdate);
            }
            var f2 = b2.updateQueue;
            null !== f2 && sh(b2, f2, d2);
            break;
          case 3:
            var g2 = b2.updateQueue;
            if (null !== g2) {
              c2 = null;
              if (null !== b2.child) switch (b2.child.tag) {
                case 5:
                  c2 = b2.child.stateNode;
                  break;
                case 1:
                  c2 = b2.child.stateNode;
              }
              sh(b2, g2, c2);
            }
            break;
          case 5:
            var h2 = b2.stateNode;
            if (null === c2 && b2.flags & 4) {
              c2 = h2;
              var k2 = b2.memoizedProps;
              switch (b2.type) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  k2.autoFocus && c2.focus();
                  break;
                case "img":
                  k2.src && (c2.src = k2.src);
              }
            }
            break;
          case 6:
            break;
          case 4:
            break;
          case 12:
            break;
          case 13:
            if (null === b2.memoizedState) {
              var l2 = b2.alternate;
              if (null !== l2) {
                var m2 = l2.memoizedState;
                if (null !== m2) {
                  var q2 = m2.dehydrated;
                  null !== q2 && bd(q2);
                }
              }
            }
            break;
          case 19:
          case 17:
          case 21:
          case 22:
          case 23:
          case 25:
            break;
          default:
            throw Error(p$4(163));
        }
        U$1 || b2.flags & 512 && Rj(b2);
      } catch (r2) {
        W$1(b2, b2.return, r2);
      }
    }
    if (b2 === a3) {
      V$1 = null;
      break;
    }
    c2 = b2.sibling;
    if (null !== c2) {
      c2.return = b2.return;
      V$1 = c2;
      break;
    }
    V$1 = b2.return;
  }
}
function gk(a3) {
  for (; null !== V$1; ) {
    var b2 = V$1;
    if (b2 === a3) {
      V$1 = null;
      break;
    }
    var c2 = b2.sibling;
    if (null !== c2) {
      c2.return = b2.return;
      V$1 = c2;
      break;
    }
    V$1 = b2.return;
  }
}
function jk(a3) {
  for (; null !== V$1; ) {
    var b2 = V$1;
    try {
      switch (b2.tag) {
        case 0:
        case 11:
        case 15:
          var c2 = b2.return;
          try {
            Qj(4, b2);
          } catch (k2) {
            W$1(b2, c2, k2);
          }
          break;
        case 1:
          var d2 = b2.stateNode;
          if ("function" === typeof d2.componentDidMount) {
            var e2 = b2.return;
            try {
              d2.componentDidMount();
            } catch (k2) {
              W$1(b2, e2, k2);
            }
          }
          var f2 = b2.return;
          try {
            Rj(b2);
          } catch (k2) {
            W$1(b2, f2, k2);
          }
          break;
        case 5:
          var g2 = b2.return;
          try {
            Rj(b2);
          } catch (k2) {
            W$1(b2, g2, k2);
          }
      }
    } catch (k2) {
      W$1(b2, b2.return, k2);
    }
    if (b2 === a3) {
      V$1 = null;
      break;
    }
    var h2 = b2.sibling;
    if (null !== h2) {
      h2.return = b2.return;
      V$1 = h2;
      break;
    }
    V$1 = b2.return;
  }
}
var lk = Math.ceil, mk = ua.ReactCurrentDispatcher, nk = ua.ReactCurrentOwner, ok = ua.ReactCurrentBatchConfig, K$1 = 0, Q = null, Y$1 = null, Z = 0, fj = 0, ej = Uf(0), T$4 = 0, pk = null, rh = 0, qk = 0, rk = 0, sk = null, tk = null, fk = 0, Gj = Infinity, uk = null, Oi = false, Pi = null, Ri = null, vk = false, wk = null, xk = 0, yk = 0, zk = null, Ak = -1, Bk = 0;
function R() {
  return 0 !== (K$1 & 6) ? B() : -1 !== Ak ? Ak : Ak = B();
}
function yi(a3) {
  if (0 === (a3.mode & 1)) return 1;
  if (0 !== (K$1 & 2) && 0 !== Z) return Z & -Z;
  if (null !== Kg.transition) return 0 === Bk && (Bk = yc()), Bk;
  a3 = C$5;
  if (0 !== a3) return a3;
  a3 = window.event;
  a3 = void 0 === a3 ? 16 : jd(a3.type);
  return a3;
}
function gi(a3, b2, c2, d2) {
  if (50 < yk) throw yk = 0, zk = null, Error(p$4(185));
  Ac(a3, c2, d2);
  if (0 === (K$1 & 2) || a3 !== Q) a3 === Q && (0 === (K$1 & 2) && (qk |= c2), 4 === T$4 && Ck(a3, Z)), Dk(a3, d2), 1 === c2 && 0 === K$1 && 0 === (b2.mode & 1) && (Gj = B() + 500, fg && jg());
}
function Dk(a3, b2) {
  var c2 = a3.callbackNode;
  wc(a3, b2);
  var d2 = uc(a3, a3 === Q ? Z : 0);
  if (0 === d2) null !== c2 && bc(c2), a3.callbackNode = null, a3.callbackPriority = 0;
  else if (b2 = d2 & -d2, a3.callbackPriority !== b2) {
    null != c2 && bc(c2);
    if (1 === b2) 0 === a3.tag ? ig(Ek.bind(null, a3)) : hg(Ek.bind(null, a3)), Jf(function() {
      0 === (K$1 & 6) && jg();
    }), c2 = null;
    else {
      switch (Dc(d2)) {
        case 1:
          c2 = fc;
          break;
        case 4:
          c2 = gc;
          break;
        case 16:
          c2 = hc;
          break;
        case 536870912:
          c2 = jc;
          break;
        default:
          c2 = hc;
      }
      c2 = Fk(c2, Gk.bind(null, a3));
    }
    a3.callbackPriority = b2;
    a3.callbackNode = c2;
  }
}
function Gk(a3, b2) {
  Ak = -1;
  Bk = 0;
  if (0 !== (K$1 & 6)) throw Error(p$4(327));
  var c2 = a3.callbackNode;
  if (Hk() && a3.callbackNode !== c2) return null;
  var d2 = uc(a3, a3 === Q ? Z : 0);
  if (0 === d2) return null;
  if (0 !== (d2 & 30) || 0 !== (d2 & a3.expiredLanes) || b2) b2 = Ik(a3, d2);
  else {
    b2 = d2;
    var e2 = K$1;
    K$1 |= 2;
    var f2 = Jk();
    if (Q !== a3 || Z !== b2) uk = null, Gj = B() + 500, Kk(a3, b2);
    do
      try {
        Lk();
        break;
      } catch (h2) {
        Mk(a3, h2);
      }
    while (1);
    $g();
    mk.current = f2;
    K$1 = e2;
    null !== Y$1 ? b2 = 0 : (Q = null, Z = 0, b2 = T$4);
  }
  if (0 !== b2) {
    2 === b2 && (e2 = xc(a3), 0 !== e2 && (d2 = e2, b2 = Nk(a3, e2)));
    if (1 === b2) throw c2 = pk, Kk(a3, 0), Ck(a3, d2), Dk(a3, B()), c2;
    if (6 === b2) Ck(a3, d2);
    else {
      e2 = a3.current.alternate;
      if (0 === (d2 & 30) && !Ok(e2) && (b2 = Ik(a3, d2), 2 === b2 && (f2 = xc(a3), 0 !== f2 && (d2 = f2, b2 = Nk(a3, f2))), 1 === b2)) throw c2 = pk, Kk(a3, 0), Ck(a3, d2), Dk(a3, B()), c2;
      a3.finishedWork = e2;
      a3.finishedLanes = d2;
      switch (b2) {
        case 0:
        case 1:
          throw Error(p$4(345));
        case 2:
          Pk(a3, tk, uk);
          break;
        case 3:
          Ck(a3, d2);
          if ((d2 & 130023424) === d2 && (b2 = fk + 500 - B(), 10 < b2)) {
            if (0 !== uc(a3, 0)) break;
            e2 = a3.suspendedLanes;
            if ((e2 & d2) !== d2) {
              R();
              a3.pingedLanes |= a3.suspendedLanes & e2;
              break;
            }
            a3.timeoutHandle = Ff(Pk.bind(null, a3, tk, uk), b2);
            break;
          }
          Pk(a3, tk, uk);
          break;
        case 4:
          Ck(a3, d2);
          if ((d2 & 4194240) === d2) break;
          b2 = a3.eventTimes;
          for (e2 = -1; 0 < d2; ) {
            var g2 = 31 - oc(d2);
            f2 = 1 << g2;
            g2 = b2[g2];
            g2 > e2 && (e2 = g2);
            d2 &= ~f2;
          }
          d2 = e2;
          d2 = B() - d2;
          d2 = (120 > d2 ? 120 : 480 > d2 ? 480 : 1080 > d2 ? 1080 : 1920 > d2 ? 1920 : 3e3 > d2 ? 3e3 : 4320 > d2 ? 4320 : 1960 * lk(d2 / 1960)) - d2;
          if (10 < d2) {
            a3.timeoutHandle = Ff(Pk.bind(null, a3, tk, uk), d2);
            break;
          }
          Pk(a3, tk, uk);
          break;
        case 5:
          Pk(a3, tk, uk);
          break;
        default:
          throw Error(p$4(329));
      }
    }
  }
  Dk(a3, B());
  return a3.callbackNode === c2 ? Gk.bind(null, a3) : null;
}
function Nk(a3, b2) {
  var c2 = sk;
  a3.current.memoizedState.isDehydrated && (Kk(a3, b2).flags |= 256);
  a3 = Ik(a3, b2);
  2 !== a3 && (b2 = tk, tk = c2, null !== b2 && Fj(b2));
  return a3;
}
function Fj(a3) {
  null === tk ? tk = a3 : tk.push.apply(tk, a3);
}
function Ok(a3) {
  for (var b2 = a3; ; ) {
    if (b2.flags & 16384) {
      var c2 = b2.updateQueue;
      if (null !== c2 && (c2 = c2.stores, null !== c2)) for (var d2 = 0; d2 < c2.length; d2++) {
        var e2 = c2[d2], f2 = e2.getSnapshot;
        e2 = e2.value;
        try {
          if (!He$2(f2(), e2)) return false;
        } catch (g2) {
          return false;
        }
      }
    }
    c2 = b2.child;
    if (b2.subtreeFlags & 16384 && null !== c2) c2.return = b2, b2 = c2;
    else {
      if (b2 === a3) break;
      for (; null === b2.sibling; ) {
        if (null === b2.return || b2.return === a3) return true;
        b2 = b2.return;
      }
      b2.sibling.return = b2.return;
      b2 = b2.sibling;
    }
  }
  return true;
}
function Ck(a3, b2) {
  b2 &= ~rk;
  b2 &= ~qk;
  a3.suspendedLanes |= b2;
  a3.pingedLanes &= ~b2;
  for (a3 = a3.expirationTimes; 0 < b2; ) {
    var c2 = 31 - oc(b2), d2 = 1 << c2;
    a3[c2] = -1;
    b2 &= ~d2;
  }
}
function Ek(a3) {
  if (0 !== (K$1 & 6)) throw Error(p$4(327));
  Hk();
  var b2 = uc(a3, 0);
  if (0 === (b2 & 1)) return Dk(a3, B()), null;
  var c2 = Ik(a3, b2);
  if (0 !== a3.tag && 2 === c2) {
    var d2 = xc(a3);
    0 !== d2 && (b2 = d2, c2 = Nk(a3, d2));
  }
  if (1 === c2) throw c2 = pk, Kk(a3, 0), Ck(a3, b2), Dk(a3, B()), c2;
  if (6 === c2) throw Error(p$4(345));
  a3.finishedWork = a3.current.alternate;
  a3.finishedLanes = b2;
  Pk(a3, tk, uk);
  Dk(a3, B());
  return null;
}
function Qk(a3, b2) {
  var c2 = K$1;
  K$1 |= 1;
  try {
    return a3(b2);
  } finally {
    K$1 = c2, 0 === K$1 && (Gj = B() + 500, fg && jg());
  }
}
function Rk(a3) {
  null !== wk && 0 === wk.tag && 0 === (K$1 & 6) && Hk();
  var b2 = K$1;
  K$1 |= 1;
  var c2 = ok.transition, d2 = C$5;
  try {
    if (ok.transition = null, C$5 = 1, a3) return a3();
  } finally {
    C$5 = d2, ok.transition = c2, K$1 = b2, 0 === (K$1 & 6) && jg();
  }
}
function Hj() {
  fj = ej.current;
  E$2(ej);
}
function Kk(a3, b2) {
  a3.finishedWork = null;
  a3.finishedLanes = 0;
  var c2 = a3.timeoutHandle;
  -1 !== c2 && (a3.timeoutHandle = -1, Gf(c2));
  if (null !== Y$1) for (c2 = Y$1.return; null !== c2; ) {
    var d2 = c2;
    wg(d2);
    switch (d2.tag) {
      case 1:
        d2 = d2.type.childContextTypes;
        null !== d2 && void 0 !== d2 && $f();
        break;
      case 3:
        zh();
        E$2(Wf);
        E$2(H$3);
        Eh();
        break;
      case 5:
        Bh(d2);
        break;
      case 4:
        zh();
        break;
      case 13:
        E$2(L);
        break;
      case 19:
        E$2(L);
        break;
      case 10:
        ah(d2.type._context);
        break;
      case 22:
      case 23:
        Hj();
    }
    c2 = c2.return;
  }
  Q = a3;
  Y$1 = a3 = Pg(a3.current, null);
  Z = fj = b2;
  T$4 = 0;
  pk = null;
  rk = qk = rh = 0;
  tk = sk = null;
  if (null !== fh) {
    for (b2 = 0; b2 < fh.length; b2++) if (c2 = fh[b2], d2 = c2.interleaved, null !== d2) {
      c2.interleaved = null;
      var e2 = d2.next, f2 = c2.pending;
      if (null !== f2) {
        var g2 = f2.next;
        f2.next = e2;
        d2.next = g2;
      }
      c2.pending = d2;
    }
    fh = null;
  }
  return a3;
}
function Mk(a3, b2) {
  do {
    var c2 = Y$1;
    try {
      $g();
      Fh.current = Rh;
      if (Ih) {
        for (var d2 = M$3.memoizedState; null !== d2; ) {
          var e2 = d2.queue;
          null !== e2 && (e2.pending = null);
          d2 = d2.next;
        }
        Ih = false;
      }
      Hh = 0;
      O$2 = N$1 = M$3 = null;
      Jh = false;
      Kh = 0;
      nk.current = null;
      if (null === c2 || null === c2.return) {
        T$4 = 1;
        pk = b2;
        Y$1 = null;
        break;
      }
      a: {
        var f2 = a3, g2 = c2.return, h2 = c2, k2 = b2;
        b2 = Z;
        h2.flags |= 32768;
        if (null !== k2 && "object" === typeof k2 && "function" === typeof k2.then) {
          var l2 = k2, m2 = h2, q2 = m2.tag;
          if (0 === (m2.mode & 1) && (0 === q2 || 11 === q2 || 15 === q2)) {
            var r2 = m2.alternate;
            r2 ? (m2.updateQueue = r2.updateQueue, m2.memoizedState = r2.memoizedState, m2.lanes = r2.lanes) : (m2.updateQueue = null, m2.memoizedState = null);
          }
          var y2 = Ui(g2);
          if (null !== y2) {
            y2.flags &= -257;
            Vi(y2, g2, h2, f2, b2);
            y2.mode & 1 && Si(f2, l2, b2);
            b2 = y2;
            k2 = l2;
            var n2 = b2.updateQueue;
            if (null === n2) {
              var t2 = /* @__PURE__ */ new Set();
              t2.add(k2);
              b2.updateQueue = t2;
            } else n2.add(k2);
            break a;
          } else {
            if (0 === (b2 & 1)) {
              Si(f2, l2, b2);
              tj();
              break a;
            }
            k2 = Error(p$4(426));
          }
        } else if (I$6 && h2.mode & 1) {
          var J2 = Ui(g2);
          if (null !== J2) {
            0 === (J2.flags & 65536) && (J2.flags |= 256);
            Vi(J2, g2, h2, f2, b2);
            Jg(Ji(k2, h2));
            break a;
          }
        }
        f2 = k2 = Ji(k2, h2);
        4 !== T$4 && (T$4 = 2);
        null === sk ? sk = [f2] : sk.push(f2);
        f2 = g2;
        do {
          switch (f2.tag) {
            case 3:
              f2.flags |= 65536;
              b2 &= -b2;
              f2.lanes |= b2;
              var x2 = Ni(f2, k2, b2);
              ph(f2, x2);
              break a;
            case 1:
              h2 = k2;
              var w2 = f2.type, u2 = f2.stateNode;
              if (0 === (f2.flags & 128) && ("function" === typeof w2.getDerivedStateFromError || null !== u2 && "function" === typeof u2.componentDidCatch && (null === Ri || !Ri.has(u2)))) {
                f2.flags |= 65536;
                b2 &= -b2;
                f2.lanes |= b2;
                var F2 = Qi(f2, h2, b2);
                ph(f2, F2);
                break a;
              }
          }
          f2 = f2.return;
        } while (null !== f2);
      }
      Sk(c2);
    } catch (na) {
      b2 = na;
      Y$1 === c2 && null !== c2 && (Y$1 = c2 = c2.return);
      continue;
    }
    break;
  } while (1);
}
function Jk() {
  var a3 = mk.current;
  mk.current = Rh;
  return null === a3 ? Rh : a3;
}
function tj() {
  if (0 === T$4 || 3 === T$4 || 2 === T$4) T$4 = 4;
  null === Q || 0 === (rh & 268435455) && 0 === (qk & 268435455) || Ck(Q, Z);
}
function Ik(a3, b2) {
  var c2 = K$1;
  K$1 |= 2;
  var d2 = Jk();
  if (Q !== a3 || Z !== b2) uk = null, Kk(a3, b2);
  do
    try {
      Tk();
      break;
    } catch (e2) {
      Mk(a3, e2);
    }
  while (1);
  $g();
  K$1 = c2;
  mk.current = d2;
  if (null !== Y$1) throw Error(p$4(261));
  Q = null;
  Z = 0;
  return T$4;
}
function Tk() {
  for (; null !== Y$1; ) Uk(Y$1);
}
function Lk() {
  for (; null !== Y$1 && !cc(); ) Uk(Y$1);
}
function Uk(a3) {
  var b2 = Vk(a3.alternate, a3, fj);
  a3.memoizedProps = a3.pendingProps;
  null === b2 ? Sk(a3) : Y$1 = b2;
  nk.current = null;
}
function Sk(a3) {
  var b2 = a3;
  do {
    var c2 = b2.alternate;
    a3 = b2.return;
    if (0 === (b2.flags & 32768)) {
      if (c2 = Ej(c2, b2, fj), null !== c2) {
        Y$1 = c2;
        return;
      }
    } else {
      c2 = Ij(c2, b2);
      if (null !== c2) {
        c2.flags &= 32767;
        Y$1 = c2;
        return;
      }
      if (null !== a3) a3.flags |= 32768, a3.subtreeFlags = 0, a3.deletions = null;
      else {
        T$4 = 6;
        Y$1 = null;
        return;
      }
    }
    b2 = b2.sibling;
    if (null !== b2) {
      Y$1 = b2;
      return;
    }
    Y$1 = b2 = a3;
  } while (null !== b2);
  0 === T$4 && (T$4 = 5);
}
function Pk(a3, b2, c2) {
  var d2 = C$5, e2 = ok.transition;
  try {
    ok.transition = null, C$5 = 1, Wk(a3, b2, c2, d2);
  } finally {
    ok.transition = e2, C$5 = d2;
  }
  return null;
}
function Wk(a3, b2, c2, d2) {
  do
    Hk();
  while (null !== wk);
  if (0 !== (K$1 & 6)) throw Error(p$4(327));
  c2 = a3.finishedWork;
  var e2 = a3.finishedLanes;
  if (null === c2) return null;
  a3.finishedWork = null;
  a3.finishedLanes = 0;
  if (c2 === a3.current) throw Error(p$4(177));
  a3.callbackNode = null;
  a3.callbackPriority = 0;
  var f2 = c2.lanes | c2.childLanes;
  Bc(a3, f2);
  a3 === Q && (Y$1 = Q = null, Z = 0);
  0 === (c2.subtreeFlags & 2064) && 0 === (c2.flags & 2064) || vk || (vk = true, Fk(hc, function() {
    Hk();
    return null;
  }));
  f2 = 0 !== (c2.flags & 15990);
  if (0 !== (c2.subtreeFlags & 15990) || f2) {
    f2 = ok.transition;
    ok.transition = null;
    var g2 = C$5;
    C$5 = 1;
    var h2 = K$1;
    K$1 |= 4;
    nk.current = null;
    Oj(a3, c2);
    dk(c2, a3);
    Oe$1(Df);
    dd = !!Cf;
    Df = Cf = null;
    a3.current = c2;
    hk(c2);
    dc();
    K$1 = h2;
    C$5 = g2;
    ok.transition = f2;
  } else a3.current = c2;
  vk && (vk = false, wk = a3, xk = e2);
  f2 = a3.pendingLanes;
  0 === f2 && (Ri = null);
  mc(c2.stateNode);
  Dk(a3, B());
  if (null !== b2) for (d2 = a3.onRecoverableError, c2 = 0; c2 < b2.length; c2++) e2 = b2[c2], d2(e2.value, { componentStack: e2.stack, digest: e2.digest });
  if (Oi) throw Oi = false, a3 = Pi, Pi = null, a3;
  0 !== (xk & 1) && 0 !== a3.tag && Hk();
  f2 = a3.pendingLanes;
  0 !== (f2 & 1) ? a3 === zk ? yk++ : (yk = 0, zk = a3) : yk = 0;
  jg();
  return null;
}
function Hk() {
  if (null !== wk) {
    var a3 = Dc(xk), b2 = ok.transition, c2 = C$5;
    try {
      ok.transition = null;
      C$5 = 16 > a3 ? 16 : a3;
      if (null === wk) var d2 = false;
      else {
        a3 = wk;
        wk = null;
        xk = 0;
        if (0 !== (K$1 & 6)) throw Error(p$4(331));
        var e2 = K$1;
        K$1 |= 4;
        for (V$1 = a3.current; null !== V$1; ) {
          var f2 = V$1, g2 = f2.child;
          if (0 !== (V$1.flags & 16)) {
            var h2 = f2.deletions;
            if (null !== h2) {
              for (var k2 = 0; k2 < h2.length; k2++) {
                var l2 = h2[k2];
                for (V$1 = l2; null !== V$1; ) {
                  var m2 = V$1;
                  switch (m2.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Pj(8, m2, f2);
                  }
                  var q2 = m2.child;
                  if (null !== q2) q2.return = m2, V$1 = q2;
                  else for (; null !== V$1; ) {
                    m2 = V$1;
                    var r2 = m2.sibling, y2 = m2.return;
                    Sj(m2);
                    if (m2 === l2) {
                      V$1 = null;
                      break;
                    }
                    if (null !== r2) {
                      r2.return = y2;
                      V$1 = r2;
                      break;
                    }
                    V$1 = y2;
                  }
                }
              }
              var n2 = f2.alternate;
              if (null !== n2) {
                var t2 = n2.child;
                if (null !== t2) {
                  n2.child = null;
                  do {
                    var J2 = t2.sibling;
                    t2.sibling = null;
                    t2 = J2;
                  } while (null !== t2);
                }
              }
              V$1 = f2;
            }
          }
          if (0 !== (f2.subtreeFlags & 2064) && null !== g2) g2.return = f2, V$1 = g2;
          else b: for (; null !== V$1; ) {
            f2 = V$1;
            if (0 !== (f2.flags & 2048)) switch (f2.tag) {
              case 0:
              case 11:
              case 15:
                Pj(9, f2, f2.return);
            }
            var x2 = f2.sibling;
            if (null !== x2) {
              x2.return = f2.return;
              V$1 = x2;
              break b;
            }
            V$1 = f2.return;
          }
        }
        var w2 = a3.current;
        for (V$1 = w2; null !== V$1; ) {
          g2 = V$1;
          var u2 = g2.child;
          if (0 !== (g2.subtreeFlags & 2064) && null !== u2) u2.return = g2, V$1 = u2;
          else b: for (g2 = w2; null !== V$1; ) {
            h2 = V$1;
            if (0 !== (h2.flags & 2048)) try {
              switch (h2.tag) {
                case 0:
                case 11:
                case 15:
                  Qj(9, h2);
              }
            } catch (na) {
              W$1(h2, h2.return, na);
            }
            if (h2 === g2) {
              V$1 = null;
              break b;
            }
            var F2 = h2.sibling;
            if (null !== F2) {
              F2.return = h2.return;
              V$1 = F2;
              break b;
            }
            V$1 = h2.return;
          }
        }
        K$1 = e2;
        jg();
        if (lc && "function" === typeof lc.onPostCommitFiberRoot) try {
          lc.onPostCommitFiberRoot(kc, a3);
        } catch (na) {
        }
        d2 = true;
      }
      return d2;
    } finally {
      C$5 = c2, ok.transition = b2;
    }
  }
  return false;
}
function Xk(a3, b2, c2) {
  b2 = Ji(c2, b2);
  b2 = Ni(a3, b2, 1);
  a3 = nh(a3, b2, 1);
  b2 = R();
  null !== a3 && (Ac(a3, 1, b2), Dk(a3, b2));
}
function W$1(a3, b2, c2) {
  if (3 === a3.tag) Xk(a3, a3, c2);
  else for (; null !== b2; ) {
    if (3 === b2.tag) {
      Xk(b2, a3, c2);
      break;
    } else if (1 === b2.tag) {
      var d2 = b2.stateNode;
      if ("function" === typeof b2.type.getDerivedStateFromError || "function" === typeof d2.componentDidCatch && (null === Ri || !Ri.has(d2))) {
        a3 = Ji(c2, a3);
        a3 = Qi(b2, a3, 1);
        b2 = nh(b2, a3, 1);
        a3 = R();
        null !== b2 && (Ac(b2, 1, a3), Dk(b2, a3));
        break;
      }
    }
    b2 = b2.return;
  }
}
function Ti(a3, b2, c2) {
  var d2 = a3.pingCache;
  null !== d2 && d2.delete(b2);
  b2 = R();
  a3.pingedLanes |= a3.suspendedLanes & c2;
  Q === a3 && (Z & c2) === c2 && (4 === T$4 || 3 === T$4 && (Z & 130023424) === Z && 500 > B() - fk ? Kk(a3, 0) : rk |= c2);
  Dk(a3, b2);
}
function Yk(a3, b2) {
  0 === b2 && (0 === (a3.mode & 1) ? b2 = 1 : (b2 = sc, sc <<= 1, 0 === (sc & 130023424) && (sc = 4194304)));
  var c2 = R();
  a3 = ih(a3, b2);
  null !== a3 && (Ac(a3, b2, c2), Dk(a3, c2));
}
function uj(a3) {
  var b2 = a3.memoizedState, c2 = 0;
  null !== b2 && (c2 = b2.retryLane);
  Yk(a3, c2);
}
function bk(a3, b2) {
  var c2 = 0;
  switch (a3.tag) {
    case 13:
      var d2 = a3.stateNode;
      var e2 = a3.memoizedState;
      null !== e2 && (c2 = e2.retryLane);
      break;
    case 19:
      d2 = a3.stateNode;
      break;
    default:
      throw Error(p$4(314));
  }
  null !== d2 && d2.delete(b2);
  Yk(a3, c2);
}
var Vk;
Vk = function(a3, b2, c2) {
  if (null !== a3) if (a3.memoizedProps !== b2.pendingProps || Wf.current) dh = true;
  else {
    if (0 === (a3.lanes & c2) && 0 === (b2.flags & 128)) return dh = false, yj(a3, b2, c2);
    dh = 0 !== (a3.flags & 131072) ? true : false;
  }
  else dh = false, I$6 && 0 !== (b2.flags & 1048576) && ug(b2, ng, b2.index);
  b2.lanes = 0;
  switch (b2.tag) {
    case 2:
      var d2 = b2.type;
      ij(a3, b2);
      a3 = b2.pendingProps;
      var e2 = Yf(b2, H$3.current);
      ch(b2, c2);
      e2 = Nh(null, b2, d2, a3, e2, c2);
      var f2 = Sh();
      b2.flags |= 1;
      "object" === typeof e2 && null !== e2 && "function" === typeof e2.render && void 0 === e2.$$typeof ? (b2.tag = 1, b2.memoizedState = null, b2.updateQueue = null, Zf(d2) ? (f2 = true, cg(b2)) : f2 = false, b2.memoizedState = null !== e2.state && void 0 !== e2.state ? e2.state : null, kh(b2), e2.updater = Ei, b2.stateNode = e2, e2._reactInternals = b2, Ii(b2, d2, a3, c2), b2 = jj(null, b2, d2, true, f2, c2)) : (b2.tag = 0, I$6 && f2 && vg(b2), Xi(null, b2, e2, c2), b2 = b2.child);
      return b2;
    case 16:
      d2 = b2.elementType;
      a: {
        ij(a3, b2);
        a3 = b2.pendingProps;
        e2 = d2._init;
        d2 = e2(d2._payload);
        b2.type = d2;
        e2 = b2.tag = Zk(d2);
        a3 = Ci(d2, a3);
        switch (e2) {
          case 0:
            b2 = cj(null, b2, d2, a3, c2);
            break a;
          case 1:
            b2 = hj(null, b2, d2, a3, c2);
            break a;
          case 11:
            b2 = Yi(null, b2, d2, a3, c2);
            break a;
          case 14:
            b2 = $i(null, b2, d2, Ci(d2.type, a3), c2);
            break a;
        }
        throw Error(p$4(
          306,
          d2,
          ""
        ));
      }
      return b2;
    case 0:
      return d2 = b2.type, e2 = b2.pendingProps, e2 = b2.elementType === d2 ? e2 : Ci(d2, e2), cj(a3, b2, d2, e2, c2);
    case 1:
      return d2 = b2.type, e2 = b2.pendingProps, e2 = b2.elementType === d2 ? e2 : Ci(d2, e2), hj(a3, b2, d2, e2, c2);
    case 3:
      a: {
        kj(b2);
        if (null === a3) throw Error(p$4(387));
        d2 = b2.pendingProps;
        f2 = b2.memoizedState;
        e2 = f2.element;
        lh(a3, b2);
        qh(b2, d2, null, c2);
        var g2 = b2.memoizedState;
        d2 = g2.element;
        if (f2.isDehydrated) if (f2 = { element: d2, isDehydrated: false, cache: g2.cache, pendingSuspenseBoundaries: g2.pendingSuspenseBoundaries, transitions: g2.transitions }, b2.updateQueue.baseState = f2, b2.memoizedState = f2, b2.flags & 256) {
          e2 = Ji(Error(p$4(423)), b2);
          b2 = lj(a3, b2, d2, c2, e2);
          break a;
        } else if (d2 !== e2) {
          e2 = Ji(Error(p$4(424)), b2);
          b2 = lj(a3, b2, d2, c2, e2);
          break a;
        } else for (yg = Lf(b2.stateNode.containerInfo.firstChild), xg = b2, I$6 = true, zg = null, c2 = Vg(b2, null, d2, c2), b2.child = c2; c2; ) c2.flags = c2.flags & -3 | 4096, c2 = c2.sibling;
        else {
          Ig();
          if (d2 === e2) {
            b2 = Zi(a3, b2, c2);
            break a;
          }
          Xi(a3, b2, d2, c2);
        }
        b2 = b2.child;
      }
      return b2;
    case 5:
      return Ah(b2), null === a3 && Eg(b2), d2 = b2.type, e2 = b2.pendingProps, f2 = null !== a3 ? a3.memoizedProps : null, g2 = e2.children, Ef(d2, e2) ? g2 = null : null !== f2 && Ef(d2, f2) && (b2.flags |= 32), gj(a3, b2), Xi(a3, b2, g2, c2), b2.child;
    case 6:
      return null === a3 && Eg(b2), null;
    case 13:
      return oj(a3, b2, c2);
    case 4:
      return yh(b2, b2.stateNode.containerInfo), d2 = b2.pendingProps, null === a3 ? b2.child = Ug(b2, null, d2, c2) : Xi(a3, b2, d2, c2), b2.child;
    case 11:
      return d2 = b2.type, e2 = b2.pendingProps, e2 = b2.elementType === d2 ? e2 : Ci(d2, e2), Yi(a3, b2, d2, e2, c2);
    case 7:
      return Xi(a3, b2, b2.pendingProps, c2), b2.child;
    case 8:
      return Xi(a3, b2, b2.pendingProps.children, c2), b2.child;
    case 12:
      return Xi(a3, b2, b2.pendingProps.children, c2), b2.child;
    case 10:
      a: {
        d2 = b2.type._context;
        e2 = b2.pendingProps;
        f2 = b2.memoizedProps;
        g2 = e2.value;
        G$2(Wg, d2._currentValue);
        d2._currentValue = g2;
        if (null !== f2) if (He$2(f2.value, g2)) {
          if (f2.children === e2.children && !Wf.current) {
            b2 = Zi(a3, b2, c2);
            break a;
          }
        } else for (f2 = b2.child, null !== f2 && (f2.return = b2); null !== f2; ) {
          var h2 = f2.dependencies;
          if (null !== h2) {
            g2 = f2.child;
            for (var k2 = h2.firstContext; null !== k2; ) {
              if (k2.context === d2) {
                if (1 === f2.tag) {
                  k2 = mh(-1, c2 & -c2);
                  k2.tag = 2;
                  var l2 = f2.updateQueue;
                  if (null !== l2) {
                    l2 = l2.shared;
                    var m2 = l2.pending;
                    null === m2 ? k2.next = k2 : (k2.next = m2.next, m2.next = k2);
                    l2.pending = k2;
                  }
                }
                f2.lanes |= c2;
                k2 = f2.alternate;
                null !== k2 && (k2.lanes |= c2);
                bh(
                  f2.return,
                  c2,
                  b2
                );
                h2.lanes |= c2;
                break;
              }
              k2 = k2.next;
            }
          } else if (10 === f2.tag) g2 = f2.type === b2.type ? null : f2.child;
          else if (18 === f2.tag) {
            g2 = f2.return;
            if (null === g2) throw Error(p$4(341));
            g2.lanes |= c2;
            h2 = g2.alternate;
            null !== h2 && (h2.lanes |= c2);
            bh(g2, c2, b2);
            g2 = f2.sibling;
          } else g2 = f2.child;
          if (null !== g2) g2.return = f2;
          else for (g2 = f2; null !== g2; ) {
            if (g2 === b2) {
              g2 = null;
              break;
            }
            f2 = g2.sibling;
            if (null !== f2) {
              f2.return = g2.return;
              g2 = f2;
              break;
            }
            g2 = g2.return;
          }
          f2 = g2;
        }
        Xi(a3, b2, e2.children, c2);
        b2 = b2.child;
      }
      return b2;
    case 9:
      return e2 = b2.type, d2 = b2.pendingProps.children, ch(b2, c2), e2 = eh(e2), d2 = d2(e2), b2.flags |= 1, Xi(a3, b2, d2, c2), b2.child;
    case 14:
      return d2 = b2.type, e2 = Ci(d2, b2.pendingProps), e2 = Ci(d2.type, e2), $i(a3, b2, d2, e2, c2);
    case 15:
      return bj(a3, b2, b2.type, b2.pendingProps, c2);
    case 17:
      return d2 = b2.type, e2 = b2.pendingProps, e2 = b2.elementType === d2 ? e2 : Ci(d2, e2), ij(a3, b2), b2.tag = 1, Zf(d2) ? (a3 = true, cg(b2)) : a3 = false, ch(b2, c2), Gi(b2, d2, e2), Ii(b2, d2, e2, c2), jj(null, b2, d2, true, a3, c2);
    case 19:
      return xj(a3, b2, c2);
    case 22:
      return dj(a3, b2, c2);
  }
  throw Error(p$4(156, b2.tag));
};
function Fk(a3, b2) {
  return ac(a3, b2);
}
function $k(a3, b2, c2, d2) {
  this.tag = a3;
  this.key = c2;
  this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null;
  this.index = 0;
  this.ref = null;
  this.pendingProps = b2;
  this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null;
  this.mode = d2;
  this.subtreeFlags = this.flags = 0;
  this.deletions = null;
  this.childLanes = this.lanes = 0;
  this.alternate = null;
}
function Bg(a3, b2, c2, d2) {
  return new $k(a3, b2, c2, d2);
}
function aj(a3) {
  a3 = a3.prototype;
  return !(!a3 || !a3.isReactComponent);
}
function Zk(a3) {
  if ("function" === typeof a3) return aj(a3) ? 1 : 0;
  if (void 0 !== a3 && null !== a3) {
    a3 = a3.$$typeof;
    if (a3 === Da) return 11;
    if (a3 === Ga) return 14;
  }
  return 2;
}
function Pg(a3, b2) {
  var c2 = a3.alternate;
  null === c2 ? (c2 = Bg(a3.tag, b2, a3.key, a3.mode), c2.elementType = a3.elementType, c2.type = a3.type, c2.stateNode = a3.stateNode, c2.alternate = a3, a3.alternate = c2) : (c2.pendingProps = b2, c2.type = a3.type, c2.flags = 0, c2.subtreeFlags = 0, c2.deletions = null);
  c2.flags = a3.flags & 14680064;
  c2.childLanes = a3.childLanes;
  c2.lanes = a3.lanes;
  c2.child = a3.child;
  c2.memoizedProps = a3.memoizedProps;
  c2.memoizedState = a3.memoizedState;
  c2.updateQueue = a3.updateQueue;
  b2 = a3.dependencies;
  c2.dependencies = null === b2 ? null : { lanes: b2.lanes, firstContext: b2.firstContext };
  c2.sibling = a3.sibling;
  c2.index = a3.index;
  c2.ref = a3.ref;
  return c2;
}
function Rg(a3, b2, c2, d2, e2, f2) {
  var g2 = 2;
  d2 = a3;
  if ("function" === typeof a3) aj(a3) && (g2 = 1);
  else if ("string" === typeof a3) g2 = 5;
  else a: switch (a3) {
    case ya:
      return Tg(c2.children, e2, f2, b2);
    case za:
      g2 = 8;
      e2 |= 8;
      break;
    case Aa:
      return a3 = Bg(12, c2, b2, e2 | 2), a3.elementType = Aa, a3.lanes = f2, a3;
    case Ea:
      return a3 = Bg(13, c2, b2, e2), a3.elementType = Ea, a3.lanes = f2, a3;
    case Fa:
      return a3 = Bg(19, c2, b2, e2), a3.elementType = Fa, a3.lanes = f2, a3;
    case Ia:
      return pj(c2, e2, f2, b2);
    default:
      if ("object" === typeof a3 && null !== a3) switch (a3.$$typeof) {
        case Ba:
          g2 = 10;
          break a;
        case Ca:
          g2 = 9;
          break a;
        case Da:
          g2 = 11;
          break a;
        case Ga:
          g2 = 14;
          break a;
        case Ha:
          g2 = 16;
          d2 = null;
          break a;
      }
      throw Error(p$4(130, null == a3 ? a3 : typeof a3, ""));
  }
  b2 = Bg(g2, c2, b2, e2);
  b2.elementType = a3;
  b2.type = d2;
  b2.lanes = f2;
  return b2;
}
function Tg(a3, b2, c2, d2) {
  a3 = Bg(7, a3, d2, b2);
  a3.lanes = c2;
  return a3;
}
function pj(a3, b2, c2, d2) {
  a3 = Bg(22, a3, d2, b2);
  a3.elementType = Ia;
  a3.lanes = c2;
  a3.stateNode = { isHidden: false };
  return a3;
}
function Qg(a3, b2, c2) {
  a3 = Bg(6, a3, null, b2);
  a3.lanes = c2;
  return a3;
}
function Sg(a3, b2, c2) {
  b2 = Bg(4, null !== a3.children ? a3.children : [], a3.key, b2);
  b2.lanes = c2;
  b2.stateNode = { containerInfo: a3.containerInfo, pendingChildren: null, implementation: a3.implementation };
  return b2;
}
function al(a3, b2, c2, d2, e2) {
  this.tag = b2;
  this.containerInfo = a3;
  this.finishedWork = this.pingCache = this.current = this.pendingChildren = null;
  this.timeoutHandle = -1;
  this.callbackNode = this.pendingContext = this.context = null;
  this.callbackPriority = 0;
  this.eventTimes = zc(0);
  this.expirationTimes = zc(-1);
  this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0;
  this.entanglements = zc(0);
  this.identifierPrefix = d2;
  this.onRecoverableError = e2;
  this.mutableSourceEagerHydrationData = null;
}
function bl(a3, b2, c2, d2, e2, f2, g2, h2, k2) {
  a3 = new al(a3, b2, c2, h2, k2);
  1 === b2 ? (b2 = 1, true === f2 && (b2 |= 8)) : b2 = 0;
  f2 = Bg(3, null, null, b2);
  a3.current = f2;
  f2.stateNode = a3;
  f2.memoizedState = { element: d2, isDehydrated: c2, cache: null, transitions: null, pendingSuspenseBoundaries: null };
  kh(f2);
  return a3;
}
function cl(a3, b2, c2) {
  var d2 = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
  return { $$typeof: wa, key: null == d2 ? null : "" + d2, children: a3, containerInfo: b2, implementation: c2 };
}
function dl(a3) {
  if (!a3) return Vf;
  a3 = a3._reactInternals;
  a: {
    if (Vb(a3) !== a3 || 1 !== a3.tag) throw Error(p$4(170));
    var b2 = a3;
    do {
      switch (b2.tag) {
        case 3:
          b2 = b2.stateNode.context;
          break a;
        case 1:
          if (Zf(b2.type)) {
            b2 = b2.stateNode.__reactInternalMemoizedMergedChildContext;
            break a;
          }
      }
      b2 = b2.return;
    } while (null !== b2);
    throw Error(p$4(171));
  }
  if (1 === a3.tag) {
    var c2 = a3.type;
    if (Zf(c2)) return bg(a3, c2, b2);
  }
  return b2;
}
function el(a3, b2, c2, d2, e2, f2, g2, h2, k2) {
  a3 = bl(c2, d2, true, a3, e2, f2, g2, h2, k2);
  a3.context = dl(null);
  c2 = a3.current;
  d2 = R();
  e2 = yi(c2);
  f2 = mh(d2, e2);
  f2.callback = void 0 !== b2 && null !== b2 ? b2 : null;
  nh(c2, f2, e2);
  a3.current.lanes = e2;
  Ac(a3, e2, d2);
  Dk(a3, d2);
  return a3;
}
function fl(a3, b2, c2, d2) {
  var e2 = b2.current, f2 = R(), g2 = yi(e2);
  c2 = dl(c2);
  null === b2.context ? b2.context = c2 : b2.pendingContext = c2;
  b2 = mh(f2, g2);
  b2.payload = { element: a3 };
  d2 = void 0 === d2 ? null : d2;
  null !== d2 && (b2.callback = d2);
  a3 = nh(e2, b2, g2);
  null !== a3 && (gi(a3, e2, g2, f2), oh(a3, e2, g2));
  return g2;
}
function gl(a3) {
  a3 = a3.current;
  if (!a3.child) return null;
  switch (a3.child.tag) {
    case 5:
      return a3.child.stateNode;
    default:
      return a3.child.stateNode;
  }
}
function hl(a3, b2) {
  a3 = a3.memoizedState;
  if (null !== a3 && null !== a3.dehydrated) {
    var c2 = a3.retryLane;
    a3.retryLane = 0 !== c2 && c2 < b2 ? c2 : b2;
  }
}
function il(a3, b2) {
  hl(a3, b2);
  (a3 = a3.alternate) && hl(a3, b2);
}
function jl() {
  return null;
}
var kl = "function" === typeof reportError ? reportError : function(a3) {
  console.error(a3);
};
function ll(a3) {
  this._internalRoot = a3;
}
ml.prototype.render = ll.prototype.render = function(a3) {
  var b2 = this._internalRoot;
  if (null === b2) throw Error(p$4(409));
  fl(a3, b2, null, null);
};
ml.prototype.unmount = ll.prototype.unmount = function() {
  var a3 = this._internalRoot;
  if (null !== a3) {
    this._internalRoot = null;
    var b2 = a3.containerInfo;
    Rk(function() {
      fl(null, a3, null, null);
    });
    b2[uf] = null;
  }
};
function ml(a3) {
  this._internalRoot = a3;
}
ml.prototype.unstable_scheduleHydration = function(a3) {
  if (a3) {
    var b2 = Hc();
    a3 = { blockedOn: null, target: a3, priority: b2 };
    for (var c2 = 0; c2 < Qc.length && 0 !== b2 && b2 < Qc[c2].priority; c2++) ;
    Qc.splice(c2, 0, a3);
    0 === c2 && Vc(a3);
  }
};
function nl(a3) {
  return !(!a3 || 1 !== a3.nodeType && 9 !== a3.nodeType && 11 !== a3.nodeType);
}
function ol(a3) {
  return !(!a3 || 1 !== a3.nodeType && 9 !== a3.nodeType && 11 !== a3.nodeType && (8 !== a3.nodeType || " react-mount-point-unstable " !== a3.nodeValue));
}
function pl() {
}
function ql(a3, b2, c2, d2, e2) {
  if (e2) {
    if ("function" === typeof d2) {
      var f2 = d2;
      d2 = function() {
        var a4 = gl(g2);
        f2.call(a4);
      };
    }
    var g2 = el(b2, d2, a3, 0, null, false, false, "", pl);
    a3._reactRootContainer = g2;
    a3[uf] = g2.current;
    sf(8 === a3.nodeType ? a3.parentNode : a3);
    Rk();
    return g2;
  }
  for (; e2 = a3.lastChild; ) a3.removeChild(e2);
  if ("function" === typeof d2) {
    var h2 = d2;
    d2 = function() {
      var a4 = gl(k2);
      h2.call(a4);
    };
  }
  var k2 = bl(a3, 0, false, null, null, false, false, "", pl);
  a3._reactRootContainer = k2;
  a3[uf] = k2.current;
  sf(8 === a3.nodeType ? a3.parentNode : a3);
  Rk(function() {
    fl(b2, k2, c2, d2);
  });
  return k2;
}
function rl(a3, b2, c2, d2, e2) {
  var f2 = c2._reactRootContainer;
  if (f2) {
    var g2 = f2;
    if ("function" === typeof e2) {
      var h2 = e2;
      e2 = function() {
        var a4 = gl(g2);
        h2.call(a4);
      };
    }
    fl(b2, g2, a3, e2);
  } else g2 = ql(c2, b2, a3, e2, d2);
  return gl(g2);
}
Ec = function(a3) {
  switch (a3.tag) {
    case 3:
      var b2 = a3.stateNode;
      if (b2.current.memoizedState.isDehydrated) {
        var c2 = tc(b2.pendingLanes);
        0 !== c2 && (Cc(b2, c2 | 1), Dk(b2, B()), 0 === (K$1 & 6) && (Gj = B() + 500, jg()));
      }
      break;
    case 13:
      Rk(function() {
        var b3 = ih(a3, 1);
        if (null !== b3) {
          var c3 = R();
          gi(b3, a3, 1, c3);
        }
      }), il(a3, 1);
  }
};
Fc = function(a3) {
  if (13 === a3.tag) {
    var b2 = ih(a3, 134217728);
    if (null !== b2) {
      var c2 = R();
      gi(b2, a3, 134217728, c2);
    }
    il(a3, 134217728);
  }
};
Gc = function(a3) {
  if (13 === a3.tag) {
    var b2 = yi(a3), c2 = ih(a3, b2);
    if (null !== c2) {
      var d2 = R();
      gi(c2, a3, b2, d2);
    }
    il(a3, b2);
  }
};
Hc = function() {
  return C$5;
};
Ic = function(a3, b2) {
  var c2 = C$5;
  try {
    return C$5 = a3, b2();
  } finally {
    C$5 = c2;
  }
};
yb = function(a3, b2, c2) {
  switch (b2) {
    case "input":
      bb(a3, c2);
      b2 = c2.name;
      if ("radio" === c2.type && null != b2) {
        for (c2 = a3; c2.parentNode; ) c2 = c2.parentNode;
        c2 = c2.querySelectorAll("input[name=" + JSON.stringify("" + b2) + '][type="radio"]');
        for (b2 = 0; b2 < c2.length; b2++) {
          var d2 = c2[b2];
          if (d2 !== a3 && d2.form === a3.form) {
            var e2 = Db(d2);
            if (!e2) throw Error(p$4(90));
            Wa(d2);
            bb(d2, e2);
          }
        }
      }
      break;
    case "textarea":
      ib(a3, c2);
      break;
    case "select":
      b2 = c2.value, null != b2 && fb(a3, !!c2.multiple, b2, false);
  }
};
Gb = Qk;
Hb = Rk;
var sl = { usingClientEntryPoint: false, Events: [Cb, ue$1, Db, Eb, Fb, Qk] }, tl = { findFiberByHostInstance: Wc, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" };
var ul = { bundleType: tl.bundleType, version: tl.version, rendererPackageName: tl.rendererPackageName, rendererConfig: tl.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: ua.ReactCurrentDispatcher, findHostInstanceByFiber: function(a3) {
  a3 = Zb(a3);
  return null === a3 ? null : a3.stateNode;
}, findFiberByHostInstance: tl.findFiberByHostInstance || jl, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
if ("undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) {
  var vl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!vl.isDisabled && vl.supportsFiber) try {
    kc = vl.inject(ul), lc = vl;
  } catch (a3) {
  }
}
reactDom_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = sl;
reactDom_production_min.createPortal = function(a3, b2) {
  var c2 = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
  if (!nl(b2)) throw Error(p$4(200));
  return cl(a3, b2, null, c2);
};
reactDom_production_min.createRoot = function(a3, b2) {
  if (!nl(a3)) throw Error(p$4(299));
  var c2 = false, d2 = "", e2 = kl;
  null !== b2 && void 0 !== b2 && (true === b2.unstable_strictMode && (c2 = true), void 0 !== b2.identifierPrefix && (d2 = b2.identifierPrefix), void 0 !== b2.onRecoverableError && (e2 = b2.onRecoverableError));
  b2 = bl(a3, 1, false, null, null, c2, false, d2, e2);
  a3[uf] = b2.current;
  sf(8 === a3.nodeType ? a3.parentNode : a3);
  return new ll(b2);
};
reactDom_production_min.findDOMNode = function(a3) {
  if (null == a3) return null;
  if (1 === a3.nodeType) return a3;
  var b2 = a3._reactInternals;
  if (void 0 === b2) {
    if ("function" === typeof a3.render) throw Error(p$4(188));
    a3 = Object.keys(a3).join(",");
    throw Error(p$4(268, a3));
  }
  a3 = Zb(b2);
  a3 = null === a3 ? null : a3.stateNode;
  return a3;
};
reactDom_production_min.flushSync = function(a3) {
  return Rk(a3);
};
reactDom_production_min.hydrate = function(a3, b2, c2) {
  if (!ol(b2)) throw Error(p$4(200));
  return rl(null, a3, b2, true, c2);
};
reactDom_production_min.hydrateRoot = function(a3, b2, c2) {
  if (!nl(a3)) throw Error(p$4(405));
  var d2 = null != c2 && c2.hydratedSources || null, e2 = false, f2 = "", g2 = kl;
  null !== c2 && void 0 !== c2 && (true === c2.unstable_strictMode && (e2 = true), void 0 !== c2.identifierPrefix && (f2 = c2.identifierPrefix), void 0 !== c2.onRecoverableError && (g2 = c2.onRecoverableError));
  b2 = el(b2, null, a3, 1, null != c2 ? c2 : null, e2, false, f2, g2);
  a3[uf] = b2.current;
  sf(a3);
  if (d2) for (a3 = 0; a3 < d2.length; a3++) c2 = d2[a3], e2 = c2._getVersion, e2 = e2(c2._source), null == b2.mutableSourceEagerHydrationData ? b2.mutableSourceEagerHydrationData = [c2, e2] : b2.mutableSourceEagerHydrationData.push(
    c2,
    e2
  );
  return new ml(b2);
};
reactDom_production_min.render = function(a3, b2, c2) {
  if (!ol(b2)) throw Error(p$4(200));
  return rl(null, a3, b2, false, c2);
};
reactDom_production_min.unmountComponentAtNode = function(a3) {
  if (!ol(a3)) throw Error(p$4(40));
  return a3._reactRootContainer ? (Rk(function() {
    rl(null, null, a3, false, function() {
      a3._reactRootContainer = null;
      a3[uf] = null;
    });
  }), true) : false;
};
reactDom_production_min.unstable_batchedUpdates = Qk;
reactDom_production_min.unstable_renderSubtreeIntoContainer = function(a3, b2, c2, d2) {
  if (!ol(c2)) throw Error(p$4(200));
  if (null == a3 || void 0 === a3._reactInternals) throw Error(p$4(38));
  return rl(a3, b2, c2, false, d2);
};
reactDom_production_min.version = "18.3.1-next-f1338f8080-20240426";
function checkDCE() {
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
    return;
  }
  try {
    __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
  } catch (err) {
    console.error(err);
  }
}
{
  checkDCE();
  reactDom.exports = reactDom_production_min;
}
var reactDomExports = reactDom.exports;
var m$4 = reactDomExports;
{
  client.createRoot = m$4.createRoot;
  client.hydrateRoot = m$4.hydrateRoot;
}
/**
 * @remix-run/router v1.23.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
function _extends$1() {
  _extends$1 = Object.assign ? Object.assign.bind() : function(target) {
    for (var i2 = 1; i2 < arguments.length; i2++) {
      var source = arguments[i2];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$1.apply(this, arguments);
}
var Action;
(function(Action2) {
  Action2["Pop"] = "POP";
  Action2["Push"] = "PUSH";
  Action2["Replace"] = "REPLACE";
})(Action || (Action = {}));
const PopStateEventType = "popstate";
function createBrowserHistory(options) {
  if (options === void 0) {
    options = {};
  }
  function createBrowserLocation(window2, globalHistory) {
    let {
      pathname,
      search,
      hash
    } = window2.location;
    return createLocation(
      "",
      {
        pathname,
        search,
        hash
      },
      // state defaults to `null` because `window.history.state` does
      globalHistory.state && globalHistory.state.usr || null,
      globalHistory.state && globalHistory.state.key || "default"
    );
  }
  function createBrowserHref(window2, to) {
    return typeof to === "string" ? to : createPath(to);
  }
  return getUrlBasedHistory(createBrowserLocation, createBrowserHref, null, options);
}
function invariant(value, message) {
  if (value === false || value === null || typeof value === "undefined") {
    throw new Error(message);
  }
}
function warning(cond, message) {
  if (!cond) {
    if (typeof console !== "undefined") console.warn(message);
    try {
      throw new Error(message);
    } catch (e2) {
    }
  }
}
function createKey() {
  return Math.random().toString(36).substr(2, 8);
}
function getHistoryState(location, index) {
  return {
    usr: location.state,
    key: location.key,
    idx: index
  };
}
function createLocation(current, to, state, key) {
  if (state === void 0) {
    state = null;
  }
  let location = _extends$1({
    pathname: typeof current === "string" ? current : current.pathname,
    search: "",
    hash: ""
  }, typeof to === "string" ? parsePath(to) : to, {
    state,
    // TODO: This could be cleaned up.  push/replace should probably just take
    // full Locations now and avoid the need to run through this flow at all
    // But that's a pretty big refactor to the current test suite so going to
    // keep as is for the time being and just let any incoming keys take precedence
    key: to && to.key || key || createKey()
  });
  return location;
}
function createPath(_ref) {
  let {
    pathname = "/",
    search = "",
    hash = ""
  } = _ref;
  if (search && search !== "?") pathname += search.charAt(0) === "?" ? search : "?" + search;
  if (hash && hash !== "#") pathname += hash.charAt(0) === "#" ? hash : "#" + hash;
  return pathname;
}
function parsePath(path) {
  let parsedPath = {};
  if (path) {
    let hashIndex = path.indexOf("#");
    if (hashIndex >= 0) {
      parsedPath.hash = path.substr(hashIndex);
      path = path.substr(0, hashIndex);
    }
    let searchIndex = path.indexOf("?");
    if (searchIndex >= 0) {
      parsedPath.search = path.substr(searchIndex);
      path = path.substr(0, searchIndex);
    }
    if (path) {
      parsedPath.pathname = path;
    }
  }
  return parsedPath;
}
function getUrlBasedHistory(getLocation, createHref, validateLocation, options) {
  if (options === void 0) {
    options = {};
  }
  let {
    window: window2 = document.defaultView,
    v5Compat = false
  } = options;
  let globalHistory = window2.history;
  let action = Action.Pop;
  let listener = null;
  let index = getIndex();
  if (index == null) {
    index = 0;
    globalHistory.replaceState(_extends$1({}, globalHistory.state, {
      idx: index
    }), "");
  }
  function getIndex() {
    let state = globalHistory.state || {
      idx: null
    };
    return state.idx;
  }
  function handlePop() {
    action = Action.Pop;
    let nextIndex = getIndex();
    let delta = nextIndex == null ? null : nextIndex - index;
    index = nextIndex;
    if (listener) {
      listener({
        action,
        location: history.location,
        delta
      });
    }
  }
  function push(to, state) {
    action = Action.Push;
    let location = createLocation(history.location, to, state);
    index = getIndex() + 1;
    let historyState = getHistoryState(location, index);
    let url = history.createHref(location);
    try {
      globalHistory.pushState(historyState, "", url);
    } catch (error) {
      if (error instanceof DOMException && error.name === "DataCloneError") {
        throw error;
      }
      window2.location.assign(url);
    }
    if (v5Compat && listener) {
      listener({
        action,
        location: history.location,
        delta: 1
      });
    }
  }
  function replace(to, state) {
    action = Action.Replace;
    let location = createLocation(history.location, to, state);
    index = getIndex();
    let historyState = getHistoryState(location, index);
    let url = history.createHref(location);
    globalHistory.replaceState(historyState, "", url);
    if (v5Compat && listener) {
      listener({
        action,
        location: history.location,
        delta: 0
      });
    }
  }
  function createURL(to) {
    let base = window2.location.origin !== "null" ? window2.location.origin : window2.location.href;
    let href = typeof to === "string" ? to : createPath(to);
    href = href.replace(/ $/, "%20");
    invariant(base, "No window.location.(origin|href) available to create URL for href: " + href);
    return new URL(href, base);
  }
  let history = {
    get action() {
      return action;
    },
    get location() {
      return getLocation(window2, globalHistory);
    },
    listen(fn) {
      if (listener) {
        throw new Error("A history only accepts one active listener");
      }
      window2.addEventListener(PopStateEventType, handlePop);
      listener = fn;
      return () => {
        window2.removeEventListener(PopStateEventType, handlePop);
        listener = null;
      };
    },
    createHref(to) {
      return createHref(window2, to);
    },
    createURL,
    encodeLocation(to) {
      let url = createURL(to);
      return {
        pathname: url.pathname,
        search: url.search,
        hash: url.hash
      };
    },
    push,
    replace,
    go(n2) {
      return globalHistory.go(n2);
    }
  };
  return history;
}
var ResultType;
(function(ResultType2) {
  ResultType2["data"] = "data";
  ResultType2["deferred"] = "deferred";
  ResultType2["redirect"] = "redirect";
  ResultType2["error"] = "error";
})(ResultType || (ResultType = {}));
function matchRoutes(routes, locationArg, basename) {
  if (basename === void 0) {
    basename = "/";
  }
  return matchRoutesImpl(routes, locationArg, basename);
}
function matchRoutesImpl(routes, locationArg, basename, allowPartial) {
  let location = typeof locationArg === "string" ? parsePath(locationArg) : locationArg;
  let pathname = stripBasename(location.pathname || "/", basename);
  if (pathname == null) {
    return null;
  }
  let branches = flattenRoutes(routes);
  rankRouteBranches(branches);
  let matches = null;
  for (let i2 = 0; matches == null && i2 < branches.length; ++i2) {
    let decoded = decodePath(pathname);
    matches = matchRouteBranch(branches[i2], decoded);
  }
  return matches;
}
function flattenRoutes(routes, branches, parentsMeta, parentPath) {
  if (branches === void 0) {
    branches = [];
  }
  if (parentsMeta === void 0) {
    parentsMeta = [];
  }
  if (parentPath === void 0) {
    parentPath = "";
  }
  let flattenRoute = (route, index, relativePath) => {
    let meta = {
      relativePath: relativePath === void 0 ? route.path || "" : relativePath,
      caseSensitive: route.caseSensitive === true,
      childrenIndex: index,
      route
    };
    if (meta.relativePath.startsWith("/")) {
      invariant(meta.relativePath.startsWith(parentPath), 'Absolute route path "' + meta.relativePath + '" nested under path ' + ('"' + parentPath + '" is not valid. An absolute child route path ') + "must start with the combined path of all its parent routes.");
      meta.relativePath = meta.relativePath.slice(parentPath.length);
    }
    let path = joinPaths([parentPath, meta.relativePath]);
    let routesMeta = parentsMeta.concat(meta);
    if (route.children && route.children.length > 0) {
      invariant(
        // Our types know better, but runtime JS may not!
        // @ts-expect-error
        route.index !== true,
        "Index routes must not have child routes. Please remove " + ('all child routes from route path "' + path + '".')
      );
      flattenRoutes(route.children, branches, routesMeta, path);
    }
    if (route.path == null && !route.index) {
      return;
    }
    branches.push({
      path,
      score: computeScore(path, route.index),
      routesMeta
    });
  };
  routes.forEach((route, index) => {
    var _route$path;
    if (route.path === "" || !((_route$path = route.path) != null && _route$path.includes("?"))) {
      flattenRoute(route, index);
    } else {
      for (let exploded of explodeOptionalSegments(route.path)) {
        flattenRoute(route, index, exploded);
      }
    }
  });
  return branches;
}
function explodeOptionalSegments(path) {
  let segments = path.split("/");
  if (segments.length === 0) return [];
  let [first, ...rest] = segments;
  let isOptional = first.endsWith("?");
  let required = first.replace(/\?$/, "");
  if (rest.length === 0) {
    return isOptional ? [required, ""] : [required];
  }
  let restExploded = explodeOptionalSegments(rest.join("/"));
  let result = [];
  result.push(...restExploded.map((subpath) => subpath === "" ? required : [required, subpath].join("/")));
  if (isOptional) {
    result.push(...restExploded);
  }
  return result.map((exploded) => path.startsWith("/") && exploded === "" ? "/" : exploded);
}
function rankRouteBranches(branches) {
  branches.sort((a3, b2) => a3.score !== b2.score ? b2.score - a3.score : compareIndexes(a3.routesMeta.map((meta) => meta.childrenIndex), b2.routesMeta.map((meta) => meta.childrenIndex)));
}
const paramRe = /^:[\w-]+$/;
const dynamicSegmentValue = 3;
const indexRouteValue = 2;
const emptySegmentValue = 1;
const staticSegmentValue = 10;
const splatPenalty = -2;
const isSplat = (s2) => s2 === "*";
function computeScore(path, index) {
  let segments = path.split("/");
  let initialScore = segments.length;
  if (segments.some(isSplat)) {
    initialScore += splatPenalty;
  }
  if (index) {
    initialScore += indexRouteValue;
  }
  return segments.filter((s2) => !isSplat(s2)).reduce((score, segment) => score + (paramRe.test(segment) ? dynamicSegmentValue : segment === "" ? emptySegmentValue : staticSegmentValue), initialScore);
}
function compareIndexes(a3, b2) {
  let siblings = a3.length === b2.length && a3.slice(0, -1).every((n2, i2) => n2 === b2[i2]);
  return siblings ? (
    // If two routes are siblings, we should try to match the earlier sibling
    // first. This allows people to have fine-grained control over the matching
    // behavior by simply putting routes with identical paths in the order they
    // want them tried.
    a3[a3.length - 1] - b2[b2.length - 1]
  ) : (
    // Otherwise, it doesn't really make sense to rank non-siblings by index,
    // so they sort equally.
    0
  );
}
function matchRouteBranch(branch, pathname, allowPartial) {
  let {
    routesMeta
  } = branch;
  let matchedParams = {};
  let matchedPathname = "/";
  let matches = [];
  for (let i2 = 0; i2 < routesMeta.length; ++i2) {
    let meta = routesMeta[i2];
    let end = i2 === routesMeta.length - 1;
    let remainingPathname = matchedPathname === "/" ? pathname : pathname.slice(matchedPathname.length) || "/";
    let match = matchPath({
      path: meta.relativePath,
      caseSensitive: meta.caseSensitive,
      end
    }, remainingPathname);
    let route = meta.route;
    if (!match) {
      return null;
    }
    Object.assign(matchedParams, match.params);
    matches.push({
      // TODO: Can this as be avoided?
      params: matchedParams,
      pathname: joinPaths([matchedPathname, match.pathname]),
      pathnameBase: normalizePathname(joinPaths([matchedPathname, match.pathnameBase])),
      route
    });
    if (match.pathnameBase !== "/") {
      matchedPathname = joinPaths([matchedPathname, match.pathnameBase]);
    }
  }
  return matches;
}
function matchPath(pattern, pathname) {
  if (typeof pattern === "string") {
    pattern = {
      path: pattern,
      caseSensitive: false,
      end: true
    };
  }
  let [matcher, compiledParams] = compilePath(pattern.path, pattern.caseSensitive, pattern.end);
  let match = pathname.match(matcher);
  if (!match) return null;
  let matchedPathname = match[0];
  let pathnameBase = matchedPathname.replace(/(.)\/+$/, "$1");
  let captureGroups = match.slice(1);
  let params = compiledParams.reduce((memo, _ref, index) => {
    let {
      paramName,
      isOptional
    } = _ref;
    if (paramName === "*") {
      let splatValue = captureGroups[index] || "";
      pathnameBase = matchedPathname.slice(0, matchedPathname.length - splatValue.length).replace(/(.)\/+$/, "$1");
    }
    const value = captureGroups[index];
    if (isOptional && !value) {
      memo[paramName] = void 0;
    } else {
      memo[paramName] = (value || "").replace(/%2F/g, "/");
    }
    return memo;
  }, {});
  return {
    params,
    pathname: matchedPathname,
    pathnameBase,
    pattern
  };
}
function compilePath(path, caseSensitive, end) {
  if (caseSensitive === void 0) {
    caseSensitive = false;
  }
  if (end === void 0) {
    end = true;
  }
  warning(path === "*" || !path.endsWith("*") || path.endsWith("/*"), 'Route path "' + path + '" will be treated as if it were ' + ('"' + path.replace(/\*$/, "/*") + '" because the `*` character must ') + "always follow a `/` in the pattern. To get rid of this warning, " + ('please change the route path to "' + path.replace(/\*$/, "/*") + '".'));
  let params = [];
  let regexpSource = "^" + path.replace(/\/*\*?$/, "").replace(/^\/*/, "/").replace(/[\\.*+^${}|()[\]]/g, "\\$&").replace(/\/:([\w-]+)(\?)?/g, (_2, paramName, isOptional) => {
    params.push({
      paramName,
      isOptional: isOptional != null
    });
    return isOptional ? "/?([^\\/]+)?" : "/([^\\/]+)";
  });
  if (path.endsWith("*")) {
    params.push({
      paramName: "*"
    });
    regexpSource += path === "*" || path === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$";
  } else if (end) {
    regexpSource += "\\/*$";
  } else if (path !== "" && path !== "/") {
    regexpSource += "(?:(?=\\/|$))";
  } else ;
  let matcher = new RegExp(regexpSource, caseSensitive ? void 0 : "i");
  return [matcher, params];
}
function decodePath(value) {
  try {
    return value.split("/").map((v2) => decodeURIComponent(v2).replace(/\//g, "%2F")).join("/");
  } catch (error) {
    warning(false, 'The URL path "' + value + '" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent ' + ("encoding (" + error + ")."));
    return value;
  }
}
function stripBasename(pathname, basename) {
  if (basename === "/") return pathname;
  if (!pathname.toLowerCase().startsWith(basename.toLowerCase())) {
    return null;
  }
  let startIndex = basename.endsWith("/") ? basename.length - 1 : basename.length;
  let nextChar = pathname.charAt(startIndex);
  if (nextChar && nextChar !== "/") {
    return null;
  }
  return pathname.slice(startIndex) || "/";
}
const ABSOLUTE_URL_REGEX$1 = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
const isAbsoluteUrl = (url) => ABSOLUTE_URL_REGEX$1.test(url);
function resolvePath(to, fromPathname) {
  if (fromPathname === void 0) {
    fromPathname = "/";
  }
  let {
    pathname: toPathname,
    search = "",
    hash = ""
  } = typeof to === "string" ? parsePath(to) : to;
  let pathname;
  if (toPathname) {
    if (isAbsoluteUrl(toPathname)) {
      pathname = toPathname;
    } else {
      if (toPathname.includes("//")) {
        let oldPathname = toPathname;
        toPathname = toPathname.replace(/\/\/+/g, "/");
        warning(false, "Pathnames cannot have embedded double slashes - normalizing " + (oldPathname + " -> " + toPathname));
      }
      if (toPathname.startsWith("/")) {
        pathname = resolvePathname(toPathname.substring(1), "/");
      } else {
        pathname = resolvePathname(toPathname, fromPathname);
      }
    }
  } else {
    pathname = fromPathname;
  }
  return {
    pathname,
    search: normalizeSearch(search),
    hash: normalizeHash(hash)
  };
}
function resolvePathname(relativePath, fromPathname) {
  let segments = fromPathname.replace(/\/+$/, "").split("/");
  let relativeSegments = relativePath.split("/");
  relativeSegments.forEach((segment) => {
    if (segment === "..") {
      if (segments.length > 1) segments.pop();
    } else if (segment !== ".") {
      segments.push(segment);
    }
  });
  return segments.length > 1 ? segments.join("/") : "/";
}
function getInvalidPathError(char, field, dest, path) {
  return "Cannot include a '" + char + "' character in a manually specified " + ("`to." + field + "` field [" + JSON.stringify(path) + "].  Please separate it out to the ") + ("`to." + dest + "` field. Alternatively you may provide the full path as ") + 'a string in <Link to="..."> and the router will parse it for you.';
}
function getPathContributingMatches(matches) {
  return matches.filter((match, index) => index === 0 || match.route.path && match.route.path.length > 0);
}
function getResolveToMatches(matches, v7_relativeSplatPath) {
  let pathMatches = getPathContributingMatches(matches);
  if (v7_relativeSplatPath) {
    return pathMatches.map((match, idx) => idx === pathMatches.length - 1 ? match.pathname : match.pathnameBase);
  }
  return pathMatches.map((match) => match.pathnameBase);
}
function resolveTo(toArg, routePathnames, locationPathname, isPathRelative) {
  if (isPathRelative === void 0) {
    isPathRelative = false;
  }
  let to;
  if (typeof toArg === "string") {
    to = parsePath(toArg);
  } else {
    to = _extends$1({}, toArg);
    invariant(!to.pathname || !to.pathname.includes("?"), getInvalidPathError("?", "pathname", "search", to));
    invariant(!to.pathname || !to.pathname.includes("#"), getInvalidPathError("#", "pathname", "hash", to));
    invariant(!to.search || !to.search.includes("#"), getInvalidPathError("#", "search", "hash", to));
  }
  let isEmptyPath = toArg === "" || to.pathname === "";
  let toPathname = isEmptyPath ? "/" : to.pathname;
  let from;
  if (toPathname == null) {
    from = locationPathname;
  } else {
    let routePathnameIndex = routePathnames.length - 1;
    if (!isPathRelative && toPathname.startsWith("..")) {
      let toSegments = toPathname.split("/");
      while (toSegments[0] === "..") {
        toSegments.shift();
        routePathnameIndex -= 1;
      }
      to.pathname = toSegments.join("/");
    }
    from = routePathnameIndex >= 0 ? routePathnames[routePathnameIndex] : "/";
  }
  let path = resolvePath(to, from);
  let hasExplicitTrailingSlash = toPathname && toPathname !== "/" && toPathname.endsWith("/");
  let hasCurrentTrailingSlash = (isEmptyPath || toPathname === ".") && locationPathname.endsWith("/");
  if (!path.pathname.endsWith("/") && (hasExplicitTrailingSlash || hasCurrentTrailingSlash)) {
    path.pathname += "/";
  }
  return path;
}
const joinPaths = (paths) => paths.join("/").replace(/\/\/+/g, "/");
const normalizePathname = (pathname) => pathname.replace(/\/+$/, "").replace(/^\/*/, "/");
const normalizeSearch = (search) => !search || search === "?" ? "" : search.startsWith("?") ? search : "?" + search;
const normalizeHash = (hash) => !hash || hash === "#" ? "" : hash.startsWith("#") ? hash : "#" + hash;
function isRouteErrorResponse(error) {
  return error != null && typeof error.status === "number" && typeof error.statusText === "string" && typeof error.internal === "boolean" && "data" in error;
}
const validMutationMethodsArr = ["post", "put", "patch", "delete"];
new Set(validMutationMethodsArr);
const validRequestMethodsArr = ["get", ...validMutationMethodsArr];
new Set(validRequestMethodsArr);
/**
 * React Router v6.30.2
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function(target) {
    for (var i2 = 1; i2 < arguments.length; i2++) {
      var source = arguments[i2];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
const DataRouterContext = /* @__PURE__ */ reactExports.createContext(null);
const DataRouterStateContext = /* @__PURE__ */ reactExports.createContext(null);
const NavigationContext = /* @__PURE__ */ reactExports.createContext(null);
const LocationContext = /* @__PURE__ */ reactExports.createContext(null);
const RouteContext = /* @__PURE__ */ reactExports.createContext({
  outlet: null,
  matches: [],
  isDataRoute: false
});
const RouteErrorContext = /* @__PURE__ */ reactExports.createContext(null);
function useInRouterContext() {
  return reactExports.useContext(LocationContext) != null;
}
function useLocation() {
  !useInRouterContext() ? invariant(false) : void 0;
  return reactExports.useContext(LocationContext).location;
}
function useIsomorphicLayoutEffect(cb2) {
  let isStatic = reactExports.useContext(NavigationContext).static;
  if (!isStatic) {
    reactExports.useLayoutEffect(cb2);
  }
}
function useNavigate() {
  let {
    isDataRoute
  } = reactExports.useContext(RouteContext);
  return isDataRoute ? useNavigateStable() : useNavigateUnstable();
}
function useNavigateUnstable() {
  !useInRouterContext() ? invariant(false) : void 0;
  let dataRouterContext = reactExports.useContext(DataRouterContext);
  let {
    basename,
    future,
    navigator: navigator2
  } = reactExports.useContext(NavigationContext);
  let {
    matches
  } = reactExports.useContext(RouteContext);
  let {
    pathname: locationPathname
  } = useLocation();
  let routePathnamesJson = JSON.stringify(getResolveToMatches(matches, future.v7_relativeSplatPath));
  let activeRef = reactExports.useRef(false);
  useIsomorphicLayoutEffect(() => {
    activeRef.current = true;
  });
  let navigate = reactExports.useCallback(function(to, options) {
    if (options === void 0) {
      options = {};
    }
    if (!activeRef.current) return;
    if (typeof to === "number") {
      navigator2.go(to);
      return;
    }
    let path = resolveTo(to, JSON.parse(routePathnamesJson), locationPathname, options.relative === "path");
    if (dataRouterContext == null && basename !== "/") {
      path.pathname = path.pathname === "/" ? basename : joinPaths([basename, path.pathname]);
    }
    (!!options.replace ? navigator2.replace : navigator2.push)(path, options.state, options);
  }, [basename, navigator2, routePathnamesJson, locationPathname, dataRouterContext]);
  return navigate;
}
function useParams() {
  let {
    matches
  } = reactExports.useContext(RouteContext);
  let routeMatch = matches[matches.length - 1];
  return routeMatch ? routeMatch.params : {};
}
function useRoutes(routes, locationArg) {
  return useRoutesImpl(routes, locationArg);
}
function useRoutesImpl(routes, locationArg, dataRouterState, future) {
  !useInRouterContext() ? invariant(false) : void 0;
  let {
    navigator: navigator2
  } = reactExports.useContext(NavigationContext);
  let {
    matches: parentMatches
  } = reactExports.useContext(RouteContext);
  let routeMatch = parentMatches[parentMatches.length - 1];
  let parentParams = routeMatch ? routeMatch.params : {};
  routeMatch ? routeMatch.pathname : "/";
  let parentPathnameBase = routeMatch ? routeMatch.pathnameBase : "/";
  routeMatch && routeMatch.route;
  let locationFromContext = useLocation();
  let location;
  if (locationArg) {
    var _parsedLocationArg$pa;
    let parsedLocationArg = typeof locationArg === "string" ? parsePath(locationArg) : locationArg;
    !(parentPathnameBase === "/" || ((_parsedLocationArg$pa = parsedLocationArg.pathname) == null ? void 0 : _parsedLocationArg$pa.startsWith(parentPathnameBase))) ? invariant(false) : void 0;
    location = parsedLocationArg;
  } else {
    location = locationFromContext;
  }
  let pathname = location.pathname || "/";
  let remainingPathname = pathname;
  if (parentPathnameBase !== "/") {
    let parentSegments = parentPathnameBase.replace(/^\//, "").split("/");
    let segments = pathname.replace(/^\//, "").split("/");
    remainingPathname = "/" + segments.slice(parentSegments.length).join("/");
  }
  let matches = matchRoutes(routes, {
    pathname: remainingPathname
  });
  let renderedMatches = _renderMatches(matches && matches.map((match) => Object.assign({}, match, {
    params: Object.assign({}, parentParams, match.params),
    pathname: joinPaths([
      parentPathnameBase,
      // Re-encode pathnames that were decoded inside matchRoutes
      navigator2.encodeLocation ? navigator2.encodeLocation(match.pathname).pathname : match.pathname
    ]),
    pathnameBase: match.pathnameBase === "/" ? parentPathnameBase : joinPaths([
      parentPathnameBase,
      // Re-encode pathnames that were decoded inside matchRoutes
      navigator2.encodeLocation ? navigator2.encodeLocation(match.pathnameBase).pathname : match.pathnameBase
    ])
  })), parentMatches, dataRouterState, future);
  if (locationArg && renderedMatches) {
    return /* @__PURE__ */ reactExports.createElement(LocationContext.Provider, {
      value: {
        location: _extends({
          pathname: "/",
          search: "",
          hash: "",
          state: null,
          key: "default"
        }, location),
        navigationType: Action.Pop
      }
    }, renderedMatches);
  }
  return renderedMatches;
}
function DefaultErrorComponent() {
  let error = useRouteError();
  let message = isRouteErrorResponse(error) ? error.status + " " + error.statusText : error instanceof Error ? error.message : JSON.stringify(error);
  let stack = error instanceof Error ? error.stack : null;
  let lightgrey = "rgba(200,200,200, 0.5)";
  let preStyles = {
    padding: "0.5rem",
    backgroundColor: lightgrey
  };
  let devInfo = null;
  return /* @__PURE__ */ reactExports.createElement(reactExports.Fragment, null, /* @__PURE__ */ reactExports.createElement("h2", null, "Unexpected Application Error!"), /* @__PURE__ */ reactExports.createElement("h3", {
    style: {
      fontStyle: "italic"
    }
  }, message), stack ? /* @__PURE__ */ reactExports.createElement("pre", {
    style: preStyles
  }, stack) : null, devInfo);
}
const defaultErrorElement = /* @__PURE__ */ reactExports.createElement(DefaultErrorComponent, null);
class RenderErrorBoundary extends reactExports.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: props.location,
      revalidation: props.revalidation,
      error: props.error
    };
  }
  static getDerivedStateFromError(error) {
    return {
      error
    };
  }
  static getDerivedStateFromProps(props, state) {
    if (state.location !== props.location || state.revalidation !== "idle" && props.revalidation === "idle") {
      return {
        error: props.error,
        location: props.location,
        revalidation: props.revalidation
      };
    }
    return {
      error: props.error !== void 0 ? props.error : state.error,
      location: state.location,
      revalidation: props.revalidation || state.revalidation
    };
  }
  componentDidCatch(error, errorInfo) {
    console.error("React Router caught the following error during render", error, errorInfo);
  }
  render() {
    return this.state.error !== void 0 ? /* @__PURE__ */ reactExports.createElement(RouteContext.Provider, {
      value: this.props.routeContext
    }, /* @__PURE__ */ reactExports.createElement(RouteErrorContext.Provider, {
      value: this.state.error,
      children: this.props.component
    })) : this.props.children;
  }
}
function RenderedRoute(_ref) {
  let {
    routeContext,
    match,
    children
  } = _ref;
  let dataRouterContext = reactExports.useContext(DataRouterContext);
  if (dataRouterContext && dataRouterContext.static && dataRouterContext.staticContext && (match.route.errorElement || match.route.ErrorBoundary)) {
    dataRouterContext.staticContext._deepestRenderedBoundaryId = match.route.id;
  }
  return /* @__PURE__ */ reactExports.createElement(RouteContext.Provider, {
    value: routeContext
  }, children);
}
function _renderMatches(matches, parentMatches, dataRouterState, future) {
  var _dataRouterState;
  if (parentMatches === void 0) {
    parentMatches = [];
  }
  if (dataRouterState === void 0) {
    dataRouterState = null;
  }
  if (future === void 0) {
    future = null;
  }
  if (matches == null) {
    var _future;
    if (!dataRouterState) {
      return null;
    }
    if (dataRouterState.errors) {
      matches = dataRouterState.matches;
    } else if ((_future = future) != null && _future.v7_partialHydration && parentMatches.length === 0 && !dataRouterState.initialized && dataRouterState.matches.length > 0) {
      matches = dataRouterState.matches;
    } else {
      return null;
    }
  }
  let renderedMatches = matches;
  let errors = (_dataRouterState = dataRouterState) == null ? void 0 : _dataRouterState.errors;
  if (errors != null) {
    let errorIndex = renderedMatches.findIndex((m2) => m2.route.id && (errors == null ? void 0 : errors[m2.route.id]) !== void 0);
    !(errorIndex >= 0) ? invariant(false) : void 0;
    renderedMatches = renderedMatches.slice(0, Math.min(renderedMatches.length, errorIndex + 1));
  }
  let renderFallback = false;
  let fallbackIndex = -1;
  if (dataRouterState && future && future.v7_partialHydration) {
    for (let i2 = 0; i2 < renderedMatches.length; i2++) {
      let match = renderedMatches[i2];
      if (match.route.HydrateFallback || match.route.hydrateFallbackElement) {
        fallbackIndex = i2;
      }
      if (match.route.id) {
        let {
          loaderData,
          errors: errors2
        } = dataRouterState;
        let needsToRunLoader = match.route.loader && loaderData[match.route.id] === void 0 && (!errors2 || errors2[match.route.id] === void 0);
        if (match.route.lazy || needsToRunLoader) {
          renderFallback = true;
          if (fallbackIndex >= 0) {
            renderedMatches = renderedMatches.slice(0, fallbackIndex + 1);
          } else {
            renderedMatches = [renderedMatches[0]];
          }
          break;
        }
      }
    }
  }
  return renderedMatches.reduceRight((outlet, match, index) => {
    let error;
    let shouldRenderHydrateFallback = false;
    let errorElement = null;
    let hydrateFallbackElement = null;
    if (dataRouterState) {
      error = errors && match.route.id ? errors[match.route.id] : void 0;
      errorElement = match.route.errorElement || defaultErrorElement;
      if (renderFallback) {
        if (fallbackIndex < 0 && index === 0) {
          warningOnce("route-fallback");
          shouldRenderHydrateFallback = true;
          hydrateFallbackElement = null;
        } else if (fallbackIndex === index) {
          shouldRenderHydrateFallback = true;
          hydrateFallbackElement = match.route.hydrateFallbackElement || null;
        }
      }
    }
    let matches2 = parentMatches.concat(renderedMatches.slice(0, index + 1));
    let getChildren = () => {
      let children;
      if (error) {
        children = errorElement;
      } else if (shouldRenderHydrateFallback) {
        children = hydrateFallbackElement;
      } else if (match.route.Component) {
        children = /* @__PURE__ */ reactExports.createElement(match.route.Component, null);
      } else if (match.route.element) {
        children = match.route.element;
      } else {
        children = outlet;
      }
      return /* @__PURE__ */ reactExports.createElement(RenderedRoute, {
        match,
        routeContext: {
          outlet,
          matches: matches2,
          isDataRoute: dataRouterState != null
        },
        children
      });
    };
    return dataRouterState && (match.route.ErrorBoundary || match.route.errorElement || index === 0) ? /* @__PURE__ */ reactExports.createElement(RenderErrorBoundary, {
      location: dataRouterState.location,
      revalidation: dataRouterState.revalidation,
      component: errorElement,
      error,
      children: getChildren(),
      routeContext: {
        outlet: null,
        matches: matches2,
        isDataRoute: true
      }
    }) : getChildren();
  }, null);
}
var DataRouterHook$1 = /* @__PURE__ */ function(DataRouterHook2) {
  DataRouterHook2["UseBlocker"] = "useBlocker";
  DataRouterHook2["UseRevalidator"] = "useRevalidator";
  DataRouterHook2["UseNavigateStable"] = "useNavigate";
  return DataRouterHook2;
}(DataRouterHook$1 || {});
var DataRouterStateHook$1 = /* @__PURE__ */ function(DataRouterStateHook2) {
  DataRouterStateHook2["UseBlocker"] = "useBlocker";
  DataRouterStateHook2["UseLoaderData"] = "useLoaderData";
  DataRouterStateHook2["UseActionData"] = "useActionData";
  DataRouterStateHook2["UseRouteError"] = "useRouteError";
  DataRouterStateHook2["UseNavigation"] = "useNavigation";
  DataRouterStateHook2["UseRouteLoaderData"] = "useRouteLoaderData";
  DataRouterStateHook2["UseMatches"] = "useMatches";
  DataRouterStateHook2["UseRevalidator"] = "useRevalidator";
  DataRouterStateHook2["UseNavigateStable"] = "useNavigate";
  DataRouterStateHook2["UseRouteId"] = "useRouteId";
  return DataRouterStateHook2;
}(DataRouterStateHook$1 || {});
function useDataRouterContext(hookName) {
  let ctx = reactExports.useContext(DataRouterContext);
  !ctx ? invariant(false) : void 0;
  return ctx;
}
function useDataRouterState(hookName) {
  let state = reactExports.useContext(DataRouterStateContext);
  !state ? invariant(false) : void 0;
  return state;
}
function useRouteContext(hookName) {
  let route = reactExports.useContext(RouteContext);
  !route ? invariant(false) : void 0;
  return route;
}
function useCurrentRouteId(hookName) {
  let route = useRouteContext();
  let thisRoute = route.matches[route.matches.length - 1];
  !thisRoute.route.id ? invariant(false) : void 0;
  return thisRoute.route.id;
}
function useRouteError() {
  var _state$errors;
  let error = reactExports.useContext(RouteErrorContext);
  let state = useDataRouterState();
  let routeId = useCurrentRouteId();
  if (error !== void 0) {
    return error;
  }
  return (_state$errors = state.errors) == null ? void 0 : _state$errors[routeId];
}
function useNavigateStable() {
  let {
    router
  } = useDataRouterContext(DataRouterHook$1.UseNavigateStable);
  let id2 = useCurrentRouteId(DataRouterStateHook$1.UseNavigateStable);
  let activeRef = reactExports.useRef(false);
  useIsomorphicLayoutEffect(() => {
    activeRef.current = true;
  });
  let navigate = reactExports.useCallback(function(to, options) {
    if (options === void 0) {
      options = {};
    }
    if (!activeRef.current) return;
    if (typeof to === "number") {
      router.navigate(to);
    } else {
      router.navigate(to, _extends({
        fromRouteId: id2
      }, options));
    }
  }, [router, id2]);
  return navigate;
}
const alreadyWarned$1 = {};
function warningOnce(key, cond, message) {
  if (!alreadyWarned$1[key]) {
    alreadyWarned$1[key] = true;
  }
}
function logV6DeprecationWarnings(renderFuture, routerFuture) {
  if ((renderFuture == null ? void 0 : renderFuture.v7_startTransition) === void 0) ;
  if ((renderFuture == null ? void 0 : renderFuture.v7_relativeSplatPath) === void 0 && true) ;
}
function Navigate(_ref4) {
  let {
    to,
    replace: replace2,
    state,
    relative
  } = _ref4;
  !useInRouterContext() ? invariant(false) : void 0;
  let {
    future,
    static: isStatic
  } = reactExports.useContext(NavigationContext);
  let {
    matches
  } = reactExports.useContext(RouteContext);
  let {
    pathname: locationPathname
  } = useLocation();
  let navigate = useNavigate();
  let path = resolveTo(to, getResolveToMatches(matches, future.v7_relativeSplatPath), locationPathname, relative === "path");
  let jsonPath = JSON.stringify(path);
  reactExports.useEffect(() => navigate(JSON.parse(jsonPath), {
    replace: replace2,
    state,
    relative
  }), [navigate, jsonPath, relative, replace2, state]);
  return null;
}
function Route(_props) {
  invariant(false);
}
function Router(_ref5) {
  let {
    basename: basenameProp = "/",
    children = null,
    location: locationProp,
    navigationType = Action.Pop,
    navigator: navigator2,
    static: staticProp = false,
    future
  } = _ref5;
  !!useInRouterContext() ? invariant(false) : void 0;
  let basename = basenameProp.replace(/^\/*/, "/");
  let navigationContext = reactExports.useMemo(() => ({
    basename,
    navigator: navigator2,
    static: staticProp,
    future: _extends({
      v7_relativeSplatPath: false
    }, future)
  }), [basename, future, navigator2, staticProp]);
  if (typeof locationProp === "string") {
    locationProp = parsePath(locationProp);
  }
  let {
    pathname = "/",
    search = "",
    hash = "",
    state = null,
    key = "default"
  } = locationProp;
  let locationContext = reactExports.useMemo(() => {
    let trailingPathname = stripBasename(pathname, basename);
    if (trailingPathname == null) {
      return null;
    }
    return {
      location: {
        pathname: trailingPathname,
        search,
        hash,
        state,
        key
      },
      navigationType
    };
  }, [basename, pathname, search, hash, state, key, navigationType]);
  if (locationContext == null) {
    return null;
  }
  return /* @__PURE__ */ reactExports.createElement(NavigationContext.Provider, {
    value: navigationContext
  }, /* @__PURE__ */ reactExports.createElement(LocationContext.Provider, {
    children,
    value: locationContext
  }));
}
function Routes(_ref6) {
  let {
    children,
    location
  } = _ref6;
  return useRoutes(createRoutesFromChildren(children), location);
}
new Promise(() => {
});
function createRoutesFromChildren(children, parentPath) {
  if (parentPath === void 0) {
    parentPath = [];
  }
  let routes = [];
  reactExports.Children.forEach(children, (element, index) => {
    if (!/* @__PURE__ */ reactExports.isValidElement(element)) {
      return;
    }
    let treePath = [...parentPath, index];
    if (element.type === reactExports.Fragment) {
      routes.push.apply(routes, createRoutesFromChildren(element.props.children, treePath));
      return;
    }
    !(element.type === Route) ? invariant(false) : void 0;
    !(!element.props.index || !element.props.children) ? invariant(false) : void 0;
    let route = {
      id: element.props.id || treePath.join("-"),
      caseSensitive: element.props.caseSensitive,
      element: element.props.element,
      Component: element.props.Component,
      index: element.props.index,
      path: element.props.path,
      loader: element.props.loader,
      action: element.props.action,
      errorElement: element.props.errorElement,
      ErrorBoundary: element.props.ErrorBoundary,
      hasErrorBoundary: element.props.ErrorBoundary != null || element.props.errorElement != null,
      shouldRevalidate: element.props.shouldRevalidate,
      handle: element.props.handle,
      lazy: element.props.lazy
    };
    if (element.props.children) {
      route.children = createRoutesFromChildren(element.props.children, treePath);
    }
    routes.push(route);
  });
  return routes;
}
/**
 * React Router DOM v6.30.2
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
function createSearchParams(init) {
  if (init === void 0) {
    init = "";
  }
  return new URLSearchParams(typeof init === "string" || Array.isArray(init) || init instanceof URLSearchParams ? init : Object.keys(init).reduce((memo, key) => {
    let value = init[key];
    return memo.concat(Array.isArray(value) ? value.map((v2) => [key, v2]) : [[key, value]]);
  }, []));
}
function getSearchParamsForLocation(locationSearch, defaultSearchParams) {
  let searchParams = createSearchParams(locationSearch);
  if (defaultSearchParams) {
    defaultSearchParams.forEach((_2, key) => {
      if (!searchParams.has(key)) {
        defaultSearchParams.getAll(key).forEach((value) => {
          searchParams.append(key, value);
        });
      }
    });
  }
  return searchParams;
}
const REACT_ROUTER_VERSION = "6";
try {
  window.__reactRouterVersion = REACT_ROUTER_VERSION;
} catch (e2) {
}
const START_TRANSITION = "startTransition";
const startTransitionImpl = t$5[START_TRANSITION];
function BrowserRouter(_ref4) {
  let {
    basename,
    children,
    future,
    window: window2
  } = _ref4;
  let historyRef = reactExports.useRef();
  if (historyRef.current == null) {
    historyRef.current = createBrowserHistory({
      window: window2,
      v5Compat: true
    });
  }
  let history = historyRef.current;
  let [state, setStateImpl] = reactExports.useState({
    action: history.action,
    location: history.location
  });
  let {
    v7_startTransition
  } = future || {};
  let setState = reactExports.useCallback((newState) => {
    v7_startTransition && startTransitionImpl ? startTransitionImpl(() => setStateImpl(newState)) : setStateImpl(newState);
  }, [setStateImpl, v7_startTransition]);
  reactExports.useLayoutEffect(() => history.listen(setState), [history, setState]);
  reactExports.useEffect(() => logV6DeprecationWarnings(future), [future]);
  return /* @__PURE__ */ reactExports.createElement(Router, {
    basename,
    children,
    location: state.location,
    navigationType: state.action,
    navigator: history,
    future
  });
}
var DataRouterHook;
(function(DataRouterHook2) {
  DataRouterHook2["UseScrollRestoration"] = "useScrollRestoration";
  DataRouterHook2["UseSubmit"] = "useSubmit";
  DataRouterHook2["UseSubmitFetcher"] = "useSubmitFetcher";
  DataRouterHook2["UseFetcher"] = "useFetcher";
  DataRouterHook2["useViewTransitionState"] = "useViewTransitionState";
})(DataRouterHook || (DataRouterHook = {}));
var DataRouterStateHook;
(function(DataRouterStateHook2) {
  DataRouterStateHook2["UseFetcher"] = "useFetcher";
  DataRouterStateHook2["UseFetchers"] = "useFetchers";
  DataRouterStateHook2["UseScrollRestoration"] = "useScrollRestoration";
})(DataRouterStateHook || (DataRouterStateHook = {}));
function useSearchParams(defaultInit) {
  let defaultSearchParamsRef = reactExports.useRef(createSearchParams(defaultInit));
  let hasSetSearchParamsRef = reactExports.useRef(false);
  let location = useLocation();
  let searchParams = reactExports.useMemo(() => (
    // Only merge in the defaults if we haven't yet called setSearchParams.
    // Once we call that we want those to take precedence, otherwise you can't
    // remove a param with setSearchParams({}) if it has an initial value
    getSearchParamsForLocation(location.search, hasSetSearchParamsRef.current ? null : defaultSearchParamsRef.current)
  ), [location.search]);
  let navigate = useNavigate();
  let setSearchParams = reactExports.useCallback((nextInit, navigateOptions) => {
    const newSearchParams = createSearchParams(typeof nextInit === "function" ? nextInit(searchParams) : nextInit);
    hasSetSearchParamsRef.current = true;
    navigate("?" + newSearchParams, navigateOptions);
  }, [navigate, searchParams]);
  return [searchParams, setSearchParams];
}
const getApiBase = () => {
  const base = "https://sistema.lucvanlatam.com";
  return base.endsWith("/") ? base.slice(0, -1) : base;
};
const apiFetch = (path, options = {}) => {
  var _a;
  const p2 = path.startsWith("/") ? path : `/${path}`;
  const url = `${getApiBase()}${p2}`;
  let token;
  try {
    token = (_a = JSON.parse(sessionStorage.getItem("lucvan_user") || "null")) == null ? void 0 : _a.token;
  } catch {
  }
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...isFormData ? {} : { "Content-Type": "application/json" },
    "Cache-Control": "no-cache, no-store, must-revalidate",
    "Pragma": "no-cache",
    "Expires": "0",
    ...options.headers || {}
  };
  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }
  return fetch(url, {
    ...options,
    headers,
    cache: "no-store"
  });
};
const api = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  apiFetch,
  getApiBase
}, Symbol.toStringTag, { value: "Module" }));
const AuthContext = reactExports.createContext({});
const useAuth = () => {
  const context = reactExports.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    const storedUser = sessionStorage.getItem("lucvan_user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);
  const login = async (email, password) => {
    try {
      const response = await apiFetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });
      const contentType = response.headers.get("content-type") || "";
      let parsed;
      let rawText;
      if (contentType.includes("application/json")) {
        try {
          parsed = await response.json();
        } catch (e2) {
          rawText = await response.text();
        }
      } else {
        rawText = await response.text();
      }
      if (!response.ok) {
        const message = (parsed == null ? void 0 : parsed.error) || (parsed == null ? void 0 : parsed.message) || (rawText ? rawText.slice(0, 200) : "Error de autenticación");
        throw new Error(message || "Error de autenticación");
      }
      if (!parsed) {
        const snippet = (rawText || "").slice(0, 120);
        throw new Error(`Respuesta inválida del servidor (no JSON). Verifica el backend/proxy. Detalle: ${snippet}`);
      }
      const data = parsed;
      console.log("Login response:", {
        user: data.user,
        name: data.user.name,
        email: data.user.email,
        fallback: data.user.email.split("@")[0]
      });
      const userData = {
        id: data.user.id,
        name: data.user.name || data.user.email.split("@")[0],
        email: data.user.email,
        role: data.user.role,
        clinicId: data.user.clinicId,
        mustChangePassword: !!data.user.mustChangePassword,
        token: data.token
      };
      setCurrentUser(userData);
      sessionStorage.setItem("lucvan_user", JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error("Login error:", error);
      throw new Error(error.message || "Error de conexión");
    }
  };
  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem("lucvan_user");
  };
  const value = {
    currentUser,
    loading,
    login,
    logout
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthContext.Provider, { value, children });
};
const scriptRel = "modulepreload";
const assetsURL = function(dep) {
  return "/" + dep;
};
const seen = {};
const __vitePreload = function preload(baseModule, deps, importerUrl) {
  let promise = Promise.resolve();
  if (deps && deps.length > 0) {
    document.getElementsByTagName("link");
    const cspNonceMeta = document.querySelector(
      "meta[property=csp-nonce]"
    );
    const cspNonce = (cspNonceMeta == null ? void 0 : cspNonceMeta.nonce) || (cspNonceMeta == null ? void 0 : cspNonceMeta.getAttribute("nonce"));
    promise = Promise.allSettled(
      deps.map((dep) => {
        dep = assetsURL(dep);
        if (dep in seen) return;
        seen[dep] = true;
        const isCss = dep.endsWith(".css");
        const cssSelector = isCss ? '[rel="stylesheet"]' : "";
        if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
          return;
        }
        const link = document.createElement("link");
        link.rel = isCss ? "stylesheet" : scriptRel;
        if (!isCss) {
          link.as = "script";
        }
        link.crossOrigin = "";
        link.href = dep;
        if (cspNonce) {
          link.setAttribute("nonce", cspNonce);
        }
        document.head.appendChild(link);
        if (isCss) {
          return new Promise((res, rej) => {
            link.addEventListener("load", res);
            link.addEventListener(
              "error",
              () => rej(new Error(`Unable to preload CSS for ${dep}`))
            );
          });
        }
      })
    );
  }
  function handlePreloadError(err) {
    const e2 = new Event("vite:preloadError", {
      cancelable: true
    });
    e2.payload = err;
    window.dispatchEvent(e2);
    if (!e2.defaultPrevented) {
      throw err;
    }
  }
  return promise.then((res) => {
    for (const item of res || []) {
      if (item.status !== "rejected") continue;
      handlePreloadError(item.reason);
    }
    return baseModule().catch(handlePreloadError);
  });
};
function Login() {
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [error, setError] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [showChangePassword, setShowChangePassword] = reactExports.useState(false);
  const [newPassword, setNewPassword] = reactExports.useState("");
  const [confirmPassword, setConfirmPassword] = reactExports.useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e2) => {
    e2.preventDefault();
    setError("");
    setLoading(true);
    try {
      const userData = await login(email, password);
      if (userData == null ? void 0 : userData.mustChangePassword) {
        setShowChangePassword(true);
        setLoading(false);
        return;
      }
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleChangePassword = async (e2) => {
    e2.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    setLoading(true);
    try {
      const res = await __vitePreload(() => Promise.resolve().then(() => api), true ? void 0 : void 0).then((m2) => m2.apiFetch("/api/auth/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          currentPassword: password,
          newPassword
        })
      }));
      let data;
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const txt = await res.text();
        throw new Error(`Respuesta inválida del servidor (no JSON). Detalle: ${txt.slice(0, 120)}`);
      }
      if (!res.ok) {
        throw new Error((data == null ? void 0 : data.error) || (data == null ? void 0 : data.message) || "Error al cambiar contraseña");
      }
      alert("Contraseña actualizada exitosamente. Inicie sesión con su nueva contraseña.");
      setShowChangePassword(false);
      setPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gradient-to-br from-[#0066A4] via-[#005889] to-[#003C63] flex items-center justify-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-3xl shadow-2xl w-full max-w-md p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/lucvan-logo-web.png", alt: "Lucván LATAM", className: "h-16 mx-auto mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold text-[#003C63] mb-2", children: "Lucván LATAM" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[#333333]", children: "Sistema de Gestión de Plantillas" })
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6", children: error }),
    showChangePassword ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold mb-1", children: "Cambio de contraseña obligatorio" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "Por seguridad, debe cambiar su contraseña temporal antes de continuar." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleChangePassword, className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-semibold text-[#003C63] mb-2", children: "Nueva contraseña" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "password",
              value: newPassword,
              onChange: (e2) => setNewPassword(e2.target.value),
              className: "w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0066A4] focus:border-[#0066A4] transition-all",
              placeholder: "Nueva contraseña (mínimo 6 caracteres)",
              required: true,
              minLength: 6
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-semibold text-[#003C63] mb-2", children: "Confirmar contraseña" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "password",
              value: confirmPassword,
              onChange: (e2) => setConfirmPassword(e2.target.value),
              className: "w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0066A4] focus:border-[#0066A4] transition-all",
              placeholder: "Confirme su nueva contraseña",
              required: true,
              minLength: 6
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "submit",
            disabled: loading,
            className: "w-full bg-[#F5C400] text-[#003C63] py-3 px-6 rounded-full font-bold hover:bg-[#ffd933] transition-all shadow-[0_12px_24px_-10px_rgba(0,60,99,0.25)] hover:shadow-[0_16px_32px_-12px_rgba(0,60,99,0.3)] hover:-translate-y-0.5 disabled:opacity-50",
            children: loading ? "Cambiando contraseña..." : "Cambiar contraseña"
          }
        )
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-semibold text-[#003C63] mb-2", children: "Email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "email",
            value: email,
            onChange: (e2) => setEmail(e2.target.value),
            className: "w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0066A4] focus:border-[#0066A4] transition-all",
            placeholder: "correo@ejemplo.com",
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-semibold text-[#003C63] mb-2", children: "Contraseña" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "password",
            value: password,
            onChange: (e2) => setPassword(e2.target.value),
            className: "w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0066A4] focus:border-[#0066A4] transition-all",
            placeholder: "••••••••",
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "submit",
          disabled: loading,
          className: "w-full bg-[#F5C400] text-[#003C63] py-3 px-6 rounded-full font-bold hover:bg-[#ffd933] transition-all shadow-[0_12px_24px_-10px_rgba(0,60,99,0.25)] hover:shadow-[0_16px_32px_-12px_rgba(0,60,99,0.3)] hover:-translate-y-0.5 disabled:opacity-50",
          children: loading ? "Iniciando sesión..." : "Iniciar Sesión"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => window.location.href = "/forgot-password",
        className: "text-sm text-[#0066A4] hover:text-[#003C63] font-semibold hover:underline",
        children: "¿Olvidaste tu contraseña?"
      }
    ) })
  ] }) });
}
function LucvanHeader({ title, user, onBack, onLogout, showBack = false, children }) {
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "bg-gradient-to-r from-[#0066A4] to-[#003C63] shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 cursor-pointer", onClick: () => navigate("/"), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/lucvan-logo-web.png", alt: "Lucván", className: "h-16 brightness-0 invert" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-white", children: title }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-end gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 items-center", children: [
      showBack && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onBack,
          className: "px-4 py-2 bg-white/10 border-2 border-white/30 text-white rounded-full hover:bg-white/20 transition font-medium backdrop-blur-sm",
          children: "← Volver"
        }
      ),
      children,
      ((user == null ? void 0 : user.name) || (user == null ? void 0 : user.email)) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full shadow-sm border border-white/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold", children: ((user == null ? void 0 : user.name) || (user == null ? void 0 : user.email) || "?").charAt(0).toUpperCase() }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "leading-tight text-right", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-blue-50 tracking-tight", children: (user == null ? void 0 : user.name) || (user == null ? void 0 : user.email) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-blue-100/80 uppercase font-semibold", children: "Usuario" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onLogout,
          className: "px-4 py-2 bg-[#F5C400] text-[#003C63] rounded-full hover:bg-[#ffd933] transition font-bold shadow-lg",
          children: "Cerrar Sesión"
        }
      )
    ] }) })
  ] }) }) });
}
const AMERICAS_COUNTRIES = [
  "Argentina",
  "Bahamas",
  "Barbados",
  "Belice",
  "Bolivia",
  "Brasil",
  "Canadá",
  "Chile",
  "Colombia",
  "Costa Rica",
  "Cuba",
  "Dominica",
  "Ecuador",
  "El Salvador",
  "Estados Unidos",
  "Granada",
  "Guatemala",
  "Guyana",
  "Haití",
  "Honduras",
  "Jamaica",
  "México",
  "Nicaragua",
  "Panamá",
  "Paraguay",
  "Perú",
  "República Dominicana",
  "San Cristóbal y Nieves",
  "San Vicente y las Granadinas",
  "Santa Lucía",
  "Surinam",
  "Trinidad y Tobago",
  "Uruguay",
  "Venezuela"
];
function AdminDashboard() {
  const [activeView, setActiveView] = reactExports.useState("home");
  const [selectedReport, setSelectedReport] = reactExports.useState("patients");
  const [backupInProgress, setBackupInProgress] = reactExports.useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [showCreateClinic, setShowCreateClinic] = reactExports.useState(false);
  const [showCreateUser, setShowCreateUser] = reactExports.useState(false);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState("");
  const [allPatients, setAllPatients] = reactExports.useState([]);
  const [allTickets, setAllTickets] = reactExports.useState([]);
  const [allUsers, setAllUsers] = reactExports.useState([]);
  const [allClinics, setAllClinics] = reactExports.useState([]);
  const [newClinic, setNewClinic] = reactExports.useState({ name: "", country: "", phone: "", address: "" });
  const [newUser, setNewUser] = reactExports.useState({ name: "", email: "", role: "clinic", clinic: "" });
  reactExports.useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");
        const usersResponse = await apiFetch("/api/users");
        if (usersResponse.ok) {
          const users = await usersResponse.json();
          setAllUsers(users.map((u2) => ({
            id: u2.id,
            name: u2.email.split("@")[0],
            email: u2.email,
            role: u2.role,
            organization: u2.clinic_name || "Lucván",
            createdAt: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
            // Placeholder
          })));
        }
        const clinicsResponse = await apiFetch("/api/clinics");
        if (clinicsResponse.ok) {
          const clinics = await clinicsResponse.json();
          setAllClinics(clinics);
        }
        const [requestsResponse, patientsResponse] = await Promise.all([
          apiFetch("/api/requests"),
          apiFetch("/api/patients")
        ]);
        let patientMap = {};
        if (patientsResponse.ok) {
          const patients = await patientsResponse.json();
          patientMap = Object.fromEntries(patients.map((p2) => [p2.id, p2]));
        }
        if (requestsResponse.ok) {
          const requests = await requestsResponse.json();
          setAllTickets(requests.map((r2) => {
            const patient = patientMap[r2.patient_id];
            const statusMap = {
              "pending": "Pendiente",
              "in_progress": "En Producción",
              "in_production": "En Producción",
              "ready": "Lista para Entregar",
              "delivered": "Entregada",
              "cancelled": "Cancelada"
            };
            return {
              id: r2.id,
              patientName: (patient == null ? void 0 : patient.name) || `Paciente ${r2.patient_id}`,
              clinicName: (patient == null ? void 0 : patient.clinic) || r2.clinic_name || "Sin clínica",
              doctorName: r2.doctor_name || "-",
              templateType: r2.template_type || "Solicitud",
              arch: r2.foot_side || "-",
              status: statusMap[r2.status] || "Pendiente",
              date: new Date(r2.created_at).toISOString().split("T")[0],
              createdDate: new Date(r2.created_at).toISOString().split("T")[0]
            };
          }));
        }
        try {
          const patientsResp = await apiFetch("/api/patients");
          if (patientsResp.ok) {
            const patients = await patientsResp.json();
            setAllPatients(patients.map((p2) => ({
              id: p2.id,
              name: p2.name,
              phone: p2.phone,
              email: p2.email,
              birthDate: p2.birthDate || p2.birth_date || null,
              clinic: p2.clinic,
              notes: p2.notes
            })));
          } else {
            setAllPatients([]);
          }
        } catch (err) {
          console.error("Error loading patients:", err);
          setAllPatients([]);
        }
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);
  const loadBackupData = async () => {
    try {
      const response = await apiFetch("/api/backups");
      if (response.ok) {
        const data = await response.json();
        setBackupHistory(data.backups || []);
        setSystemStatus(data.status || {
          lastBackup: null,
          nextBackup: null,
          serverSpace: { used: 0, total: 22, unit: "GB" },
          cloudSpace: { used: 0, total: 5, unit: "GB" },
          archiveCount: 0
        });
      }
    } catch (err) {
      console.error("Error loading backup data:", err);
    }
  };
  reactExports.useEffect(() => {
    if (activeView === "backups") {
      loadBackupData();
    }
  }, [activeView]);
  const [backupHistory, setBackupHistory] = reactExports.useState([]);
  const [systemStatus, setSystemStatus] = reactExports.useState({
    lastBackup: null,
    nextBackup: null,
    serverSpace: { used: 0, total: 22, unit: "GB" },
    cloudSpace: { used: 0, total: 5, unit: "GB" },
    archiveCount: 0
  });
  const handleCreateClinic = async () => {
    if (!newClinic.name || !newClinic.country) {
      alert("Nombre y país son obligatorios");
      return;
    }
    try {
      const response = await apiFetch("/api/clinics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: newClinic.name,
          phone: newClinic.phone,
          email: newClinic.email || null,
          address: newClinic.address || null
        })
      });
      if (response.ok) {
        const clinic = await response.json();
        setAllClinics([...allClinics, clinic]);
        setNewClinic({ name: "", country: "", phone: "", address: "" });
        setShowCreateClinic(false);
        alert("Clínica creada exitosamente");
      } else {
        const error2 = await response.json();
        alert(`Error: ${error2.error}`);
      }
    } catch (error2) {
      console.error("Error creating clinic:", error2);
      alert("Error al crear la clínica");
    }
  };
  const handleCreateUser = async () => {
    if (!newUser.email || !newUser.role) {
      alert("Email y rol son obligatorios");
      return;
    }
    try {
      const response = await apiFetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: newUser.email,
          password: "temp123",
          // Temporary password
          role: newUser.role.toLowerCase(),
          clinicId: newUser.role === "clinic" ? parseInt(newUser.clinic) : null
        })
      });
      if (response.ok) {
        const user = await response.json();
        setAllUsers([...allUsers, {
          id: user.id,
          name: user.email.split("@")[0],
          email: user.email,
          role: user.role,
          organization: user.clinicId ? "Clínica" : "Lucván",
          createdAt: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
        }]);
        setNewUser({ name: "", email: "", role: "clinic", clinic: "" });
        alert("Usuario creado exitosamente");
      } else {
        const error2 = await response.json();
        alert(`Error: ${error2.error}`);
      }
    } catch (error2) {
      console.error("Error creating user:", error2);
      alert("Error al crear el usuario");
    }
  };
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const handleExportReport = () => {
    let csvContent = "";
    let filename = "";
    if (selectedReport === "patients") {
      csvContent = [
        ["Nombre", "Clínica", "Fecha de Creación"],
        ...allPatients.map((p2) => [
          p2.name,
          p2.clinic,
          p2.createdAt ? new Date(p2.createdAt).toLocaleDateString("es-ES") : "-"
        ])
      ].map((row) => row.join(",")).join("\n");
      filename = `reporte-pacientes-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv`;
    } else if (selectedReport === "tickets") {
      csvContent = [
        ["ID Ticket", "Paciente", "Clinica", "Doctor", "Tipo de Plantilla", "Arcada", "Estado", "Fecha de Creacion", "Ultima Actualizacion"],
        ...allTickets.map((t2) => [
          t2.id,
          t2.patientName,
          t2.clinicName,
          t2.doctorName,
          t2.templateType,
          t2.arch,
          t2.status,
          new Date(t2.createdDate).toLocaleDateString("es-ES"),
          new Date(t2.date).toLocaleDateString("es-ES")
        ])
      ].map((row) => row.join(",")).join("\n");
      filename = `reporte-tickets-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv`;
    } else if (selectedReport === "users") {
      csvContent = [
        ["ID", "Nombre", "Email", "Rol", "Organización", "Fecha de Creación"],
        ...allUsers.map((u2) => [u2.id, u2.name, u2.email, u2.role, u2.organization, new Date(u2.createdAt).toLocaleDateString("es-ES")])
      ].map((row) => row.join(",")).join("\n");
      filename = `reporte-usuarios-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv`;
    }
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a3 = document.createElement("a");
    a3.href = url;
    a3.download = filename;
    a3.click();
    window.URL.revokeObjectURL(url);
  };
  const handleManualBackup = async () => {
    setBackupInProgress(true);
    try {
      const response = await apiFetch("/api/backups/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      if (response.ok) {
        const data = await response.json();
        alert("Backup manual iniciado. El proceso se ejecutará en segundo plano.");
        loadBackupData();
      } else {
        const error2 = await response.json();
        alert("Error al crear backup: " + (error2.error || "Error desconocido"));
      }
    } catch (err) {
      console.error("Error creating backup:", err);
      alert("Error al crear backup manual");
    } finally {
      setBackupInProgress(false);
    }
  };
  const handleDownloadBackup = async (backupId) => {
    try {
      const response = await apiFetch(`/api/backups/${backupId}/download`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a3 = document.createElement("a");
        a3.href = url;
        a3.download = `backup-${backupId}.sql`;
        a3.click();
        window.URL.revokeObjectURL(url);
        alert("Descarga iniciada");
      } else {
        const error2 = await response.json();
        alert("Error al descargar: " + (error2.error || "Error desconocido"));
      }
    } catch (err) {
      console.error("Error downloading backup:", err);
      alert("Error al descargar backup");
    }
  };
  const handleRestoreBackup = async (backupId) => {
    const confirmed = window.confirm(
      "⚠️ ADVERTENCIA: Restaurar un backup sobrescribirá todos los datos actuales del sistema. ¿Estás seguro de continuar?"
    );
    if (confirmed) {
      try {
        const response = await apiFetch(`/api/backups/${backupId}/restore`, {
          method: "POST",
          headers: { "Content-Type": "application/json" }
        });
        if (response.ok) {
          const data = await response.json();
          alert("Restauración iniciada en segundo plano. El sistema puede reiniciarse.");
          loadBackupData();
        } else {
          const error2 = await response.json();
          alert("Error al restaurar: " + (error2.error || "Error desconocido"));
        }
      } catch (err) {
        console.error("Error restoring backup:", err);
        alert("Error al restaurar backup");
      }
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-[#F4F6F8]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      LucvanHeader,
      {
        title: "Panel de Administración",
        user: currentUser,
        onLogout: handleLogout,
        showBack: activeView !== "home",
        onBack: () => setActiveView("home")
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
      activeView === "home" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => navigate("/admin/users"),
            className: "bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition transform hover:scale-105 border border-gray-100",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-5xl mb-4", children: "👥" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-blue-900 mb-2", children: "Ver Usuarios" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600", children: "Gestionar usuarios del sistema" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => navigate("/clinic"),
            className: "bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition transform hover:scale-105 border border-gray-100",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-5xl mb-4", children: "🏥" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-blue-900 mb-2", children: "Ver Clínicas" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600", children: "Acceder al módulo de clínicas" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => navigate("/production"),
            className: "bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition transform hover:scale-105 border border-gray-100",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-5xl mb-4", children: "🔨" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-blue-900 mb-2", children: "Producción" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600", children: "Acceder al módulo de producción" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setActiveView("backups"),
            className: "bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition transform hover:scale-105 border border-gray-100",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-5xl mb-4", children: "💾" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-blue-900 mb-2", children: "Backups" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600", children: "Gestionar copias de seguridad" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setActiveView("reports"),
            className: "bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition transform hover:scale-105 border border-gray-100",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-5xl mb-4", children: "📊" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-blue-900 mb-2", children: "Reportes" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600", children: "Descargar reportes en CSV" })
            ]
          }
        )
      ] }),
      activeView === "users" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl shadow-lg p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold", children: "Gestión de Usuarios" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setActiveView("home"),
              className: "px-4 py-2 bg-white border-2 border-[#0066A4] text-[#003C63] rounded-full hover:bg-[#F4F6F8] font-semibold transition-all",
              children: "← Volver"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-gray-200 rounded-lg p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Crear Usuario" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  placeholder: "Nombre",
                  value: newUser.name,
                  onChange: (e2) => setNewUser({ ...newUser, name: e2.target.value }),
                  className: "w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0066A4] focus:border-[#0066A4]"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "email",
                  placeholder: "Email",
                  value: newUser.email,
                  onChange: (e2) => setNewUser({ ...newUser, email: e2.target.value }),
                  className: "w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0066A4] focus:border-[#0066A4]"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "select",
                {
                  value: newUser.role,
                  onChange: (e2) => {
                    const roleValue = e2.target.value;
                    setNewUser({ ...newUser, role: roleValue, clinic: roleValue === "clinic" ? newUser.clinic : "" });
                  },
                  className: "w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0066A4] focus:border-[#0066A4]",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "clinic", children: "Clínica" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "production", children: "Producción" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "admin", children: "Admin" })
                  ]
                }
              ),
              newUser.role === "clinic" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "select",
                  {
                    value: newUser.clinic,
                    onChange: (e2) => setNewUser({ ...newUser, clinic: e2.target.value }),
                    className: "flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0066A4] focus:border-[#0066A4]",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Seleccionar Clínica" }),
                      allPatients.map((p2) => p2.clinic).filter((v2, i2, a3) => a3.indexOf(v2) === i2).map((c2) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c2, children: c2 }, c2))
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setShowCreateClinic(true),
                    className: "px-4 py-2 bg-[#F5C400] text-[#003C63] rounded-full font-bold hover:bg-[#ffd933] transition shadow-[0_12px_24px_-10px_rgba(0,60,99,0.25)]",
                    children: "+ Clínica"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  className: "w-full px-4 py-2 bg-[#F5C400] text-[#003C63] rounded-full font-bold hover:bg-[#ffd933] transition",
                  onClick: handleCreateUser,
                  children: "Crear Usuario"
                }
              )
            ] })
          ] }),
          showCreateClinic && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-gray-200 rounded-lg p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Crear Clínica" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  placeholder: "Nombre de la Clínica",
                  value: newClinic.name,
                  onChange: (e2) => setNewClinic({ ...newClinic, name: e2.target.value }),
                  className: "w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0066A4] focus:border-[#0066A4]"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "select",
                {
                  required: true,
                  value: newClinic.country,
                  onChange: (e2) => setNewClinic({ ...newClinic, country: e2.target.value }),
                  className: "w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0066A4] focus:border-[#0066A4]",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Seleccionar País (obligatorio)" }),
                    AMERICAS_COUNTRIES.map((country) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: country, children: country }, country))
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "tel",
                  inputMode: "numeric",
                  pattern: "[0-9 ]*",
                  placeholder: "Teléfono de contacto",
                  value: newClinic.phone,
                  onChange: (e2) => setNewClinic({ ...newClinic, phone: e2.target.value.replace(/[^0-9 ]/g, "") }),
                  className: "w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0066A4] focus:border-[#0066A4]"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "textarea",
                {
                  rows: "3",
                  placeholder: "Dirección exacta de la clínica",
                  value: newClinic.address,
                  onChange: (e2) => setNewClinic({ ...newClinic, address: e2.target.value }),
                  className: "w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0066A4] focus:border-[#0066A4]"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    className: "flex-1 px-4 py-2 bg-[#F5C400] text-[#003C63] rounded-full font-bold hover:bg-[#ffd933] transition",
                    onClick: handleCreateClinic,
                    children: "Guardar Clínica"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setShowCreateClinic(false),
                    className: "flex-1 px-4 py-2 bg-white border-2 border-[#0066A4] text-[#003C63] rounded-full hover:bg-[#F4F6F8]",
                    children: "Cancelar"
                  }
                )
              ] })
            ] })
          ] })
        ] })
      ] }),
      activeView === "backups" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl shadow-lg p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-[#003C63]", children: "Gestión de Backups" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: handleManualBackup,
              disabled: backupInProgress,
              className: `px-6 py-2 rounded-full font-bold transition-colors duration-200 shadow-lg ${backupInProgress ? "bg-gray-400 text-gray-200 cursor-not-allowed" : "bg-[#F5C400] text-[#003C63] hover:bg-[#ffd933]"}`,
              children: backupInProgress ? "Procesando..." : "Crear Backup Manual"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-blue-50 p-4 rounded-lg border border-blue-200", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-600 mb-1", children: "Último Backup" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-semibold text-gray-800", children: systemStatus.lastBackup ? new Date(systemStatus.lastBackup).toLocaleDateString("es-ES") : "Sin datos" }),
              systemStatus.lastBackup && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500", children: new Date(systemStatus.lastBackup).toLocaleTimeString("es-ES") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-green-50 p-4 rounded-lg border border-green-200", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-600 mb-1", children: "Próximo Backup" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-semibold text-gray-800", children: systemStatus.nextBackup ? new Date(systemStatus.nextBackup).toLocaleDateString("es-ES") : "Domingos 3:00 AM" }),
              systemStatus.nextBackup && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500", children: new Date(systemStatus.nextBackup).toLocaleTimeString("es-ES") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-yellow-50 p-4 rounded-lg border border-yellow-200", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-600 mb-1", children: "Espacio Servidor" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-lg font-semibold text-gray-800", children: [
                systemStatus.serverSpace.used,
                " / ",
                systemStatus.serverSpace.total,
                " GB"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full bg-gray-200 rounded-full h-2 mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "bg-yellow-500 h-2 rounded-full",
                  style: { width: `${systemStatus.serverSpace.used / systemStatus.serverSpace.total * 100}%` }
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-purple-50 p-4 rounded-lg border border-purple-200", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-600 mb-1", children: "Espacio Cloud" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-lg font-semibold text-gray-800", children: [
                systemStatus.cloudSpace.used,
                " / ",
                systemStatus.cloudSpace.total,
                " GB"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full bg-gray-200 rounded-full h-2 mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "bg-purple-500 h-2 rounded-full",
                  style: { width: `${systemStatus.cloudSpace.used / systemStatus.cloudSpace.total * 100}%` }
                }
              ) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-gray-200 rounded-lg p-6 bg-gray-50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold mb-4 text-gray-800", children: "Historial de Backups" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "min-w-full bg-white border border-gray-200 rounded-lg", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-gray-100", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-sm font-semibold text-gray-700", children: "ID" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-sm font-semibold text-gray-700", children: "Tipo" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-sm font-semibold text-gray-700", children: "Fecha" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-sm font-semibold text-gray-700", children: "Tamaño" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-sm font-semibold text-gray-700", children: "Chunks" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-sm font-semibold text-gray-700", children: "Estado" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-sm font-semibold text-gray-700", children: "Acciones" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: backupHistory.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: "7", className: "px-4 py-8 text-center text-gray-500", children: "No hay backups registrados. Crea un backup manual para comenzar." }) }) : backupHistory.map((backup, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: index % 2 === 0 ? "bg-white" : "bg-gray-50", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-sm text-gray-800", children: backup.id }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `px-2 py-1 rounded-full text-xs font-medium ${backup.type === "Automático" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`,
                    children: backup.type
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-sm text-gray-800", children: [
                  new Date(backup.date).toLocaleDateString("es-ES"),
                  " ",
                  new Date(backup.date).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-sm text-gray-800", children: backup.size }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-sm text-gray-600", children: backup.chunks }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `px-2 py-1 rounded-full text-xs font-medium ${backup.status === "completed" || backup.status === "Completado" ? "bg-green-100 text-green-800" : backup.status === "in_progress" || backup.status === "En Progreso" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`,
                    children: backup.status === "completed" ? "Completado" : backup.status === "in_progress" ? "En Progreso" : backup.status
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: () => handleDownloadBackup(backup.id),
                      className: "text-blue-600 hover:text-blue-800 font-medium",
                      title: "Descargar backup",
                      children: "Descargar"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: () => handleRestoreBackup(backup.id),
                      className: "text-green-600 hover:text-green-800 font-medium",
                      title: "Restaurar backup",
                      children: "Restaurar"
                    }
                  )
                ] }) })
              ] }, backup.id)) })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-gray-600 bg-blue-50 p-4 rounded-lg border border-blue-200", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold text-gray-800 mb-2", children: "ℹ️ Información del Sistema de Backups" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Backups Automáticos:" }),
              " Se ejecutan semanalmente (domingos a las 3:00 AM). Los backups grandes se dividen en chunks de ~900MB que se suben durante varios días consecutivos para no exceder los límites de transferencia."
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Backups Manuales:" }),
              " Puedes crear backups manuales en cualquier momento desde este panel. El sistema notificará cuando el proceso finalice."
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Archivos Archivados:" }),
              " ",
              systemStatus.archiveCount,
              " archivos antiguos (mayores a 12 meses) están almacenados en la nube para liberar espacio en el servidor."
            ] })
          ] })
        ] })
      ] }),
      activeView === "reports" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl shadow-lg p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-[#003C63]", children: "Reportes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setActiveView("home"),
              className: "px-4 py-2 bg-white border-2 border-[#0066A4] text-[#003C63] rounded-full hover:bg-[#F4F6F8] font-semibold transition-all",
              children: "← Volver"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 mb-3", children: "Seleccionar Reporte:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setSelectedReport("patients"),
                className: `px-4 py-2 rounded-lg font-medium transition ${selectedReport === "patients" ? "bg-[#0066A4] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
                children: "👥 Pacientes"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setSelectedReport("tickets"),
                className: `px-4 py-2 rounded-lg font-medium transition ${selectedReport === "tickets" ? "bg-[#0066A4] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
                children: "🎫 Tickets"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setSelectedReport("users"),
                className: `px-4 py-2 rounded-lg font-medium transition ${selectedReport === "users" ? "bg-[#0066A4] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
                children: "👤 Usuarios"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-50 rounded-lg p-6 border border-gray-200 mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold mb-4 text-gray-900", children: selectedReport === "patients" ? "Reporte de Pacientes" : selectedReport === "tickets" ? "Reporte de Tickets" : "Reporte de Usuarios" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm border-collapse", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-gray-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
              selectedReport === "patients" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "border border-gray-300 px-4 py-2 text-left", children: "Nombre" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "border border-gray-300 px-4 py-2 text-left", children: "Clínica" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "border border-gray-300 px-4 py-2 text-left", children: "F. Creación" })
              ] }),
              selectedReport === "tickets" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "border border-gray-300 px-4 py-2 text-left", children: "ID" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "border border-gray-300 px-4 py-2 text-left", children: "Paciente" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "border border-gray-300 px-4 py-2 text-left", children: "Clínica" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "border border-gray-300 px-4 py-2 text-left", children: "Doctor" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "border border-gray-300 px-4 py-2 text-left", children: "Tipo" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "border border-gray-300 px-4 py-2 text-left", children: "Arcada" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "border border-gray-300 px-4 py-2 text-left", children: "Estado" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "border border-gray-300 px-4 py-2 text-left", children: "Fecha" })
              ] }),
              selectedReport === "users" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "border border-gray-300 px-4 py-2 text-left", children: "ID" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "border border-gray-300 px-4 py-2 text-left", children: "Nombre" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "border border-gray-300 px-4 py-2 text-left", children: "Email" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "border border-gray-300 px-4 py-2 text-left", children: "Rol" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "border border-gray-300 px-4 py-2 text-left", children: "F. Creación" })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
              selectedReport === "patients" && (allPatients.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: "3", className: "border border-gray-300 px-4 py-4 text-center text-gray-500", children: "No hay pacientes registrados" }) }) : allPatients.map((p2, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: idx % 2 === 0 ? "bg-white" : "bg-gray-50", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "border border-gray-300 px-4 py-2", children: p2.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "border border-gray-300 px-4 py-2", children: p2.clinic }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "border border-gray-300 px-4 py-2", children: p2.createdAt ? new Date(p2.createdAt).toLocaleDateString("es-ES") : "-" })
              ] }, p2.id))),
              selectedReport === "tickets" && (allTickets.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: "8", className: "border border-gray-300 px-4 py-4 text-center text-gray-500", children: "No hay tickets registrados" }) }) : allTickets.map((t2, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: idx % 2 === 0 ? "bg-white" : "bg-gray-50", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "border border-gray-300 px-4 py-2", children: t2.id }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "border border-gray-300 px-4 py-2", children: t2.patientName }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "border border-gray-300 px-4 py-2", children: t2.clinicName }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "border border-gray-300 px-4 py-2", children: t2.doctorName }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "border border-gray-300 px-4 py-2", children: t2.templateType }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "border border-gray-300 px-4 py-2", children: t2.arch }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "border border-gray-300 px-4 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `px-2 py-1 rounded text-xs font-medium ${t2.status === "Entregado" ? "bg-green-100 text-green-800" : t2.status === "En Producción" ? "bg-blue-100 text-blue-800" : t2.status === "Pendiente" ? "bg-yellow-100 text-yellow-800" : t2.status === "Cancelado" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"}`,
                    children: t2.status
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "border border-gray-300 px-4 py-2", children: new Date(t2.date).toLocaleDateString("es-ES") })
              ] }, t2.id))),
              selectedReport === "users" && (allUsers.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: "5", className: "border border-gray-300 px-4 py-4 text-center text-gray-500", children: "No hay usuarios registrados" }) }) : allUsers.map((u2, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: idx % 2 === 0 ? "bg-white" : "bg-gray-50", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "border border-gray-300 px-4 py-2", children: u2.id }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "border border-gray-300 px-4 py-2", children: u2.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "border border-gray-300 px-4 py-2", children: u2.email }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "border border-gray-300 px-4 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800", children: u2.role }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "border border-gray-300 px-4 py-2", children: u2.createdAt ? new Date(u2.createdAt).toLocaleDateString("es-ES") : "-" })
              ] }, u2.id)))
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: handleExportReport,
            className: "px-6 py-3 bg-[#0066A4] text-white rounded-full font-bold hover:bg-[#005a8f] transition shadow-lg",
            children: "📥 Descargar como CSV"
          }
        )
      ] }),
      "      "
    ] })
  ] });
}
var i$5 = Object.defineProperty;
var d$3 = (t2, e2, n2) => e2 in t2 ? i$5(t2, e2, { enumerable: true, configurable: true, writable: true, value: n2 }) : t2[e2] = n2;
var r$5 = (t2, e2, n2) => (d$3(t2, typeof e2 != "symbol" ? e2 + "" : e2, n2), n2);
let o$7 = class o {
  constructor() {
    r$5(this, "current", this.detect());
    r$5(this, "handoffState", "pending");
    r$5(this, "currentId", 0);
  }
  set(e2) {
    this.current !== e2 && (this.handoffState = "pending", this.currentId = 0, this.current = e2);
  }
  reset() {
    this.set(this.detect());
  }
  nextId() {
    return ++this.currentId;
  }
  get isServer() {
    return this.current === "server";
  }
  get isClient() {
    return this.current === "client";
  }
  detect() {
    return typeof window == "undefined" || typeof document == "undefined" ? "server" : "client";
  }
  handoff() {
    this.handoffState === "pending" && (this.handoffState = "complete");
  }
  get isHandoffComplete() {
    return this.handoffState === "complete";
  }
};
let s$6 = new o$7();
function l$4(n2) {
  var u2;
  return s$6.isServer ? null : n2 == null ? document : (u2 = n2 == null ? void 0 : n2.ownerDocument) != null ? u2 : document;
}
function r$4(n2) {
  var u2, o4;
  return s$6.isServer ? null : n2 == null ? document : (o4 = (u2 = n2 == null ? void 0 : n2.getRootNode) == null ? void 0 : u2.call(n2)) != null ? o4 : document;
}
function e$3(n2) {
  var u2, o4;
  return (o4 = (u2 = r$4(n2)) == null ? void 0 : u2.activeElement) != null ? o4 : null;
}
function d$2(n2) {
  return e$3(n2) === n2;
}
function t$4(e2) {
  typeof queueMicrotask == "function" ? queueMicrotask(e2) : Promise.resolve().then(e2).catch((o4) => setTimeout(() => {
    throw o4;
  }));
}
function o$6() {
  let s2 = [], r2 = { addEventListener(e2, t2, n2, i2) {
    return e2.addEventListener(t2, n2, i2), r2.add(() => e2.removeEventListener(t2, n2, i2));
  }, requestAnimationFrame(...e2) {
    let t2 = requestAnimationFrame(...e2);
    return r2.add(() => cancelAnimationFrame(t2));
  }, nextFrame(...e2) {
    return r2.requestAnimationFrame(() => r2.requestAnimationFrame(...e2));
  }, setTimeout(...e2) {
    let t2 = setTimeout(...e2);
    return r2.add(() => clearTimeout(t2));
  }, microTask(...e2) {
    let t2 = { current: true };
    return t$4(() => {
      t2.current && e2[0]();
    }), r2.add(() => {
      t2.current = false;
    });
  }, style(e2, t2, n2) {
    let i2 = e2.style.getPropertyValue(t2);
    return Object.assign(e2.style, { [t2]: n2 }), this.add(() => {
      Object.assign(e2.style, { [t2]: i2 });
    });
  }, group(e2) {
    let t2 = o$6();
    return e2(t2), this.add(() => t2.dispose());
  }, add(e2) {
    return s2.includes(e2) || s2.push(e2), () => {
      let t2 = s2.indexOf(e2);
      if (t2 >= 0) for (let n2 of s2.splice(t2, 1)) n2();
    };
  }, dispose() {
    for (let e2 of s2.splice(0)) e2();
  } };
  return r2;
}
function p$3() {
  let [e2] = reactExports.useState(o$6);
  return reactExports.useEffect(() => () => e2.dispose(), [e2]), e2;
}
let n$6 = (e2, t2) => {
  s$6.isServer ? reactExports.useEffect(e2, t2) : reactExports.useLayoutEffect(e2, t2);
};
function s$5(e2) {
  let r2 = reactExports.useRef(e2);
  return n$6(() => {
    r2.current = e2;
  }, [e2]), r2;
}
let o$5 = function(t2) {
  let e2 = s$5(t2);
  return React$1.useCallback((...r2) => e2.current(...r2), [e2]);
};
function n$5(e2) {
  return reactExports.useMemo(() => e2, Object.values(e2));
}
let e$2 = reactExports.createContext(void 0);
function a$a() {
  return reactExports.useContext(e$2);
}
function t$3(...r2) {
  return Array.from(new Set(r2.flatMap((n2) => typeof n2 == "string" ? n2.split(" ") : []))).filter(Boolean).join(" ");
}
function u$7(r2, n2, ...a3) {
  if (r2 in n2) {
    let e2 = n2[r2];
    return typeof e2 == "function" ? e2(...a3) : e2;
  }
  let t2 = new Error(`Tried to handle "${r2}" but there is no handler defined. Only defined handlers are: ${Object.keys(n2).map((e2) => `"${e2}"`).join(", ")}.`);
  throw Error.captureStackTrace && Error.captureStackTrace(t2, u$7), t2;
}
var A$2 = ((a3) => (a3[a3.None = 0] = "None", a3[a3.RenderStrategy = 1] = "RenderStrategy", a3[a3.Static = 2] = "Static", a3))(A$2 || {}), C$4 = ((e2) => (e2[e2.Unmount = 0] = "Unmount", e2[e2.Hidden = 1] = "Hidden", e2))(C$4 || {});
function K() {
  let n2 = $$1();
  return reactExports.useCallback((r2) => U({ mergeRefs: n2, ...r2 }), [n2]);
}
function U({ ourProps: n2, theirProps: r2, slot: e2, defaultTag: a3, features: s2, visible: t2 = true, name: l2, mergeRefs: i2 }) {
  i2 = i2 != null ? i2 : I$5;
  let o4 = P$1(r2, n2);
  if (t2) return F(o4, e2, a3, l2, i2);
  let y2 = s2 != null ? s2 : 0;
  if (y2 & 2) {
    let { static: f2 = false, ...u2 } = o4;
    if (f2) return F(u2, e2, a3, l2, i2);
  }
  if (y2 & 1) {
    let { unmount: f2 = true, ...u2 } = o4;
    return u$7(f2 ? 0 : 1, { [0]() {
      return null;
    }, [1]() {
      return F({ ...u2, hidden: true, style: { display: "none" } }, e2, a3, l2, i2);
    } });
  }
  return F(o4, e2, a3, l2, i2);
}
function F(n2, r2 = {}, e2, a3, s2) {
  let { as: t2 = e2, children: l2, refName: i2 = "ref", ...o4 } = h$3(n2, ["unmount", "static"]), y2 = n2.ref !== void 0 ? { [i2]: n2.ref } : {}, f2 = typeof l2 == "function" ? l2(r2) : l2;
  "className" in o4 && o4.className && typeof o4.className == "function" && (o4.className = o4.className(r2)), o4["aria-labelledby"] && o4["aria-labelledby"] === o4.id && (o4["aria-labelledby"] = void 0);
  let u2 = {};
  if (r2) {
    let d2 = false, p2 = [];
    for (let [c2, T3] of Object.entries(r2)) typeof T3 == "boolean" && (d2 = true), T3 === true && p2.push(c2.replace(/([A-Z])/g, (g2) => `-${g2.toLowerCase()}`));
    if (d2) {
      u2["data-headlessui-state"] = p2.join(" ");
      for (let c2 of p2) u2[`data-${c2}`] = "";
    }
  }
  if (b$1(t2) && (Object.keys(m$3(o4)).length > 0 || Object.keys(m$3(u2)).length > 0)) if (!reactExports.isValidElement(f2) || Array.isArray(f2) && f2.length > 1 || D$2(f2)) {
    if (Object.keys(m$3(o4)).length > 0) throw new Error(['Passing props on "Fragment"!', "", `The current component <${a3} /> is rendering a "Fragment".`, "However we need to passthrough the following props:", Object.keys(m$3(o4)).concat(Object.keys(m$3(u2))).map((d2) => `  - ${d2}`).join(`
`), "", "You can apply a few solutions:", ['Add an `as="..."` prop, to ensure that we render an actual element instead of a "Fragment".', "Render a single element as the child so that we can forward the props onto that element."].map((d2) => `  - ${d2}`).join(`
`)].join(`
`));
  } else {
    let d2 = f2.props, p2 = d2 == null ? void 0 : d2.className, c2 = typeof p2 == "function" ? (...R2) => t$3(p2(...R2), o4.className) : t$3(p2, o4.className), T3 = c2 ? { className: c2 } : {}, g2 = P$1(f2.props, m$3(h$3(o4, ["ref"])));
    for (let R2 in u2) R2 in g2 && delete u2[R2];
    return reactExports.cloneElement(f2, Object.assign({}, g2, u2, y2, { ref: s2(H$2(f2), y2.ref) }, T3));
  }
  return reactExports.createElement(t2, Object.assign({}, h$3(o4, ["ref"]), !b$1(t2) && y2, !b$1(t2) && u2), f2);
}
function $$1() {
  let n2 = reactExports.useRef([]), r2 = reactExports.useCallback((e2) => {
    for (let a3 of n2.current) a3 != null && (typeof a3 == "function" ? a3(e2) : a3.current = e2);
  }, []);
  return (...e2) => {
    if (!e2.every((a3) => a3 == null)) return n2.current = e2, r2;
  };
}
function I$5(...n2) {
  return n2.every((r2) => r2 == null) ? void 0 : (r2) => {
    for (let e2 of n2) e2 != null && (typeof e2 == "function" ? e2(r2) : e2.current = r2);
  };
}
function P$1(...n2) {
  if (n2.length === 0) return {};
  if (n2.length === 1) return n2[0];
  let r2 = {}, e2 = {};
  for (let s2 of n2) for (let t2 in s2) t2.startsWith("on") && typeof s2[t2] == "function" ? (e2[t2] != null || (e2[t2] = []), e2[t2].push(s2[t2])) : r2[t2] = s2[t2];
  if (r2.disabled || r2["aria-disabled"]) for (let s2 in e2) /^(on(?:Click|Pointer|Mouse|Key)(?:Down|Up|Press)?)$/.test(s2) && (e2[s2] = [(t2) => {
    var l2;
    return (l2 = t2 == null ? void 0 : t2.preventDefault) == null ? void 0 : l2.call(t2);
  }]);
  for (let s2 in e2) Object.assign(r2, { [s2](t2, ...l2) {
    let i2 = e2[s2];
    for (let o4 of i2) {
      if ((t2 instanceof Event || (t2 == null ? void 0 : t2.nativeEvent) instanceof Event) && t2.defaultPrevented) return;
      o4(t2, ...l2);
    }
  } });
  return r2;
}
function Y(n2) {
  var r2;
  return Object.assign(reactExports.forwardRef(n2), { displayName: (r2 = n2.displayName) != null ? r2 : n2.name });
}
function m$3(n2) {
  let r2 = Object.assign({}, n2);
  for (let e2 in r2) r2[e2] === void 0 && delete r2[e2];
  return r2;
}
function h$3(n2, r2 = []) {
  let e2 = Object.assign({}, n2);
  for (let a3 of r2) a3 in e2 && delete e2[a3];
  return e2;
}
function H$2(n2) {
  return React$1.version.split(".")[0] >= "19" ? n2.props.ref : n2.ref;
}
function b$1(n2) {
  return n2 === reactExports.Fragment || n2 === Symbol.for("react.fragment");
}
function D$2(n2) {
  return b$1(n2.type);
}
let a$9 = "span";
var s$4 = ((e2) => (e2[e2.None = 1] = "None", e2[e2.Focusable = 2] = "Focusable", e2[e2.Hidden = 4] = "Hidden", e2))(s$4 || {});
function l$3(t2, r2) {
  var n2;
  let { features: d2 = 1, ...e2 } = t2, o4 = { ref: r2, "aria-hidden": (d2 & 2) === 2 ? true : (n2 = e2["aria-hidden"]) != null ? n2 : void 0, hidden: (d2 & 4) === 4 ? true : void 0, style: { position: "fixed", top: 1, left: 1, width: 1, height: 0, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", borderWidth: "0", ...(d2 & 4) === 4 && (d2 & 2) !== 2 && { display: "none" } } };
  return K()({ ourProps: o4, theirProps: e2, slot: {}, defaultTag: a$9, name: "Hidden" });
}
let f$6 = Y(l$3);
function o$4(e2) {
  return typeof e2 != "object" || e2 === null ? false : "nodeType" in e2;
}
function t$2(e2) {
  return o$4(e2) && "tagName" in e2;
}
function n$4(e2) {
  return t$2(e2) && "accessKey" in e2;
}
function i$4(e2) {
  return t$2(e2) && "tabIndex" in e2;
}
function r$3(e2) {
  return t$2(e2) && "style" in e2;
}
function u$6(e2) {
  return n$4(e2) && e2.nodeName === "IFRAME";
}
function l$2(e2) {
  return n$4(e2) && e2.nodeName === "INPUT";
}
let u$5 = Symbol();
function T$3(t2, n2 = true) {
  return Object.assign(t2, { [u$5]: n2 });
}
function y$2(...t2) {
  let n2 = reactExports.useRef(t2);
  reactExports.useEffect(() => {
    n2.current = t2;
  }, [t2]);
  let c2 = o$5((e2) => {
    for (let o4 of n2.current) o4 != null && (typeof o4 == "function" ? o4(e2) : o4.current = e2);
  });
  return t2.every((e2) => e2 == null || (e2 == null ? void 0 : e2[u$5])) ? void 0 : c2;
}
let a$8 = reactExports.createContext(null);
a$8.displayName = "DescriptionContext";
function f$5() {
  let r2 = reactExports.useContext(a$8);
  if (r2 === null) {
    let e2 = new Error("You used a <Description /> component, but it is not inside a relevant parent.");
    throw Error.captureStackTrace && Error.captureStackTrace(e2, f$5), e2;
  }
  return r2;
}
function H$1() {
  let [r2, e2] = reactExports.useState([]);
  return [r2.length > 0 ? r2.join(" ") : void 0, reactExports.useMemo(() => function(t2) {
    let i2 = o$5((n2) => (e2((o4) => [...o4, n2]), () => e2((o4) => {
      let s2 = o4.slice(), p2 = s2.indexOf(n2);
      return p2 !== -1 && s2.splice(p2, 1), s2;
    }))), l2 = reactExports.useMemo(() => ({ register: i2, slot: t2.slot, name: t2.name, props: t2.props, value: t2.value }), [i2, t2.slot, t2.name, t2.props, t2.value]);
    return React$1.createElement(a$8.Provider, { value: l2 }, t2.children);
  }, [e2])];
}
let I$4 = "p";
function C$3(r2, e2) {
  let c2 = reactExports.useId(), t2 = a$a(), { id: i2 = `headlessui-description-${c2}`, ...l2 } = r2, n2 = f$5(), o4 = y$2(e2);
  n$6(() => n2.register(i2), [i2, n2.register]);
  let s2 = n$5({ ...n2.slot, disabled: t2 || false }), p2 = { ref: o4, ...n2.props, id: i2 };
  return K()({ ourProps: p2, theirProps: l2, slot: s2, defaultTag: I$4, name: n2.name || "Description" });
}
let _$2 = Y(C$3), M$2 = Object.assign(_$2, {});
var o$3 = ((r2) => (r2.Space = " ", r2.Enter = "Enter", r2.Escape = "Escape", r2.Backspace = "Backspace", r2.Delete = "Delete", r2.ArrowLeft = "ArrowLeft", r2.ArrowUp = "ArrowUp", r2.ArrowRight = "ArrowRight", r2.ArrowDown = "ArrowDown", r2.Home = "Home", r2.End = "End", r2.PageUp = "PageUp", r2.PageDown = "PageDown", r2.Tab = "Tab", r2))(o$3 || {});
let e$1 = reactExports.createContext(() => {
});
function C$2({ value: t2, children: o4 }) {
  return React$1.createElement(e$1.Provider, { value: t2 }, o4);
}
let a$7 = class a extends Map {
  constructor(t2) {
    super();
    this.factory = t2;
  }
  get(t2) {
    let e2 = super.get(t2);
    return e2 === void 0 && (e2 = this.factory(t2), this.set(t2, e2)), e2;
  }
};
var h$2 = Object.defineProperty;
var v$1 = (t2, e2, r2) => e2 in t2 ? h$2(t2, e2, { enumerable: true, configurable: true, writable: true, value: r2 }) : t2[e2] = r2;
var S$5 = (t2, e2, r2) => (v$1(t2, e2 + "", r2), r2), b = (t2, e2, r2) => {
  if (!e2.has(t2)) throw TypeError("Cannot " + r2);
};
var i$3 = (t2, e2, r2) => (b(t2, e2, "read from private field"), r2 ? r2.call(t2) : e2.get(t2)), c$5 = (t2, e2, r2) => {
  if (e2.has(t2)) throw TypeError("Cannot add the same private member more than once");
  e2 instanceof WeakSet ? e2.add(t2) : e2.set(t2, r2);
}, u$4 = (t2, e2, r2, s2) => (b(t2, e2, "write to private field"), e2.set(t2, r2), r2);
var n$3, a$6, o$2;
let T$2 = class T {
  constructor(e2) {
    c$5(this, n$3, {});
    c$5(this, a$6, new a$7(() => /* @__PURE__ */ new Set()));
    c$5(this, o$2, /* @__PURE__ */ new Set());
    S$5(this, "disposables", o$6());
    u$4(this, n$3, e2), s$6.isServer && this.disposables.microTask(() => {
      this.dispose();
    });
  }
  dispose() {
    this.disposables.dispose();
  }
  get state() {
    return i$3(this, n$3);
  }
  subscribe(e2, r2) {
    if (s$6.isServer) return () => {
    };
    let s2 = { selector: e2, callback: r2, current: e2(i$3(this, n$3)) };
    return i$3(this, o$2).add(s2), this.disposables.add(() => {
      i$3(this, o$2).delete(s2);
    });
  }
  on(e2, r2) {
    return s$6.isServer ? () => {
    } : (i$3(this, a$6).get(e2).add(r2), this.disposables.add(() => {
      i$3(this, a$6).get(e2).delete(r2);
    }));
  }
  send(e2) {
    let r2 = this.reduce(i$3(this, n$3), e2);
    if (r2 !== i$3(this, n$3)) {
      u$4(this, n$3, r2);
      for (let s2 of i$3(this, o$2)) {
        let l2 = s2.selector(i$3(this, n$3));
        j$3(s2.current, l2) || (s2.current = l2, s2.callback(l2));
      }
      for (let s2 of i$3(this, a$6).get(e2.type)) s2(i$3(this, n$3), e2);
    }
  }
};
n$3 = /* @__PURE__ */ new WeakMap(), a$6 = /* @__PURE__ */ new WeakMap(), o$2 = /* @__PURE__ */ new WeakMap();
function j$3(t2, e2) {
  return Object.is(t2, e2) ? true : typeof t2 != "object" || t2 === null || typeof e2 != "object" || e2 === null ? false : Array.isArray(t2) && Array.isArray(e2) ? t2.length !== e2.length ? false : f$4(t2[Symbol.iterator](), e2[Symbol.iterator]()) : t2 instanceof Map && e2 instanceof Map || t2 instanceof Set && e2 instanceof Set ? t2.size !== e2.size ? false : f$4(t2.entries(), e2.entries()) : p$2(t2) && p$2(e2) ? f$4(Object.entries(t2)[Symbol.iterator](), Object.entries(e2)[Symbol.iterator]()) : false;
}
function f$4(t2, e2) {
  do {
    let r2 = t2.next(), s2 = e2.next();
    if (r2.done && s2.done) return true;
    if (r2.done || s2.done || !Object.is(r2.value, s2.value)) return false;
  } while (true);
}
function p$2(t2) {
  if (Object.prototype.toString.call(t2) !== "[object Object]") return false;
  let e2 = Object.getPrototypeOf(t2);
  return e2 === null || Object.getPrototypeOf(e2) === null;
}
var a$5 = Object.defineProperty;
var r$2 = (e2, c2, t2) => c2 in e2 ? a$5(e2, c2, { enumerable: true, configurable: true, writable: true, value: t2 }) : e2[c2] = t2;
var p$1 = (e2, c2, t2) => (r$2(e2, typeof c2 != "symbol" ? c2 + "" : c2, t2), t2);
var k$1 = ((t2) => (t2[t2.Push = 0] = "Push", t2[t2.Pop = 1] = "Pop", t2))(k$1 || {});
let y$1 = { [0](e2, c2) {
  let t2 = c2.id, s2 = e2.stack, i2 = e2.stack.indexOf(t2);
  if (i2 !== -1) {
    let n2 = e2.stack.slice();
    return n2.splice(i2, 1), n2.push(t2), s2 = n2, { ...e2, stack: s2 };
  }
  return { ...e2, stack: [...e2.stack, t2] };
}, [1](e2, c2) {
  let t2 = c2.id, s2 = e2.stack.indexOf(t2);
  if (s2 === -1) return e2;
  let i2 = e2.stack.slice();
  return i2.splice(s2, 1), { ...e2, stack: i2 };
} };
let o$1 = class o2 extends T$2 {
  constructor() {
    super(...arguments);
    p$1(this, "actions", { push: (t2) => this.send({ type: 0, id: t2 }), pop: (t2) => this.send({ type: 1, id: t2 }) });
    p$1(this, "selectors", { isTop: (t2, s2) => t2.stack[t2.stack.length - 1] === s2, inStack: (t2, s2) => t2.stack.includes(s2) });
  }
  static new() {
    return new o2({ stack: [] });
  }
  reduce(t2, s2) {
    return u$7(s2.type, y$1, t2, s2);
  }
};
const x$4 = new a$7(() => o$1.new());
var withSelector = { exports: {} };
var useSyncExternalStoreWithSelector_production = {};
/**
 * @license React
 * use-sync-external-store-with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var React = reactExports;
function is(x2, y2) {
  return x2 === y2 && (0 !== x2 || 1 / x2 === 1 / y2) || x2 !== x2 && y2 !== y2;
}
var objectIs = "function" === typeof Object.is ? Object.is : is, useSyncExternalStore = React.useSyncExternalStore, useRef = React.useRef, useEffect = React.useEffect, useMemo = React.useMemo, useDebugValue = React.useDebugValue;
useSyncExternalStoreWithSelector_production.useSyncExternalStoreWithSelector = function(subscribe, getSnapshot, getServerSnapshot, selector, isEqual) {
  var instRef = useRef(null);
  if (null === instRef.current) {
    var inst = { hasValue: false, value: null };
    instRef.current = inst;
  } else inst = instRef.current;
  instRef = useMemo(
    function() {
      function memoizedSelector(nextSnapshot) {
        if (!hasMemo) {
          hasMemo = true;
          memoizedSnapshot = nextSnapshot;
          nextSnapshot = selector(nextSnapshot);
          if (void 0 !== isEqual && inst.hasValue) {
            var currentSelection = inst.value;
            if (isEqual(currentSelection, nextSnapshot))
              return memoizedSelection = currentSelection;
          }
          return memoizedSelection = nextSnapshot;
        }
        currentSelection = memoizedSelection;
        if (objectIs(memoizedSnapshot, nextSnapshot)) return currentSelection;
        var nextSelection = selector(nextSnapshot);
        if (void 0 !== isEqual && isEqual(currentSelection, nextSelection))
          return memoizedSnapshot = nextSnapshot, currentSelection;
        memoizedSnapshot = nextSnapshot;
        return memoizedSelection = nextSelection;
      }
      var hasMemo = false, memoizedSnapshot, memoizedSelection, maybeGetServerSnapshot = void 0 === getServerSnapshot ? null : getServerSnapshot;
      return [
        function() {
          return memoizedSelector(getSnapshot());
        },
        null === maybeGetServerSnapshot ? void 0 : function() {
          return memoizedSelector(maybeGetServerSnapshot());
        }
      ];
    },
    [getSnapshot, getServerSnapshot, selector, isEqual]
  );
  var value = useSyncExternalStore(subscribe, instRef[0], instRef[1]);
  useEffect(
    function() {
      inst.hasValue = true;
      inst.value = value;
    },
    [value]
  );
  useDebugValue(value);
  return value;
};
{
  withSelector.exports = useSyncExternalStoreWithSelector_production;
}
var withSelectorExports = withSelector.exports;
function S$4(e2, n2, r2 = j$3) {
  return withSelectorExports.useSyncExternalStoreWithSelector(o$5((i2) => e2.subscribe(s$3, i2)), o$5(() => e2.state), o$5(() => e2.state), o$5(n2), r2);
}
function s$3(e2) {
  return e2;
}
function I$3(o4, s2) {
  let t2 = reactExports.useId(), r2 = x$4.get(s2), [i2, c2] = S$4(r2, reactExports.useCallback((e2) => [r2.selectors.isTop(e2, t2), r2.selectors.inStack(e2, t2)], [r2, t2]));
  return n$6(() => {
    if (o4) return r2.actions.push(t2), () => r2.actions.pop(t2);
  }, [r2, o4, t2]), o4 ? c2 ? i2 : true : false;
}
let f$3 = /* @__PURE__ */ new Map(), u$3 = /* @__PURE__ */ new Map();
function h$1(t2) {
  var e2;
  let r2 = (e2 = u$3.get(t2)) != null ? e2 : 0;
  return u$3.set(t2, r2 + 1), r2 !== 0 ? () => m$2(t2) : (f$3.set(t2, { "aria-hidden": t2.getAttribute("aria-hidden"), inert: t2.inert }), t2.setAttribute("aria-hidden", "true"), t2.inert = true, () => m$2(t2));
}
function m$2(t2) {
  var i2;
  let r2 = (i2 = u$3.get(t2)) != null ? i2 : 1;
  if (r2 === 1 ? u$3.delete(t2) : u$3.set(t2, r2 - 1), r2 !== 1) return;
  let e2 = f$3.get(t2);
  e2 && (e2["aria-hidden"] === null ? t2.removeAttribute("aria-hidden") : t2.setAttribute("aria-hidden", e2["aria-hidden"]), t2.inert = e2.inert, f$3.delete(t2));
}
function y(t2, { allowed: r2, disallowed: e2 } = {}) {
  let i2 = I$3(t2, "inert-others");
  n$6(() => {
    var d2, c2;
    if (!i2) return;
    let a3 = o$6();
    for (let n2 of (d2 = e2 == null ? void 0 : e2()) != null ? d2 : []) n2 && a3.add(h$1(n2));
    let s2 = (c2 = r2 == null ? void 0 : r2()) != null ? c2 : [];
    for (let n2 of s2) {
      if (!n2) continue;
      let l2 = l$4(n2);
      if (!l2) continue;
      let o4 = n2.parentElement;
      for (; o4 && o4 !== l2.body; ) {
        for (let p2 of o4.children) s2.some((E2) => p2.contains(E2)) || a3.add(h$1(p2));
        o4 = o4.parentElement;
      }
    }
    return a3.dispose;
  }, [i2, r2, e2]);
}
function p(s2, n2, o4) {
  let i2 = s$5((t2) => {
    let e2 = t2.getBoundingClientRect();
    e2.x === 0 && e2.y === 0 && e2.width === 0 && e2.height === 0 && o4();
  });
  reactExports.useEffect(() => {
    if (!s2) return;
    let t2 = n2 === null ? null : n$4(n2) ? n2 : n2.current;
    if (!t2) return;
    let e2 = o$6();
    if (typeof ResizeObserver != "undefined") {
      let r2 = new ResizeObserver(() => i2.current(t2));
      r2.observe(t2), e2.add(() => r2.disconnect());
    }
    if (typeof IntersectionObserver != "undefined") {
      let r2 = new IntersectionObserver(() => i2.current(t2));
      r2.observe(t2), e2.add(() => r2.disconnect());
    }
    return () => e2.dispose();
  }, [n2, i2, s2]);
}
let E$1 = ["[contentEditable=true]", "[tabindex]", "a[href]", "area[href]", "button:not([disabled])", "iframe", "input:not([disabled])", "select:not([disabled])", "details>summary", "textarea:not([disabled])"].map((e2) => `${e2}:not([tabindex='-1'])`).join(","), S$3 = ["[data-autofocus]"].map((e2) => `${e2}:not([tabindex='-1'])`).join(",");
var T$1 = ((o4) => (o4[o4.First = 1] = "First", o4[o4.Previous = 2] = "Previous", o4[o4.Next = 4] = "Next", o4[o4.Last = 8] = "Last", o4[o4.WrapAround = 16] = "WrapAround", o4[o4.NoScroll = 32] = "NoScroll", o4[o4.AutoFocus = 64] = "AutoFocus", o4))(T$1 || {}), A$1 = ((n2) => (n2[n2.Error = 0] = "Error", n2[n2.Overflow = 1] = "Overflow", n2[n2.Success = 2] = "Success", n2[n2.Underflow = 3] = "Underflow", n2))(A$1 || {}), O$1 = ((t2) => (t2[t2.Previous = -1] = "Previous", t2[t2.Next = 1] = "Next", t2))(O$1 || {});
function x$3(e2 = document.body) {
  return e2 == null ? [] : Array.from(e2.querySelectorAll(E$1)).sort((r2, t2) => Math.sign((r2.tabIndex || Number.MAX_SAFE_INTEGER) - (t2.tabIndex || Number.MAX_SAFE_INTEGER)));
}
function h(e2 = document.body) {
  return e2 == null ? [] : Array.from(e2.querySelectorAll(S$3)).sort((r2, t2) => Math.sign((r2.tabIndex || Number.MAX_SAFE_INTEGER) - (t2.tabIndex || Number.MAX_SAFE_INTEGER)));
}
var I$2 = ((t2) => (t2[t2.Strict = 0] = "Strict", t2[t2.Loose = 1] = "Loose", t2))(I$2 || {});
function H(e2, r2 = 0) {
  var t2;
  return e2 === ((t2 = l$4(e2)) == null ? void 0 : t2.body) ? false : u$7(r2, { [0]() {
    return e2.matches(E$1);
  }, [1]() {
    let l2 = e2;
    for (; l2 !== null; ) {
      if (l2.matches(E$1)) return true;
      l2 = l2.parentElement;
    }
    return false;
  } });
}
var g = ((t2) => (t2[t2.Keyboard = 0] = "Keyboard", t2[t2.Mouse = 1] = "Mouse", t2))(g || {});
typeof window != "undefined" && typeof document != "undefined" && (document.addEventListener("keydown", (e2) => {
  e2.metaKey || e2.altKey || e2.ctrlKey || (document.documentElement.dataset.headlessuiFocusVisible = "");
}, true), document.addEventListener("click", (e2) => {
  e2.detail === 1 ? delete document.documentElement.dataset.headlessuiFocusVisible : e2.detail === 0 && (document.documentElement.dataset.headlessuiFocusVisible = "");
}, true));
function w$4(e2) {
  e2 == null || e2.focus({ preventScroll: true });
}
let _$1 = ["textarea", "input"].join(",");
function P(e2) {
  var r2, t2;
  return (t2 = (r2 = e2 == null ? void 0 : e2.matches) == null ? void 0 : r2.call(e2, _$1)) != null ? t2 : false;
}
function G$1(e2, r2 = (t2) => t2) {
  return e2.slice().sort((t2, l2) => {
    let n2 = r2(t2), a3 = r2(l2);
    if (n2 === null || a3 === null) return 0;
    let u2 = n2.compareDocumentPosition(a3);
    return u2 & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : u2 & Node.DOCUMENT_POSITION_PRECEDING ? 1 : 0;
  });
}
function v(e2, r2, { sorted: t2 = true, relativeTo: l2 = null, skipElements: n2 = [] } = {}) {
  let a3 = Array.isArray(e2) ? e2.length > 0 ? r$4(e2[0]) : document : r$4(e2), u2 = Array.isArray(e2) ? t2 ? G$1(e2) : e2 : r2 & 64 ? h(e2) : x$3(e2);
  n2.length > 0 && u2.length > 1 && (u2 = u2.filter((i2) => !n2.some((d2) => d2 != null && "current" in d2 ? (d2 == null ? void 0 : d2.current) === i2 : d2 === i2))), l2 = l2 != null ? l2 : a3 == null ? void 0 : a3.activeElement;
  let o4 = (() => {
    if (r2 & 5) return 1;
    if (r2 & 10) return -1;
    throw new Error("Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last");
  })(), M2 = (() => {
    if (r2 & 1) return 0;
    if (r2 & 2) return Math.max(0, u2.indexOf(l2)) - 1;
    if (r2 & 4) return Math.max(0, u2.indexOf(l2)) + 1;
    if (r2 & 8) return u2.length - 1;
    throw new Error("Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last");
  })(), N2 = r2 & 32 ? { preventScroll: true } : {}, m2 = 0, c2 = u2.length, s2;
  do {
    if (m2 >= c2 || m2 + c2 <= 0) return 0;
    let i2 = M2 + m2;
    if (r2 & 16) i2 = (i2 + c2) % c2;
    else {
      if (i2 < 0) return 3;
      if (i2 >= c2) return 1;
    }
    s2 = u2[i2], s2 == null || s2.focus(N2), m2 += o4;
  } while (s2 !== e$3(s2));
  return r2 & 6 && P(s2) && s2.select(), 2;
}
function t$1() {
  return /iPhone/gi.test(window.navigator.platform) || /Mac/gi.test(window.navigator.platform) && window.navigator.maxTouchPoints > 0;
}
function i$2() {
  return /Android/gi.test(window.navigator.userAgent);
}
function n$2() {
  return t$1() || i$2();
}
function i$1(t2, e2, o4, n2) {
  let u2 = s$5(o4);
  reactExports.useEffect(() => {
    if (!t2) return;
    function r2(m2) {
      u2.current(m2);
    }
    return document.addEventListener(e2, r2, n2), () => document.removeEventListener(e2, r2, n2);
  }, [t2, e2, n2]);
}
function s$2(t2, e2, o4, n2) {
  let i2 = s$5(o4);
  reactExports.useEffect(() => {
    if (!t2) return;
    function r2(d2) {
      i2.current(d2);
    }
    return window.addEventListener(e2, r2, n2), () => window.removeEventListener(e2, r2, n2);
  }, [t2, e2, n2]);
}
const C$1 = 30;
function k(o4, f2, h2) {
  let m2 = s$5(h2), s2 = reactExports.useCallback(function(e2, c2) {
    if (e2.defaultPrevented) return;
    let r2 = c2(e2);
    if (r2 === null || !r2.getRootNode().contains(r2) || !r2.isConnected) return;
    let M2 = function u2(n2) {
      return typeof n2 == "function" ? u2(n2()) : Array.isArray(n2) || n2 instanceof Set ? n2 : [n2];
    }(f2);
    for (let u2 of M2) if (u2 !== null && (u2.contains(r2) || e2.composed && e2.composedPath().includes(u2))) return;
    return !H(r2, I$2.Loose) && r2.tabIndex !== -1 && e2.preventDefault(), m2.current(e2, r2);
  }, [m2, f2]), i2 = reactExports.useRef(null);
  i$1(o4, "pointerdown", (t2) => {
    var e2, c2;
    n$2() || (i2.current = ((c2 = (e2 = t2.composedPath) == null ? void 0 : e2.call(t2)) == null ? void 0 : c2[0]) || t2.target);
  }, true), i$1(o4, "pointerup", (t2) => {
    if (n$2() || !i2.current) return;
    let e2 = i2.current;
    return i2.current = null, s2(t2, () => e2);
  }, true);
  let l2 = reactExports.useRef({ x: 0, y: 0 });
  i$1(o4, "touchstart", (t2) => {
    l2.current.x = t2.touches[0].clientX, l2.current.y = t2.touches[0].clientY;
  }, true), i$1(o4, "touchend", (t2) => {
    let e2 = { x: t2.changedTouches[0].clientX, y: t2.changedTouches[0].clientY };
    if (!(Math.abs(e2.x - l2.current.x) >= C$1 || Math.abs(e2.y - l2.current.y) >= C$1)) return s2(t2, () => i$4(t2.target) ? t2.target : null);
  }, true), s$2(o4, "blur", (t2) => s2(t2, () => u$6(window.document.activeElement) ? window.document.activeElement : null), true);
}
function u$2(...e2) {
  return reactExports.useMemo(() => l$4(...e2), [...e2]);
}
function E(n2, e2, a3, t2) {
  let i2 = s$5(a3);
  reactExports.useEffect(() => {
    n2 = n2 != null ? n2 : window;
    function r2(o4) {
      i2.current(o4);
    }
    return n2.addEventListener(e2, r2, t2), () => n2.removeEventListener(e2, r2, t2);
  }, [n2, e2, t2]);
}
function o3(t2) {
  return reactExports.useSyncExternalStore(t2.subscribe, t2.getSnapshot, t2.getSnapshot);
}
function a$4(o4, r2) {
  let t2 = o4(), n2 = /* @__PURE__ */ new Set();
  return { getSnapshot() {
    return t2;
  }, subscribe(e2) {
    return n2.add(e2), () => n2.delete(e2);
  }, dispatch(e2, ...s2) {
    let i2 = r2[e2].call(t2, ...s2);
    i2 && (t2 = i2, n2.forEach((c2) => c2()));
  } };
}
function d$1() {
  let r2;
  return { before({ doc: e2 }) {
    var l2;
    let o4 = e2.documentElement, t2 = (l2 = e2.defaultView) != null ? l2 : window;
    r2 = Math.max(0, t2.innerWidth - o4.clientWidth);
  }, after({ doc: e2, d: o4 }) {
    let t2 = e2.documentElement, l2 = Math.max(0, t2.clientWidth - t2.offsetWidth), n2 = Math.max(0, r2 - l2);
    o4.style(t2, "paddingRight", `${n2}px`);
  } };
}
function w$3() {
  return t$1() ? { before({ doc: o4, d: r2, meta: m2 }) {
    function a3(s2) {
      for (let l2 of m2().containers) for (let c2 of l2()) if (c2.contains(s2)) return true;
      return false;
    }
    r2.microTask(() => {
      var c2;
      if (window.getComputedStyle(o4.documentElement).scrollBehavior !== "auto") {
        let t2 = o$6();
        t2.style(o4.documentElement, "scrollBehavior", "auto"), r2.add(() => r2.microTask(() => t2.dispose()));
      }
      let s2 = (c2 = window.scrollY) != null ? c2 : window.pageYOffset, l2 = null;
      r2.addEventListener(o4, "click", (t2) => {
        if (i$4(t2.target)) try {
          let e2 = t2.target.closest("a");
          if (!e2) return;
          let { hash: n2 } = new URL(e2.href), f2 = o4.querySelector(n2);
          i$4(f2) && !a3(f2) && (l2 = f2);
        } catch {
        }
      }, true), r2.group((t2) => {
        r2.addEventListener(o4, "touchstart", (e2) => {
          if (t2.dispose(), i$4(e2.target) && r$3(e2.target)) if (a3(e2.target)) {
            let n2 = e2.target;
            for (; n2.parentElement && a3(n2.parentElement); ) n2 = n2.parentElement;
            t2.style(n2, "overscrollBehavior", "contain");
          } else t2.style(e2.target, "touchAction", "none");
        });
      }), r2.addEventListener(o4, "touchmove", (t2) => {
        if (i$4(t2.target)) {
          if (l$2(t2.target)) return;
          if (a3(t2.target)) {
            let e2 = t2.target;
            for (; e2.parentElement && e2.dataset.headlessuiPortal !== "" && !(e2.scrollHeight > e2.clientHeight || e2.scrollWidth > e2.clientWidth); ) e2 = e2.parentElement;
            e2.dataset.headlessuiPortal === "" && t2.preventDefault();
          } else t2.preventDefault();
        }
      }, { passive: false }), r2.add(() => {
        var e2;
        let t2 = (e2 = window.scrollY) != null ? e2 : window.pageYOffset;
        s2 !== t2 && window.scrollTo(0, s2), l2 && l2.isConnected && (l2.scrollIntoView({ block: "nearest" }), l2 = null);
      });
    });
  } } : {};
}
function r$1() {
  return { before({ doc: e2, d: o4 }) {
    o4.style(e2.documentElement, "overflow", "hidden");
  } };
}
function r(e2) {
  let o4 = {};
  for (let t2 of e2) Object.assign(o4, t2(o4));
  return o4;
}
let c$4 = a$4(() => /* @__PURE__ */ new Map(), { PUSH(e2, o4) {
  var n2;
  let t2 = (n2 = this.get(e2)) != null ? n2 : { doc: e2, count: 0, d: o$6(), meta: /* @__PURE__ */ new Set(), computedMeta: {} };
  return t2.count++, t2.meta.add(o4), t2.computedMeta = r(t2.meta), this.set(e2, t2), this;
}, POP(e2, o4) {
  let t2 = this.get(e2);
  return t2 && (t2.count--, t2.meta.delete(o4), t2.computedMeta = r(t2.meta)), this;
}, SCROLL_PREVENT(e2) {
  let o4 = { doc: e2.doc, d: e2.d, meta() {
    return e2.computedMeta;
  } }, t2 = [w$3(), d$1(), r$1()];
  t2.forEach(({ before: n2 }) => n2 == null ? void 0 : n2(o4)), t2.forEach(({ after: n2 }) => n2 == null ? void 0 : n2(o4));
}, SCROLL_ALLOW({ d: e2 }) {
  e2.dispose();
}, TEARDOWN({ doc: e2 }) {
  this.delete(e2);
} });
c$4.subscribe(() => {
  let e2 = c$4.getSnapshot(), o4 = /* @__PURE__ */ new Map();
  for (let [t2] of e2) o4.set(t2, t2.documentElement.style.overflow);
  for (let t2 of e2.values()) {
    let n2 = o4.get(t2.doc) === "hidden", a3 = t2.count !== 0;
    (a3 && !n2 || !a3 && n2) && c$4.dispatch(t2.count > 0 ? "SCROLL_PREVENT" : "SCROLL_ALLOW", t2), t2.count === 0 && c$4.dispatch("TEARDOWN", t2);
  }
});
function a$3(r2, e2, n2 = () => ({ containers: [] })) {
  let f2 = o3(c$4), o$12 = e2 ? f2.get(e2) : void 0, i2 = o$12 ? o$12.count > 0 : false;
  return n$6(() => {
    if (!(!e2 || !r2)) return c$4.dispatch("PUSH", e2, n2), () => c$4.dispatch("POP", e2, n2);
  }, [r2, e2]), i2;
}
function f$2(e2, c2, n2 = () => [document.body]) {
  let r2 = I$3(e2, "scroll-lock");
  a$3(r2, c2, (t2) => {
    var o4;
    return { containers: [...(o4 = t2.containers) != null ? o4 : [], n2] };
  });
}
function c$3(u2 = 0) {
  let [r2, a3] = reactExports.useState(u2), g2 = reactExports.useCallback((e2) => a3(e2), []), s2 = reactExports.useCallback((e2) => a3((l2) => l2 | e2), []), m2 = reactExports.useCallback((e2) => (r2 & e2) === e2, [r2]), n2 = reactExports.useCallback((e2) => a3((l2) => l2 & ~e2), []), F2 = reactExports.useCallback((e2) => a3((l2) => l2 ^ e2), []);
  return { flags: r2, setFlag: g2, addFlag: s2, hasFlag: m2, removeFlag: n2, toggleFlag: F2 };
}
var define_process_env_default = {};
var T2, S$2;
typeof process != "undefined" && typeof globalThis != "undefined" && typeof Element != "undefined" && ((T2 = process == null ? void 0 : define_process_env_default) == null ? void 0 : T2["NODE_ENV"]) === "test" && typeof ((S$2 = Element == null ? void 0 : Element.prototype) == null ? void 0 : S$2.getAnimations) == "undefined" && (Element.prototype.getAnimations = function() {
  return console.warn(["Headless UI has polyfilled `Element.prototype.getAnimations` for your tests.", "Please install a proper polyfill e.g. `jsdom-testing-mocks`, to silence these warnings.", "", "Example usage:", "```js", "import { mockAnimationsApi } from 'jsdom-testing-mocks'", "mockAnimationsApi()", "```"].join(`
`)), [];
});
var A = ((i2) => (i2[i2.None = 0] = "None", i2[i2.Closed = 1] = "Closed", i2[i2.Enter = 2] = "Enter", i2[i2.Leave = 4] = "Leave", i2))(A || {});
function x$2(e2) {
  let r2 = {};
  for (let t2 in e2) e2[t2] === true && (r2[`data-${t2}`] = "");
  return r2;
}
function N(e2, r2, t2, n2) {
  let [i2, a3] = reactExports.useState(t2), { hasFlag: s2, addFlag: o4, removeFlag: l2 } = c$3(e2 && i2 ? 3 : 0), u2 = reactExports.useRef(false), f2 = reactExports.useRef(false), E2 = p$3();
  return n$6(() => {
    var d2;
    if (e2) {
      if (t2 && a3(true), !r2) {
        t2 && o4(3);
        return;
      }
      return (d2 = n2 == null ? void 0 : n2.start) == null || d2.call(n2, t2), C(r2, { inFlight: u2, prepare() {
        f2.current ? f2.current = false : f2.current = u2.current, u2.current = true, !f2.current && (t2 ? (o4(3), l2(4)) : (o4(4), l2(2)));
      }, run() {
        f2.current ? t2 ? (l2(3), o4(4)) : (l2(4), o4(3)) : t2 ? l2(1) : o4(1);
      }, done() {
        var p2;
        f2.current && D$1(r2) || (u2.current = false, l2(7), t2 || a3(false), (p2 = n2 == null ? void 0 : n2.end) == null || p2.call(n2, t2));
      } });
    }
  }, [e2, t2, r2, E2]), e2 ? [i2, { closed: s2(1), enter: s2(2), leave: s2(4), transition: s2(2) || s2(4) }] : [t2, { closed: void 0, enter: void 0, leave: void 0, transition: void 0 }];
}
function C(e2, { prepare: r2, run: t2, done: n2, inFlight: i2 }) {
  let a3 = o$6();
  return j$2(e2, { prepare: r2, inFlight: i2 }), a3.nextFrame(() => {
    t2(), a3.requestAnimationFrame(() => {
      a3.add(M$1(e2, n2));
    });
  }), a3.dispose;
}
function M$1(e2, r2) {
  var a3, s2;
  let t2 = o$6();
  if (!e2) return t2.dispose;
  let n2 = false;
  t2.add(() => {
    n2 = true;
  });
  let i2 = (s2 = (a3 = e2.getAnimations) == null ? void 0 : a3.call(e2).filter((o4) => o4 instanceof CSSTransition)) != null ? s2 : [];
  return i2.length === 0 ? (r2(), t2.dispose) : (Promise.allSettled(i2.map((o4) => o4.finished)).then(() => {
    n2 || r2();
  }), t2.dispose);
}
function j$2(e2, { inFlight: r2, prepare: t2 }) {
  if (r2 != null && r2.current) {
    t2();
    return;
  }
  let n2 = e2.style.transition;
  e2.style.transition = "none", t2(), e2.offsetHeight, e2.style.transition = n2;
}
function D$1(e2) {
  var t2, n2;
  return ((n2 = (t2 = e2.getAnimations) == null ? void 0 : t2.call(e2)) != null ? n2 : []).some((i2) => i2 instanceof CSSTransition && i2.playState !== "finished");
}
function m$1(u2, t2) {
  let e2 = reactExports.useRef([]), r2 = o$5(u2);
  reactExports.useEffect(() => {
    let o4 = [...e2.current];
    for (let [a3, l2] of t2.entries()) if (e2.current[a3] !== l2) {
      let n2 = r2(t2, o4);
      return e2.current = t2, n2;
    }
  }, [r2, ...t2]);
}
let n$1 = reactExports.createContext(null);
n$1.displayName = "OpenClosedContext";
var i = ((e2) => (e2[e2.Open = 1] = "Open", e2[e2.Closed = 2] = "Closed", e2[e2.Closing = 4] = "Closing", e2[e2.Opening = 8] = "Opening", e2))(i || {});
function u$1() {
  return reactExports.useContext(n$1);
}
function c$2({ value: o4, children: t2 }) {
  return React$1.createElement(n$1.Provider, { value: o4 }, t2);
}
function s$1({ children: o4 }) {
  return React$1.createElement(n$1.Provider, { value: null }, o4);
}
function t(n2) {
  function e2() {
    document.readyState !== "loading" && (n2(), document.removeEventListener("DOMContentLoaded", e2));
  }
  typeof window != "undefined" && typeof document != "undefined" && (document.addEventListener("DOMContentLoaded", e2), e2());
}
let n = [];
t(() => {
  function e2(t2) {
    if (!i$4(t2.target) || t2.target === document.body || n[0] === t2.target) return;
    let r2 = t2.target;
    r2 = r2.closest(E$1), n.unshift(r2 != null ? r2 : t2.target), n = n.filter((o4) => o4 != null && o4.isConnected), n.splice(10);
  }
  window.addEventListener("click", e2, { capture: true }), window.addEventListener("mousedown", e2, { capture: true }), window.addEventListener("focus", e2, { capture: true }), document.body.addEventListener("click", e2, { capture: true }), document.body.addEventListener("mousedown", e2, { capture: true }), document.body.addEventListener("focus", e2, { capture: true });
});
function c$1(t2) {
  let r2 = o$5(t2), e2 = reactExports.useRef(false);
  reactExports.useEffect(() => (e2.current = false, () => {
    e2.current = true, t$4(() => {
      e2.current && r2();
    });
  }), [r2]);
}
let e = reactExports.createContext(false);
function a$2() {
  return reactExports.useContext(e);
}
function l$1(o4) {
  return React$1.createElement(e.Provider, { value: o4.force }, o4.children);
}
function W(e2) {
  let o4 = a$2(), l2 = reactExports.useContext(c), [r2, p2] = reactExports.useState(() => {
    var s2;
    if (!o4 && l2 !== null) return (s2 = l2.current) != null ? s2 : null;
    if (s$6.isServer) return null;
    let t2 = e2 == null ? void 0 : e2.getElementById("headlessui-portal-root");
    if (t2) return t2;
    if (e2 === null) return null;
    let n2 = e2.createElement("div");
    return n2.setAttribute("id", "headlessui-portal-root"), e2.body.appendChild(n2);
  });
  return reactExports.useEffect(() => {
    r2 !== null && (e2 != null && e2.body.contains(r2) || e2 == null || e2.body.appendChild(r2));
  }, [r2, e2]), reactExports.useEffect(() => {
    o4 || l2 !== null && p2(l2.current);
  }, [l2, p2, o4]), r2;
}
let _ = reactExports.Fragment, j$1 = Y(function(o4, l2) {
  let { ownerDocument: r2 = null, ...p2 } = o4, t2 = reactExports.useRef(null), n2 = y$2(T$3((a3) => {
    t2.current = a3;
  }), l2), s2 = u$2(t2.current), C2 = r2 != null ? r2 : s2, u2 = W(C2), y2 = reactExports.useContext(m), g2 = p$3(), v2 = K();
  return c$1(() => {
    var a3;
    u2 && u2.childNodes.length <= 0 && ((a3 = u2.parentElement) == null || a3.removeChild(u2));
  }), u2 ? reactDomExports.createPortal(React$1.createElement("div", { "data-headlessui-portal": "", ref: (a3) => {
    g2.dispose(), y2 && a3 && g2.add(y2.register(a3));
  } }, v2({ ourProps: { ref: n2 }, theirProps: p2, slot: {}, defaultTag: _, name: "Portal" })), u2) : null;
});
function S$1(e2, o4) {
  let l2 = y$2(o4), { enabled: r2 = true, ownerDocument: p2, ...t2 } = e2, n2 = K();
  return r2 ? React$1.createElement(j$1, { ...t2, ownerDocument: p2, ref: l2 }) : n2({ ourProps: { ref: l2 }, theirProps: t2, slot: {}, defaultTag: _, name: "Portal" });
}
let I$1 = reactExports.Fragment, c = reactExports.createContext(null);
function D(e2, o4) {
  let { target: l2, ...r2 } = e2, t2 = { ref: y$2(o4) }, n2 = K();
  return React$1.createElement(c.Provider, { value: l2 }, n2({ ourProps: t2, theirProps: r2, defaultTag: I$1, name: "Popover.Group" }));
}
let m = reactExports.createContext(null);
function ee$1() {
  let e2 = reactExports.useContext(m), o4 = reactExports.useRef([]), l2 = o$5((t2) => (o4.current.push(t2), e2 && e2.register(t2), () => r2(t2))), r2 = o$5((t2) => {
    let n2 = o4.current.indexOf(t2);
    n2 !== -1 && o4.current.splice(n2, 1), e2 && e2.unregister(t2);
  }), p2 = reactExports.useMemo(() => ({ register: l2, unregister: r2, portals: o4 }), [l2, r2, o4]);
  return [o4, reactExports.useMemo(() => function({ children: n2 }) {
    return React$1.createElement(m.Provider, { value: p2 }, n2);
  }, [p2])];
}
let J = Y(S$1), X$1 = Y(D), te$1 = Object.assign(J, { Group: X$1 });
function a$1(o4, r2 = typeof document != "undefined" ? document.defaultView : null, t2) {
  let n2 = I$3(o4, "escape");
  E(r2, "keydown", (e2) => {
    n2 && (e2.defaultPrevented || e2.key === o$3.Escape && t2(e2));
  });
}
function f$1() {
  var t2;
  let [e2] = reactExports.useState(() => typeof window != "undefined" && typeof window.matchMedia == "function" ? window.matchMedia("(pointer: coarse)") : null), [o4, c2] = reactExports.useState((t2 = e2 == null ? void 0 : e2.matches) != null ? t2 : false);
  return n$6(() => {
    if (!e2) return;
    function n2(r2) {
      c2(r2.matches);
    }
    return e2.addEventListener("change", n2), () => e2.removeEventListener("change", n2);
  }, [e2]), o4;
}
function S({ defaultContainers: l2 = [], portals: n2, mainTreeNode: o4 } = {}) {
  let c2 = o$5(() => {
    var r2, u2;
    let i2 = l$4(o4), t2 = [];
    for (let e2 of l2) e2 !== null && (t$2(e2) ? t2.push(e2) : "current" in e2 && t$2(e2.current) && t2.push(e2.current));
    if (n2 != null && n2.current) for (let e2 of n2.current) t2.push(e2);
    for (let e2 of (r2 = i2 == null ? void 0 : i2.querySelectorAll("html > *, body > *")) != null ? r2 : []) e2 !== document.body && e2 !== document.head && t$2(e2) && e2.id !== "headlessui-portal-root" && (o4 && (e2.contains(o4) || e2.contains((u2 = o4 == null ? void 0 : o4.getRootNode()) == null ? void 0 : u2.host)) || t2.some((E2) => e2.contains(E2)) || t2.push(e2));
    return t2;
  });
  return { resolveContainers: c2, contains: o$5((i2) => c2().some((t2) => t2.contains(i2))) };
}
let d = reactExports.createContext(null);
function j({ children: l2, node: n2 }) {
  let [o4, c2] = reactExports.useState(null), i2 = x$1(n2 != null ? n2 : o4);
  return React$1.createElement(d.Provider, { value: i2 }, l2, i2 === null && React$1.createElement(f$6, { features: s$4.Hidden, ref: (t2) => {
    var r2, u2;
    if (t2) {
      for (let e2 of (u2 = (r2 = l$4(t2)) == null ? void 0 : r2.querySelectorAll("html > *, body > *")) != null ? u2 : []) if (e2 !== document.body && e2 !== document.head && t$2(e2) && e2 != null && e2.contains(t2)) {
        c2(e2);
        break;
      }
    }
  } }));
}
function x$1(l2 = null) {
  var n2;
  return (n2 = reactExports.useContext(d)) != null ? n2 : l2;
}
function s() {
  let r2 = typeof document == "undefined";
  return "useSyncExternalStore" in t$5 ? ((o4) => o4.useSyncExternalStore)(t$5)(() => () => {
  }, () => false, () => !r2) : false;
}
function l() {
  let r2 = s(), [e2, n2] = reactExports.useState(s$6.isHandoffComplete);
  return e2 && s$6.isHandoffComplete === false && n2(false), reactExports.useEffect(() => {
    e2 !== true && n2(true);
  }, [e2]), reactExports.useEffect(() => s$6.handoff(), []), r2 ? false : e2;
}
function f() {
  let e2 = reactExports.useRef(false);
  return n$6(() => (e2.current = true, () => {
    e2.current = false;
  }), []), e2;
}
var a2 = ((r2) => (r2[r2.Forwards = 0] = "Forwards", r2[r2.Backwards = 1] = "Backwards", r2))(a2 || {});
function u() {
  let e2 = reactExports.useRef(0);
  return s$2(true, "keydown", (r2) => {
    r2.key === "Tab" && (e2.current = r2.shiftKey ? 1 : 0);
  }, true), e2;
}
function x(o4) {
  if (!o4) return /* @__PURE__ */ new Set();
  if (typeof o4 == "function") return new Set(o4());
  let t2 = /* @__PURE__ */ new Set();
  for (let e2 of o4.current) t$2(e2.current) && t2.add(e2.current);
  return t2;
}
let $ = "div";
var G = ((n2) => (n2[n2.None = 0] = "None", n2[n2.InitialFocus = 1] = "InitialFocus", n2[n2.TabLock = 2] = "TabLock", n2[n2.FocusLock = 4] = "FocusLock", n2[n2.RestoreFocus = 8] = "RestoreFocus", n2[n2.AutoFocus = 16] = "AutoFocus", n2))(G || {});
function w$2(o4, t2) {
  let e2 = reactExports.useRef(null), r2 = y$2(e2, t2), { initialFocus: u$12, initialFocusFallback: a$12, containers: n2, features: s2 = 15, ...f2 } = o4;
  l() || (s2 = 0);
  let l$12 = u$2(e2.current);
  re(s2, { ownerDocument: l$12 });
  let T3 = ne(s2, { ownerDocument: l$12, container: e2, initialFocus: u$12, initialFocusFallback: a$12 });
  oe(s2, { ownerDocument: l$12, container: e2, containers: n2, previousActiveElement: T3 });
  let g2 = u(), A2 = o$5((c2) => {
    if (!n$4(e2.current)) return;
    let E2 = e2.current;
    ((V2) => V2())(() => {
      u$7(g2.current, { [a2.Forwards]: () => {
        v(E2, T$1.First, { skipElements: [c2.relatedTarget, a$12] });
      }, [a2.Backwards]: () => {
        v(E2, T$1.Last, { skipElements: [c2.relatedTarget, a$12] });
      } });
    });
  }), v$12 = I$3(!!(s2 & 2), "focus-trap#tab-lock"), N2 = p$3(), b2 = reactExports.useRef(false), k2 = { ref: r2, onKeyDown(c2) {
    c2.key == "Tab" && (b2.current = true, N2.requestAnimationFrame(() => {
      b2.current = false;
    }));
  }, onBlur(c2) {
    if (!(s2 & 4)) return;
    let E2 = x(n2);
    n$4(e2.current) && E2.add(e2.current);
    let L2 = c2.relatedTarget;
    i$4(L2) && L2.dataset.headlessuiFocusGuard !== "true" && (I(E2, L2) || (b2.current ? v(e2.current, u$7(g2.current, { [a2.Forwards]: () => T$1.Next, [a2.Backwards]: () => T$1.Previous }) | T$1.WrapAround, { relativeTo: c2.target }) : i$4(c2.target) && w$4(c2.target)));
  } }, B2 = K();
  return React$1.createElement(React$1.Fragment, null, v$12 && React$1.createElement(f$6, { as: "button", type: "button", "data-headlessui-focus-guard": true, onFocus: A2, features: s$4.Focusable }), B2({ ourProps: k2, theirProps: f2, defaultTag: $, name: "FocusTrap" }), v$12 && React$1.createElement(f$6, { as: "button", type: "button", "data-headlessui-focus-guard": true, onFocus: A2, features: s$4.Focusable }));
}
let ee = Y(w$2), ge = Object.assign(ee, { features: G });
function te(o4 = true) {
  let t2 = reactExports.useRef(n.slice());
  return m$1(([e2], [r2]) => {
    r2 === true && e2 === false && t$4(() => {
      t2.current.splice(0);
    }), r2 === false && e2 === true && (t2.current = n.slice());
  }, [o4, n, t2]), o$5(() => {
    var e2;
    return (e2 = t2.current.find((r2) => r2 != null && r2.isConnected)) != null ? e2 : null;
  });
}
function re(o4, { ownerDocument: t2 }) {
  let e2 = !!(o4 & 8), r2 = te(e2);
  m$1(() => {
    e2 || d$2(t2 == null ? void 0 : t2.body) && w$4(r2());
  }, [e2]), c$1(() => {
    e2 && w$4(r2());
  });
}
function ne(o4, { ownerDocument: t2, container: e2, initialFocus: r2, initialFocusFallback: u2 }) {
  let a3 = reactExports.useRef(null), n2 = I$3(!!(o4 & 1), "focus-trap#initial-focus"), s2 = f();
  return m$1(() => {
    if (o4 === 0) return;
    if (!n2) {
      u2 != null && u2.current && w$4(u2.current);
      return;
    }
    let f2 = e2.current;
    f2 && t$4(() => {
      if (!s2.current) return;
      let l2 = t2 == null ? void 0 : t2.activeElement;
      if (r2 != null && r2.current) {
        if ((r2 == null ? void 0 : r2.current) === l2) {
          a3.current = l2;
          return;
        }
      } else if (f2.contains(l2)) {
        a3.current = l2;
        return;
      }
      if (r2 != null && r2.current) w$4(r2.current);
      else {
        if (o4 & 16) {
          if (v(f2, T$1.First | T$1.AutoFocus) !== A$1.Error) return;
        } else if (v(f2, T$1.First) !== A$1.Error) return;
        if (u2 != null && u2.current && (w$4(u2.current), (t2 == null ? void 0 : t2.activeElement) === u2.current)) return;
        console.warn("There are no focusable elements inside the <FocusTrap />");
      }
      a3.current = t2 == null ? void 0 : t2.activeElement;
    });
  }, [u2, n2, o4]), a3;
}
function oe(o4, { ownerDocument: t2, container: e2, containers: r2, previousActiveElement: u2 }) {
  let a3 = f(), n2 = !!(o4 & 4);
  E(t2 == null ? void 0 : t2.defaultView, "focus", (s2) => {
    if (!n2 || !a3.current) return;
    let f2 = x(r2);
    n$4(e2.current) && f2.add(e2.current);
    let l2 = u2.current;
    if (!l2) return;
    let T3 = s2.target;
    n$4(T3) ? I(f2, T3) ? (u2.current = T3, w$4(T3)) : (s2.preventDefault(), s2.stopPropagation(), w$4(l2)) : w$4(u2.current);
  }, true);
}
function I(o4, t2) {
  for (let e2 of o4) if (e2.contains(t2)) return true;
  return false;
}
function ue(e2) {
  var t2;
  return !!(e2.enter || e2.enterFrom || e2.enterTo || e2.leave || e2.leaveFrom || e2.leaveTo) || !b$1((t2 = e2.as) != null ? t2 : de) || React$1.Children.count(e2.children) === 1;
}
let V = reactExports.createContext(null);
V.displayName = "TransitionContext";
var De = ((n2) => (n2.Visible = "visible", n2.Hidden = "hidden", n2))(De || {});
function He$1() {
  let e2 = reactExports.useContext(V);
  if (e2 === null) throw new Error("A <Transition.Child /> is used but it is missing a parent <Transition /> or <Transition.Root />.");
  return e2;
}
function Ae() {
  let e2 = reactExports.useContext(w$1);
  if (e2 === null) throw new Error("A <Transition.Child /> is used but it is missing a parent <Transition /> or <Transition.Root />.");
  return e2;
}
let w$1 = reactExports.createContext(null);
w$1.displayName = "NestingContext";
function M(e2) {
  return "children" in e2 ? M(e2.children) : e2.current.filter(({ el: t2 }) => t2.current !== null).filter(({ state: t2 }) => t2 === "visible").length > 0;
}
function Te(e2, t2) {
  let n2 = s$5(e2), l2 = reactExports.useRef([]), S2 = f(), R2 = p$3(), d2 = o$5((o4, i2 = C$4.Hidden) => {
    let a3 = l2.current.findIndex(({ el: s2 }) => s2 === o4);
    a3 !== -1 && (u$7(i2, { [C$4.Unmount]() {
      l2.current.splice(a3, 1);
    }, [C$4.Hidden]() {
      l2.current[a3].state = "hidden";
    } }), R2.microTask(() => {
      var s2;
      !M(l2) && S2.current && ((s2 = n2.current) == null || s2.call(n2));
    }));
  }), y2 = o$5((o4) => {
    let i2 = l2.current.find(({ el: a3 }) => a3 === o4);
    return i2 ? i2.state !== "visible" && (i2.state = "visible") : l2.current.push({ el: o4, state: "visible" }), () => d2(o4, C$4.Unmount);
  }), C2 = reactExports.useRef([]), p2 = reactExports.useRef(Promise.resolve()), h2 = reactExports.useRef({ enter: [], leave: [] }), g2 = o$5((o4, i2, a3) => {
    C2.current.splice(0), t2 && (t2.chains.current[i2] = t2.chains.current[i2].filter(([s2]) => s2 !== o4)), t2 == null || t2.chains.current[i2].push([o4, new Promise((s2) => {
      C2.current.push(s2);
    })]), t2 == null || t2.chains.current[i2].push([o4, new Promise((s2) => {
      Promise.all(h2.current[i2].map(([r2, f2]) => f2)).then(() => s2());
    })]), i2 === "enter" ? p2.current = p2.current.then(() => t2 == null ? void 0 : t2.wait.current).then(() => a3(i2)) : a3(i2);
  }), v2 = o$5((o4, i2, a3) => {
    Promise.all(h2.current[i2].splice(0).map(([s2, r2]) => r2)).then(() => {
      var s2;
      (s2 = C2.current.shift()) == null || s2();
    }).then(() => a3(i2));
  });
  return reactExports.useMemo(() => ({ children: l2, register: y2, unregister: d2, onStart: g2, onStop: v2, wait: p2, chains: h2 }), [y2, d2, l2, g2, v2, h2, p2]);
}
let de = reactExports.Fragment, fe = A$2.RenderStrategy;
function Fe(e2, t2) {
  var ee2, te2;
  let { transition: n2 = true, beforeEnter: l$12, afterEnter: S2, beforeLeave: R2, afterLeave: d2, enter: y2, enterFrom: C2, enterTo: p2, entered: h2, leave: g2, leaveFrom: v2, leaveTo: o4, ...i$12 } = e2, [a3, s2] = reactExports.useState(null), r2 = reactExports.useRef(null), f2 = ue(e2), U2 = y$2(...f2 ? [r2, t2, s2] : t2 === null ? [] : [t2]), H2 = (ee2 = i$12.unmount) == null || ee2 ? C$4.Unmount : C$4.Hidden, { show: u2, appear: z2, initial: K$12 } = He$1(), [m2, j2] = reactExports.useState(u2 ? "visible" : "hidden"), Q2 = Ae(), { register: A2, unregister: F2 } = Q2;
  n$6(() => A2(r2), [A2, r2]), n$6(() => {
    if (H2 === C$4.Hidden && r2.current) {
      if (u2 && m2 !== "visible") {
        j2("visible");
        return;
      }
      return u$7(m2, { ["hidden"]: () => F2(r2), ["visible"]: () => A2(r2) });
    }
  }, [m2, r2, A2, F2, u2, H2]);
  let G2 = l();
  n$6(() => {
    if (f2 && G2 && m2 === "visible" && r2.current === null) throw new Error("Did you forget to passthrough the `ref` to the actual DOM node?");
  }, [r2, m2, G2, f2]);
  let ce2 = K$12 && !z2, Y2 = z2 && u2 && K$12, B2 = reactExports.useRef(false), I2 = Te(() => {
    B2.current || (j2("hidden"), F2(r2));
  }, Q2), Z2 = o$5((W2) => {
    B2.current = true;
    let L2 = W2 ? "enter" : "leave";
    I2.onStart(r2, L2, (_2) => {
      _2 === "enter" ? l$12 == null || l$12() : _2 === "leave" && (R2 == null || R2());
    });
  }), $2 = o$5((W2) => {
    let L2 = W2 ? "enter" : "leave";
    B2.current = false, I2.onStop(r2, L2, (_2) => {
      _2 === "enter" ? S2 == null || S2() : _2 === "leave" && (d2 == null || d2());
    }), L2 === "leave" && !M(I2) && (j2("hidden"), F2(r2));
  });
  reactExports.useEffect(() => {
    f2 && n2 || (Z2(u2), $2(u2));
  }, [u2, f2, n2]);
  let pe2 = /* @__PURE__ */ (() => !(!n2 || !f2 || !G2 || ce2))(), [, T3] = N(pe2, a3, u2, { start: Z2, end: $2 }), Ce2 = m$3({ ref: U2, className: ((te2 = t$3(i$12.className, Y2 && y2, Y2 && C2, T3.enter && y2, T3.enter && T3.closed && C2, T3.enter && !T3.closed && p2, T3.leave && g2, T3.leave && !T3.closed && v2, T3.leave && T3.closed && o4, !T3.transition && u2 && h2)) == null ? void 0 : te2.trim()) || void 0, ...x$2(T3) }), N$12 = 0;
  m2 === "visible" && (N$12 |= i.Open), m2 === "hidden" && (N$12 |= i.Closed), u2 && m2 === "hidden" && (N$12 |= i.Opening), !u2 && m2 === "visible" && (N$12 |= i.Closing);
  let he2 = K();
  return React$1.createElement(w$1.Provider, { value: I2 }, React$1.createElement(c$2, { value: N$12 }, he2({ ourProps: Ce2, theirProps: i$12, defaultTag: de, features: fe, visible: m2 === "visible", name: "Transition.Child" })));
}
function Ie(e2, t2) {
  let { show: n2, appear: l$12 = false, unmount: S2 = true, ...R2 } = e2, d2 = reactExports.useRef(null), y2 = ue(e2), C2 = y$2(...y2 ? [d2, t2] : t2 === null ? [] : [t2]);
  l();
  let p2 = u$1();
  if (n2 === void 0 && p2 !== null && (n2 = (p2 & i.Open) === i.Open), n2 === void 0) throw new Error("A <Transition /> is used but it is missing a `show={true | false}` prop.");
  let [h2, g2] = reactExports.useState(n2 ? "visible" : "hidden"), v2 = Te(() => {
    n2 || g2("hidden");
  }), [o4, i$12] = reactExports.useState(true), a3 = reactExports.useRef([n2]);
  n$6(() => {
    o4 !== false && a3.current[a3.current.length - 1] !== n2 && (a3.current.push(n2), i$12(false));
  }, [a3, n2]);
  let s2 = reactExports.useMemo(() => ({ show: n2, appear: l$12, initial: o4 }), [n2, l$12, o4]);
  n$6(() => {
    n2 ? g2("visible") : !M(v2) && d2.current !== null && g2("hidden");
  }, [n2, v2]);
  let r2 = { unmount: S2 }, f2 = o$5(() => {
    var u2;
    o4 && i$12(false), (u2 = e2.beforeEnter) == null || u2.call(e2);
  }), U2 = o$5(() => {
    var u2;
    o4 && i$12(false), (u2 = e2.beforeLeave) == null || u2.call(e2);
  }), H2 = K();
  return React$1.createElement(w$1.Provider, { value: v2 }, React$1.createElement(V.Provider, { value: s2 }, H2({ ourProps: { ...r2, as: reactExports.Fragment, children: React$1.createElement(me, { ref: C2, ...r2, ...R2, beforeEnter: f2, beforeLeave: U2 }) }, theirProps: {}, defaultTag: reactExports.Fragment, features: fe, visible: h2 === "visible", name: "Transition" })));
}
function Le(e2, t2) {
  let n2 = reactExports.useContext(V) !== null, l2 = u$1() !== null;
  return React$1.createElement(React$1.Fragment, null, !n2 && l2 ? React$1.createElement(X, { ref: t2, ...e2 }) : React$1.createElement(me, { ref: t2, ...e2 }));
}
let X = Y(Ie), me = Y(Fe), Oe = Y(Le), Ke$1 = Object.assign(X, { Child: Oe, Root: X });
var we = ((o4) => (o4[o4.Open = 0] = "Open", o4[o4.Closed = 1] = "Closed", o4))(we || {}), Be = ((t2) => (t2[t2.SetTitleId = 0] = "SetTitleId", t2))(Be || {});
let Ue = { [0](e2, t2) {
  return e2.titleId === t2.id ? e2 : { ...e2, titleId: t2.id };
} }, w = reactExports.createContext(null);
w.displayName = "DialogContext";
function O(e2) {
  let t2 = reactExports.useContext(w);
  if (t2 === null) {
    let o4 = new Error(`<${e2} /> is missing a parent <Dialog /> component.`);
    throw Error.captureStackTrace && Error.captureStackTrace(o4, O), o4;
  }
  return t2;
}
function He(e2, t2) {
  return u$7(t2.type, Ue, e2, t2);
}
let z = Y(function(t2, o4) {
  let a3 = reactExports.useId(), { id: n2 = `headlessui-dialog-${a3}`, open: i$12, onClose: p$12, initialFocus: d2, role: s2 = "dialog", autoFocus: f2 = true, __demoMode: u2 = false, unmount: y$12 = false, ...S$12 } = t2, R2 = reactExports.useRef(false);
  s2 = function() {
    return s2 === "dialog" || s2 === "alertdialog" ? s2 : (R2.current || (R2.current = true, console.warn(`Invalid role [${s2}] passed to <Dialog />. Only \`dialog\` and and \`alertdialog\` are supported. Using \`dialog\` instead.`)), "dialog");
  }();
  let g2 = u$1();
  i$12 === void 0 && g2 !== null && (i$12 = (g2 & i.Open) === i.Open);
  let T3 = reactExports.useRef(null), I2 = y$2(T3, o4), F2 = u$2(T3.current), c2 = i$12 ? 0 : 1, [b2, Q2] = reactExports.useReducer(He, { titleId: null, descriptionId: null, panelRef: reactExports.createRef() }), m2 = o$5(() => p$12(false)), B2 = o$5((r2) => Q2({ type: 0, id: r2 })), D2 = l() ? c2 === 0 : false, [Z2, ee2] = ee$1(), te2 = { get current() {
    var r2;
    return (r2 = b2.panelRef.current) != null ? r2 : T3.current;
  } }, v2 = x$1(), { resolveContainers: M2 } = S({ mainTreeNode: v2, portals: Z2, defaultContainers: [te2] }), U2 = g2 !== null ? (g2 & i.Closing) === i.Closing : false;
  y(u2 || U2 ? false : D2, { allowed: o$5(() => {
    var r2, W2;
    return [(W2 = (r2 = T3.current) == null ? void 0 : r2.closest("[data-headlessui-portal]")) != null ? W2 : null];
  }), disallowed: o$5(() => {
    var r2;
    return [(r2 = v2 == null ? void 0 : v2.closest("body > *:not(#headlessui-portal-root)")) != null ? r2 : null];
  }) });
  let P2 = x$4.get(null);
  n$6(() => {
    if (D2) return P2.actions.push(n2), () => P2.actions.pop(n2);
  }, [P2, n2, D2]);
  let H2 = S$4(P2, reactExports.useCallback((r2) => P2.selectors.isTop(r2, n2), [P2, n2]));
  k(H2, M2, (r2) => {
    r2.preventDefault(), m2();
  }), a$1(H2, F2 == null ? void 0 : F2.defaultView, (r2) => {
    r2.preventDefault(), r2.stopPropagation(), document.activeElement && "blur" in document.activeElement && typeof document.activeElement.blur == "function" && document.activeElement.blur(), m2();
  }), f$2(u2 || U2 ? false : D2, F2, M2), p(D2, T3, m2);
  let [oe2, ne2] = H$1(), re2 = reactExports.useMemo(() => [{ dialogState: c2, close: m2, setTitleId: B2, unmount: y$12 }, b2], [c2, m2, B2, y$12, b2]), N2 = n$5({ open: c2 === 0 }), le2 = { ref: I2, id: n2, role: s2, tabIndex: -1, "aria-modal": u2 ? void 0 : c2 === 0 ? true : void 0, "aria-labelledby": b2.titleId, "aria-describedby": oe2, unmount: y$12 }, ae2 = !f$1(), E2 = G.None;
  D2 && !u2 && (E2 |= G.RestoreFocus, E2 |= G.TabLock, f2 && (E2 |= G.AutoFocus), ae2 && (E2 |= G.InitialFocus));
  let ie2 = K();
  return React$1.createElement(s$1, null, React$1.createElement(l$1, { force: true }, React$1.createElement(te$1, null, React$1.createElement(w.Provider, { value: re2 }, React$1.createElement(X$1, { target: T3 }, React$1.createElement(l$1, { force: false }, React$1.createElement(ne2, { slot: N2 }, React$1.createElement(ee2, null, React$1.createElement(ge, { initialFocus: d2, initialFocusFallback: T3, containers: M2, features: E2 }, React$1.createElement(C$2, { value: m2 }, ie2({ ourProps: le2, theirProps: S$12, slot: N2, defaultTag: Ne, features: We, visible: c2 === 0, name: "Dialog" })))))))))));
}), Ne = "div", We = A$2.RenderStrategy | A$2.Static;
function $e(e2, t2) {
  let { transition: o4 = false, open: a3, ...n2 } = e2, i2 = u$1(), p2 = e2.hasOwnProperty("open") || i2 !== null, d2 = e2.hasOwnProperty("onClose");
  if (!p2 && !d2) throw new Error("You have to provide an `open` and an `onClose` prop to the `Dialog` component.");
  if (!p2) throw new Error("You provided an `onClose` prop to the `Dialog`, but forgot an `open` prop.");
  if (!d2) throw new Error("You provided an `open` prop to the `Dialog`, but forgot an `onClose` prop.");
  if (!i2 && typeof e2.open != "boolean") throw new Error(`You provided an \`open\` prop to the \`Dialog\`, but the value is not a boolean. Received: ${e2.open}`);
  if (typeof e2.onClose != "function") throw new Error(`You provided an \`onClose\` prop to the \`Dialog\`, but the value is not a function. Received: ${e2.onClose}`);
  return (a3 !== void 0 || o4) && !n2.static ? React$1.createElement(j, null, React$1.createElement(Ke$1, { show: a3, transition: o4, unmount: n2.unmount }, React$1.createElement(z, { ref: t2, ...n2 }))) : React$1.createElement(j, null, React$1.createElement(z, { ref: t2, open: a3, ...n2 }));
}
let je = "div";
function Ye(e2, t2) {
  let o4 = reactExports.useId(), { id: a3 = `headlessui-dialog-panel-${o4}`, transition: n2 = false, ...i2 } = e2, [{ dialogState: p2, unmount: d2 }, s2] = O("Dialog.Panel"), f2 = y$2(t2, s2.panelRef), u2 = n$5({ open: p2 === 0 }), y2 = o$5((I2) => {
    I2.stopPropagation();
  }), S2 = { ref: f2, id: a3, onClick: y2 }, R2 = n2 ? Oe : reactExports.Fragment, g2 = n2 ? { unmount: d2 } : {}, T3 = K();
  return React$1.createElement(R2, { ...g2 }, T3({ ourProps: S2, theirProps: i2, slot: u2, defaultTag: je, name: "Dialog.Panel" }));
}
let Je = "div";
function Ke(e2, t2) {
  let { transition: o4 = false, ...a3 } = e2, [{ dialogState: n2, unmount: i2 }] = O("Dialog.Backdrop"), p2 = n$5({ open: n2 === 0 }), d2 = { ref: t2, "aria-hidden": true }, s2 = o4 ? Oe : reactExports.Fragment, f2 = o4 ? { unmount: i2 } : {}, u2 = K();
  return React$1.createElement(s2, { ...f2 }, u2({ ourProps: d2, theirProps: a3, slot: p2, defaultTag: Je, name: "Dialog.Backdrop" }));
}
let Xe = "h2";
function Ve(e2, t2) {
  let o4 = reactExports.useId(), { id: a3 = `headlessui-dialog-title-${o4}`, ...n2 } = e2, [{ dialogState: i2, setTitleId: p2 }] = O("Dialog.Title"), d2 = y$2(t2);
  reactExports.useEffect(() => (p2(a3), () => p2(null)), [a3, p2]);
  let s2 = n$5({ open: i2 === 0 }), f2 = { ref: d2, id: a3 };
  return K()({ ourProps: f2, theirProps: n2, slot: s2, defaultTag: Xe, name: "Dialog.Title" });
}
let qe = Y($e), ze = Y(Ye);
Y(Ke);
let Qe = Y(Ve), ht = Object.assign(qe, { Panel: ze, Title: Qe, Description: M$2 });
function CreateClinicForm({ onCreated, onCancel }) {
  const [name, setName] = reactExports.useState("");
  const [country, setCountry] = reactExports.useState("");
  const [countryCode, setCountryCode] = reactExports.useState("");
  const [phone, setPhone] = reactExports.useState("");
  const [address, setAddress] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const countryCodes = {
    "Argentina": "+54",
    "Bolivia": "+591",
    "Brasil": "+55",
    "Chile": "+56",
    "Colombia": "+57",
    "Costa Rica": "+506",
    "Cuba": "+53",
    "Ecuador": "+593",
    "El Salvador": "+503",
    "Guatemala": "+502",
    "Honduras": "+504",
    "México": "+52",
    "Nicaragua": "+505",
    "Panamá": "+507",
    "Paraguay": "+595",
    "Perú": "+51",
    "Puerto Rico": "+1",
    "República Dominicana": "+1",
    "Uruguay": "+598",
    "Venezuela": "+58"
  };
  const handleCountryChange = (selectedCountry) => {
    setCountry(selectedCountry);
    if (selectedCountry && countryCodes[selectedCountry]) {
      setCountryCode(countryCodes[selectedCountry]);
      setPhone("");
    } else {
      setCountryCode("");
      setPhone("");
    }
  };
  const handleSubmit = async (e2) => {
    e2.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/api/clinics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, country, phone: countryCode + phone, address })
      });
      if (!res.ok) throw new Error("Error creando clínica");
      const clinic = await res.json();
      onCreated(clinic);
    } catch (e22) {
      setError(e22.message);
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block mb-1 font-medium", children: "Nombre de la clínica" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "w-full border rounded px-3 py-2", value: name, onChange: (e2) => {
        setName(e2.target.value);
        e2.target.setCustomValidity("");
      }, onInvalid: (e2) => e2.target.setCustomValidity("Por favor ingrese el nombre de la clínica"), required: true, placeholder: "Ej: Clínica San José" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block mb-1 font-medium", children: "País" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "w-full border rounded px-3 py-2", value: country, onChange: (e2) => {
        handleCountryChange(e2.target.value);
        e2.target.setCustomValidity("");
      }, onInvalid: (e2) => e2.target.setCustomValidity("Por favor seleccione un país"), required: true, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Selecciona un país" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Argentina", children: "Argentina" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Bolivia", children: "Bolivia" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Brasil", children: "Brasil" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Chile", children: "Chile" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Colombia", children: "Colombia" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Costa Rica", children: "Costa Rica" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Cuba", children: "Cuba" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Ecuador", children: "Ecuador" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "El Salvador", children: "El Salvador" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Guatemala", children: "Guatemala" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Honduras", children: "Honduras" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "México", children: "México" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Nicaragua", children: "Nicaragua" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Panamá", children: "Panamá" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Paraguay", children: "Paraguay" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Perú", children: "Perú" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Puerto Rico", children: "Puerto Rico" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "República Dominicana", children: "República Dominicana" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Uruguay", children: "Uruguay" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Venezuela", children: "Venezuela" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block mb-1 font-medium", children: "Teléfono" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            className: "w-20 border rounded px-3 py-2 bg-gray-100 font-semibold",
            value: countryCode,
            disabled: true,
            placeholder: "Cód."
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "tel",
            className: "w-full border rounded px-3 py-2",
            value: phone,
            onChange: (e2) => setPhone(e2.target.value),
            disabled: !country,
            placeholder: country ? "Ej: 24304847" : "Seleccione un país primero"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block mb-1 font-medium", children: "Dirección" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "w-full border rounded px-3 py-2", value: address, onChange: (e2) => setAddress(e2.target.value), placeholder: "Dirección completa (opcional)" })
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-red-600 text-sm", children: error }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "px-4 py-2 bg-gray-200 rounded", onClick: onCancel, children: "Cancelar" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition", disabled: loading, children: loading ? "Guardando..." : "Guardar" })
    ] })
  ] });
}
function CreateUserForm({ clinics, onClose, onCreated, onClinicCreated }) {
  const [name, setName] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  const [role, setRole] = reactExports.useState("");
  const [clinicId, setClinicId] = reactExports.useState("");
  const [showCreateClinic, setShowCreateClinic] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const handleSubmit = async (e2) => {
    e2.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password: "Lucvan2025",
          // Contraseña temporal
          role,
          clinic_id: clinicId || null
        })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error creando usuario");
      }
      const user = await res.json();
      alert(`Usuario creado exitosamente.
Contraseña temporal: Lucvan2025
El usuario debe cambiarla en su primer inicio de sesión.`);
      if (onCreated) onCreated(user);
      handleClose();
    } catch (e22) {
      setError(e22.message);
    } finally {
      setLoading(false);
    }
  };
  const handleClose = () => {
    setName("");
    setEmail("");
    setRole("");
    setClinicId("");
    setShowCreateClinic(false);
    setError("");
    setLoading(false);
    if (onClose) onClose();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: showCreateClinic ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 p-4 border rounded bg-gray-50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    CreateClinicForm,
    {
      onCreated: (clinic) => {
        setShowCreateClinic(false);
        setClinicId(clinic.id);
        if (onClinicCreated) onClinicCreated(clinic);
      },
      onCancel: () => setShowCreateClinic(false)
    }
  ) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", autoComplete: "off", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block mb-1 font-medium", children: "Nombre completo" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "text",
          className: "w-full border rounded px-3 py-2",
          value: name,
          onChange: (e2) => {
            setName(e2.target.value);
            e2.target.setCustomValidity("");
          },
          onInvalid: (e2) => e2.target.setCustomValidity("Por favor ingrese el nombre completo"),
          required: true,
          placeholder: "Ej: Juan Pérez"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block mb-1 font-medium", children: "Email" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "email",
          className: "w-full border rounded px-3 py-2",
          value: email,
          onChange: (e2) => {
            setEmail(e2.target.value);
            e2.target.setCustomValidity("");
          },
          onInvalid: (e2) => e2.target.setCustomValidity("Por favor ingrese un email válido"),
          required: true,
          placeholder: "ejemplo@correo.com"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block mb-1 font-medium", children: "Rol" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "select",
        {
          className: "w-full border rounded px-3 py-2",
          value: role,
          onChange: (e2) => {
            setRole(e2.target.value);
            e2.target.setCustomValidity("");
          },
          onInvalid: (e2) => e2.target.setCustomValidity("Por favor seleccione un rol"),
          required: true,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Selecciona un rol" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "admin", children: "Administrador" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "clinic", children: "Clínica" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "workshop", children: "Producción" })
          ]
        }
      )
    ] }),
    role === "clinic" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block mb-1 font-medium", children: [
        "Clínica ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-600", children: "*" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            className: "w-full border rounded px-3 py-2",
            value: clinicId,
            onChange: (e2) => {
              setClinicId(e2.target.value);
              e2.target.setCustomValidity("");
            },
            onInvalid: (e2) => e2.target.setCustomValidity("Por favor seleccione una clínica"),
            required: true,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Selecciona una clínica" }),
              clinics.map((c2) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c2.id, children: c2.name }, c2.id))
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition whitespace-nowrap",
            onClick: () => setShowCreateClinic(true),
            children: "Nueva clínica"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-blue-50 border border-blue-200 rounded p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-blue-800", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Nota:" }),
      " Se creará el usuario con la contraseña temporal: ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Lucvan2025" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
      "El usuario deberá cambiarla en su primer inicio de sesión."
    ] }) }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-red-600 text-sm", children: error }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "px-4 py-2 bg-gray-200 rounded", onClick: handleClose, children: "Cancelar" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition", disabled: loading, children: loading ? "Creando..." : "Crear usuario" })
    ] })
  ] }) });
}
function UsersManagement() {
  const [tab, setTab] = reactExports.useState("users");
  const [users, setUsers] = reactExports.useState([]);
  const [clinics, setClinics] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState("");
  const [showUserModal, setShowUserModal] = reactExports.useState(false);
  const [showClinicModal, setShowClinicModal] = reactExports.useState(false);
  const [showEditModal, setShowEditModal] = reactExports.useState(false);
  const [editingUser, setEditingUser] = reactExports.useState(null);
  const [searchUser, setSearchUser] = reactExports.useState("");
  const [searchClinic, setSearchClinic] = reactExports.useState("");
  const [showEditClinicModal, setShowEditClinicModal] = reactExports.useState(false);
  const [editingClinic, setEditingClinic] = reactExports.useState(null);
  const roleLabels = {
    admin: "Administrador",
    clinic: "Clínica",
    workshop: "Producción",
    production: "Producción"
  };
  const loadData = async () => {
    try {
      setLoading(true);
      const [uRes, cRes] = await Promise.all([
        apiFetch("/api/users?limit=100&offset=0"),
        apiFetch("/api/clinics?limit=100&offset=0")
      ]);
      const usersJson = uRes.ok ? await uRes.json() : [];
      const clinicsJson = cRes.ok ? await cRes.json() : [];
      const clinicNameById = new Map(clinicsJson.map((c2) => [c2.id, c2.name]));
      const enrichedUsers = usersJson.map((u2) => ({
        ...u2,
        clinic_name: u2.clinic_name || (u2.clinic_id ? clinicNameById.get(u2.clinic_id) || null : null)
      }));
      setClinics(clinicsJson);
      setUsers(enrichedUsers);
    } catch (e2) {
      setError("Error cargando datos");
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    loadData();
  }, []);
  const removeUser = async (id2) => {
    if (!window.confirm("Confirmar eliminación de usuario")) return;
    const res = await apiFetch(`/api/users/${id2}`, { method: "DELETE" });
    if (res.ok) setUsers(users.filter((u2) => u2.id !== id2));
    else alert("Error al eliminar usuario");
  };
  const removeClinic = async (id2) => {
    if (!window.confirm("Confirmar eliminación de clínica")) return;
    const res = await apiFetch(`/api/clinics/${id2}`, { method: "DELETE" });
    if (res.ok) {
      setClinics(clinics.filter((c2) => c2.id !== id2));
    } else {
      const data = await res.json();
      alert(data.error || "Error al eliminar clínica");
    }
  };
  const toggleClinicStatus = async (clinic, targetDisabled) => {
    const endpoint = targetDisabled ? "disable" : "enable";
    const res = await apiFetch(`/api/clinics/${clinic.id}/${endpoint}`, { method: "PATCH" });
    if (res.ok) {
      setClinics(clinics.map((c2) => c2.id === clinic.id ? { ...c2, disabled: targetDisabled } : c2));
      if (targetDisabled) {
        setUsers(users.map((u2) => u2.clinic_id === clinic.id ? { ...u2, disabled: true } : u2));
      }
      setEditingClinic((prev) => prev && prev.id === clinic.id ? { ...prev, disabled: targetDisabled } : prev);
      return true;
    }
    const data = await res.json().catch(() => null);
    alert((data == null ? void 0 : data.error) || "Error al cambiar estado de clínica");
    return false;
  };
  const updateClinic = async (clinic) => {
    const res = await apiFetch(`/api/clinics/${clinic.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(clinic)
    });
    if (res.ok) {
      setShowEditClinicModal(false);
      await loadData();
    } else {
      alert("Error al actualizar clínica");
    }
  };
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6", children: "Cargando..." });
  if (error) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 text-red-600", children: error });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-[#F4F6F8]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      LucvanHeader,
      {
        title: "Gestión de Usuarios y Clínicas",
        user: null,
        onLogout: () => {
          window.location.href = "/login";
        },
        showBack: true,
        onBack: () => window.history.back()
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 max-w-5xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex border-b mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `px-6 py-2 font-semibold border-b-2 transition-colors ${tab === "users" ? "border-blue-600 text-blue-700 bg-blue-50" : "border-transparent text-gray-500"}`, onClick: () => setTab("users"), children: "Usuarios" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `px-6 py-2 font-semibold border-b-2 transition-colors ${tab === "clinics" ? "border-blue-600 text-blue-700 bg-blue-50" : "border-transparent text-gray-500"}`, onClick: () => setTab("clinics"), children: "Clínicas" })
      ] }),
      tab === "users" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-semibold", children: "Usuarios" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition", onClick: () => setShowUserModal(true), children: "Crear nuevo usuario" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            className: "w-full border rounded px-3 py-2",
            placeholder: "Buscar por email o nombre...",
            value: searchUser,
            onChange: (e2) => setSearchUser(e2.target.value)
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white rounded shadow overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-blue-50 text-blue-900", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 px-3 text-left", children: "Nombre" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 px-3 text-left", children: "Correo" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 px-3 text-left", children: "Rol" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 px-3 text-left", children: "Clínica" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 px-3 text-left", children: "Estado" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 px-3" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: users.filter((u2) => {
            const term = searchUser.toLowerCase();
            return u2.email && u2.email.toLowerCase().includes(term) || u2.name && u2.name.toLowerCase().includes(term);
          }).map((u2) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b hover:bg-blue-50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 px-3", children: u2.name || "-" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3", children: u2.email }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3", children: roleLabels[u2.role] || u2.role }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3", children: u2.clinic_name || "-" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-block text-xs px-2 py-1 rounded ${u2.disabled ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`, children: u2.disabled ? "Deshabilitado" : "Activo" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-3 text-right space-x-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "text-blue-600 hover:underline text-xs", onClick: () => {
                setEditingUser(u2);
                setShowEditModal(true);
              }, children: "Editar" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "text-red-600 hover:underline text-xs", onClick: () => removeUser(u2.id), children: "Eliminar" })
            ] })
          ] }, u2.id)) })
        ] }) })
      ] }),
      tab === "clinics" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-semibold", children: "Clínicas" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition", onClick: () => setShowClinicModal(true), children: "Crear nueva clínica" })
        ] }),
        "            ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            className: "w-full border rounded px-3 py-2",
            placeholder: "Buscar clínica por nombre...",
            value: searchClinic,
            onChange: (e2) => setSearchClinic(e2.target.value)
          }
        ) }),
        "            ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white rounded shadow overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-blue-50 text-blue-900", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 px-3 text-left", children: "Nombre" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 px-3 text-left", children: "País" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 px-3 text-left", children: "Teléfono" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 px-3 text-left", children: "Dirección" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 px-3 text-left", children: "Estado" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 px-3" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: clinics.filter((c2) => c2.name && c2.name.toLowerCase().includes(searchClinic.toLowerCase())).map((c2) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b hover:bg-blue-50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 px-3", children: c2.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3", children: c2.country || "-" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3", children: c2.phone || "-" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3", children: c2.address ? c2.address.substring(0, 30) + (c2.address.length > 30 ? "..." : "") : "-" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-block text-xs px-2 py-1 rounded ${c2.disabled ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`, children: c2.disabled ? "Desactivada" : "Activa" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-3 text-right space-x-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "text-blue-600 hover:underline text-xs", onClick: () => {
                setEditingClinic(c2);
                setShowEditClinicModal(true);
              }, children: "Editar" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "text-red-600 hover:underline text-xs", onClick: () => removeClinic(c2.id), children: "Eliminar" })
            ] })
          ] }, c2.id)) })
        ] }) })
      ] }),
      showEditModal && editingUser && /* @__PURE__ */ jsxRuntimeExports.jsx(ht, { open: true, onClose: () => setShowEditModal(false), className: "fixed z-50 inset-0 overflow-y-auto p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center min-h-screen", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black opacity-30" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-white rounded-lg shadow-lg p-8 w-full max-w-md mx-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold mb-4", children: "Editar usuario" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block mb-1 font-medium", children: "Nombre" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  className: "w-full border rounded px-3 py-2",
                  value: editingUser.name || "",
                  onChange: (e2) => setEditingUser({ ...editingUser, name: e2.target.value }),
                  placeholder: "Nombre completo"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block mb-1 font-medium", children: "Email" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "email",
                  className: "w-full border rounded px-3 py-2",
                  value: editingUser.email,
                  onChange: (e2) => setEditingUser({ ...editingUser, email: e2.target.value }),
                  placeholder: "correo@dominio.com"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block mb-1 font-medium", children: "Rol" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "select",
                {
                  className: "w-full border rounded px-3 py-2",
                  value: editingUser.role,
                  onChange: (e2) => {
                    const newRole = e2.target.value;
                    setEditingUser({
                      ...editingUser,
                      role: newRole,
                      clinic_id: newRole === "clinic" ? editingUser.clinic_id : null,
                      clinic_name: newRole === "clinic" ? editingUser.clinic_name : null
                    });
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "admin", children: "Administrador" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "clinic", children: "Clínica" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "workshop", children: "Producción" })
                  ]
                }
              )
            ] }),
            editingUser.role === "clinic" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block mb-1 font-medium", children: "Clínica" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "select",
                {
                  className: "w-full border rounded px-3 py-2",
                  value: editingUser.clinic_id || "",
                  onChange: (e2) => {
                    const clinicId = e2.target.value ? parseInt(e2.target.value) : null;
                    const selectedClinic = clinics.find((c2) => c2.id === clinicId);
                    setEditingUser({
                      ...editingUser,
                      clinic_id: clinicId,
                      clinic_name: (selectedClinic == null ? void 0 : selectedClinic.name) || null
                    });
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Sin clínica asignada" }),
                    clinics.map((c2) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c2.id, children: c2.name }, c2.id))
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block mb-1 font-medium", children: "Estado" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "text",
                    className: "w-full border rounded px-3 py-2 bg-gray-100",
                    value: editingUser.disabled ? "Deshabilitado" : "Activo",
                    disabled: true
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    className: `px-4 py-2 rounded text-white whitespace-nowrap ${editingUser.disabled ? "bg-green-600 hover:bg-green-700" : "bg-orange-600 hover:bg-orange-700"}`,
                    onClick: () => {
                      var _a;
                      if (editingUser.disabled && editingUser.clinic_id && ((_a = clinics.find((c2) => c2.id === editingUser.clinic_id)) == null ? void 0 : _a.disabled)) {
                        alert("No puedes habilitar un usuario si su clínica está desactivada");
                        return;
                      }
                      const endpoint = editingUser.disabled ? "enable" : "disable";
                      apiFetch(`/api/users/${editingUser.id}/${endpoint}`, { method: "PATCH" }).then((res) => {
                        if (res.ok) {
                          setUsers(users.map((u2) => u2.id === editingUser.id ? { ...u2, disabled: !editingUser.disabled } : u2));
                          setEditingUser({ ...editingUser, disabled: !editingUser.disabled });
                        } else {
                          res.json().then((data) => {
                            alert(data.error || "Error al cambiar estado del usuario");
                          });
                        }
                      });
                    },
                    children: editingUser.disabled ? "Habilitar" : "Deshabilitar"
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 mt-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "px-4 py-2 bg-gray-200 rounded", onClick: () => setShowEditModal(false), children: "Cancelar" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition",
                onClick: () => {
                  if (editingUser.role === "clinic" && !editingUser.clinic_id) {
                    alert("Selecciona una clínica para usuarios con rol clínica");
                    return;
                  }
                  apiFetch(`/api/users/${editingUser.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      email: editingUser.email,
                      name: editingUser.name,
                      role: editingUser.role,
                      clinic_id: editingUser.role === "clinic" ? editingUser.clinic_id : null
                    })
                  }).then(async (res) => {
                    if (res.ok) {
                      const updated = await res.json().catch(() => null);
                      const merged = updated ? { ...editingUser, ...updated } : editingUser;
                      setUsers(users.map((u2) => u2.id === editingUser.id ? merged : u2));
                      setShowEditModal(false);
                    } else {
                      const data = await res.json().catch(() => null);
                      alert((data == null ? void 0 : data.error) || "Error al actualizar usuario");
                    }
                  });
                },
                children: "Guardar"
              }
            )
          ] })
        ] })
      ] }) }),
      showUserModal && /* @__PURE__ */ jsxRuntimeExports.jsx(ht, { open: true, onClose: () => setShowUserModal(false), className: "fixed z-50 inset-0 overflow-y-auto p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center min-h-screen", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black opacity-30" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-white rounded-lg shadow-lg p-8 w-full max-w-md mx-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold mb-4", children: "Crear nuevo usuario" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            CreateUserForm,
            {
              clinics,
              onClose: () => setShowUserModal(false),
              onCreated: (u2) => {
                if (u2) {
                  setUsers([...users, u2]);
                  setShowUserModal(false);
                  loadData();
                }
              },
              onClinicCreated: (c2) => {
                if (c2) loadData();
              }
            }
          )
        ] })
      ] }) }),
      showClinicModal && /* @__PURE__ */ jsxRuntimeExports.jsx(ht, { open: true, onClose: () => setShowClinicModal(false), className: "fixed z-50 inset-0 overflow-y-auto p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center min-h-screen", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black opacity-30" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-white rounded-lg shadow-lg p-8 w-full max-w-md mx-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold mb-4", children: "Crear nueva clínica" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CreateClinicForm, { onCreated: (c2) => {
            if (c2) {
              setShowClinicModal(false);
              loadData();
            }
          }, onCancel: () => setShowClinicModal(false) })
        ] })
      ] }) }),
      showEditClinicModal && editingClinic && /* @__PURE__ */ jsxRuntimeExports.jsx(ht, { open: true, onClose: () => setShowEditClinicModal(false), className: "fixed z-50 inset-0 overflow-y-auto p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center min-h-screen", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black opacity-30" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-white rounded-lg shadow-lg p-8 w-full max-w-md mx-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold mb-4", children: "Editar clínica" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            EditClinicForm,
            {
              clinic: editingClinic,
              onSave: (c2) => updateClinic(c2),
              onCancel: () => setShowEditClinicModal(false),
              onToggleStatus: (targetDisabled) => toggleClinicStatus(editingClinic, targetDisabled)
            }
          )
        ] })
      ] }) })
    ] })
  ] });
}
function EditClinicForm({ clinic, onSave, onCancel, onToggleStatus }) {
  const [name, setName] = reactExports.useState(clinic.name);
  const [country, setCountry] = reactExports.useState(clinic.country || "");
  const [countryCode, setCountryCode] = reactExports.useState("");
  const [phone, setPhone] = reactExports.useState("");
  const [address, setAddress] = reactExports.useState(clinic.address || "");
  const [loading, setLoading] = reactExports.useState(false);
  const [disabled, setDisabled] = reactExports.useState(!!clinic.disabled);
  const countryCodes = {
    "Argentina": "+54",
    "Bolivia": "+591",
    "Brasil": "+55",
    "Chile": "+56",
    "Colombia": "+57",
    "Costa Rica": "+506",
    "Cuba": "+53",
    "Ecuador": "+593",
    "El Salvador": "+503",
    "Guatemala": "+502",
    "Honduras": "+504",
    "México": "+52",
    "Nicaragua": "+505",
    "Panamá": "+507",
    "Paraguay": "+595",
    "Perú": "+51",
    "Puerto Rico": "+1",
    "República Dominicana": "+1",
    "Uruguay": "+598",
    "Venezuela": "+58"
  };
  reactExports.useEffect(() => {
    if (clinic.phone) {
      const matchedCode = Object.values(countryCodes).find((code) => clinic.phone.startsWith(code));
      if (matchedCode) {
        setCountryCode(matchedCode);
        setPhone(clinic.phone.substring(matchedCode.length).trim());
      } else {
        setPhone(clinic.phone);
      }
    }
  }, [clinic.phone]);
  const handleCountryChange = (selectedCountry) => {
    setCountry(selectedCountry);
    if (selectedCountry && countryCodes[selectedCountry]) {
      setCountryCode(countryCodes[selectedCountry]);
      setPhone("");
    } else {
      setCountryCode("");
      setPhone("");
    }
  };
  const handleSave = () => {
    setLoading(true);
    onSave({
      id: clinic.id,
      name,
      country,
      phone: countryCode + phone,
      address,
      disabled
    });
    setLoading(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block mb-1 font-medium", children: "Nombre de la clínica" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "w-full border rounded px-3 py-2", value: name, onChange: (e2) => setName(e2.target.value), required: true })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block mb-1 font-medium", children: "País" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "w-full border rounded px-3 py-2", value: country, onChange: (e2) => handleCountryChange(e2.target.value), required: true, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Selecciona un País" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Argentina", children: "Argentina" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Bolivia", children: "Bolivia" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Brasil", children: "Brasil" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Chile", children: "Chile" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Colombia", children: "Colombia" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Costa Rica", children: "Costa Rica" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Cuba", children: "Cuba" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Ecuador", children: "Ecuador" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "El Salvador", children: "El Salvador" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Guatemala", children: "Guatemala" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Honduras", children: "Honduras" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "México", children: "México" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Nicaragua", children: "Nicaragua" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Panamá", children: "Panamá" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Paraguay", children: "Paraguay" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Perú", children: "Perú" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Puerto Rico", children: "Puerto Rico" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "República Dominicana", children: "República Dominicana" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Uruguay", children: "Uruguay" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Venezuela", children: "Venezuela" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block mb-1 font-medium", children: "Teléfono" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", className: "w-20 border rounded px-3 py-2 bg-gray-100 font-semibold", value: countryCode, disabled: true, placeholder: "Cód." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "tel", className: "w-full border rounded px-3 py-2", value: phone, onChange: (e2) => setPhone(e2.target.value), disabled: !country, placeholder: country ? "Ej: 24304847" : "Seleccione un País primero" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block mb-1 font-medium", children: "Dirección" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "w-full border rounded px-3 py-2", value: address, onChange: (e2) => setAddress(e2.target.value), placeholder: "Dirección completa (opcional)" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block mb-1 font-medium", children: "Estado" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            className: "w-full border rounded px-3 py-2 bg-gray-100",
            value: disabled ? "Desactivada" : "Activa",
            disabled: true
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: `px-4 py-2 rounded text-white whitespace-nowrap ${disabled ? "bg-green-600 hover:bg-green-700" : "bg-orange-600 hover:bg-orange-700"}`,
            onClick: async () => {
              if (!onToggleStatus) return;
              const ok2 = await onToggleStatus(!disabled);
              if (ok2) setDisabled(!disabled);
            },
            children: disabled ? "Activar" : "Desactivar"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 mt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "px-4 py-2 bg-gray-200 rounded", onClick: onCancel, children: "Cancelar" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition", onClick: handleSave, disabled: loading, children: loading ? "Guardando..." : "Guardar" })
    ] })
  ] });
}
const AMERICAS_COUNTRY_CODES = [
  { code: "+1", country: "Estados Unidos/Canadá", flag: "🇺🇸" },
  { code: "+1242", country: "Bahamas", flag: "🇧🇸" },
  { code: "+1246", country: "Barbados", flag: "🇧🇧" },
  { code: "+501", country: "Belice", flag: "🇧🇿" },
  { code: "+591", country: "Bolivia", flag: "🇧🇴" },
  { code: "+55", country: "Brasil", flag: "🇧🇷" },
  { code: "+56", country: "Chile", flag: "🇨🇱" },
  { code: "+57", country: "Colombia", flag: "🇨🇴" },
  { code: "+506", country: "Costa Rica", flag: "🇨🇷" },
  { code: "+53", country: "Cuba", flag: "🇨🇺" },
  { code: "+1809", country: "República Dominicana", flag: "🇩🇴" },
  { code: "+1829", country: "República Dominicana (Alt)", flag: "🇩🇴" },
  { code: "+1849", country: "República Dominicana (Alt2)", flag: "🇩🇴" },
  { code: "+593", country: "Ecuador", flag: "🇪🇨" },
  { code: "+503", country: "El Salvador", flag: "🇸🇻" },
  { code: "+502", country: "Guatemala", flag: "🇬🇹" },
  { code: "+592", country: "Guyana", flag: "🇬🇾" },
  { code: "+509", country: "Haití", flag: "🇭🇹" },
  { code: "+504", country: "Honduras", flag: "🇭🇳" },
  { code: "+1876", country: "Jamaica", flag: "🇯🇲" },
  { code: "+52", country: "México", flag: "🇲🇽" },
  { code: "+505", country: "Nicaragua", flag: "🇳🇮" },
  { code: "+507", country: "Panamá", flag: "🇵🇦" },
  { code: "+595", country: "Paraguay", flag: "🇵🇾" },
  { code: "+51", country: "Perú", flag: "🇵🇪" },
  { code: "+1869", country: "San Cristóbal y Nieves", flag: "🇰🇳" },
  { code: "+1758", country: "Santa Lucía", flag: "🇱🇨" },
  { code: "+1784", country: "San Vicente y las Granadinas", flag: "🇻🇨" },
  { code: "+597", country: "Surinam", flag: "🇸🇷" },
  { code: "+1868", country: "Trinidad y Tobago", flag: "🇹🇹" },
  { code: "+598", country: "Uruguay", flag: "🇺🇾" },
  { code: "+58", country: "Venezuela", flag: "🇻🇪" }
];
const getDefaultCountryCode = (countryName) => {
  const match = AMERICAS_COUNTRY_CODES.find((item) => item.country.toLowerCase() === (countryName || "").toLowerCase());
  return match ? match.code : "+52";
};
function ClinicDashboard() {
  const [activeTab, setActiveTab] = reactExports.useState("patients");
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const [requestSearchTerm, setRequestSearchTerm] = reactExports.useState("");
  const [requestStatusFilter, setRequestStatusFilter] = reactExports.useState("all");
  const [showNewPatientModal, setShowNewPatientModal] = reactExports.useState(false);
  const { currentUser, logout } = useAuth();
  const [countryCode, setCountryCode] = reactExports.useState("+52");
  const [clinicInfo, setClinicInfo] = reactExports.useState(null);
  const [requests, setRequests] = reactExports.useState([]);
  const [allClinics, setAllClinics] = reactExports.useState([]);
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    const load = async () => {
      try {
        const resAllClinics = await apiFetch(`/api/clinics?limit=100`);
        if (resAllClinics.ok) {
          const clinicsData = await resAllClinics.json();
          setAllClinics(clinicsData || []);
          if ((currentUser == null ? void 0 : currentUser.role) === "admin") {
            setClinicInfo(null);
            setCountryCode("+52");
          } else if (currentUser == null ? void 0 : currentUser.clinicId) {
            const c2 = clinicsData.find((x2) => x2.id === currentUser.clinicId);
            setClinicInfo(c2 || null);
            setCountryCode(getDefaultCountryCode(c2 == null ? void 0 : c2.country));
          }
        }
        const res = await apiFetch("/api/patients");
        if (res.ok) {
          const data = await res.json();
          setPatients(data || []);
        } else {
          setPatients([]);
        }
        const reqRes = await apiFetch("/api/requests");
        if (reqRes.ok) {
          const reqData = await reqRes.json();
          setRequests(reqData || []);
        } else {
          setRequests([]);
        }
      } catch (err) {
        console.error("Error loading data:", err);
        setPatients([]);
      }
    };
    load();
    const interval = setInterval(() => {
      apiFetch("/api/requests").then((res) => {
        if (res.ok) {
          res.json().then((data) => setRequests(data || []));
        }
      }).catch((err) => console.error("Error refreshing requests:", err));
    }, 3e4);
    return () => clearInterval(interval);
  }, [currentUser == null ? void 0 : currentUser.clinicId]);
  const [patients, setPatients] = reactExports.useState([]);
  const [editingPatient, setEditingPatient] = reactExports.useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = reactExports.useState(null);
  const filteredPatients = patients.filter(
    (p2) => p2.name.toLowerCase().includes(searchTerm.toLowerCase()) || p2.email.toLowerCase().includes(searchTerm.toLowerCase()) || p2.phone.includes(searchTerm)
  );
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const handleBackToAdmin = () => {
    if ((currentUser == null ? void 0 : currentUser.role) === "admin") {
      navigate("/admin");
    }
  };
  const groupedPatients = Object.entries(
    filteredPatients.reduce((acc, p2) => {
      var _a, _b;
      const letter = (((_b = (_a = p2.name) == null ? void 0 : _a.trim()) == null ? void 0 : _b.charAt(0)) || "#").toUpperCase();
      const key = /[A-ZÁÉÍÓÚÜÑ]/i.test(letter) ? letter : "#";
      acc[key] = acc[key] || [];
      acc[key].push(p2);
      return acc;
    }, {})
  ).sort((a3, b2) => a3[0].localeCompare(b2[0]));
  const activeRequests = requests.filter((r2) => r2.status !== "cancelled" && r2.status !== "delivered");
  const countAll = activeRequests.length;
  const countPending = activeRequests.filter((r2) => r2.status === "pending").length;
  const countInProd = activeRequests.filter((r2) => r2.status === "in_production").length;
  const countReady = activeRequests.filter((r2) => r2.status === "ready").length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-[#F4F6F8]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      LucvanHeader,
      {
        title: "Sistema de Gestión Clínica",
        user: currentUser,
        onLogout: handleLogout,
        onBack: handleBackToAdmin,
        showBack: (currentUser == null ? void 0 : currentUser.role) === "admin"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white border-b-2 border-gray-200", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setActiveTab("patients"),
          className: `py-3 px-6 font-semibold transition border-b-4 ${activeTab === "patients" ? "border-[#0066A4] text-[#0066A4]" : "border-transparent text-gray-500 hover:text-[#003C63] hover:border-gray-300"}`,
          children: "Pacientes"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setActiveTab("requests"),
          className: `py-3 px-6 font-semibold transition border-b-4 ${activeTab === "requests" ? "border-[#0066A4] text-[#0066A4]" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`,
          children: "Solicitudes"
        }
      )
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
      activeTab === "patients" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              placeholder: "Buscar paciente...",
              value: searchTerm,
              onChange: (e2) => setSearchTerm(e2.target.value),
              className: "flex-1 px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setShowNewPatientModal(true),
              className: "px-5 py-2.5 bg-[#F5C400] text-[#003C63] rounded-full font-bold hover:bg-[#ffd933] transition shadow-[0_12px_24px_-10px_rgba(0,60,99,0.25)] hover:shadow-[0_16px_32px_-12px_rgba(0,60,99,0.3)]",
              children: "+ Registrar Paciente"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white border rounded-lg", children: filteredPatients.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 text-center text-gray-500", children: "No hay pacientes registrados." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 p-3 border-b bg-gray-50", children: groupedPatients.map(([letter]) => /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: `#grp-${letter}`, className: "px-2 py-1 text-xs font-semibold text-[#003C63] hover:underline", children: letter }, letter)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y", children: groupedPatients.map(([letter, items]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: `grp-${letter}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gray-50 px-4 py-2 text-xs font-bold text-gray-600 sticky top-0", children: letter }),
            items.map((patient) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-4 hover:bg-gray-50 transition", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => navigate(`/patient/${patient.id}`),
                  className: "text-left flex-1",
                  title: "Ver detalle del paciente",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-semibold text-gray-900", children: patient.name })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                (currentUser == null ? void 0 : currentUser.role) === "admin" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline-block px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium", children: patient.clinic || "Sin clínica" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => navigate(`/patient/${patient.id}`),
                    className: "px-3 py-1.5 bg-[#003C63] text-white rounded-md text-xs font-semibold hover:bg-[#005a8f]",
                    children: "Ver"
                  }
                )
              ] })
            ] }, patient.id))
          ] }, letter)) })
        ] }) })
      ] }),
      activeTab === "requests" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white border rounded-lg p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col sm:flex-row gap-4 mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold mb-3 text-gray-900", children: "Solicitudes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              placeholder: "Buscar por nombre del paciente...",
              value: requestSearchTerm,
              onChange: (e2) => setRequestSearchTerm(e2.target.value),
              className: "w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 mb-6 pb-4 border-b border-gray-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setRequestStatusFilter("all"),
              className: `px-4 py-2 rounded-full font-medium transition ${requestStatusFilter === "all" ? "bg-[#003C63] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
              children: [
                "Todas",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 inline-block px-2 py-0.5 text-xs rounded-full bg-white/20 border border-white/30", children: countAll })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setRequestStatusFilter("pending"),
              className: `px-4 py-2 rounded-full font-medium transition ${requestStatusFilter === "pending" ? "bg-yellow-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
              children: [
                "Pendientes",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 inline-block px-2 py-0.5 text-xs rounded-full bg-white/20 border border-white/30", children: countPending })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setRequestStatusFilter("in_production"),
              className: `px-4 py-2 rounded-full font-medium transition ${requestStatusFilter === "in_production" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
              children: [
                "En Producción",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 inline-block px-2 py-0.5 text-xs rounded-full bg-white/20 border border-white/30", children: countInProd })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setRequestStatusFilter("ready"),
              className: `px-4 py-2 rounded-full font-medium transition ${requestStatusFilter === "ready" ? "bg-green-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
              children: [
                "Listas para Entregar",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 inline-block px-2 py-0.5 text-xs rounded-full bg-white/20 border border-white/30", children: countReady })
              ]
            }
          )
        ] }),
        requests.filter((r2) => r2.status !== "cancelled" && r2.status !== "delivered").filter((r2) => requestStatusFilter === "all" || r2.status === requestStatusFilter).filter((req) => {
          const patient = patients.find((p2) => p2.id === req.patient_id);
          return ((patient == null ? void 0 : patient.name) || "").toLowerCase().includes(requestSearchTerm.toLowerCase());
        }).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-16 text-gray-500", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-medium", children: requestStatusFilter === "all" ? "No hay solicitudes activas" : `No hay solicitudes ${requestStatusFilter === "pending" ? "pendientes" : requestStatusFilter === "in_production" ? "en producción" : requestStatusFilter === "ready" ? "listas para entregar" : "con este estado"}` }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: requests.filter((r2) => r2.status !== "cancelled" && r2.status !== "delivered").filter((r2) => requestStatusFilter === "all" || r2.status === requestStatusFilter).filter((req) => {
          const patient = patients.find((p2) => p2.id === req.patient_id);
          return ((patient == null ? void 0 : patient.name) || "").toLowerCase().includes(requestSearchTerm.toLowerCase());
        }).sort((a3, b2) => new Date(b2.created_at) - new Date(a3.created_at)).map((req) => {
          const patient = patients.find((p2) => p2.id === req.patient_id);
          let statusBadge = { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pendiente" };
          if (req.status === "in_production") {
            statusBadge = { bg: "bg-blue-100", text: "text-blue-800", label: "En Producción" };
          } else if (req.status === "ready") {
            statusBadge = { bg: "bg-green-100", text: "text-green-800", label: "Lista para Entregar" };
          } else if (req.status === "delivered") {
            statusBadge = { bg: "bg-gray-100", text: "text-gray-800", label: "Entregada" };
          } else if (req.status === "cancelled") {
            statusBadge = { bg: "bg-red-100", text: "text-red-800", label: "Cancelada" };
          }
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              onClick: () => navigate(`/request/${req.id}`),
              className: "bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-[#0066A4] cursor-pointer transition-all",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-semibold text-gray-900 mb-3", children: (patient == null ? void 0 : patient.name) || "Paciente desconocido" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-600 mb-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500 uppercase text-[10px] font-bold", children: "Tipo" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-gray-900", children: req.template_type || req.templateType || "-" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500 uppercase text-[10px] font-bold", children: "Pie" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-gray-900", children: req.foot_side || req.footSide || "-" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500 uppercase text-[10px] font-bold", children: "Fecha" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-gray-900", children: new Date(req.created_at || req.createdAt).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" }) })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => navigate(`/request/${req.id}`),
                      className: "inline-flex items-center px-3 py-1.5 bg-[#003C63] text-white rounded-md text-xs font-semibold hover:bg-[#005a8f]",
                      children: "Ver detalle"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-400", children: [
                    "#",
                    req.consecutive || req.id
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-block px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap ${statusBadge.bg} ${statusBadge.text}`, children: statusBadge.label })
                ] })
              ] })
            },
            req.id
          );
        }) })
      ] })
    ] }),
    showNewPatientModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-lg p-8 max-w-md w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold mb-6 text-gray-900", children: "Registrar Nuevo Paciente" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "space-y-5", onSubmit: async (e2) => {
        e2.preventDefault();
        const form = e2.currentTarget;
        const firstName = form.elements["firstName"].value.trim();
        const lastName1 = form.elements["lastName1"].value.trim();
        const lastName2 = form.elements["lastName2"].value.trim();
        const notes = form.elements["notes"].value.trim() || null;
        if (!firstName || !lastName1 || !lastName2) return;
        const fullName = `${firstName} ${lastName1} ${lastName2}`.trim();
        try {
          const res = await apiFetch("/api/patients", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: fullName,
              notes
            })
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Error al guardar paciente");
          setPatients((prev) => [data, ...prev]);
          setShowNewPatientModal(false);
        } catch (err) {
          alert(err.message);
        }
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: [
            "Nombre ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-600", children: "*" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              name: "firstName",
              type: "text",
              placeholder: "Ej: Juan",
              className: "w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400",
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: [
            "Primer Apellido ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-600", children: "*" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              name: "lastName1",
              type: "text",
              placeholder: "Ej: Pérez",
              className: "w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400",
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: [
            "Segundo Apellido ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-600", children: "*" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              name: "lastName2",
              type: "text",
              placeholder: "Ej: García",
              className: "w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400",
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Notas Clínicas" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              name: "notes",
              rows: "3",
              placeholder: "Información médica relevante, alergias, condiciones especiales... (opcional)",
              className: "w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "submit",
              className: "flex-1 bg-yellow-500 text-blue-950 py-2.5 rounded-md font-medium hover:bg-yellow-600 transition",
              children: "Guardar Paciente"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setShowNewPatientModal(false),
              className: "flex-1 bg-white border border-gray-300 text-gray-700 py-2.5 rounded-md font-medium hover:bg-gray-50 transition",
              children: "Cancelar"
            }
          )
        ] })
      ] })
    ] }) })
  ] });
}
function ProductionDashboard() {
  const [activeTab, setActiveTab] = reactExports.useState("pending");
  const [statusFilter, setStatusFilter] = reactExports.useState(null);
  const [sortByDate, setSortByDate] = reactExports.useState("newest");
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = reactExports.useState([]);
  const [patients, setPatients] = reactExports.useState([]);
  const [clinics, setClinics] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    const load = async () => {
      try {
        const resRequests = await apiFetch("/api/requests");
        if (resRequests.ok) {
          const reqData = await resRequests.json();
          setRequests(reqData || []);
        }
        const resPatients = await apiFetch("/api/patients");
        if (resPatients.ok) {
          const patientsData = await resPatients.json();
          setPatients(patientsData || []);
        }
        const resClinics = await apiFetch("/api/clinics?limit=100");
        if (resClinics.ok) {
          const clinicsData = await resClinics.json();
          setClinics(clinicsData || []);
        }
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [currentUser == null ? void 0 : currentUser.token]);
  reactExports.useEffect(() => {
    const interval = setInterval(async () => {
      try {
        if (document.hidden) return;
        const res = await apiFetch("/api/requests");
        if (res.ok) {
          const data = await res.json();
          setRequests(data || []);
        }
      } catch (err) {
      }
    }, 1e4);
    return () => clearInterval(interval);
  }, [currentUser == null ? void 0 : currentUser.token]);
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const handleBackToAdmin = () => {
    if ((currentUser == null ? void 0 : currentUser.role) === "admin") {
      navigate("/admin");
    }
  };
  const handleTicketClick = async (ticket) => {
    navigate(`/ticket/${ticket.id}`);
  };
  const tickets = requests.map((req) => {
    const patient = patients.find((p2) => p2.id === req.patient_id);
    clinics.find((c2) => c2.name === (patient == null ? void 0 : patient.clinic));
    return {
      id: req.id,
      consecutive: req.consecutive_number || req.id,
      patientName: (patient == null ? void 0 : patient.name) || "Desconocido",
      clinicName: (patient == null ? void 0 : patient.clinic) || "Sin clínica",
      doctorName: req.doctor_name || req.doctorName || "-",
      templateType: req.template_type || req.templateType || "Solicitud",
      arch: req.foot_side || req.footSide || "-",
      status: req.status === "pending" ? "Pendiente" : req.status === "in_progress" || req.status === "in_production" ? "En Producción" : req.status === "ready" ? "Lista para Entregar" : req.status === "delivered" ? "Entregada" : req.status === "cancelled" ? "Cancelada" : "Pendiente",
      date: req.created_at || req.createdAt,
      files: req.files ? Array.isArray(req.files) ? req.files : JSON.parse(req.files) : [],
      notes: [],
      internalNotes: req.observations || "",
      shoeSize: req.shoe_size || req.shoeSize,
      specs: req.specs || {}
    };
  });
  const pendingTickets = tickets.filter((t2) => t2.status === "Pendiente");
  const inProductionTickets = tickets.filter((t2) => t2.status === "En Producción");
  const readyTickets = tickets.filter((t2) => t2.status === "Lista para Entregar");
  const completedTickets = tickets.filter((t2) => t2.status === "Entregada");
  const filteredByStatus = statusFilter === null ? tickets.filter((t2) => t2.status !== "Entregado" && t2.status !== "Cancelado") : tickets.filter((t2) => t2.status === statusFilter);
  const filteredTickets = filteredByStatus.filter(
    (t2) => t2.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || t2.clinicName.toLowerCase().includes(searchTerm.toLowerCase()) || t2.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const sortedTickets = [...filteredTickets].sort((a3, b2) => {
    const dateA = new Date(a3.date);
    const dateB = new Date(b2.date);
    return sortByDate === "newest" ? dateB - dateA : dateA - dateB;
  });
  const handleStatusToggle = (status) => {
    setStatusFilter(statusFilter === status ? null : status);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-[#F4F6F8]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      LucvanHeader,
      {
        title: "Producción",
        user: currentUser,
        onLogout: handleLogout,
        onBack: handleBackToAdmin,
        showBack: (currentUser == null ? void 0 : currentUser.role) === "admin"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold text-blue-900", children: "Dashboard de Producción" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-600 mt-1", children: statusFilter ? `Filtrando por: ${statusFilter}` : "Mostrando todos los tickets activos" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-semibold text-gray-700", children: "Ordenar por fecha:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              value: sortByDate,
              onChange: (e2) => setSortByDate(e2.target.value),
              className: "px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "newest", children: "Más recientes primero" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "oldest", children: "Más antiguos primero" })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6 mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            onClick: () => handleStatusToggle("Pendiente"),
            className: `bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500 cursor-pointer transition ${statusFilter === "Pendiente" ? "ring-2 ring-yellow-500 bg-yellow-50" : "hover:shadow-lg"}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600 text-sm font-medium", children: "Pendientes" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold text-gray-900 mt-2", children: pendingTickets.length })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl", children: "⏳" })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            onClick: () => handleStatusToggle("En Producción"),
            className: `bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500 cursor-pointer transition ${statusFilter === "En Producción" ? "ring-2 ring-blue-500 bg-blue-50" : "hover:shadow-lg"}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600 text-sm font-medium", children: "En Producción" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold text-gray-900 mt-2", children: inProductionTickets.length })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl", children: "🔨" })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            onClick: () => handleStatusToggle("Lista para Entregar"),
            className: `bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-500 cursor-pointer transition ${statusFilter === "Lista para Entregar" ? "ring-2 ring-purple-500 bg-purple-50" : "hover:shadow-xl"}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600 text-sm font-medium", children: "Lista para Entregar" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold text-gray-900 mt-2", children: readyTickets.length })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl", children: "📦" })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            onClick: () => setStatusFilter("Entregado"),
            className: `bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500 cursor-pointer transition ${statusFilter === "Entregado" ? "ring-2 ring-green-500" : "hover:shadow-xl"}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600 text-sm font-medium", children: "Entregados" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold text-gray-900 mt-2", children: completedTickets.length })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl", children: "✅" })
            ] })
          }
        )
      ] }),
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white rounded-xl shadow-lg p-12 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-gray-500", children: "Cargando solicitudes..." }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl shadow-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-4 border-b border-gray-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-lg font-semibold text-gray-900", children: [
              statusFilter ? `Tickets: ${statusFilter}` : "Tickets activos",
              " (",
              sortedTickets.length,
              ")"
            ] }),
            statusFilter !== null && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setStatusFilter(null),
                className: "text-sm text-blue-600 hover:text-blue-800 font-semibold",
                children: "Ver todos"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                placeholder: "Buscar por paciente, clínica o doctor...",
                value: searchTerm,
                onChange: (e2) => setSearchTerm(e2.target.value),
                className: "w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "svg",
              {
                className: "absolute left-3 top-3 h-5 w-5 text-gray-400",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" })
              }
            ),
            searchTerm && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setSearchTerm(""),
                className: "absolute right-3 top-3 text-gray-400 hover:text-gray-600",
                children: "✕"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-gray-200", children: sortedTickets.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-12 text-gray-500", children: searchTerm ? `No se encontraron resultados para "${searchTerm}"` : statusFilter === "all" ? "No hay tickets registrados" : `No hay tickets con estado "${statusFilter}"` }) : sortedTickets.map((ticket) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            onClick: () => handleTicketClick(ticket),
            className: "p-6 hover:bg-gray-50 transition cursor-pointer",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "bg-[#003C63] text-white text-sm font-bold px-2 py-1 rounded", children: [
                    "#",
                    ticket.consecutive || ticket.id
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-gray-900", children: ticket.patientName }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-3 py-1 rounded-full text-xs font-semibold ${ticket.status === "Pendiente" ? "bg-yellow-100 text-yellow-800" : ticket.status === "En Producción" ? "bg-blue-100 text-blue-800" : ticket.status === "Lista para Entregar" ? "bg-purple-100 text-purple-800" : "bg-green-100 text-green-800"}`, children: ticket.status })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 gap-4 text-sm text-gray-600", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "Clínica:" }),
                    " ",
                    ticket.clinicName
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "Doctor:" }),
                    " ",
                    ticket.doctorName
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "Tipo:" }),
                    " ",
                    ticket.templateType
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "Arcada:" }),
                    " ",
                    ticket.arch
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 text-sm text-gray-500", children: [
                  "Fecha: ",
                  new Date(ticket.date).toLocaleDateString("es-ES"),
                  ticket.files.length > 0 && ` • ${ticket.files.length} archivo(s) adjunto(s)`
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-blue-500 text-sm font-semibold ml-4", children: "Ver detalles →" })
            ] })
          },
          ticket.id
        )) })
      ] })
    ] })
  ] });
}
function ProductionTicketDetail() {
  const { id: id2 } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [ticket, setTicket] = reactExports.useState(null);
  const [workshopNotes, setWorkshopNotes] = reactExports.useState([]);
  const [newNote, setNewNote] = reactExports.useState("");
  const [newStatus, setNewStatus] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  reactExports.useEffect(() => {
    loadTicketData();
  }, [id2]);
  async function loadTicketData() {
    try {
      setLoading(true);
      const ticketRes = await apiFetch(`/api/requests/${id2}`);
      if (!ticketRes.ok) throw new Error("Error cargando ticket");
      const ticketData = await ticketRes.json();
      setTicket(ticketData);
      setNewStatus(ticketData.status || "pending");
      const notesRes = await apiFetch(`/api/requests/${id2}/workshop-notes`);
      if (notesRes.ok) {
        const notesData = await notesRes.json();
        setWorkshopNotes(Array.isArray(notesData) ? notesData : []);
      }
    } catch (err) {
      setError("Error cargando el ticket");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  async function handleAddNote() {
    if (!newNote.trim()) return;
    try {
      const res = await apiFetch(`/api/requests/${id2}/workshop-notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment: newNote })
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error ${res.status}: ${errorText}`);
      }
      const result = await res.json();
      setNewNote("");
      await loadTicketData();
      console.log("Nota agregada exitosamente:", result);
    } catch (err) {
      console.error("Error agregando nota:", err);
      alert(`Error al agregar nota: ${err.message}`);
    }
  }
  const handleDownloadFile = (file) => {
    if (!file.url) {
      alert("⚠️ El archivo no tiene URL disponible. Puede ser un nombre de archivo guardado sin URL de descarga.");
      return;
    }
    let downloadUrl = file.url;
    if (!downloadUrl.startsWith("http")) {
      const apiBase = "https://sistema.lucvanlatam.com";
      downloadUrl = `${apiBase}${downloadUrl.startsWith("/") ? "" : "/"}${downloadUrl}`;
    }
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = file.name || "archivo";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  async function handleStatusChange() {
    try {
      const statusMap = {
        "pending": "pending",
        "in_production": "in_production",
        "En Producción": "in_production",
        "ready": "ready",
        "Lista para Entregar": "ready",
        "delivered": "delivered",
        "Entregada": "delivered"
      };
      const res = await apiFetch(`/api/requests/${id2}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: statusMap[newStatus] || newStatus })
      });
      if (res.ok) {
        await loadTicketData();
        alert("Estado actualizado");
      }
    } catch (err) {
      alert("Error actualizando estado");
      console.error(err);
    }
  }
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-gray-50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LucvanHeader, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center items-center h-96", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500", children: "Cargando ticket..." }) })
    ] });
  }
  if (error || !ticket) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-gray-50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LucvanHeader, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center items-center h-96", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-red-500", children: error || "Ticket no encontrado" }) })
    ] });
  }
  const specConfig = [
    {
      keys: ["arcoTransverso", "ArcoTransverso"],
      label: "Arco Transverso (AT)",
      image: "/images/cunas/arco-transverso.webp"
    },
    {
      keys: ["barraMetatarsal", "BarraMetatarsal"],
      label: "Barra Metatarsal",
      image: "/images/cunas/barra-metatarsal.webp"
    },
    {
      keys: ["cunaCalcaneaInterna", "CunaCalcaneaInterna"],
      label: "Cuña Calcánea Interna",
      image: "/images/cunas/cuna-calcanea-interna.webp"
    },
    {
      keys: ["cunaCalcaneaExtrema", "CunaCalcaneaExtrema"],
      label: "Cuña Calcánea Externa",
      image: "/images/cunas/cuna-calcanea-extrema.webp"
    },
    {
      keys: ["cunaCalcaneaLarga", "CunaCalcaneaLarga"],
      label: "Cuña Calcánea Larga",
      image: "/images/cunas/cuna-calcanea-larga.webp"
    },
    {
      keys: ["elevacionAL", "Elevacional", "ElevacionAL"],
      label: "Elevación AL",
      image: "/images/cunas/elevacion-al.webp"
    },
    {
      keys: ["alza", "Alza"],
      label: "Alza",
      image: "/images/cunas/Alza.webp"
    }
  ];
  const getSpecValue = (specs, keys) => {
    for (const k2 of keys) {
      if (specs && Object.prototype.hasOwnProperty.call(specs, k2)) {
        return specs[k2];
      }
    }
    return null;
  };
  const isSpecActive = (value) => {
    if (!value && value !== 0) return false;
    if (typeof value === "boolean") return value;
    if (typeof value === "string") return value.trim() !== "" && value !== "false";
    if (typeof value === "number") return true;
    if (typeof value === "object") {
      return Object.values(value).some((v2) => {
        if (!v2 && v2 !== 0) return false;
        if (typeof v2 === "boolean") return v2;
        if (typeof v2 === "string") return v2.trim() !== "" && v2 !== "false";
        if (typeof v2 === "number") return true;
        if (typeof v2 === "object") {
          return Object.values(v2).some((inner) => inner && inner !== "false");
        }
        return false;
      });
    }
    return false;
  };
  const renderFootSide = () => {
    if (!ticket.foot_side) return "-";
    const value = ticket.foot_side.toLowerCase();
    if (value.includes("izq")) return "Izquierdo";
    if (value.includes("der")) return "Derecho";
    if (value.includes("amb")) return "Ambos";
    return ticket.foot_side;
  };
  const renderSpecDetails = (value) => {
    if (!value) return null;
    if (typeof value === "boolean") {
      return value ? null : null;
    }
    if (typeof value === "string" || typeof value === "number") {
      const val = String(value).toLowerCase();
      if (val === "true" || val === "false") return null;
      return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-gray-800", children: String(value) });
    }
    if (typeof value === "object" && (value.izqSelected !== void 0 || value.derSelected !== void 0)) {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1 text-sm text-gray-800", children: [
        value.izqSelected && value.izqMm && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-bold", children: "Izq" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            value.izqMm,
            "mm"
          ] })
        ] }),
        value.derSelected && value.derMm && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-0.5 rounded bg-red-100 text-red-800 text-xs font-bold", children: "Der" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            value.derMm,
            "mm"
          ] })
        ] })
      ] });
    }
    if (typeof value === "object") {
      const left = value.izq || value.left;
      const right = value.der || value.right;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1 text-sm text-gray-800", children: [
        left && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-bold", children: "Izq" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: typeof left === "object" ? `${left.tipo || ""} ${left.mm || ""}mm`.trim() : String(left).toLowerCase() === "true" ? "" : String(left) })
        ] }),
        right && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-0.5 rounded bg-red-100 text-red-800 text-xs font-bold", children: "Der" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: typeof right === "object" ? `${right.tipo || ""} ${right.mm || ""}mm`.trim() : String(right).toLowerCase() === "true" ? "" : String(right) })
        ] })
      ] });
    }
    return null;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-gray-50 pb-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(LucvanHeader, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => navigate("/production"),
          className: "flex items-center gap-2 text-[#003C63] hover:text-[#005a8f] font-semibold text-lg",
          children: "← Regresar al Dashboard"
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl max-w-7xl mx-auto overflow-hidden shadow-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-0 bg-gradient-to-r from-[#003C63] to-[#0066A4] text-white px-6 py-2 flex justify-between items-center z-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "bg-[#F5C400] text-[#003C63] text-sm font-bold px-2 py-0.5 rounded", children: [
              "#",
              ticket.consecutive_number || ticket.id
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold", children: "Detalles del Ticket" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                value: newStatus,
                onChange: (e2) => setNewStatus(e2.target.value),
                className: "px-2 py-1 border-2 border-[#F5C400] rounded text-[#003C63] font-semibold text-sm focus:ring-2 focus:ring-[#F5C400] focus:border-[#F5C400]",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "pending", children: "Pendiente" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "in_production", children: "En Producción" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ready", children: "Lista para Entregar" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "delivered", children: "Entregada" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: handleStatusChange,
                className: "bg-[#F5C400] text-[#003C63] px-3 py-1 rounded font-bold hover:bg-yellow-500 transition text-sm",
                children: "Guardar"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-[#F4F6F8] rounded-lg p-4 space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-[#003C63] text-base mb-3", children: "Información de la Solicitud" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3 text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 font-semibold", children: "Paciente" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-gray-900", children: ticket.patient_name || "-" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 font-semibold", children: "Clínica" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-gray-900", children: ticket.clinic || "-" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 font-semibold", children: "Doctor" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-gray-900", children: ticket.doctor_name || "-" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 font-semibold", children: "Fecha Solicitud" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-gray-900", children: new Date(ticket.created_at).toLocaleDateString("es-ES") })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 font-semibold", children: "Tipo de Plantilla" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-gray-900", children: ticket.template_type || "-" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 font-semibold", children: "Pie a Trabajar" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-gray-900", children: renderFootSide() })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 font-semibold", children: "Talla de Calzado" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-gray-900", children: ticket.shoe_size || "-" })
              ] })
            ] })
          ] }),
          ticket.comments && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-amber-50 rounded-lg p-4 border-l-4 border-amber-400", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-amber-900 mb-2 text-sm", children: "📝 Comentarios de la Clínica" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-700 text-sm bg-white p-3 rounded", children: ticket.comments })
          ] }),
          ticket.observations && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-100 rounded-lg p-4 border-l-4 border-gray-400", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-gray-800 mb-2 text-sm", children: "Observaciones del Doctor" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-800 text-sm bg-white p-3 rounded", children: ticket.observations })
          ] }),
          Array.isArray(ticket.files) && ticket.files.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-lg border border-gray-200 p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-[#003C63] text-sm mb-2", children: "Archivos adjuntos" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: ticket.files.map((file, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => handleDownloadFile(file),
                className: "w-full text-left flex items-center gap-2 text-sm text-blue-700 hover:text-blue-900 hover:bg-blue-50 p-2 rounded transition",
                title: file.url ? "Click para descargar" : "URL no disponible",
                children: [
                  "📎 ",
                  file.name || `Archivo ${idx + 1}`,
                  file.size ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-gray-500", children: [
                    "(",
                    Math.round(file.size / 1024),
                    " KB)"
                  ] }) : null
                ]
              },
              file.url || idx
            )) })
          ] }),
          ticket.specs && Object.keys(ticket.specs).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-blue-50 rounded-lg p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-[#003C63] text-base mb-3", children: "Especificaciones solicitadas (con referencia visual)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3", children: (() => {
              const cards = specConfig.map((spec) => {
                const value = getSpecValue(ticket.specs, spec.keys);
                if (!isSpecActive(value)) return null;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white p-3 rounded border-2 border-blue-200 flex flex-col gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "img",
                      {
                        src: spec.image,
                        alt: spec.label,
                        className: "w-16 h-16 object-contain rounded border border-gray-200",
                        onError: (e2) => {
                          e2.target.style.display = "none";
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-blue-600 font-bold uppercase", children: spec.label }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-gray-500", children: "Vista de referencia" })
                    ] })
                  ] }),
                  renderSpecDetails(value) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pl-1", children: renderSpecDetails(value) })
                ] }, spec.label);
              }).filter(Boolean);
              if (!cards.length) {
                return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", children: "Sin especificaciones solicitadas." });
              }
              return cards;
            })() })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto mt-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl shadow-lg p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-[#003C63] text-lg mb-4", children: "💬 Notas Internas del Taller" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              value: newNote,
              onChange: (e2) => setNewNote(e2.target.value),
              placeholder: "Escribe una nota interna sobre el progreso del trabajo...",
              className: "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#003C63] focus:border-transparent resize-none",
              rows: "3"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: handleAddNote,
              disabled: !newNote.trim(),
              className: "mt-2 bg-[#003C63] text-white px-4 py-2 rounded hover:bg-[#005a8f] disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold text-sm transition",
              children: "💬 Publicar Nota"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: workshopNotes.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-gray-400 text-center py-12", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg", children: "💭" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Sin notas aún. Sé el primero en comentar." })
        ] }) : workshopNotes.map((note, index) => {
          var _a;
          return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-gray-200 pb-4 last:border-b-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-[#003C63] text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0", children: ((_a = note.user_name) == null ? void 0 : _a.charAt(0).toUpperCase()) || "👤" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-100 rounded-lg p-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-gray-900", children: note.user_name || "Anónimo" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-700 mt-1 whitespace-pre-wrap break-words", children: note.comment })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 mt-1", children: new Date(note.created_at).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              }) })
            ] })
          ] }) }, note.id || index);
        }) })
      ] }) })
    ] })
  ] });
}
function PatientDetail() {
  const { id: id2 } = useParams();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [patient, setPatient] = reactExports.useState(null);
  const [requests, setRequests] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [isEditingPatient, setIsEditingPatient] = reactExports.useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = reactExports.useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = reactExports.useState("");
  const [viewingRequest, setViewingRequest] = reactExports.useState(null);
  const [searchDate, setSearchDate] = reactExports.useState("");
  const [editForm, setEditForm] = reactExports.useState({
    name: "",
    phone: "",
    email: "",
    birthDate: "",
    notes: ""
  });
  reactExports.useEffect(() => {
    const load = async () => {
      try {
        const resPatients = await apiFetch("/api/patients");
        if (resPatients.ok) {
          const patients = await resPatients.json();
          const p2 = patients.find((x2) => x2.id === parseInt(id2));
          setPatient(p2 || null);
        }
        try {
          const resRequests = await apiFetch(`/api/requests?patientId=${id2}`);
          if (resRequests.ok) {
            const reqs = await resRequests.json();
            setRequests(Array.isArray(reqs) ? reqs : []);
          }
        } catch (err) {
          console.error("Error loading requests:", err);
          setRequests([]);
        }
      } catch (err) {
        console.error("Error loading patient", err);
      } finally {
        setLoading(false);
      }
    };
    load();
    const pollInterval = setInterval(async () => {
      try {
        const resRequests = await apiFetch(`/api/requests?patientId=${id2}`);
        if (resRequests.ok) {
          const reqs = await resRequests.json();
          setRequests(Array.isArray(reqs) ? reqs : []);
        }
      } catch (err) {
        console.error("Error refreshing requests:", err);
      }
    }, 3e3);
    return () => clearInterval(pollInterval);
  }, [id2, currentUser == null ? void 0 : currentUser.token]);
  const handleEditPatient = () => {
    if (!patient) return;
    const nameParts = (patient.name || "").trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName1 = nameParts[1] || "";
    const lastName2 = nameParts.slice(2).join(" ") || "";
    setEditForm({
      firstName,
      lastName1,
      lastName2,
      phone: patient.phone,
      email: patient.email || "",
      birthDate: patient.birthDate || "",
      notes: patient.notes || ""
    });
    setIsEditingPatient(true);
  };
  const handleSavePatient = async (e2) => {
    e2.preventDefault();
    const form = e2.currentTarget;
    const firstName = form.elements["firstName"].value.trim();
    const lastName1 = form.elements["lastName1"].value.trim();
    const lastName2 = form.elements["lastName2"].value.trim();
    const notes = form.elements["notes"].value.trim() || null;
    if (!firstName || !lastName1 || !lastName2) {
      alert("Nombre y ambos apellidos son requeridos");
      return;
    }
    const fullName = `${firstName} ${lastName1} ${lastName2}`.trim();
    try {
      const res = await apiFetch(`/api/patients/${id2}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: fullName, notes })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al actualizar");
      setPatient(data);
      setIsEditingPatient(false);
      alert("Paciente actualizado exitosamente");
    } catch (err) {
      alert(err.message);
    }
  };
  const handleDeletePatient = async () => {
    if (deleteConfirmText !== "eliminar usuario") {
      alert('Debes escribir "eliminar usuario" para confirmar');
      return;
    }
    try {
      const res = await apiFetch(`/api/patients/${id2}`, {
        method: "DELETE"
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al eliminar");
      }
      alert("Paciente eliminado exitosamente");
      navigate("/clinic");
    } catch (err) {
      alert(err.message);
    }
  };
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-[#F4F6F8]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LucvanHeader, { title: "Perfil del Paciente", user: currentUser, onLogout: handleLogout }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Cargando paciente..." }) })
    ] });
  }
  if (!patient) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-[#F4F6F8]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LucvanHeader, { title: "Perfil del Paciente", user: currentUser, onLogout: handleLogout }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500 mb-4", children: "Paciente no encontrado" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => navigate("/clinic"),
            className: "px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400",
            children: "Volver a Pacientes"
          }
        )
      ] }) })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-[#F4F6F8]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(LucvanHeader, { title: "Perfil del Paciente", user: currentUser, onLogout: handleLogout }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
      ((currentUser == null ? void 0 : currentUser.role) === "clinic" || (currentUser == null ? void 0 : currentUser.role) === "admin") && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => navigate("/clinic"),
          className: "mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 inline-flex items-center gap-2",
          children: "← Volver a Pacientes"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 sm:px-8 py-6 relative", children: !isEditingPatient ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-6 items-start sm:items-end", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 bg-[#003C63] rounded-lg flex items-center justify-center text-2xl font-semibold text-white border border-gray-300 shadow-sm", children: patient.name.charAt(0).toUpperCase() }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-semibold text-[#003C63]", children: patient.name }),
            patient.email && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600 text-sm mt-1", children: patient.email })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 self-start sm:self-center mt-4 sm:mt-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: handleEditPatient,
                className: "px-4 py-2 bg-[#0066A4] text-white rounded-md hover:bg-[#003C63] font-medium transition-colors text-sm",
                children: "Editar"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => navigate(`/request/new/${patient.id}`),
                className: "px-4 py-2 bg-[#003C63] text-white rounded-md hover:bg-[#0066A4] font-medium transition-colors text-sm",
                children: "Nueva Solicitud"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 mt-8 pt-8 border-t border-gray-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-[#F8F9FA] p-4 rounded-md border border-gray-200", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#003C63] text-xs font-semibold uppercase tracking-wide", children: "Solicitudes" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-[#0066A4] mt-2 text-lg", children: requests.length })
            ] }),
            patient.email && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-[#F8F9FA] p-4 rounded-md border border-gray-200", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#003C63] text-xs font-semibold uppercase tracking-wide", children: "Correo" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-gray-900 mt-2 break-all text-sm", children: patient.email })
            ] })
          ] }),
          patient.notes && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-[#FFFBF0] p-4 rounded-md border border-gray-200", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#003C63] text-xs font-semibold uppercase tracking-wide", children: "Notas" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-700 text-sm mt-3 leading-relaxed", children: patient.notes })
          ] })
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSavePatient, className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-6", children: "Editar Paciente" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: [
            "Nombre ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-600", children: "*" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              name: "firstName",
              type: "text",
              defaultValue: editForm.firstName,
              placeholder: "Ej: Juan",
              className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066A4]",
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: [
            "Primer Apellido ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-600", children: "*" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              name: "lastName1",
              type: "text",
              defaultValue: editForm.lastName1,
              placeholder: "Ej: Pérez",
              className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066A4]",
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: [
            "Segundo Apellido ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-600", children: "*" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              name: "lastName2",
              type: "text",
              defaultValue: editForm.lastName2,
              placeholder: "Ej: García",
              className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066A4]",
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Notas Clínicas" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              name: "notes",
              rows: "4",
              defaultValue: patient.notes || "",
              placeholder: "Información médica relevante, alergias, condiciones especiales... (opcional)",
              className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066A4]"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "submit",
              className: "px-6 py-2 bg-[#0066A4] text-white rounded-lg font-medium hover:bg-[#003C63]",
              children: "Guardar Cambios"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setIsEditingPatient(false),
              className: "px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300",
              children: "Cancelar"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setShowDeleteConfirm(true),
              className: "px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 ml-auto",
              children: "🗑️ Eliminar Paciente"
            }
          )
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold text-[#003C63]", children: "Historial de Solicitudes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 w-full sm:w-auto", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                placeholder: "Buscar por fecha (ej: febrero, 2026)...",
                value: searchDate,
                onChange: (e2) => setSearchDate(e2.target.value),
                className: "flex-1 sm:flex-none sm:w-64 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0066A4] focus:border-transparent"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: async () => {
                  try {
                    const resRequests = await apiFetch(`/api/requests?patientId=${id2}`);
                    if (resRequests.ok) {
                      const reqs = await resRequests.json();
                      setRequests(Array.isArray(reqs) ? reqs : []);
                    }
                  } catch (err) {
                    console.error("Error refreshing requests:", err);
                  }
                },
                className: "px-3 py-1.5 text-sm font-medium text-[#0066A4] hover:text-[#003C63] hover:bg-[#F0F5FA] rounded transition-all whitespace-nowrap",
                title: "Refrescar estado de las solicitudes",
                children: "↻ Refrescar"
              }
            )
          ] })
        ] }),
        requests.filter((req) => {
          if (!searchDate.trim()) return true;
          const dateStr = new Date(req.createdAt || req.created_at).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" });
          return dateStr.toLowerCase().includes(searchDate.toLowerCase());
        }).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-12 text-gray-500", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-medium", children: searchDate ? "No se encontraron solicitudes" : "No hay solicitudes registradas" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-2", children: searchDate ? "Intenta con otro término de búsqueda" : 'Crea una nueva solicitud usando el botón "Nueva Solicitud"' })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: requests.filter((req) => {
          if (!searchDate.trim()) return true;
          const dateStr = new Date(req.createdAt || req.created_at).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" });
          return dateStr.toLowerCase().includes(searchDate.toLowerCase());
        }).map((req) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-gray-200 rounded-md p-3 hover:bg-[#F8F9FA] cursor-pointer transition-all hover:border-[#0066A4] hover:shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start gap-2", onClick: () => navigate(`/request/${req.id}`), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-[#003C63] text-white text-xs font-semibold px-2.5 py-1 rounded whitespace-nowrap", children: new Date(req.createdAt || req.created_at).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "2-digit" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-gray-900 text-sm truncate", children: req.templateType || req.template_type || "Solicitud" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-gray-600 flex flex-wrap gap-2 mb-1", children: [
              (req.doctor_name || req.doctorName) && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Dr. ",
                req.doctor_name || req.doctorName
              ] }),
              (req.foot_side || req.footSide) && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Pie: ",
                req.foot_side || req.footSide
              ] }),
              (req.shoe_size || req.shoeSize) && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Talla: ",
                req.shoe_size || req.shoeSize
              ] })
            ] }),
            req.observations && req.observations !== "Sin notas" && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 line-clamp-1", children: req.observations })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-1 whitespace-nowrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `px-2 py-0.5 rounded text-xs font-medium ${req.status === "cancelled" ? "bg-red-100 text-red-800" : req.status === "delivered" ? "bg-green-100 text-green-800" : req.status === "ready" ? "bg-purple-100 text-purple-800" : req.status === "in_production" || req.status === "in_progress" ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-800"}`,
                children: req.status === "cancelled" ? "Cancelada" : req.status === "delivered" ? "Entregada" : req.status === "ready" ? "Lista" : req.status === "in_production" || req.status === "in_progress" ? "Producción" : "Pendiente"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "text-xs text-[#0066A4] hover:text-[#003C63]", onClick: (e2) => {
              e2.stopPropagation();
              navigate(`/request/${req.id}`);
            }, children: "Detalles →" })
          ] })
        ] }) }, req.id)) })
      ] }) })
    ] }),
    showDeleteConfirm && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-lg p-8 max-w-md w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-4", children: "Eliminar Paciente" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-gray-600 mb-6", children: [
        "Esta acción es irreversible. Escribe ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: '"eliminar usuario"' }),
        " para confirmar."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "text",
          placeholder: 'Escribe "eliminar usuario"',
          value: deleteConfirmText,
          onChange: (e2) => setDeleteConfirmText(e2.target.value),
          className: "w-full px-4 py-2 border-2 border-red-300 rounded-lg mb-6 focus:ring-2 focus:ring-red-500 focus:border-red-500"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: handleDeletePatient,
            disabled: deleteConfirmText !== "eliminar usuario",
            className: "flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
            children: "Eliminar"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => {
              setShowDeleteConfirm(false);
              setDeleteConfirmText("");
            },
            className: "flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors",
            children: "Cancelar"
          }
        )
      ] })
    ] }) })
  ] });
}
function NewRequest() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [patient, setPatient] = reactExports.useState(null);
  const [uploadedFiles, setUploadedFiles] = reactExports.useState([]);
  const [doctorName, setDoctorName] = reactExports.useState("");
  const [templateType, setTemplateType] = reactExports.useState("");
  const [footSide, setFootSide] = reactExports.useState("");
  const [shoeSize, setShoeSize] = reactExports.useState("");
  const [observations, setObservations] = reactExports.useState("");
  reactExports.useEffect(() => {
    const loadPatient = async () => {
      try {
        const res = await apiFetch("/api/patients");
        if (res.ok) {
          const patients = await res.json();
          const p2 = patients.find((x2) => x2.id === parseInt(patientId));
          setPatient(p2 || null);
        }
      } catch (err) {
        console.error("Error loading patient", err);
      }
    };
    if (currentUser == null ? void 0 : currentUser.token) loadPatient();
  }, [patientId, currentUser == null ? void 0 : currentUser.token]);
  const [specs, setSpecs] = reactExports.useState({
    arcoTransverso: { izq: false, der: false },
    barraMetatarsal: { izq: false, der: false },
    cunaCalcaneaInterna: { izq: "", der: "" },
    // '3mm', '5mm', '7mm'
    cunaCalcaneaExtrema: { izq: "", der: "" },
    cunaCalcaneaLarga: { izq: "", der: "" },
    elevacionAL: { izqSelected: false, izqMm: "", derSelected: false, derMm: "" },
    alza: {
      izq: { tipo: "", mm: "" },
      // tipo: 'talon', '3/4', 'larga'
      der: { tipo: "", mm: "" }
    }
  });
  const allowLeft = footSide === "Izquierdo" || footSide === "Ambos";
  const allowRight = footSide === "Derecho" || footSide === "Ambos";
  const handleFileUpload = (e2) => {
    const files = Array.from(e2.target.files);
    setUploadedFiles([...uploadedFiles, ...files]);
  };
  const removeFile = (index) => {
    setUploadedFiles(uploadedFiles.filter((_2, i2) => i2 !== index));
  };
  const handleSubmit = async (e2) => {
    e2.preventDefault();
    if (!doctorName || !templateType || !footSide || !shoeSize) {
      alert("Por favor completa los campos obligatorios: Doctor, Tipo de plantilla, Lado del pie y Talla de calzado.");
      return;
    }
    const size = parseFloat(shoeSize);
    if (isNaN(size) || size < 19 || size > 50) {
      alert("La talla debe estar entre 19 y 50.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("patientId", parseInt(patientId));
      formData.append("doctorName", doctorName);
      formData.append("templateType", templateType);
      formData.append("footSide", footSide);
      formData.append("shoeSize", shoeSize);
      formData.append("specs", JSON.stringify(specs));
      formData.append("observations", observations);
      uploadedFiles.forEach((file) => formData.append("files", file));
      const res = await apiFetch("/api/requests", {
        method: "POST",
        body: formData
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al crear la solicitud");
      }
      alert("Solicitud creada exitosamente");
      navigate(`/patient/${patientId}`);
    } catch (err) {
      console.error("Error al crear solicitud:", err);
      alert("Error al crear la solicitud: " + err.message);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-[#F4F6F8]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "bg-gradient-to-r from-[#0066A4] to-[#003C63] shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => navigate(`/patient/${patientId}`),
          className: "text-white hover:text-[#F5C400] font-medium transition-colors",
          children: "← Volver"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/lucvan-logo-web.png", alt: "Lucván", className: "h-12 brightness-0 invert" })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-3xl shadow-xl p-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold text-[#003C63] mb-2", children: "Nueva Solicitud de Plantilla" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-[#333333] mb-8", children: "Complete el formulario con la información requerida" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 bg-white border-2 border-[#0066A4] rounded-2xl p-5 shadow-md", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-bold text-[#0066A4] mb-2", children: "Paciente" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-600", children: "Nombre:" }),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-gray-900", children: patient ? patient.name : "Cargando..." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Nombre del Doctor" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              value: doctorName,
              onChange: (e2) => setDoctorName(e2.target.value),
              placeholder: "Nombre completo del doctor",
              className: "w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400",
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Tipo de Plantilla" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              value: templateType,
              onChange: (e2) => setTemplateType(e2.target.value),
              className: "w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400",
              required: true,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Seleccione tipo de plantilla" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Amputado" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Pie cavo" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Diabético" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Pie plano" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Fascitis plantar" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Espolón" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Ultrasoft" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Lado del Pie" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              value: footSide,
              onChange: (e2) => setFootSide(e2.target.value),
              className: "w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400",
              required: true,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Seleccione lado del pie" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Izquierdo" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Derecho" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Ambos" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Talla de Calzado" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "number",
              value: shoeSize,
              onChange: (e2) => setShoeSize(e2.target.value),
              placeholder: "Ingrese talla (19-50)",
              min: "19",
              max: "50",
              step: "0.5",
              className: "w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0066A4] focus:border-[#0066A4] transition-all",
              onWheel: (e2) => e2.currentTarget.blur(),
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-2 border-[#0066A4] rounded-2xl p-6 bg-gradient-to-br from-blue-50/30 to-white", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-[#003C63] mb-4", children: "Especificaciones de Cuñas y Alzas" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl p-4 shadow-md border border-gray-200", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/images/cunas/arco-transverso.webp", alt: "AT", className: "w-20 h-20 object-contain mb-2", onError: (e2) => {
                  console.error("Image failed to load:", e2.target.src);
                  e2.target.style.display = "none";
                } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold text-[#003C63] text-sm mb-3 text-center", children: "Arco Transverso (AT)" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-center gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: `inline-flex items-center gap-2 cursor-pointer ${!allowLeft ? "opacity-50" : ""}`, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "checkbox",
                      checked: specs.arcoTransverso.izq,
                      onChange: (e2) => setSpecs({ ...specs, arcoTransverso: { ...specs.arcoTransverso, izq: e2.target.checked } }),
                      className: "rounded border-gray-300 text-[#0066A4] focus:ring-[#0066A4]",
                      disabled: !allowLeft
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-red-600", children: "Izq" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: `inline-flex items-center gap-2 cursor-pointer ${!allowRight ? "opacity-50" : ""}`, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "checkbox",
                      checked: specs.arcoTransverso.der,
                      onChange: (e2) => setSpecs({ ...specs, arcoTransverso: { ...specs.arcoTransverso, der: e2.target.checked } }),
                      className: "rounded border-gray-300 text-[#0066A4] focus:ring-[#0066A4]",
                      disabled: !allowRight
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-red-600", children: "Der" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl p-4 shadow-md border border-gray-200", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/images/cunas/barra-metatarsal.webp", alt: "BTM", className: "w-20 h-20 object-contain mb-2", onError: (e2) => {
                  console.error("Image failed to load:", e2.target.src);
                  e2.target.style.display = "none";
                } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold text-[#003C63] text-sm mb-3 text-center", children: "Barra Metatarsal (BTM)" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-center gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: `inline-flex items-center gap-2 cursor-pointer ${!allowLeft ? "opacity-50" : ""}`, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "checkbox",
                      checked: specs.barraMetatarsal.izq,
                      onChange: (e2) => setSpecs({ ...specs, barraMetatarsal: { ...specs.barraMetatarsal, izq: e2.target.checked } }),
                      className: "rounded border-gray-300 text-[#0066A4] focus:ring-[#0066A4]",
                      disabled: !allowLeft
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-red-600", children: "Izq" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: `inline-flex items-center gap-2 cursor-pointer ${!allowRight ? "opacity-50" : ""}`, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "checkbox",
                      checked: specs.barraMetatarsal.der,
                      onChange: (e2) => setSpecs({ ...specs, barraMetatarsal: { ...specs.barraMetatarsal, der: e2.target.checked } }),
                      className: "rounded border-gray-300 text-[#0066A4] focus:ring-[#0066A4]",
                      disabled: !allowRight
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-red-600", children: "Der" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl p-4 shadow-md border border-gray-200", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/images/cunas/cuna-calcanea-interna.webp", alt: "CCI", className: "w-20 h-20 object-contain mb-2", onError: (e2) => {
                  console.error("Image failed to load:", e2.target.src);
                  e2.target.style.display = "none";
                } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold text-[#003C63] text-sm mb-3 text-center", children: "Cuña Calcánea Interna (CCI)" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-gray-600", children: "Izquierda:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 mt-1", children: ["3mm", "5mm", "7mm"].map((size) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: `inline-flex items-center gap-1 cursor-pointer text-xs ${!allowLeft ? "opacity-50" : ""}`, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "radio",
                        name: "cci-izq",
                        checked: specs.cunaCalcaneaInterna.izq === size,
                        onChange: () => setSpecs({ ...specs, cunaCalcaneaInterna: { ...specs.cunaCalcaneaInterna, izq: size } }),
                        className: "text-[#0066A4] focus:ring-[#0066A4]",
                        disabled: !allowLeft
                      }
                    ),
                    size
                  ] }, size)) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-gray-600", children: "Derecha:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 mt-1", children: ["3mm", "5mm", "7mm"].map((size) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: `inline-flex items-center gap-1 cursor-pointer text-xs ${!allowRight ? "opacity-50" : ""}`, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "radio",
                        name: "cci-der",
                        checked: specs.cunaCalcaneaInterna.der === size,
                        onChange: () => setSpecs({ ...specs, cunaCalcaneaInterna: { ...specs.cunaCalcaneaInterna, der: size } }),
                        className: "text-[#0066A4] focus:ring-[#0066A4]",
                        disabled: !allowRight
                      }
                    ),
                    size
                  ] }, size)) })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl p-4 shadow-md border border-gray-200", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/images/cunas/cuna-calcanea-extrema.webp", alt: "CCE", className: "w-20 h-20 object-contain mb-2", onError: (e2) => {
                  console.error("Image failed to load:", e2.target.src);
                  e2.target.style.display = "none";
                } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold text-[#003C63] text-sm mb-3 text-center", children: "Cuña Calcánea Extrema (CCE)" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-gray-600", children: "Izquierda:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 mt-1", children: ["3mm", "5mm", "7mm"].map((size) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: `inline-flex items-center gap-1 cursor-pointer text-xs ${!allowLeft ? "opacity-50" : ""}`, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "radio",
                        name: "cce-izq",
                        checked: specs.cunaCalcaneaExtrema.izq === size,
                        onChange: () => setSpecs({ ...specs, cunaCalcaneaExtrema: { ...specs.cunaCalcaneaExtrema, izq: size } }),
                        className: "text-[#0066A4] focus:ring-[#0066A4]",
                        disabled: !allowLeft
                      }
                    ),
                    size
                  ] }, size)) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-gray-600", children: "Derecha:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 mt-1", children: ["3mm", "5mm", "7mm"].map((size) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: `inline-flex items-center gap-1 cursor-pointer text-xs ${!allowRight ? "opacity-50" : ""}`, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "radio",
                        name: "cce-der",
                        checked: specs.cunaCalcaneaExtrema.der === size,
                        onChange: () => setSpecs({ ...specs, cunaCalcaneaExtrema: { ...specs.cunaCalcaneaExtrema, der: size } }),
                        className: "text-[#0066A4] focus:ring-[#0066A4]",
                        disabled: !allowRight
                      }
                    ),
                    size
                  ] }, size)) })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl p-4 shadow-md border border-gray-200", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/images/cunas/cuna-calcanea-larga.webp", alt: "CCL", className: "w-20 h-20 object-contain mb-2", onError: (e2) => {
                  console.error("Image failed to load:", e2.target.src);
                  e2.target.style.display = "none";
                } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold text-[#003C63] text-sm mb-3 text-center", children: "Cuña Calcánea Larga (Antepie)" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-gray-600", children: "Izquierda:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 mt-1", children: ["3mm", "5mm", "7mm"].map((size) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: `inline-flex items-center gap-1 cursor-pointer text-xs ${!allowLeft ? "opacity-50" : ""}`, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "radio",
                        name: "ccl-izq",
                        checked: specs.cunaCalcaneaLarga.izq === size,
                        onChange: () => setSpecs({ ...specs, cunaCalcaneaLarga: { ...specs.cunaCalcaneaLarga, izq: size } }),
                        className: "text-[#0066A4] focus:ring-[#0066A4]",
                        disabled: !allowLeft
                      }
                    ),
                    size
                  ] }, size)) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-gray-600", children: "Derecha:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 mt-1", children: ["3mm", "5mm", "7mm"].map((size) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: `inline-flex items-center gap-1 cursor-pointer text-xs ${!allowRight ? "opacity-50" : ""}`, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "radio",
                        name: "ccl-der",
                        checked: specs.cunaCalcaneaLarga.der === size,
                        onChange: () => setSpecs({ ...specs, cunaCalcaneaLarga: { ...specs.cunaCalcaneaLarga, der: size } }),
                        className: "text-[#0066A4] focus:ring-[#0066A4]",
                        disabled: !allowRight
                      }
                    ),
                    size
                  ] }, size)) })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl p-4 shadow-md border border-gray-200", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/images/cunas/elevacion-al.webp", alt: "EAL", className: "w-20 h-20 object-contain mb-2", onError: (e2) => {
                  console.error("Image failed to load:", e2.target.src);
                  e2.target.style.display = "none";
                } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold text-[#003C63] text-sm mb-3 text-center", children: "Elevación A.L." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-gray-600", children: "Izquierda:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: `inline-flex items-center gap-2 cursor-pointer ${!allowLeft ? "opacity-50" : ""}`, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "checkbox",
                        checked: specs.elevacionAL.izqSelected,
                        onChange: (e2) => setSpecs({ ...specs, elevacionAL: { ...specs.elevacionAL, izqSelected: e2.target.checked, izqMm: e2.target.checked ? "" : "" } }),
                        className: "rounded border-gray-300 text-[#0066A4] focus:ring-[#0066A4]",
                        disabled: !allowLeft
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-red-600", children: "Sí" })
                  ] }) }),
                  specs.elevacionAL.izqSelected && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "number",
                      value: specs.elevacionAL.izqMm,
                      onChange: (e2) => setSpecs({ ...specs, elevacionAL: { ...specs.elevacionAL, izqMm: e2.target.value } }),
                      placeholder: "mm",
                      className: "w-full mt-2 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#0066A4]",
                      disabled: !allowLeft,
                      onWheel: (e2) => e2.currentTarget.blur()
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-gray-600", children: "Derecha:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: `inline-flex items-center gap-2 cursor-pointer ${!allowRight ? "opacity-50" : ""}`, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "checkbox",
                        checked: specs.elevacionAL.derSelected,
                        onChange: (e2) => setSpecs({ ...specs, elevacionAL: { ...specs.elevacionAL, derSelected: e2.target.checked, derMm: e2.target.checked ? "" : "" } }),
                        className: "rounded border-gray-300 text-[#0066A4] focus:ring-[#0066A4]",
                        disabled: !allowRight
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-red-600", children: "Sí" })
                  ] }) }),
                  specs.elevacionAL.derSelected && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "number",
                      value: specs.elevacionAL.derMm,
                      onChange: (e2) => setSpecs({ ...specs, elevacionAL: { ...specs.elevacionAL, derMm: e2.target.value } }),
                      placeholder: "mm",
                      className: "w-full mt-2 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#0066A4]",
                      disabled: !allowRight,
                      onWheel: (e2) => e2.currentTarget.blur()
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl p-4 shadow-md border border-gray-200 md:col-span-2 lg:col-span-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/images/cunas/Alza.webp", alt: "Alza", className: "w-20 h-20 object-contain mb-2", onError: (e2) => {
                  console.error("Image failed to load:", e2.target.src);
                  e2.target.style.display = "none";
                } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold text-[#003C63] text-sm mb-3 text-center", children: "Alza" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-gray-600", children: "Izquierda:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 mt-1 flex-wrap", children: ["talon", "3/4", "larga"].map((tipo) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: `inline-flex items-center gap-1 cursor-pointer text-xs ${!allowLeft ? "opacity-50" : ""}`, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "radio",
                        name: "alza-izq-tipo",
                        checked: specs.alza.izq.tipo === tipo,
                        onChange: () => setSpecs({ ...specs, alza: { ...specs.alza, izq: { ...specs.alza.izq, tipo } } }),
                        className: "text-[#0066A4] focus:ring-[#0066A4]",
                        disabled: !allowLeft
                      }
                    ),
                    tipo === "talon" ? "Talón" : tipo === "3/4" ? "3/4" : "Larga"
                  ] }, tipo)) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "number",
                      value: specs.alza.izq.mm,
                      onChange: (e2) => setSpecs({ ...specs, alza: { ...specs.alza, izq: { ...specs.alza.izq, mm: e2.target.value } } }),
                      placeholder: "mm",
                      className: "w-full mt-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#0066A4]",
                      disabled: !allowLeft,
                      onWheel: (e2) => e2.currentTarget.blur()
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-gray-600", children: "Derecha:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 mt-1 flex-wrap", children: ["talon", "3/4", "larga"].map((tipo) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: `inline-flex items-center gap-1 cursor-pointer text-xs ${!allowRight ? "opacity-50" : ""}`, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "radio",
                        name: "alza-der-tipo",
                        checked: specs.alza.der.tipo === tipo,
                        onChange: () => setSpecs({ ...specs, alza: { ...specs.alza, der: { ...specs.alza.der, tipo } } }),
                        className: "text-[#0066A4] focus:ring-[#0066A4]",
                        disabled: !allowRight
                      }
                    ),
                    tipo === "talon" ? "Talón" : tipo === "3/4" ? "3/4" : "Larga"
                  ] }, tipo)) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "number",
                      value: specs.alza.der.mm,
                      onChange: (e2) => setSpecs({ ...specs, alza: { ...specs.alza, der: { ...specs.alza.der, mm: e2.target.value } } }),
                      placeholder: "mm",
                      className: "w-full mt-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#0066A4]",
                      disabled: !allowRight,
                      onWheel: (e2) => e2.currentTarget.blur()
                    }
                  )
                ] })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Observaciones" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              rows: "4",
              value: observations,
              onChange: (e2) => setObservations(e2.target.value),
              placeholder: "Ingrese observaciones, especificaciones o consideraciones especiales...",
              className: "w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Documentos Adjuntos" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:border-gray-400 transition", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 mb-2", children: "Arrastra archivos o haz clic para seleccionar" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "file",
                multiple: true,
                accept: ".pdf,.jpg,.jpeg,.png",
                onChange: handleFileUpload,
                className: "hidden",
                id: "fileInput"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "fileInput",
                className: "inline-block px-3 py-1.5 bg-gray-900 text-white rounded text-xs font-medium cursor-pointer hover:bg-gray-800 transition",
                children: "Seleccionar"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400 mt-2", children: "PDF, JPG, PNG • Máx. 10MB" }),
            uploadedFiles.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 space-y-1", children: uploadedFiles.map((file, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between bg-gray-50 p-2 rounded text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-700 truncate", children: file.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => removeFile(index),
                  className: "text-red-600 hover:text-red-800 ml-2 font-medium",
                  children: "✕"
                }
              )
            ] }, index)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 pt-6 border-t-2 border-gray-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "submit",
              className: "flex-1 bg-[#F5C400] text-[#003C63] py-3 px-6 rounded-full font-bold hover:bg-[#ffd933] transition-all shadow-[0_12px_24px_-10px_rgba(0,60,99,0.25)] hover:shadow-[0_16px_32px_-12px_rgba(0,60,99,0.3)] hover:-translate-y-0.5",
              children: "Enviar Solicitud"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => navigate(`/patient/${patientId}`),
              className: "flex-1 bg-white border-2 border-[#0066A4] text-[#003C63] py-3 px-6 rounded-full font-semibold hover:bg-[#F4F6F8] transition-all",
              children: "Cancelar"
            }
          )
        ] })
      ] })
    ] }) })
  ] });
}
function RequestDetail() {
  const { id: id2 } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [request, setRequest] = reactExports.useState(null);
  const [patient, setPatient] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const [showCancelModal, setShowCancelModal] = reactExports.useState(false);
  const [cancelReason, setCancelReason] = reactExports.useState("");
  const deliveredDateValue = (request == null ? void 0 : request.delivered_at) || (request == null ? void 0 : request.deliveredAt) || (request == null ? void 0 : request.delivered_date) || (request == null ? void 0 : request.deliveredDate);
  const canStopPolling = (request == null ? void 0 : request.status) === "delivered" || (request == null ? void 0 : request.status) === "cancelled";
  reactExports.useEffect(() => {
    const fetchPatient = async (patientId) => {
      try {
        const res = await apiFetch(`/api/patients/${patientId}`);
        if (res.ok) {
          const patientData = await res.json();
          setPatient(patientData);
          return;
        }
      } catch (e2) {
      }
      setPatient(null);
    };
    const load = async () => {
      try {
        const res = await apiFetch(`/api/requests/${id2}`);
        if (!res.ok) {
          const errorText = await res.text();
          console.error(`Error ${res.status}: ${errorText}`);
          setError(`Error al cargar la solicitud (código ${res.status}). Verifica que el ID sea correcto y que el backend esté activo.`);
          setLoading(false);
          return;
        }
        const data = await res.json();
        console.log("Initial request data:", data);
        setRequest(data);
        setLoading(false);
        if (data.patient_id) {
          fetchPatient(data.patient_id);
        }
      } catch (e2) {
        console.error("Error cargando solicitud", e2);
        setError(`Error de conexión: ${e2.message}. Verifica que el backend esté corriendo en http://localhost:4000`);
        setLoading(false);
      }
    };
    load();
    if (canStopPolling) return;
    const poll = setInterval(async () => {
      try {
        const res = await apiFetch(`/api/requests/${id2}`);
        if (res.ok) {
          const data = await res.json();
          console.log("Polling data:", data);
          setRequest(data);
        }
      } catch (e2) {
      }
    }, 3e3);
    return () => clearInterval(poll);
  }, [id2, canStopPolling]);
  const handleCancelRequest = async () => {
    if (!cancelReason.trim()) {
      alert("Por favor proporciona un motivo de cancelación");
      return;
    }
    try {
      const res = await apiFetch(`/api/requests/${id2}/cancel`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: cancelReason })
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error al cancelar solicitud");
      }
      await res.json();
      if ((currentUser == null ? void 0 : currentUser.role) === "clinic") {
        navigate("/clinic-dashboard");
      } else if ((currentUser == null ? void 0 : currentUser.role) === "workshop" || (currentUser == null ? void 0 : currentUser.role) === "production") {
        navigate("/production");
      } else {
        navigate("/admin");
      }
    } catch (e2) {
      console.error("Error cancelando solicitud", e2);
      alert(`Error: ${e2.message}`);
    }
  };
  const handleDuplicateRequest = () => {
    if (!(request == null ? void 0 : request.patient_id)) return;
    navigate(`/request/new/${request.patient_id}`, {
      state: { duplicateFrom: request }
    });
  };
  const handleWarranty = () => {
    alert("Función de garantía en desarrollo");
  };
  const isWarrantyActive = () => {
    if (!deliveredDateValue) return false;
    const deliveredDate = new Date(deliveredDateValue);
    const now = /* @__PURE__ */ new Date();
    const daysSinceDelivery = Math.floor((now - deliveredDate) / (1e3 * 60 * 60 * 24));
    return daysSinceDelivery <= 30;
  };
  const specs = (request == null ? void 0 : request.specs) || {};
  const renderSpec = (name, data) => {
    var _a, _b;
    if (!data) return null;
    if (name === "elevacionAL" && typeof data === "object") {
      const hasValues2 = data.izqSelected && data.izqMm || data.derSelected && data.derMm;
      if (!hasValues2) return null;
      const label2 = "Elevación A.L.";
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-gray-50 rounded border border-gray-200", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm text-gray-900 mb-2", children: label2 }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs space-y-1", children: [
          data.izqSelected && data.izqMm && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-gray-700", children: [
            "Izq: ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", children: [
              data.izqMm,
              "mm"
            ] })
          ] }),
          data.derSelected && data.derMm && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-gray-700", children: [
            "Der: ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", children: [
              data.derMm,
              "mm"
            ] })
          ] })
        ] })
      ] }, name);
    }
    const isSimpleCheckbox = typeof data === "object" && (data.izq === true || data.izq === false || data.der === true || data.der === false) && !data.tipo && !data.mm && !((_a = data.izq) == null ? void 0 : _a.mm) && !((_b = data.der) == null ? void 0 : _b.mm);
    const hasValues = typeof data === "object" && (data.izq !== null && data.izq !== void 0 && data.izq !== false && data.izq !== "" || data.der !== null && data.der !== void 0 && data.der !== false && data.der !== "");
    if (!hasValues && !isSimpleCheckbox) return null;
    const label = name.replace(/([A-Z])/g, " $1").replace(/^./, (s2) => s2.toUpperCase()).trim();
    if (isSimpleCheckbox) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-gray-50 rounded border border-gray-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm text-gray-900 mb-2", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 text-xs", children: [
        data.izq && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-600 font-medium", children: "Izq ✓" }),
        data.der && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-600 font-medium", children: "Der ✓" })
      ] })
    ] }, name);
    if (hasValues) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-gray-50 rounded border border-gray-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm text-gray-900 mb-2", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs space-y-1", children: [
        data.izq !== null && data.izq !== void 0 && data.izq !== false && data.izq !== "" && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-gray-700", children: [
          "Izq: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: typeof data.izq === "object" ? `${data.izq.tipo || ""} ${data.izq.mm || ""}mm`.trim() : String(data.izq) })
        ] }),
        data.der !== null && data.der !== void 0 && data.der !== false && data.der !== "" && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-gray-700", children: [
          "Der: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: typeof data.der === "object" ? `${data.der.tipo || ""} ${data.der.mm || ""}mm`.trim() : String(data.der) })
        ] })
      ] })
    ] }, name);
    return null;
  };
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Cargando..." }) });
  if (error || !request) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex flex-col items-center justify-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-lg text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-red-600 mb-2", children: "No se encontró la solicitud" }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-700 mb-4", children: error }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-gray-600 text-sm mb-4", children: [
      "ID de solicitud: ",
      id2
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => navigate(-1),
        className: "bg-[#003C63] text-white px-4 py-2 rounded hover:bg-[#0066A4]",
        children: "← Volver"
      }
    )
  ] }) });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-[#F4F6F8]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(LucvanHeader, { currentUser }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => navigate(`/patient/${request.patient_id}`), className: "text-[#003C63] hover:text-[#0066A4] mb-6", children: "← Volver al paciente" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-3xl shadow-xl p-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 pb-6 border-b", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-[#003C63] mb-1", children: (patient == null ? void 0 : patient.name) || request.patient_name || `Paciente #${request.patient_id}` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base text-gray-700 font-medium mb-2", children: request.template_type || request.templateType || "Solicitud" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-4 text-sm text-gray-700", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-orange-600", children: [
              "Fecha de solicitud: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-normal text-gray-800", children: new Date(request.created_at || request.createdAt).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" }) })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-400", children: [
              "#",
              request.consecutive || request.id
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 justify-end", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: handleDuplicateRequest,
                  className: "px-4 py-2 bg-yellow-400 text-[#003C63] rounded-md hover:bg-yellow-500 font-semibold transition-colors text-sm shadow-sm",
                  children: "Duplicar"
                }
              ),
              request.status === "delivered" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: handleWarranty,
                  disabled: !isWarrantyActive(),
                  className: `px-4 py-2 rounded-md font-medium transition-colors text-sm ${isWarrantyActive() ? "bg-green-600 text-white hover:bg-green-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`,
                  title: isWarrantyActive() ? "Garantía activa" : "Garantía vencida (30 días)",
                  children: "Garantía"
                }
              ),
              ((currentUser == null ? void 0 : currentUser.role) === "admin" || (currentUser == null ? void 0 : currentUser.role) === "clinic" && request.status === "pending") && request.status !== "cancelled" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => setShowCancelModal(true),
                  className: "px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 font-medium transition-colors text-sm",
                  children: (currentUser == null ? void 0 : currentUser.role) === "clinic" ? "Solicitar Cancelación" : "Cancelar Solicitud"
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4 border-b pb-6 mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-600", children: "Doctor" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-gray-900", children: request.doctor_name || request.doctorName })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-600", children: "Pie" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-gray-900", children: request.foot_side || request.footSide })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-600", children: "Talla" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-gray-900", children: request.shoe_size || request.shoeSize })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-600", children: "Estado" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-block px-3 py-1.5 rounded-full text-xs font-semibold ${request.status === "cancelled" ? "bg-red-100 text-red-800" : request.status === "delivered" ? "bg-green-100 text-green-800" : request.status === "ready" ? "bg-purple-100 text-purple-800" : request.status === "in_production" || request.status === "in_progress" ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-800"}`, children: request.status === "cancelled" ? "Cancelada" : request.status === "delivered" ? "Entregada" : request.status === "ready" ? "Lista para Entregar" : request.status === "in_production" || request.status === "in_progress" ? "En Producción" : "Pendiente" }),
            request.status === "delivered" && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-gray-700 mt-2", children: [
              "Fecha de entrega: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-gray-900", children: deliveredDateValue ? new Date(deliveredDateValue).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" }) : "No registrada" })
            ] })
          ] })
        ] }),
        request.status === "cancelled" && request.cancel_reason && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-l-4 border-red-500 bg-red-50 p-4 mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-red-900 mb-1", children: "Motivo de Cancelación" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-red-800", children: request.cancel_reason })
        ] }),
        request.observations && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b pb-6 mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold text-gray-900 mb-3", children: "Observaciones" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-700", children: request.observations })
        ] }),
        Object.entries(specs).filter(([k2, v2]) => {
          if (!v2 || typeof v2 !== "object") return false;
          if (k2 === "elevacionAL") {
            return v2.izqSelected && v2.izqMm || v2.derSelected && v2.derMm;
          }
          const hasRealValue = (val) => {
            if (val === null || val === void 0 || val === false || val === "") return false;
            if (typeof val === "object") {
              return Object.values(val).some((v22) => v22 !== null && v22 !== void 0 && v22 !== "" && v22 !== false);
            }
            return true;
          };
          return hasRealValue(v2.izq) || hasRealValue(v2.der);
        }).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b pb-6 mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold text-gray-900 mb-3", children: "Especificaciones de Cuñas y Alzas" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: Object.entries(specs).filter(([k2, v2]) => {
            if (!v2 || typeof v2 !== "object") return false;
            if (k2 === "elevacionAL") {
              return v2.izqSelected && v2.izqMm || v2.derSelected && v2.derMm;
            }
            const hasRealValue = (val) => {
              if (val === null || val === void 0 || val === false || val === "") return false;
              if (typeof val === "object") {
                return Object.values(val).some((v22) => v22 !== null && v22 !== void 0 && v22 !== "" && v22 !== false);
              }
              return true;
            };
            return hasRealValue(v2.izq) || hasRealValue(v2.der);
          }).map(([k2, v2]) => renderSpec(k2, v2)) })
        ] }),
        (Array.isArray(request.files) ? request.files.length > 0 : JSON.parse(request.files || "[]").length > 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold text-gray-900 mb-3", children: "Adjuntos" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: (Array.isArray(request.files) ? request.files : JSON.parse(request.files || "[]")).map((file, idx) => {
            const name = typeof file === "string" ? file : file.name || "Archivo";
            const url = typeof file === "object" ? file.url || file.path || "" : "";
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 p-2 bg-gray-50 rounded", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5 text-gray-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }),
              url ? /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: url, download: true, className: "text-sm text-blue-600 hover:text-blue-800 underline", children: name }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-gray-700", children: [
                name,
                " (solo nombre, sin archivo)"
              ] })
            ] }, idx);
          }) })
        ] })
      ] })
    ] }),
    showCancelModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-lg p-6 max-w-md w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold mb-4 text-[#003C63]", children: "⚠️ Cancelar y Eliminar Solicitud" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 p-4 bg-red-50 border border-red-200 rounded-md", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-red-800 font-semibold mb-2", children: "¡ADVERTENCIA!" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-red-700 text-sm mb-2", children: [
          "Esta acción es ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "irreversible" }),
          " y eliminará permanentemente:"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-red-700 text-sm list-disc list-inside space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "La solicitud completa del sistema" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Todos los archivos adjuntos" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Toda la información asociada" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600 mb-3 text-sm font-medium", children: "Por favor proporciona el motivo de cancelación:" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "textarea",
        {
          value: cancelReason,
          onChange: (e2) => setCancelReason(e2.target.value),
          placeholder: "Ejemplo: Error en los datos del paciente, solicitud duplicada, ya no se requiere el servicio...",
          className: "w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 mb-4",
          rows: "4"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: handleCancelRequest,
            disabled: !cancelReason.trim(),
            className: "flex-1 bg-red-600 text-white py-2.5 rounded-md font-medium hover:bg-red-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed",
            children: "Sí, Eliminar Solicitud"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => {
              setShowCancelModal(false);
              setCancelReason("");
            },
            className: "flex-1 bg-white border border-gray-300 text-gray-700 py-2.5 rounded-md font-medium hover:bg-gray-50 transition",
            children: "No, Mantener"
          }
        )
      ] })
    ] }) })
  ] });
}
function InviteAccept() {
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get("token");
  const [token, setToken] = reactExports.useState(tokenFromUrl || "");
  const [email, setEmail] = reactExports.useState("");
  const [role, setRole] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [message, setMessage] = reactExports.useState("");
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    if (token) {
      (async () => {
        try {
          const res = await apiFetch(`/api/auth/invite/${token}`);
          if (res.ok) {
            const data = await res.json();
            setEmail(data.email);
            setRole(data.role);
          } else {
            const err = await res.json();
            setMessage(err.error || "Invitación inválida");
          }
        } catch (e2) {
          setMessage("Error validando invitación");
        }
      })();
    }
  }, [token]);
  const submit = async () => {
    if (!token || !password) return setMessage("Token y contraseña son requeridos");
    try {
      setLoading(true);
      const res = await apiFetch("/api/auth/invite/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Cuenta creada. Ahora puedes iniciar sesión.");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setMessage(data.error || "Error aceptando invitación");
      }
    } catch (e2) {
      console.error(e2);
      setMessage("Error de red");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-[#F4F6F8] p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md w-full bg-white rounded-xl shadow p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold mb-4", children: "Aceptar Invitación" }),
    message && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-3 text-sm text-red-600", children: message }),
    email && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 text-sm text-gray-700", children: [
      "Registrando: ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: email }),
      " — rol: ",
      role
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      !tokenFromUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: token, onChange: (e2) => setToken(e2.target.value), placeholder: "Token de invitación", className: "w-full px-3 py-2 border rounded" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", value: password, onChange: (e2) => setPassword(e2.target.value), placeholder: "Nueva contraseña", className: "w-full px-3 py-2 border rounded" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: submit, disabled: loading, className: "w-full bg-[#0066A4] text-white py-2 rounded", children: loading ? "Procesando..." : "Establecer contraseña" })
    ] })
  ] }) });
}
function ForcePasswordChange() {
  const { currentUser, logout } = useAuth();
  const [currentPassword, setCurrentPassword] = reactExports.useState("");
  const [newPassword, setNewPassword] = reactExports.useState("");
  const [confirmPassword, setConfirmPassword] = reactExports.useState("");
  const [error, setError] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const handleSubmit = async (e2) => {
    e2.preventDefault();
    setError("");
    if (!currentPassword) {
      setError("Ingrese su contraseña actual");
      return;
    }
    if (newPassword.length < 6) {
      setError("La nueva contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: currentUser.email,
          currentPassword,
          newPassword
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al cambiar contraseña");
      alert("Contraseña actualizada. Inicie sesión nuevamente con su nueva contraseña.");
      logout();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gradient-to-br from-[#0066A4] via-[#005889] to-[#003C63] flex items-center justify-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-3xl shadow-2xl w-full max-w-md p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/lucvan-logo-web.png", alt: "Lucván LATAM", className: "h-16 mx-auto mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-[#003C63]", children: "Cambio de contraseña requerido" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[#333333] mt-2", children: [
        "Usuario: ",
        currentUser == null ? void 0 : currentUser.email
      ] })
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4", children: error }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-semibold text-[#003C63] mb-2", children: "Contraseña actual" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "password",
            value: currentPassword,
            onChange: (e2) => setCurrentPassword(e2.target.value),
            className: "w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0066A4] focus:border-[#0066A4] transition-all",
            placeholder: "Ingrese su contraseña actual",
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-semibold text-[#003C63] mb-2", children: "Nueva contraseña" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "password",
            value: newPassword,
            onChange: (e2) => setNewPassword(e2.target.value),
            className: "w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0066A4] focus:border-[#0066A4] transition-all",
            placeholder: "Nueva contraseña (mínimo 6 caracteres)",
            required: true,
            minLength: 6
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-semibold text-[#003C63] mb-2", children: "Confirmar contraseña" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "password",
            value: confirmPassword,
            onChange: (e2) => setConfirmPassword(e2.target.value),
            className: "w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0066A4] focus:border-[#0066A4] transition-all",
            placeholder: "Confirme su nueva contraseña",
            required: true,
            minLength: 6
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "submit",
          disabled: loading,
          className: "w-full bg-[#F5C400] text-[#003C63] py-3 px-6 rounded-full font-bold hover:bg-[#ffd933] transition-all shadow-[0_12px_24px_-10px_rgba(0,60,99,0.25)] hover:shadow-[0_16px_32px_-12px_rgba(0,60,99,0.3)] hover:-translate-y-0.5 disabled:opacity-50",
          children: loading ? "Cambiando contraseña..." : "Cambiar contraseña"
        }
      )
    ] })
  ] }) });
}
function ForgotPassword() {
  const [email, setEmail] = reactExports.useState("");
  const [message, setMessage] = reactExports.useState("");
  const [error, setError] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const handleSubmit = async (e2) => {
    e2.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    try {
      const data = await apiFetch("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email })
      });
      setMessage(data.message || "Revisa tu correo para instrucciones de reseteo");
      setEmail("");
    } catch (err) {
      setError(err.message || "Error al enviar el correo");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-lg shadow-xl p-8 w-full max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-gray-800", children: "¿Olvidaste tu contraseña?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600 mt-2", children: "Ingresa tu correo electrónico y te enviaremos instrucciones para resetear tu contraseña" })
    ] }),
    message && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg", children: message }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg", children: error }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Correo electrónico" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "email",
            value: email,
            onChange: (e2) => setEmail(e2.target.value),
            required: true,
            placeholder: "tu@email.com",
            className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "submit",
          disabled: loading,
          className: "w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors",
          children: loading ? "Enviando..." : "Enviar instrucciones"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/login", className: "text-blue-600 hover:text-blue-700 text-sm font-medium", children: "← Volver al inicio de sesión" }) })
  ] }) });
}
function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [password, setPassword] = reactExports.useState("");
  const [confirmPassword, setConfirmPassword] = reactExports.useState("");
  const [message, setMessage] = reactExports.useState("");
  const [error, setError] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!token) {
      setError("Token inválido. Por favor solicita un nuevo enlace de reseteo.");
    }
  }, [token]);
  const handleSubmit = async (e2) => {
    e2.preventDefault();
    setMessage("");
    setError("");
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    setLoading(true);
    try {
      const data = await apiFetch("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password })
      });
      setMessage(data.message || "Contraseña actualizada exitosamente");
      setTimeout(() => {
        navigate("/login");
      }, 2e3);
    } catch (err) {
      setError(err.message || "Error al resetear la contraseña");
    } finally {
      setLoading(false);
    }
  };
  if (!token) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white rounded-lg shadow-xl p-8 w-full max-w-md", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-red-500 text-5xl mb-4", children: "⚠️" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-gray-800 mb-4", children: "Token Inválido" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600 mb-6", children: "El enlace de reseteo es inválido o ha expirado." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/forgot-password",
          className: "inline-block bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 font-medium",
          children: "Solicitar nuevo enlace"
        }
      )
    ] }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-lg shadow-xl p-8 w-full max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-gray-800", children: "Crear Nueva Contraseña" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600 mt-2", children: "Ingresa tu nueva contraseña" })
    ] }),
    message && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg", children: [
      message,
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-2", children: "Redirigiendo al login..." })
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg", children: error }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Nueva Contraseña" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "password",
            value: password,
            onChange: (e2) => setPassword(e2.target.value),
            required: true,
            minLength: 6,
            placeholder: "Mínimo 6 caracteres",
            className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Confirmar Contraseña" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "password",
            value: confirmPassword,
            onChange: (e2) => setConfirmPassword(e2.target.value),
            required: true,
            minLength: 6,
            placeholder: "Repite tu contraseña",
            className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "submit",
          disabled: loading || !!message,
          className: "w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors",
          children: loading ? "Actualizando..." : "Cambiar Contraseña"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/login", className: "text-blue-600 hover:text-blue-700 text-sm font-medium", children: "← Volver al inicio de sesión" }) })
  ] }) });
}
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl", children: "Cargando..." }) });
  }
  if (!currentUser) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/login", replace: true });
  }
  if (currentUser.mustChangePassword && location.pathname !== "/change-password") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/change-password", replace: true });
  }
  if (allowedRoles) {
    const role = currentUser.role;
    const isAllowed = allowedRoles.includes(role) || role === "production" && allowedRoles.includes("workshop") || role === "workshop" && allowedRoles.includes("production");
    if (!isAllowed) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/", replace: true });
    }
  }
  return children;
};
function AppRouter() {
  const { currentUser } = useAuth();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Routes, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Route,
      {
        path: "/login",
        element: currentUser ? /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/", replace: true }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Login, {})
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/forgot-password", element: /* @__PURE__ */ jsxRuntimeExports.jsx(ForgotPassword, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/reset-password", element: /* @__PURE__ */ jsxRuntimeExports.jsx(ResetPassword, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Route,
      {
        path: "/",
        element: /* @__PURE__ */ jsxRuntimeExports.jsxs(ProtectedRoute, { children: [
          (currentUser == null ? void 0 : currentUser.role) === "admin" && /* @__PURE__ */ jsxRuntimeExports.jsx(AdminDashboard, {}),
          (currentUser == null ? void 0 : currentUser.role) === "clinic" && /* @__PURE__ */ jsxRuntimeExports.jsx(ClinicDashboard, {}),
          ((currentUser == null ? void 0 : currentUser.role) === "workshop" || (currentUser == null ? void 0 : currentUser.role) === "production") && /* @__PURE__ */ jsxRuntimeExports.jsx(ProductionDashboard, {})
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Route,
      {
        path: "/change-password",
        element: /* @__PURE__ */ jsxRuntimeExports.jsx(ProtectedRoute, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ForcePasswordChange, {}) })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Route,
      {
        path: "/admin",
        element: /* @__PURE__ */ jsxRuntimeExports.jsx(ProtectedRoute, { allowedRoles: ["admin"], children: /* @__PURE__ */ jsxRuntimeExports.jsx(AdminDashboard, {}) })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Route,
      {
        path: "/admin/users",
        element: /* @__PURE__ */ jsxRuntimeExports.jsx(ProtectedRoute, { allowedRoles: ["admin"], children: /* @__PURE__ */ jsxRuntimeExports.jsx(UsersManagement, {}) })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Route,
      {
        path: "/clinic",
        element: /* @__PURE__ */ jsxRuntimeExports.jsx(ProtectedRoute, { allowedRoles: ["admin", "clinic"], children: /* @__PURE__ */ jsxRuntimeExports.jsx(ClinicDashboard, {}) })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Route,
      {
        path: "/production",
        element: /* @__PURE__ */ jsxRuntimeExports.jsx(ProtectedRoute, { allowedRoles: ["admin", "workshop", "production"], children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProductionDashboard, {}) })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Route,
      {
        path: "/ticket/:id",
        element: /* @__PURE__ */ jsxRuntimeExports.jsx(ProtectedRoute, { allowedRoles: ["admin", "workshop", "production"], children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProductionTicketDetail, {}) })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Route,
      {
        path: "/patient/:id",
        element: /* @__PURE__ */ jsxRuntimeExports.jsx(ProtectedRoute, { allowedRoles: ["admin", "clinic"], children: /* @__PURE__ */ jsxRuntimeExports.jsx(PatientDetail, {}) })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Route,
      {
        path: "/request/new/:patientId",
        element: /* @__PURE__ */ jsxRuntimeExports.jsx(ProtectedRoute, { allowedRoles: ["admin", "clinic"], children: /* @__PURE__ */ jsxRuntimeExports.jsx(NewRequest, {}) })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Route,
      {
        path: "/request/:id",
        element: /* @__PURE__ */ jsxRuntimeExports.jsx(ProtectedRoute, { allowedRoles: ["admin", "clinic"], children: /* @__PURE__ */ jsxRuntimeExports.jsx(RequestDetail, {}) })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/invite/accept", element: /* @__PURE__ */ jsxRuntimeExports.jsx(InviteAccept, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "*", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/", replace: true }) })
  ] });
}
function App() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(BrowserRouter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AuthProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AppRouter, {}) }) });
}
client.createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsxRuntimeExports.jsx(React$1.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) })
);
//# sourceMappingURL=index-C-HjYfUC.js.map
