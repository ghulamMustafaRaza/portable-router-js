// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
require = (function (modules, cache, entry) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof require === "function" && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof require === "function" && require;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }
      
      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module;

      modules[name][0].call(module.exports, localRequire, module, module.exports);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module() {
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  // Override the current require with this new one
  return newRequire;
})({3:[function(require,module,exports) {
"use strict";
exports.__esModule = true;
var default_1 = /** @class */ (function () {
    function default_1(config) {
        this.route = config.route;
        this.fn = config.fn;
        this.scope = config.scope ? config.scope : null;
        this.rules = config.rules ? config.rules : {};
        this.routeArguments = Array();
        this.optionalRouteArguments = Array();
        //Create the route arguments if they exist
        this.routeParts = this.route.split("/");
        for (var i = 0, j = this.routeParts.length; i < j; i++) {
            var rPart = this.routeParts[i];
            //See if there are pseudo macro's in the route
            //will fetch all {id} parts of the route. So the manditory parts
            if (rPart.substr(0, 1) == "{" && rPart.substr(rPart.length - 1, 1) == "}") {
                var rKey = rPart.substr(1, rPart.length - 2);
                this.optionalRouteArguments.push(rKey);
            }
            //will fetch all :id: parts of the route. So the optional parts
            if (rPart.substr(0, 1) == ":") {
                var rKey = rPart.substr(1, rPart.length - 2);
                this.routeArguments.push(rKey);
            }
        }
    }
    default_1.prototype.matches = function (route) {
        //We'd like to examen every individual part of the incoming route
        var incomingRouteParts = route.split("/");
        //This might seem strange, but assuming the route is correct
        //makes the logic easier, than assuming it is wrong.    
        var routeMatches = true;
        //if the route is shorter than the route we want to check it against we can immidiatly stop.
        if (this.routeParts.slice(0, 2).indexOf('*') !== -1)
            routeMatches = true;
        else if (incomingRouteParts.length < this.routeParts.length - this.optionalRouteArguments.length) {
            routeMatches = false;
            // console.log(1)
        }
        else {
            // console.log(2)
            var a = incomingRouteParts;
            for (var i = 0, j = a.length; i < j && routeMatches; i++) {
                //Lets cache the variables, to prevent variable lookups by the javascript engine
                var iRp = a[i]; //current incoming Route Part
                var rP = this.routeParts[i]; //current routePart                     
                if (typeof rP == 'undefined') {
                    // console.log(20)
                    //The route almost certainly doesn't match it's longer than the route to check against
                    routeMatches = false;
                }
                else {
                    // console.log(21)
                    var cP0 = rP.substr(0, 1); //char at postion 0
                    var cPe = rP.substr(rP.length - 1, 1); //char at last postion                   
                    if ((cP0 != "{" && cP0 != ":") && (cPe != "}")) {
                        // console.log(210, cP0, cPe, rP, iRp, incomingRouteParts)
                        //This part of the route to check against is not  a pseudo macro, so it has to match exactly
                        if (iRp != rP) {
                            routeMatches = false;
                        }
                    }
                    else {
                        // console.log(211)
                        //Since this is a pseudo macro and there was a value at this place. The route is correct.
                        routeMatches = true;
                    }
                }
            }
        }
        // console.log(routeMatches, route, this)
        return routeMatches;
    };
    default_1.prototype.getArgumentsValues = function (route) {
        //Split the incoming route
        var rRouteParts = route.split("/");
        //Create an array for the values
        var rObject = new Object();
        for (var i = 0, j = this.routeParts.length; i < j; i++) {
            var rP = this.routeParts[i]; //current routePart
            var cP0 = rP.substr(0, 1); //char at postion 0
            var cPe = rP.substr(rP.length - 1, 1); //char at last postion
            if ((cP0 == "{" && cPe == "}") || cP0 == ":") {
                var key = cP0 == ":" ? rP.substr(1) : rP.substr(1, rP.length - 2);
                // console.log(key, cP0 == ":", rP.substr(1), rP.substr(1, rP.length - 2))
                //if this part of the route was a pseudo macro,
                //either manditory or optional add this to the array
                rObject[key] = rRouteParts[i];
            }
        }
        return rObject;
    };
    return default_1;
}());
exports["default"] = default_1;

},{}],2:[function(require,module,exports) {
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var route_1 = require("./route");
var Base = /** @class */ (function () {
    function Base() {
        var _this = this;
        this.routers = [];
        this.applyRoutes = function (a) { return _this.routers.map(function (router) {
            router.applyRoute(a);
        }); };
        this.addEvent = function () {
            if (_this.routers.length) {
                var links_1 = document.getElementsByClassName('router-link');
                var _loop_1 = function (i) {
                    links_1[i].onclick = function () { return _this.routers[0].changeRoute(links_1[i].href); };
                };
                for (var i = 0; i < links_1.length; i++) {
                    _loop_1(i);
                }
            }
            else
                throw new Error('No Router Spacified');
        };
        window.onpopstate = function (a) {
            _this.applyRoutes(a.target.location.pathname);
        };
        window.onpushstate = function (a) {
            _this.applyRoutes(a.target.location.pathname);
        };
    }
    return Base;
}());
exports.Base = Base;
var default_1 = /** @class */ (function (_super) {
    __extends(default_1, _super);
    function default_1(_a) {
        var routes = _a.routes, appId = _a.appId;
        var _this = _super.call(this) || this;
        _this.routes = new Array();
        _this.app = document.getElementById(appId);
        if (!_this.app) {
            _this.app = document.createElement('div');
            _this.app.id = appId;
            document.body.appendChild(_this.app);
        }
        // console.log(routes)
        routes.map(function (a) {
            _this.registerRoute(a.route, a.render);
        });
        _this.routers.push(_this);
        _this.applyRoute(window.location.pathname);
        _this.addEvent();
        return _this;
    }
    //Here we use a somewhat different style of create the prototype
    //than for the Route prototype. Both ways are valid. 
    //I'm using them mixed here, but It's probably wise not to do that.
    //And stick to a single pattern. Here I'm doing it to show both possibilities
    default_1.prototype.registerRoute = function (route, fn, paramObject) {
        if (paramObject === void 0) { paramObject = { scope: undefined }; }
        //We'll have route and function as named parameters
        //and all the future optional parameters in a single object.
        //Right now we just have scope as a optional parameters
        var scope = paramObject && paramObject.scope || {};
        return this.routes[this.routes.length] = new route_1["default"]({
            route: route,
            fn: fn,
            scope: scope
        });
    };
    default_1.prototype.applyRoute = function (route) {
        //iterate all routes
        var matched = false;
        // console.log(route)
        for (var i = 0, j = this.routes.length; i < j; i++) {
            var sRoute = this.routes[i];
            //match route
            if (sRoute.matches(route)) {
                //if true call callback function with the proper scope
                var html = sRoute.fn.apply(sRoute.scope, [sRoute.getArgumentsValues(route), history, route]);
                this.app.innerHTML = html;
                matched = true;
                break;
            }
        }
        if (!matched) {
            this.app.innerHTML = '<h1>not found</h1>';
            // console.log('nf')
        }
    };
    default_1.prototype.changeRoute = function (r) {
        r = r.split(window.location.origin).filter(function (a) { return a; })[0];
        event.preventDefault();
        this.applyRoutes(r);
        history.pushState({}, r, r);
        this.addEvent();
        return false;
    };
    default_1.prototype.goBack = function () {
        event.preventDefault();
        history.back();
        return false;
    };
    default_1.prototype.goForward = function () {
        event.preventDefault();
        history.forward();
        return false;
    };
    return default_1;
}(Base));
exports["default"] = default_1;

},{"./route":3}],1:[function(require,module,exports) {
"use strict";
exports.__esModule = true;
var router_1 = require("./router");
//We'll create an alias for router in the window object
window["Router"] = router_1["default"];

},{"./router":2}]},{},[1])