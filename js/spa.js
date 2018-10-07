(function ($,ko,videojs,SVG) {
  'use strict';

  $ = $ && $.hasOwnProperty('default') ? $['default'] : $;
  ko = ko && ko.hasOwnProperty('default') ? ko['default'] : ko;
  videojs = videojs && videojs.hasOwnProperty('default') ? videojs['default'] : videojs;
  SVG = SVG && SVG.hasOwnProperty('default') ? SVG['default'] : SVG;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function styleInject(css, ref) {
    if ( ref === void 0 ) ref = {};
    var insertAt = ref.insertAt;

    if (!css || typeof document === 'undefined') { return; }

    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';

    if (insertAt === 'top') {
      if (head.firstChild) {
        head.insertBefore(style, head.firstChild);
      } else {
        head.appendChild(style);
      }
    } else {
      head.appendChild(style);
    }

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  }

  var css = ".bmpp-curtains{background-color:#fff;position:fixed;z-index:1000;top:0;bottom:0;left:0;right:0}.bmpp-uiLayout{display:-webkit-box;display:-ms-flexbox;display:flex;width:100vw;height:100vh}.bmpp-sidePane{-webkit-box-ordinal-group:1;-ms-flex-order:0;order:0;width:14vw;min-width:208px;min-width:13rem;border-left:1px solid rgba(34,36,38,.15);border-right:1px solid rgba(34,36,38,.15);overflow-y:hidden}.bmpp-sidePane_menuItem{padding:1em!important;border-bottom:1px solid rgba(34,36,38,.15);cursor:pointer}.bmpp-sidePane_menuItem-noPadding{padding:0!important}.bmpp-sidePane_searchButton{margin-left:.3em!important}.bmpp-queryMap{margin:-1em 0 0!important;width:100%;height:15em;background-image:url(\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0wIDBoNXY1SDB6Ii8+PHBhdGggZD0iTTAgNWw1LTV6bTYtMUw0IDZ6bS03LTNsMi0yeiIgc3Ryb2tlPSIjODg4Ii8+PC9zdmc+\");background-repeat:repeat}.bmpp-main{display:-webkit-box;display:-ms-flexbox;display:flex;width:100vw;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;-webkit-box-align:stretch;-ms-flex-align:stretch;align-items:stretch;overflow-y:scroll;padding-bottom:3em}.bmpp-resultsOptionsPane,.bmpp-subcorpusPane{width:55em;margin:3em auto auto 6em!important}.bmpp-nearLabelIcon{margin:0;padding:0;position:absolute;right:.2em;top:.8em}.bmpp-resultsPane{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;-webkit-box-align:stretch;-ms-flex-align:stretch;align-items:stretch}.bmpp-resultsPane_video{border-bottom:1px solid rgba(34,36,38,.15);background-color:#eee}.bmpp-resultsPane_results{overflow-y:scroll}.bmpp-queryPane{display:-webkit-box;display:-ms-flexbox;display:flex}.bmpp-query,.bmpp-queryPane{-webkit-box-flex:1;-ms-flex:1 0 auto;flex:1 0 auto}.bmpp-query{max-width:70em;padding:3em 1em 0 0;-webkit-box-ordinal-group:2;-ms-flex-order:1;order:1}.bmpp-queryTree{-webkit-box-ordinal-group:1;-ms-flex-order:0;order:0;width:9em}.bmpp-queryElement{min-height:10em}.bmpp-queryDistance{min-height:4em}";
  styleInject(css);

  var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var page = createCommonjsModule(function (module, exports) {
  (function (global, factory) {
  	module.exports = factory();
  }(commonjsGlobal, (function () {
  var isarray = Array.isArray || function (arr) {
    return Object.prototype.toString.call(arr) == '[object Array]';
  };

  /**
   * Expose `pathToRegexp`.
   */
  var pathToRegexp_1 = pathToRegexp;
  var parse_1 = parse;
  var compile_1 = compile;
  var tokensToFunction_1 = tokensToFunction;
  var tokensToRegExp_1 = tokensToRegExp;

  /**
   * The main path matching regexp utility.
   *
   * @type {RegExp}
   */
  var PATH_REGEXP = new RegExp([
    // Match escaped characters that would otherwise appear in future matches.
    // This allows the user to escape special characters that won't transform.
    '(\\\\.)',
    // Match Express-style parameters and un-named parameters with a prefix
    // and optional suffixes. Matches appear as:
    //
    // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
    // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
    // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
    '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^()])+)\\))?|\\(((?:\\\\.|[^()])+)\\))([+*?])?|(\\*))'
  ].join('|'), 'g');

  /**
   * Parse a string for the raw tokens.
   *
   * @param  {String} str
   * @return {Array}
   */
  function parse (str) {
    var tokens = [];
    var key = 0;
    var index = 0;
    var path = '';
    var res;

    while ((res = PATH_REGEXP.exec(str)) != null) {
      var m = res[0];
      var escaped = res[1];
      var offset = res.index;
      path += str.slice(index, offset);
      index = offset + m.length;

      // Ignore already escaped sequences.
      if (escaped) {
        path += escaped[1];
        continue
      }

      // Push the current path onto the tokens.
      if (path) {
        tokens.push(path);
        path = '';
      }

      var prefix = res[2];
      var name = res[3];
      var capture = res[4];
      var group = res[5];
      var suffix = res[6];
      var asterisk = res[7];

      var repeat = suffix === '+' || suffix === '*';
      var optional = suffix === '?' || suffix === '*';
      var delimiter = prefix || '/';
      var pattern = capture || group || (asterisk ? '.*' : '[^' + delimiter + ']+?');

      tokens.push({
        name: name || key++,
        prefix: prefix || '',
        delimiter: delimiter,
        optional: optional,
        repeat: repeat,
        pattern: escapeGroup(pattern)
      });
    }

    // Match any characters still remaining.
    if (index < str.length) {
      path += str.substr(index);
    }

    // If the path exists, push it onto the end.
    if (path) {
      tokens.push(path);
    }

    return tokens
  }

  /**
   * Compile a string to a template function for the path.
   *
   * @param  {String}   str
   * @return {Function}
   */
  function compile (str) {
    return tokensToFunction(parse(str))
  }

  /**
   * Expose a method for transforming tokens into the path function.
   */
  function tokensToFunction (tokens) {
    // Compile all the tokens into regexps.
    var matches = new Array(tokens.length);

    // Compile all the patterns before compilation.
    for (var i = 0; i < tokens.length; i++) {
      if (typeof tokens[i] === 'object') {
        matches[i] = new RegExp('^' + tokens[i].pattern + '$');
      }
    }

    return function (obj) {
      var path = '';
      var data = obj || {};

      for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i];

        if (typeof token === 'string') {
          path += token;

          continue
        }

        var value = data[token.name];
        var segment;

        if (value == null) {
          if (token.optional) {
            continue
          } else {
            throw new TypeError('Expected "' + token.name + '" to be defined')
          }
        }

        if (isarray(value)) {
          if (!token.repeat) {
            throw new TypeError('Expected "' + token.name + '" to not repeat, but received "' + value + '"')
          }

          if (value.length === 0) {
            if (token.optional) {
              continue
            } else {
              throw new TypeError('Expected "' + token.name + '" to not be empty')
            }
          }

          for (var j = 0; j < value.length; j++) {
            segment = encodeURIComponent(value[j]);

            if (!matches[i].test(segment)) {
              throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
            }

            path += (j === 0 ? token.prefix : token.delimiter) + segment;
          }

          continue
        }

        segment = encodeURIComponent(value);

        if (!matches[i].test(segment)) {
          throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
        }

        path += token.prefix + segment;
      }

      return path
    }
  }

  /**
   * Escape a regular expression string.
   *
   * @param  {String} str
   * @return {String}
   */
  function escapeString (str) {
    return str.replace(/([.+*?=^!:${}()[\]|\/])/g, '\\$1')
  }

  /**
   * Escape the capturing group by escaping special characters and meaning.
   *
   * @param  {String} group
   * @return {String}
   */
  function escapeGroup (group) {
    return group.replace(/([=!:$\/()])/g, '\\$1')
  }

  /**
   * Attach the keys as a property of the regexp.
   *
   * @param  {RegExp} re
   * @param  {Array}  keys
   * @return {RegExp}
   */
  function attachKeys (re, keys) {
    re.keys = keys;
    return re
  }

  /**
   * Get the flags for a regexp from the options.
   *
   * @param  {Object} options
   * @return {String}
   */
  function flags (options) {
    return options.sensitive ? '' : 'i'
  }

  /**
   * Pull out keys from a regexp.
   *
   * @param  {RegExp} path
   * @param  {Array}  keys
   * @return {RegExp}
   */
  function regexpToRegexp (path, keys) {
    // Use a negative lookahead to match only capturing groups.
    var groups = path.source.match(/\((?!\?)/g);

    if (groups) {
      for (var i = 0; i < groups.length; i++) {
        keys.push({
          name: i,
          prefix: null,
          delimiter: null,
          optional: false,
          repeat: false,
          pattern: null
        });
      }
    }

    return attachKeys(path, keys)
  }

  /**
   * Transform an array into a regexp.
   *
   * @param  {Array}  path
   * @param  {Array}  keys
   * @param  {Object} options
   * @return {RegExp}
   */
  function arrayToRegexp (path, keys, options) {
    var parts = [];

    for (var i = 0; i < path.length; i++) {
      parts.push(pathToRegexp(path[i], keys, options).source);
    }

    var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));

    return attachKeys(regexp, keys)
  }

  /**
   * Create a path regexp from string input.
   *
   * @param  {String} path
   * @param  {Array}  keys
   * @param  {Object} options
   * @return {RegExp}
   */
  function stringToRegexp (path, keys, options) {
    var tokens = parse(path);
    var re = tokensToRegExp(tokens, options);

    // Attach keys back to the regexp.
    for (var i = 0; i < tokens.length; i++) {
      if (typeof tokens[i] !== 'string') {
        keys.push(tokens[i]);
      }
    }

    return attachKeys(re, keys)
  }

  /**
   * Expose a function for taking tokens and returning a RegExp.
   *
   * @param  {Array}  tokens
   * @param  {Array}  keys
   * @param  {Object} options
   * @return {RegExp}
   */
  function tokensToRegExp (tokens, options) {
    options = options || {};

    var strict = options.strict;
    var end = options.end !== false;
    var route = '';
    var lastToken = tokens[tokens.length - 1];
    var endsWithSlash = typeof lastToken === 'string' && /\/$/.test(lastToken);

    // Iterate over the tokens and create our regexp string.
    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];

      if (typeof token === 'string') {
        route += escapeString(token);
      } else {
        var prefix = escapeString(token.prefix);
        var capture = token.pattern;

        if (token.repeat) {
          capture += '(?:' + prefix + capture + ')*';
        }

        if (token.optional) {
          if (prefix) {
            capture = '(?:' + prefix + '(' + capture + '))?';
          } else {
            capture = '(' + capture + ')?';
          }
        } else {
          capture = prefix + '(' + capture + ')';
        }

        route += capture;
      }
    }

    // In non-strict mode we allow a slash at the end of match. If the path to
    // match already ends with a slash, we remove it for consistency. The slash
    // is valid at the end of a path match, not in the middle. This is important
    // in non-ending mode, where "/test/" shouldn't match "/test//route".
    if (!strict) {
      route = (endsWithSlash ? route.slice(0, -2) : route) + '(?:\\/(?=$))?';
    }

    if (end) {
      route += '$';
    } else {
      // In non-ending mode, we need the capturing groups to match as much as
      // possible by using a positive lookahead to the end or next path segment.
      route += strict && endsWithSlash ? '' : '(?=\\/|$)';
    }

    return new RegExp('^' + route, flags(options))
  }

  /**
   * Normalize the given path string, returning a regular expression.
   *
   * An empty array can be passed in for the keys, which will hold the
   * placeholder key descriptions. For example, using `/user/:id`, `keys` will
   * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
   *
   * @param  {(String|RegExp|Array)} path
   * @param  {Array}                 [keys]
   * @param  {Object}                [options]
   * @return {RegExp}
   */
  function pathToRegexp (path, keys, options) {
    keys = keys || [];

    if (!isarray(keys)) {
      options = keys;
      keys = [];
    } else if (!options) {
      options = {};
    }

    if (path instanceof RegExp) {
      return regexpToRegexp(path, keys, options)
    }

    if (isarray(path)) {
      return arrayToRegexp(path, keys, options)
    }

    return stringToRegexp(path, keys, options)
  }

  pathToRegexp_1.parse = parse_1;
  pathToRegexp_1.compile = compile_1;
  pathToRegexp_1.tokensToFunction = tokensToFunction_1;
  pathToRegexp_1.tokensToRegExp = tokensToRegExp_1;

  /**
     * Module dependencies.
     */

    

    /**
     * Short-cuts for global-object checks
     */

    var hasDocument = ('undefined' !== typeof document);
    var hasWindow = ('undefined' !== typeof window);
    var hasHistory = ('undefined' !== typeof history);
    var hasProcess = typeof process !== 'undefined';

    /**
     * Detect click event
     */
    var clickEvent = hasDocument && document.ontouchstart ? 'touchstart' : 'click';

    /**
     * To work properly with the URL
     * history.location generated polyfill in https://github.com/devote/HTML5-History-API
     */

    var isLocation = hasWindow && !!(window.history.location || window.location);

    /**
     * The page instance
     * @api private
     */
    function Page(options) {
      // public things
      this.callbacks = [];
      this.exits = [];
      this.current = '';
      this.len = 0;

      // private things
      this._dispatch = true;
      this._decodeURLComponents = true;
      this._base = '';
      this._strict = false;
      this._running = false;
      this._hashbang = false;

      // bound functions
      this._onclick = this._onclick.bind(this);
      this._onpopstate = this._onpopstate.bind(this);

      this.configure(options);
    }

    /**
     * Configure the instance of page. This can be called multiple times.
     *
     * @param {Object} options
     * @api public
     */

    Page.prototype.configure = function(options) {
      var opts = options || {};

      this._window = opts.window || (hasWindow && window);
      this._dispatch = opts.dispatch !== false;
      this._decodeURLComponents = opts.decodeURLComponents !== false;
      this._popstate = opts.popstate !== false && hasWindow;
      this._click = opts.click !== false && hasDocument;
      this._hashbang = !!opts.hashbang;

      var _window = this._window;
      if(this._popstate) {
        _window.addEventListener('popstate', this._onpopstate, false);
      } else if(hasWindow) {
        _window.removeEventListener('popstate', this._onpopstate, false);
      }

      if (this._click) {
        _window.document.addEventListener(clickEvent, this._onclick, false);
      } else if(hasDocument) {
        _window.document.removeEventListener(clickEvent, this._onclick, false);
      }

      if(this._hashbang && hasWindow && !hasHistory) {
        _window.addEventListener('hashchange', this._onpopstate, false);
      } else if(hasWindow) {
        _window.removeEventListener('hashchange', this._onpopstate, false);
      }
    };

    /**
     * Get or set basepath to `path`.
     *
     * @param {string} path
     * @api public
     */

    Page.prototype.base = function(path) {
      if (0 === arguments.length) return this._base;
      this._base = path;
    };

    /**
     * Gets the `base`, which depends on whether we are using History or
     * hashbang routing.

     * @api private
     */
    Page.prototype._getBase = function() {
      var base = this._base;
      if(!!base) return base;
      var loc = hasWindow && this._window && this._window.location;
      return (hasWindow && this._hashbang && loc && loc.protocol === 'file:') ? loc.pathname : base;
    };

    /**
     * Get or set strict path matching to `enable`
     *
     * @param {boolean} enable
     * @api public
     */

    Page.prototype.strict = function(enable) {
      if (0 === arguments.length) return this._strict;
      this._strict = enable;
    };


    /**
     * Bind with the given `options`.
     *
     * Options:
     *
     *    - `click` bind to click events [true]
     *    - `popstate` bind to popstate [true]
     *    - `dispatch` perform initial dispatch [true]
     *
     * @param {Object} options
     * @api public
     */

    Page.prototype.start = function(options) {
      this.configure(options);

      if (!this._dispatch) return;
      this._running = true;

      var url;
      if(isLocation) {
        var window = this._window;
        var loc = window.location;

        if(this._hashbang && ~loc.hash.indexOf('#!')) {
          url = loc.hash.substr(2) + loc.search;
        } else if (this._hashbang) {
          url = loc.search + loc.hash;
        } else {
          url = loc.pathname + loc.search + loc.hash;
        }
      }

      this.replace(url, null, true, this._dispatch);
    };

    /**
     * Unbind click and popstate event handlers.
     *
     * @api public
     */

    Page.prototype.stop = function() {
      if (!this._running) return;
      this.current = '';
      this.len = 0;
      this._running = false;

      var window = this._window;
      hasDocument && window.document.removeEventListener(clickEvent, this._onclick, false);
      hasWindow && window.removeEventListener('popstate', this._onpopstate, false);
      hasWindow && window.removeEventListener('hashchange', this._onpopstate, false);
    };

    /**
     * Show `path` with optional `state` object.
     *
     * @param {string} path
     * @param {Object=} state
     * @param {boolean=} dispatch
     * @param {boolean=} push
     * @return {!Context}
     * @api public
     */

    Page.prototype.show = function(path, state, dispatch, push) {
      var ctx = new Context(path, state, this),
        prev = this.prevContext;
      this.prevContext = ctx;
      this.current = ctx.path;
      if (this._dispatch) this.dispatch(ctx, prev);
      if (false !== ctx.handled && false !== push) ctx.pushState();
      return ctx;
    };

    /**
     * Goes back in the history
     * Back should always let the current route push state and then go back.
     *
     * @param {string} path - fallback path to go back if no more history exists, if undefined defaults to page.base
     * @param {Object=} state
     * @api public
     */

    Page.prototype.back = function(path, state) {
      var page = this;
      if (this.len > 0) {
        var window = this._window;
        // this may need more testing to see if all browsers
        // wait for the next tick to go back in history
        hasHistory && window.history.back();
        this.len--;
      } else if (path) {
        setTimeout(function() {
          page.show(path, state);
        });
      } else {
        setTimeout(function() {
          page.show(page._getBase(), state);
        });
      }
    };

    /**
     * Register route to redirect from one path to other
     * or just redirect to another route
     *
     * @param {string} from - if param 'to' is undefined redirects to 'from'
     * @param {string=} to
     * @api public
     */
    Page.prototype.redirect = function(from, to) {
      var inst = this;

      // Define route from a path to another
      if ('string' === typeof from && 'string' === typeof to) {
        page.call(this, from, function(e) {
          setTimeout(function() {
            inst.replace(/** @type {!string} */ (to));
          }, 0);
        });
      }

      // Wait for the push state and replace it with another
      if ('string' === typeof from && 'undefined' === typeof to) {
        setTimeout(function() {
          inst.replace(from);
        }, 0);
      }
    };

    /**
     * Replace `path` with optional `state` object.
     *
     * @param {string} path
     * @param {Object=} state
     * @param {boolean=} init
     * @param {boolean=} dispatch
     * @return {!Context}
     * @api public
     */


    Page.prototype.replace = function(path, state, init, dispatch) {
      var ctx = new Context(path, state, this),
        prev = this.prevContext;
      this.prevContext = ctx;
      this.current = ctx.path;
      ctx.init = init;
      ctx.save(); // save before dispatching, which may redirect
      if (false !== dispatch) this.dispatch(ctx, prev);
      return ctx;
    };

    /**
     * Dispatch the given `ctx`.
     *
     * @param {Context} ctx
     * @api private
     */

    Page.prototype.dispatch = function(ctx, prev) {
      var i = 0, j = 0, page = this;

      function nextExit() {
        var fn = page.exits[j++];
        if (!fn) return nextEnter();
        fn(prev, nextExit);
      }

      function nextEnter() {
        var fn = page.callbacks[i++];

        if (ctx.path !== page.current) {
          ctx.handled = false;
          return;
        }
        if (!fn) return unhandled.call(page, ctx);
        fn(ctx, nextEnter);
      }

      if (prev) {
        nextExit();
      } else {
        nextEnter();
      }
    };

    /**
     * Register an exit route on `path` with
     * callback `fn()`, which will be called
     * on the previous context when a new
     * page is visited.
     */
    Page.prototype.exit = function(path, fn) {
      if (typeof path === 'function') {
        return this.exit('*', path);
      }

      var route = new Route(path, null, this);
      for (var i = 1; i < arguments.length; ++i) {
        this.exits.push(route.middleware(arguments[i]));
      }
    };

    /**
     * Handle "click" events.
     */

    /* jshint +W054 */
    Page.prototype._onclick = function(e) {
      if (1 !== this._which(e)) return;

      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
      if (e.defaultPrevented) return;

      // ensure link
      // use shadow dom when available if not, fall back to composedPath()
      // for browsers that only have shady
      var el = e.target;
      var eventPath = e.path || (e.composedPath ? e.composedPath() : null);

      if(eventPath) {
        for (var i = 0; i < eventPath.length; i++) {
          if (!eventPath[i].nodeName) continue;
          if (eventPath[i].nodeName.toUpperCase() !== 'A') continue;
          if (!eventPath[i].href) continue;

          el = eventPath[i];
          break;
        }
      }

      // continue ensure link
      // el.nodeName for svg links are 'a' instead of 'A'
      while (el && 'A' !== el.nodeName.toUpperCase()) el = el.parentNode;
      if (!el || 'A' !== el.nodeName.toUpperCase()) return;

      // check if link is inside an svg
      // in this case, both href and target are always inside an object
      var svg = (typeof el.href === 'object') && el.href.constructor.name === 'SVGAnimatedString';

      // Ignore if tag has
      // 1. "download" attribute
      // 2. rel="external" attribute
      if (el.hasAttribute('download') || el.getAttribute('rel') === 'external') return;

      // ensure non-hash for the same path
      var link = el.getAttribute('href');
      if(!this._hashbang && this._samePath(el) && (el.hash || '#' === link)) return;

      // Check for mailto: in the href
      if (link && link.indexOf('mailto:') > -1) return;

      // check target
      // svg target is an object and its desired value is in .baseVal property
      if (svg ? el.target.baseVal : el.target) return;

      // x-origin
      // note: svg links that are not relative don't call click events (and skip page.js)
      // consequently, all svg links tested inside page.js are relative and in the same origin
      if (!svg && !this.sameOrigin(el.href)) return;

      // rebuild path
      // There aren't .pathname and .search properties in svg links, so we use href
      // Also, svg href is an object and its desired value is in .baseVal property
      var path = svg ? el.href.baseVal : (el.pathname + el.search + (el.hash || ''));

      path = path[0] !== '/' ? '/' + path : path;

      // strip leading "/[drive letter]:" on NW.js on Windows
      if (hasProcess && path.match(/^\/[a-zA-Z]:\//)) {
        path = path.replace(/^\/[a-zA-Z]:\//, '/');
      }

      // same page
      var orig = path;
      var pageBase = this._getBase();

      if (path.indexOf(pageBase) === 0) {
        path = path.substr(pageBase.length);
      }

      if (this._hashbang) path = path.replace('#!', '');

      if (pageBase && orig === path) return;

      e.preventDefault();
      this.show(orig);
    };

    /**
     * Handle "populate" events.
     * @api private
     */

    Page.prototype._onpopstate = (function () {
      var loaded = false;
      if ( ! hasWindow ) {
        return function() {};
      }
      if (hasDocument && document.readyState === 'complete') {
        loaded = true;
      } else {
        window.addEventListener('load', function() {
          setTimeout(function() {
            loaded = true;
          }, 0);
        });
      }
      return function onpopstate(e) {
        if (!loaded) return;
        var page = this;
        if (e.state) {
          var path = e.state.path;
          page.replace(path, e.state);
        } else if (isLocation) {
          var loc = page._window.location;
          page.show(loc.pathname + loc.search + loc.hash, undefined, undefined, false);
        }
      };
    })();

    /**
     * Event button.
     */
    Page.prototype._which = function(e) {
      e = e || (hasWindow && this._window.event);
      return null == e.which ? e.button : e.which;
    };

    /**
     * Convert to a URL object
     * @api private
     */
    Page.prototype._toURL = function(href) {
      var window = this._window;
      if(typeof URL === 'function' && isLocation) {
        return new URL(href, window.location.toString());
      } else if (hasDocument) {
        var anc = window.document.createElement('a');
        anc.href = href;
        return anc;
      }
    };

    /**
     * Check if `href` is the same origin.
     * @param {string} href
     * @api public
     */

    Page.prototype.sameOrigin = function(href) {
      if(!href || !isLocation) return false;

      var url = this._toURL(href);
      var window = this._window;

      var loc = window.location;
      return loc.protocol === url.protocol &&
        loc.hostname === url.hostname &&
        loc.port === url.port;
    };

    /**
     * @api private
     */
    Page.prototype._samePath = function(url) {
      if(!isLocation) return false;
      var window = this._window;
      var loc = window.location;
      return url.pathname === loc.pathname &&
        url.search === loc.search;
    };

    /**
     * Remove URL encoding from the given `str`.
     * Accommodates whitespace in both x-www-form-urlencoded
     * and regular percent-encoded form.
     *
     * @param {string} val - URL component to decode
     * @api private
     */
    Page.prototype._decodeURLEncodedURIComponent = function(val) {
      if (typeof val !== 'string') { return val; }
      return this._decodeURLComponents ? decodeURIComponent(val.replace(/\+/g, ' ')) : val;
    };

    /**
     * Create a new `page` instance and function
     */
    function createPage(options) {
      var pageInstance = new Page();

      function pageFn(/* args */) {
        return page.apply(pageInstance, arguments);
      }

      // Copy all of the things over. In 2.0 maybe we use setPrototypeOf
      pageFn.callbacks = pageInstance.callbacks;
      pageFn.exits = pageInstance.exits;
      pageFn.base = pageInstance.base.bind(pageInstance);
      pageFn.strict = pageInstance.strict.bind(pageInstance);
      pageFn.start = pageInstance.start.bind(pageInstance);
      pageFn.stop = pageInstance.stop.bind(pageInstance);
      pageFn.show = pageInstance.show.bind(pageInstance);
      pageFn.back = pageInstance.back.bind(pageInstance);
      pageFn.redirect = pageInstance.redirect.bind(pageInstance);
      pageFn.replace = pageInstance.replace.bind(pageInstance);
      pageFn.dispatch = pageInstance.dispatch.bind(pageInstance);
      pageFn.exit = pageInstance.exit.bind(pageInstance);
      pageFn.configure = pageInstance.configure.bind(pageInstance);
      pageFn.sameOrigin = pageInstance.sameOrigin.bind(pageInstance);

      pageFn.create = createPage;

      Object.defineProperty(pageFn, 'len', {
        get: function(){
          return pageInstance.len;
        },
        set: function(val) {
          pageInstance.len = val;
        }
      });

      Object.defineProperty(pageFn, 'current', {
        get: function(){
          return pageInstance.current;
        },
        set: function(val) {
          pageInstance.current = val;
        }
      });

      // In 2.0 these can be named exports
      pageFn.Context = Context;
      pageFn.Route = Route;

      return pageFn;
    }

    /**
     * Register `path` with callback `fn()`,
     * or route `path`, or redirection,
     * or `page.start()`.
     *
     *   page(fn);
     *   page('*', fn);
     *   page('/user/:id', load, user);
     *   page('/user/' + user.id, { some: 'thing' });
     *   page('/user/' + user.id);
     *   page('/from', '/to')
     *   page();
     *
     * @param {string|!Function|!Object} path
     * @param {Function=} fn
     * @api public
     */

    function page(path, fn) {
      // <callback>
      if ('function' === typeof path) {
        return page.call(this, '*', path);
      }

      // route <path> to <callback ...>
      if ('function' === typeof fn) {
        var route = new Route(/** @type {string} */ (path), null, this);
        for (var i = 1; i < arguments.length; ++i) {
          this.callbacks.push(route.middleware(arguments[i]));
        }
        // show <path> with [state]
      } else if ('string' === typeof path) {
        this['string' === typeof fn ? 'redirect' : 'show'](path, fn);
        // start [options]
      } else {
        this.start(path);
      }
    }

    /**
     * Unhandled `ctx`. When it's not the initial
     * popstate then redirect. If you wish to handle
     * 404s on your own use `page('*', callback)`.
     *
     * @param {Context} ctx
     * @api private
     */
    function unhandled(ctx) {
      if (ctx.handled) return;
      var current;
      var page = this;
      var window = page._window;

      if (page._hashbang) {
        current = isLocation && this._getBase() + window.location.hash.replace('#!', '');
      } else {
        current = isLocation && window.location.pathname + window.location.search;
      }

      if (current === ctx.canonicalPath) return;
      page.stop();
      ctx.handled = false;
      isLocation && (window.location.href = ctx.canonicalPath);
    }

    /**
     * Initialize a new "request" `Context`
     * with the given `path` and optional initial `state`.
     *
     * @constructor
     * @param {string} path
     * @param {Object=} state
     * @api public
     */

    function Context(path, state, pageInstance) {
      var _page = this.page = pageInstance || page;
      var window = _page._window;
      var hashbang = _page._hashbang;

      var pageBase = _page._getBase();
      if ('/' === path[0] && 0 !== path.indexOf(pageBase)) path = pageBase + (hashbang ? '#!' : '') + path;
      var i = path.indexOf('?');

      this.canonicalPath = path;
      this.path = path.replace(pageBase, '') || '/';
      if (hashbang) this.path = this.path.replace('#!', '') || '/';

      this.title = (hasDocument && window.document.title);
      this.state = state || {};
      this.state.path = path;
      this.querystring = ~i ? _page._decodeURLEncodedURIComponent(path.slice(i + 1)) : '';
      this.pathname = _page._decodeURLEncodedURIComponent(~i ? path.slice(0, i) : path);
      this.params = {};

      // fragment
      this.hash = '';
      if (!hashbang) {
        if (!~this.path.indexOf('#')) return;
        var parts = this.path.split('#');
        this.path = this.pathname = parts[0];
        this.hash = _page._decodeURLEncodedURIComponent(parts[1]) || '';
        this.querystring = this.querystring.split('#')[0];
      }
    }

    /**
     * Push state.
     *
     * @api private
     */

    Context.prototype.pushState = function() {
      var page = this.page;
      var window = page._window;
      var hashbang = page._hashbang;

      page.len++;
      if (hasHistory) {
          window.history.pushState(this.state, this.title,
            hashbang && this.path !== '/' ? '#!' + this.path : this.canonicalPath);
      }
    };

    /**
     * Save the context state.
     *
     * @api public
     */

    Context.prototype.save = function() {
      var page = this.page;
      if (hasHistory && page._window.location.protocol !== 'file:') {
          page._window.history.replaceState(this.state, this.title,
            page._hashbang && this.path !== '/' ? '#!' + this.path : this.canonicalPath);
      }
    };

    /**
     * Initialize `Route` with the given HTTP `path`,
     * and an array of `callbacks` and `options`.
     *
     * Options:
     *
     *   - `sensitive`    enable case-sensitive routes
     *   - `strict`       enable strict matching for trailing slashes
     *
     * @constructor
     * @param {string} path
     * @param {Object=} options
     * @api private
     */

    function Route(path, options, page) {
      var _page = this.page = page || globalPage;
      var opts = options || {};
      opts.strict = opts.strict || page._strict;
      this.path = (path === '*') ? '(.*)' : path;
      this.method = 'GET';
      this.regexp = pathToRegexp_1(this.path, this.keys = [], opts);
    }

    /**
     * Return route middleware with
     * the given callback `fn()`.
     *
     * @param {Function} fn
     * @return {Function}
     * @api public
     */

    Route.prototype.middleware = function(fn) {
      var self = this;
      return function(ctx, next) {
        if (self.match(ctx.path, ctx.params)) return fn(ctx, next);
        next();
      };
    };

    /**
     * Check if this route matches `path`, if so
     * populate `params`.
     *
     * @param {string} path
     * @param {Object} params
     * @return {boolean}
     * @api private
     */

    Route.prototype.match = function(path, params) {
      var keys = this.keys,
        qsIndex = path.indexOf('?'),
        pathname = ~qsIndex ? path.slice(0, qsIndex) : path,
        m = this.regexp.exec(decodeURIComponent(pathname));

      if (!m) return false;

      for (var i = 1, len = m.length; i < len; ++i) {
        var key = keys[i - 1];
        var val = this.page._decodeURLEncodedURIComponent(m[i]);
        if (val !== undefined || !(hasOwnProperty.call(params, key.name))) {
          params[key.name] = val;
        }
      }

      return true;
    };


    /**
     * Module exports.
     */

    var globalPage = createPage();
    var page_js = globalPage;
    page.default = globalPage;

  return page_js;

  })));
  });

  var resultsData = [{
    "start": 2.2,
    "end": 3.74,
    "edu": "N-vE002",
    "transcription": "Годов \семидесятых я думаю.",
    "comment": ""
  }, {
    "start": 6.01,
    "end": 8.49,
    "edu": "N-vE005",
    "transcription": "(ˀ 0.06) (ɐ 0.53) Мы видим˗м сельский /–пейзаж,,,",
    "comment": ""
  }, {
    "start": 25.64,
    "end": 28.38,
    "edu": "N-vE017",
    "transcription": "у него (ɥ 0.29) на шее красный \платок ↑завязан,",
    "comment": ""
  }, {
    "start": 50.03,
    "end": 52.79,
    "edu": "N-vE027",
    "transcription": "там уже \стоят (0.13) (ɥ 0.26) \парочка корзин /полных,",
    "comment": ""
  }, {
    "start": 65.95,
    "end": 68.35,
    "edu": "N-vE034",
    "transcription": "так всё очень не= || делает /нежно и \любовноɯ.",
    "comment": ""
  }, {
    "start": 106.37,
    "end": 107.35,
    "edu": "N-vE064",
    "transcription": "велосипед /большой,",
    "comment": ""
  }, {
    "start": 107.35,
    "end": 108.55,
    "edu": "N-vE065",
    "transcription": "какие \старые /советские,",
    "comment": ""
  }, {
    "start": 131.45,
    "end": 133.38,
    "edu": "N-vE079",
    "transcription": "видит \фермер собирает там –груши,",
    "comment": ""
  }, {
    "start": 133.38,
    "end": 134.92,
    "edu": "N-vE080",
    "transcription": "полностью поглощён этим /занятием,",
    "comment": ""
  }, {
    "start": 151.01,
    "end": 152.5,
    "edu": "N-vE090",
    "transcription": "с этой тяжеленной /↑корзиной,",
    "comment": ""
  }, {
    "start": 192.57,
    "end": 193.79,
    "edu": "N-vE117",
    "transcription": "он один из них /приспускает,",
    "comment": "Произносит [прыспускает]."
  }, {
    "start": 228.21,
    "end": 230.18,
    "edu": "N-vE136",
    "transcription": "(ˀ 0.11) Они \помогают ему /подняться=,",
    "comment": ""
  }, {
    "start": 230.18,
    "end": 231.17,
    "edu": "N-vE137",
    "transcription": "(ə 0.04) (\Двое /помогают,",
    "comment": "Произносит [помогаюƟ]."
  }, {
    "start": 231.17,
    "end": 233.48,
    "edu": "N-vE138",
    "transcription": "/ˀодин так и сту= || и \стучит своей этой \↑штукой.)",
    "comment": ""
  }, {
    "start": 255.66,
    "end": 256.96,
    "edu": "N-vE152",
    "transcription": "/поднимают они ↑её,",
    "comment": ""
  }, {
    "start": 271.63,
    "end": 272.32,
    "edu": "N-vE161",
    "transcription": "взамен \шляпы,",
    "comment": ""
  }, {
    "start": 445.39,
    "end": 447.44,
    "edu": "N-vE238",
    "transcription": "/Корзины прям просто под \грушей /стоят,",
    "comment": ""
  }, {
    "start": 480.57,
    "end": 481.36,
    "edu": "N-vE246",
    "transcription": "Ничего не \видно, ",
    "comment": ""
  }, {
    "start": 596.29,
    "end": 597.69,
    "edu": "N-vE289",
    "transcription": "я бы \свалилась точно.",
    "comment": "Второе слово произносит [салилась]. Последнее слово — шепотом."
  }, {
    "start": 766.41,
    "end": 768.09,
    "edu": "N-vE325",
    "transcription": "Как˗к какая-то \əшпанаɯ.",
    "comment": ""
  }, {
    "start": 770.11,
    "end": 772.28,
    "edu": "N-vE326",
    "transcription": "Ну /сначала как-то они \подозрительно выглядят,",
    "comment": ""
  }, {
    "start": 772.28,
    "end": 773.34,
    "edu": "N-vE327",
    "transcription": "но /вообще \нормально.",
    "comment": ""
  }, {
    "start": 773.34,
    "end": 774.34,
    "edu": "N-vE328",
    "transcription": "Они ему /помогают...",
    "comment": ""
  }, {
    "start": 801.81,
    "end": 802.15,
    "edu": "N-vE329",
    "transcription": "(ɯ 0.19) \Да,",
    "comment": ""
  }, {
    "start": 802.15,
    "end": 803.46,
    "edu": "N-vE330",
    "transcription": "он /садится,",
    "comment": ""
  }, {
    "start": 803.63,
    "end": 805.6,
    "edu": "N-vE331",
    "transcription": "(ə 0.16) см= || смотрит свою /–коленку,,, ≈≈",
    "comment": ""
  }, {
    "start": 805.6,
    "end": 806.23,
    "edu": "N-vE332",
    "transcription": "Ну прямо \так, ",
    "comment": ""
  }, {
    "start": 806.23,
    "end": 807.02,
    "edu": "N-vE333",
    "transcription": "он /лежал сначала,",
    "comment": ""
  }, {
    "start": 841.78,
    "end": 843.47,
    "edu": "N-vE343",
    "transcription": "ˀОни ст= || \поднимают ему всё это,",
    "comment": ""
  }, {
    "start": 928.41,
    "end": 928.89,
    "edu": "N-vE364",
    "transcription": "/Не- \н˗не!,",
    "comment": ""
  }, {
    "start": 1092.77,
    "end": 1095.3,
    "edu": "N-vE385",
    "transcription": "мы /ничего˗оə || (0.40) уже не \поправляем /никого.",
    "comment": ""
  }];

  /**
   * Helpers.
   */

  var s = 1000;
  var m = s * 60;
  var h = m * 60;
  var d = h * 24;
  var w = d * 7;
  var y = d * 365.25;

  /**
   * Parse or format the given `val`.
   *
   * Options:
   *
   *  - `long` verbose formatting [false]
   *
   * @param {String|Number} val
   * @param {Object} [options]
   * @throws {Error} throw an error if val is not a non-empty string or a number
   * @return {String|Number}
   * @api public
   */

  var ms = function(val, options) {
    options = options || {};
    var type = typeof val;
    if (type === 'string' && val.length > 0) {
      return parse(val);
    } else if (type === 'number' && isNaN(val) === false) {
      return options.long ? fmtLong(val) : fmtShort(val);
    }
    throw new Error(
      'val is not a non-empty string or a valid number. val=' +
        JSON.stringify(val)
    );
  };

  /**
   * Parse the given `str` and return milliseconds.
   *
   * @param {String} str
   * @return {Number}
   * @api private
   */

  function parse(str) {
    str = String(str);
    if (str.length > 100) {
      return;
    }
    var match = /^((?:\d+)?\-?\d?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
      str
    );
    if (!match) {
      return;
    }
    var n = parseFloat(match[1]);
    var type = (match[2] || 'ms').toLowerCase();
    switch (type) {
      case 'years':
      case 'year':
      case 'yrs':
      case 'yr':
      case 'y':
        return n * y;
      case 'weeks':
      case 'week':
      case 'w':
        return n * w;
      case 'days':
      case 'day':
      case 'd':
        return n * d;
      case 'hours':
      case 'hour':
      case 'hrs':
      case 'hr':
      case 'h':
        return n * h;
      case 'minutes':
      case 'minute':
      case 'mins':
      case 'min':
      case 'm':
        return n * m;
      case 'seconds':
      case 'second':
      case 'secs':
      case 'sec':
      case 's':
        return n * s;
      case 'milliseconds':
      case 'millisecond':
      case 'msecs':
      case 'msec':
      case 'ms':
        return n;
      default:
        return undefined;
    }
  }

  /**
   * Short format for `ms`.
   *
   * @param {Number} ms
   * @return {String}
   * @api private
   */

  function fmtShort(ms) {
    var msAbs = Math.abs(ms);
    if (msAbs >= d) {
      return Math.round(ms / d) + 'd';
    }
    if (msAbs >= h) {
      return Math.round(ms / h) + 'h';
    }
    if (msAbs >= m) {
      return Math.round(ms / m) + 'm';
    }
    if (msAbs >= s) {
      return Math.round(ms / s) + 's';
    }
    return ms + 'ms';
  }

  /**
   * Long format for `ms`.
   *
   * @param {Number} ms
   * @return {String}
   * @api private
   */

  function fmtLong(ms) {
    var msAbs = Math.abs(ms);
    if (msAbs >= d) {
      return plural(ms, msAbs, d, 'day');
    }
    if (msAbs >= h) {
      return plural(ms, msAbs, h, 'hour');
    }
    if (msAbs >= m) {
      return plural(ms, msAbs, m, 'minute');
    }
    if (msAbs >= s) {
      return plural(ms, msAbs, s, 'second');
    }
    return ms + ' ms';
  }

  /**
   * Pluralization helper.
   */

  function plural(ms, msAbs, n, name) {
    var isPlural = msAbs >= n * 1.5;
    return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
  }

  /**
   * This is the common logic for both the Node.js and web browser
   * implementations of `debug()`.
   */

  function setup(env) {
  	createDebug.debug = createDebug;
  	createDebug.default = createDebug;
  	createDebug.coerce = coerce;
  	createDebug.disable = disable;
  	createDebug.enable = enable;
  	createDebug.enabled = enabled;
  	createDebug.humanize = ms;

  	Object.keys(env).forEach(key => {
  		createDebug[key] = env[key];
  	});

  	/**
  	* Active `debug` instances.
  	*/
  	createDebug.instances = [];

  	/**
  	* The currently active debug mode names, and names to skip.
  	*/

  	createDebug.names = [];
  	createDebug.skips = [];

  	/**
  	* Map of special "%n" handling functions, for the debug "format" argument.
  	*
  	* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
  	*/
  	createDebug.formatters = {};

  	/**
  	* Selects a color for a debug namespace
  	* @param {String} namespace The namespace string for the for the debug instance to be colored
  	* @return {Number|String} An ANSI color code for the given namespace
  	* @api private
  	*/
  	function selectColor(namespace) {
  		let hash = 0;

  		for (let i = 0; i < namespace.length; i++) {
  			hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
  			hash |= 0; // Convert to 32bit integer
  		}

  		return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
  	}
  	createDebug.selectColor = selectColor;

  	/**
  	* Create a debugger with the given `namespace`.
  	*
  	* @param {String} namespace
  	* @return {Function}
  	* @api public
  	*/
  	function createDebug(namespace) {
  		let prevTime;

  		function debug(...args) {
  			// Disabled?
  			if (!debug.enabled) {
  				return;
  			}

  			const self = debug;

  			// Set `diff` timestamp
  			const curr = Number(new Date());
  			const ms$$1 = curr - (prevTime || curr);
  			self.diff = ms$$1;
  			self.prev = prevTime;
  			self.curr = curr;
  			prevTime = curr;

  			args[0] = createDebug.coerce(args[0]);

  			if (typeof args[0] !== 'string') {
  				// Anything else let's inspect with %O
  				args.unshift('%O');
  			}

  			// Apply any `formatters` transformations
  			let index = 0;
  			args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
  				// If we encounter an escaped % then don't increase the array index
  				if (match === '%%') {
  					return match;
  				}
  				index++;
  				const formatter = createDebug.formatters[format];
  				if (typeof formatter === 'function') {
  					const val = args[index];
  					match = formatter.call(self, val);

  					// Now we need to remove `args[index]` since it's inlined in the `format`
  					args.splice(index, 1);
  					index--;
  				}
  				return match;
  			});

  			// Apply env-specific formatting (colors, etc.)
  			createDebug.formatArgs.call(self, args);

  			const logFn = self.log || createDebug.log;
  			logFn.apply(self, args);
  		}

  		debug.namespace = namespace;
  		debug.enabled = createDebug.enabled(namespace);
  		debug.useColors = createDebug.useColors();
  		debug.color = selectColor(namespace);
  		debug.destroy = destroy;
  		debug.extend = extend;
  		// Debug.formatArgs = formatArgs;
  		// debug.rawLog = rawLog;

  		// env-specific initialization logic for debug instances
  		if (typeof createDebug.init === 'function') {
  			createDebug.init(debug);
  		}

  		createDebug.instances.push(debug);

  		return debug;
  	}

  	function destroy() {
  		const index = createDebug.instances.indexOf(this);
  		if (index !== -1) {
  			createDebug.instances.splice(index, 1);
  			return true;
  		}
  		return false;
  	}

  	function extend(namespace, delimiter) {
  		return createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
  	}

  	/**
  	* Enables a debug mode by namespaces. This can include modes
  	* separated by a colon and wildcards.
  	*
  	* @param {String} namespaces
  	* @api public
  	*/
  	function enable(namespaces) {
  		createDebug.save(namespaces);

  		createDebug.names = [];
  		createDebug.skips = [];

  		let i;
  		const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
  		const len = split.length;

  		for (i = 0; i < len; i++) {
  			if (!split[i]) {
  				// ignore empty strings
  				continue;
  			}

  			namespaces = split[i].replace(/\*/g, '.*?');

  			if (namespaces[0] === '-') {
  				createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
  			} else {
  				createDebug.names.push(new RegExp('^' + namespaces + '$'));
  			}
  		}

  		for (i = 0; i < createDebug.instances.length; i++) {
  			const instance = createDebug.instances[i];
  			instance.enabled = createDebug.enabled(instance.namespace);
  		}
  	}

  	/**
  	* Disable debug output.
  	*
  	* @api public
  	*/
  	function disable() {
  		createDebug.enable('');
  	}

  	/**
  	* Returns true if the given mode name is enabled, false otherwise.
  	*
  	* @param {String} name
  	* @return {Boolean}
  	* @api public
  	*/
  	function enabled(name) {
  		if (name[name.length - 1] === '*') {
  			return true;
  		}

  		let i;
  		let len;

  		for (i = 0, len = createDebug.skips.length; i < len; i++) {
  			if (createDebug.skips[i].test(name)) {
  				return false;
  			}
  		}

  		for (i = 0, len = createDebug.names.length; i < len; i++) {
  			if (createDebug.names[i].test(name)) {
  				return true;
  			}
  		}

  		return false;
  	}

  	/**
  	* Coerce `val`.
  	*
  	* @param {Mixed} val
  	* @return {Mixed}
  	* @api private
  	*/
  	function coerce(val) {
  		if (val instanceof Error) {
  			return val.stack || val.message;
  		}
  		return val;
  	}

  	createDebug.enable(createDebug.load());

  	return createDebug;
  }

  var common = setup;

  var browser = createCommonjsModule(function (module, exports) {
  /* eslint-env browser */

  /**
   * This is the web browser implementation of `debug()`.
   */

  exports.log = log;
  exports.formatArgs = formatArgs;
  exports.save = save;
  exports.load = load;
  exports.useColors = useColors;
  exports.storage = localstorage();

  /**
   * Colors.
   */

  exports.colors = [
  	'#0000CC',
  	'#0000FF',
  	'#0033CC',
  	'#0033FF',
  	'#0066CC',
  	'#0066FF',
  	'#0099CC',
  	'#0099FF',
  	'#00CC00',
  	'#00CC33',
  	'#00CC66',
  	'#00CC99',
  	'#00CCCC',
  	'#00CCFF',
  	'#3300CC',
  	'#3300FF',
  	'#3333CC',
  	'#3333FF',
  	'#3366CC',
  	'#3366FF',
  	'#3399CC',
  	'#3399FF',
  	'#33CC00',
  	'#33CC33',
  	'#33CC66',
  	'#33CC99',
  	'#33CCCC',
  	'#33CCFF',
  	'#6600CC',
  	'#6600FF',
  	'#6633CC',
  	'#6633FF',
  	'#66CC00',
  	'#66CC33',
  	'#9900CC',
  	'#9900FF',
  	'#9933CC',
  	'#9933FF',
  	'#99CC00',
  	'#99CC33',
  	'#CC0000',
  	'#CC0033',
  	'#CC0066',
  	'#CC0099',
  	'#CC00CC',
  	'#CC00FF',
  	'#CC3300',
  	'#CC3333',
  	'#CC3366',
  	'#CC3399',
  	'#CC33CC',
  	'#CC33FF',
  	'#CC6600',
  	'#CC6633',
  	'#CC9900',
  	'#CC9933',
  	'#CCCC00',
  	'#CCCC33',
  	'#FF0000',
  	'#FF0033',
  	'#FF0066',
  	'#FF0099',
  	'#FF00CC',
  	'#FF00FF',
  	'#FF3300',
  	'#FF3333',
  	'#FF3366',
  	'#FF3399',
  	'#FF33CC',
  	'#FF33FF',
  	'#FF6600',
  	'#FF6633',
  	'#FF9900',
  	'#FF9933',
  	'#FFCC00',
  	'#FFCC33'
  ];

  /**
   * Currently only WebKit-based Web Inspectors, Firefox >= v31,
   * and the Firebug extension (any Firefox version) are known
   * to support "%c" CSS customizations.
   *
   * TODO: add a `localStorage` variable to explicitly enable/disable colors
   */

  // eslint-disable-next-line complexity
  function useColors() {
  	// NB: In an Electron preload script, document will be defined but not fully
  	// initialized. Since we know we're in Chrome, we'll just detect this case
  	// explicitly
  	if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
  		return true;
  	}

  	// Internet Explorer and Edge do not support colors.
  	if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
  		return false;
  	}

  	// Is webkit? http://stackoverflow.com/a/16459606/376773
  	// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  	return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
  		// Is firebug? http://stackoverflow.com/a/398120/376773
  		(typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
  		// Is firefox >= v31?
  		// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
  		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
  		// Double check webkit in userAgent just in case we are in a worker
  		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
  }

  /**
   * Colorize log arguments if enabled.
   *
   * @api public
   */

  function formatArgs(args) {
  	args[0] = (this.useColors ? '%c' : '') +
  		this.namespace +
  		(this.useColors ? ' %c' : ' ') +
  		args[0] +
  		(this.useColors ? '%c ' : ' ') +
  		'+' + module.exports.humanize(this.diff);

  	if (!this.useColors) {
  		return;
  	}

  	const c = 'color: ' + this.color;
  	args.splice(1, 0, c, 'color: inherit');

  	// The final "%c" is somewhat tricky, because there could be other
  	// arguments passed either before or after the %c, so we need to
  	// figure out the correct index to insert the CSS into
  	let index = 0;
  	let lastC = 0;
  	args[0].replace(/%[a-zA-Z%]/g, match => {
  		if (match === '%%') {
  			return;
  		}
  		index++;
  		if (match === '%c') {
  			// We only are interested in the *last* %c
  			// (the user may have provided their own)
  			lastC = index;
  		}
  	});

  	args.splice(lastC, 0, c);
  }

  /**
   * Invokes `console.log()` when available.
   * No-op when `console.log` is not a "function".
   *
   * @api public
   */
  function log(...args) {
  	// This hackery is required for IE8/9, where
  	// the `console.log` function doesn't have 'apply'
  	return typeof console === 'object' &&
  		console.log &&
  		console.log(...args);
  }

  /**
   * Save `namespaces`.
   *
   * @param {String} namespaces
   * @api private
   */
  function save(namespaces) {
  	try {
  		if (namespaces) {
  			exports.storage.setItem('debug', namespaces);
  		} else {
  			exports.storage.removeItem('debug');
  		}
  	} catch (error) {
  		// Swallow
  		// XXX (@Qix-) should we be logging these?
  	}
  }

  /**
   * Load `namespaces`.
   *
   * @return {String} returns the previously persisted debug modes
   * @api private
   */
  function load() {
  	let r;
  	try {
  		r = exports.storage.getItem('debug');
  	} catch (error) {
  		// Swallow
  		// XXX (@Qix-) should we be logging these?
  	}

  	// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  	if (!r && typeof process !== 'undefined' && 'env' in process) {
  		r = process.env.DEBUG;
  	}

  	return r;
  }

  /**
   * Localstorage attempts to return the localstorage.
   *
   * This is necessary because safari throws
   * when a user disables cookies/localstorage
   * and you attempt to access it.
   *
   * @return {LocalStorage}
   * @api private
   */

  function localstorage() {
  	try {
  		// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
  		// The Browser also has localStorage in the global context.
  		return localStorage;
  	} catch (error) {
  		// Swallow
  		// XXX (@Qix-) should we be logging these?
  	}
  }

  module.exports = common(exports);

  const {formatters} = module.exports;

  /**
   * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
   */

  formatters.j = function (v) {
  	try {
  		return JSON.stringify(v);
  	} catch (error) {
  		return '[UnexpectedJSONParseError]: ' + error.message;
  	}
  };
  });
  var browser_1 = browser.log;
  var browser_2 = browser.formatArgs;
  var browser_3 = browser.save;
  var browser_4 = browser.load;
  var browser_5 = browser.useColors;
  var browser_6 = browser.storage;
  var browser_7 = browser.colors;

  var videoPlayer = videojs('bmpp-videoPlayer');
  var log = browser('bumppo:log');

  {
    browser.enable('*');
    log('Logging is enabled!');
  }

  function viewModel() {
    var _this = this;

    this.queryPane = Symbol.for('query'), this.subcorpusPane = Symbol.for('subcorpus'), this.resultsPane = Symbol.for('results'), this.resultsOptionsPane = Symbol.for('resoptions');
    this.panes = [this.queryPane, this.subcorpusPane, this.resultsPane, this.resultsOptionsPane];
    this.activePane = ko.observable();

    this.switchOnQueryPane = function () {
      _this.activePane(_this.queryPane);
    };

    this.switchOnSubcorpusPane = function () {
      _this.activePane(_this.subcorpusPane);
    };

    this.switchOnResultsPane = function () {
      _this.activePane(_this.resultsPane);
    };

    this.switchOnResultsOptionsPane = function () {
      _this.activePane(_this.resultsOptionsPane);
    };

    this.isQueryPaneOn = ko.computed(function () {
      return _this.activePane() === _this.queryPane;
    });
    this.isSubcorpusPaneOn = ko.computed(function () {
      return _this.activePane() === _this.subcorpusPane;
    });
    this.isResultsPaneOn = ko.computed(function () {
      return _this.activePane() === _this.resultsPane;
    });
    this.isResultsOptionsPaneOn = ko.computed(function () {
      return _this.activePane() === _this.resultsOptionsPane;
    });
    ko.computed(function () {
      var activePane = _this.activePane();

      if (activePane) {
        page("/".concat(Symbol.keyFor(activePane)));
        videoPlayer.pause();
      }
    });
    this.results = resultsData;

    this.playVideo = function (result) {
      videoPlayer.currentTime(result.start);
      videoPlayer.play();
    };
  }

  var vM = new viewModel();
  ko.applyBindings(vM); // Настройка клиентской маршрутизации

  var queryURL = Symbol.keyFor(vM.queryPane),
      subcorpusURL = Symbol.keyFor(vM.subcorpusPane),
      resultsURL = Symbol.keyFor(vM.resultsPane),
      resultsOptionsURL = Symbol.keyFor(vM.resultsOptionsPane);

  page.base('/bumppo-ghpages');
  page('/', function () {
    vM.activePane(vM.queryPane);
  });
  page("/".concat(queryURL), function () {
    vM.activePane(vM.queryPane);
  });
  page("/".concat(subcorpusURL), function () {
    vM.activePane(vM.subcorpusPane);
  });
  page("/".concat(resultsURL), function () {
    vM.activePane(vM.resultsPane);
  });
  page("/".concat(resultsOptionsURL), function () {
    vM.activePane(vM.resultsOptionsPane);
  });
  page();
  $('.ui.checkbox').checkbox();
  videoPlayer.ready(function () {
    var volume = videoPlayer.volume();
    videoPlayer.volume(0);
    videoPlayer.currentTime(0);
    videoPlayer.pause();
    videoPlayer.volume(volume);
  });

  var cN = function cN(drawer, text, element) {
    _classCallCheck(this, cN);

    var color = '#aaa',
        c = drawer.circle(30).attr({
      fill: 'none',
      stroke: color,
      'stroke-width': 1
    }).cx(15).cy(15),
        t = drawer.text(text).attr({
      fill: color
    }).cx(15).cy(15),
        svg = drawer.group().add(c).add(t);
    this.svg = svg;
    this.element = element;

    if (element.length) {
      svg.cx(98).y(element.offset().top + 13);
    }
  };

  function drawLine(drawer, n1, n2, level) {
    var r = 15,
        b1 = r * 0.5,
        b2 = r * 4,
        s = r * 1,
        l = r * 1.3,
        c = r * 3,
        d = r * 4.5;

    if (level === 0) {
      drawer.path("M ".concat(n1.svg.cx(), " ").concat(n1.svg.cy() + r, "\n             L ").concat(n2.svg.cx(), " ").concat(n2.svg.cy() - r)).fill('none').stroke({
        color: '#aaa',
        width: 1
      });
    } else {
      drawer.path("\n\nM ".concat(n1.svg.cx(), " ").concat(n1.svg.cy() + r, "\nV ").concat(n1.svg.cy() + r + b1, "\nC ").concat(n1.svg.cx(), " ").concat(n1.svg.cy() + r + b1 + c, "\n  ").concat(n1.svg.cx() - s - l * level, " ").concat(n1.svg.cy() + r + b1 + d - c, "\n  ").concat(n1.svg.cx() - s - l * level, " ").concat(n1.svg.cy() + r + b1 + d, "\nV ").concat(n2.svg.cy() - r - b2 - d, "\nC ").concat(n2.svg.cx() - s - l * level, " ").concat(n2.svg.cy() - r - b2 - d + c, "\n  ").concat(n2.svg.cx(), " ").concat(n2.svg.cy() - r - b2 - c, "\n  ").concat(n2.svg.cx(), " ").concat(n2.svg.cy() - r - b2, "\nV ").concat(n2.svg.cy() - r, "\n\n      ")).fill('none').stroke({
        color: '#aaa',
        width: 1
      });
    }
  }

  var draw = SVG('bmpp-queryTree').size('100%', '100%'),
      n1 = new cN(draw, '1', $('.n1.bmpp-queryElement')),
      n2 = new cN(draw, '2', $('.n2.bmpp-queryElement')),
      n3 = new cN(draw, '3', $('.n3.bmpp-queryElement')),
      n4 = new cN(draw, '4', $('.n4.bmpp-queryElement')),
      n5 = new cN(draw, '5', $('.n5.bmpp-queryElement'));
  drawLine(draw, n1, n2, 0);
  drawLine(draw, n1, n3, 1);
  drawLine(draw, n3, n4, 0);
  drawLine(draw, n1, n5, 2);

}(jQuery,ko,videojs,SVG));
//# sourceMappingURL=spa.js.map
