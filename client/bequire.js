'use strict';

this.define = (function initialiseDefine() {
  var isOpera = typeof opera !== 'undefined' && opera.toString() === '[object Opera]';
  var jsFileRegex = /\.js$|\.mjs$\.jsx$/
  var urlRegex = /(.*:|.*?)(\/\/|.*?)(.*?)(\/.*?)(\?.*?|#.*?|$)(#.*|$)/;

  function hashUrl(url) {
    if (
      process.env.NODE_ENV === 'production'
      && !url.startsWith('!')
      && url !== 'module'
      && url !== 'exports'
      && url !== 'require'
    ) {
      return '!' + hashSum(url)
    }
    return url
  }
  
  function parseUrl(url) {
    var parts = urlRegex.exec(url);
    if (!parts) {
      return {};
    }
    var search = parts[5];
    var hash = parts[6];
    if (!search.startsWith('?')) {
      hash = search;
      search = '';
    }
    if (!hash.startsWith('#')) {
      hash = '';
    }
    return {
      protocol: parts[1],
      host: parts[3],
      pathname: parts[4],
      search,
      hash,
      searchParams: search
        .replace(/^\?/, '')
        .split('&')
        .reduce((params, kv) => {
            var kvPair = kv.split('=')
            params[kvPair[0]] = kvPair[1]
            return params
          }, {})
    };
  }

  function normalisePath(path) {
    if (path.startsWith('!')) {
      return path
    }
    return '.' + parseUrl(path).pathname
  }

  function getScriptFrom(evt) {
    //Using currentTarget instead of target for Firefox 2.0's sake. Not
    //all old browsers will be supported, but this one was easy enough
    //to support and still makes sense.
    return evt.currentTarget || evt.srcElement;
  }

  function removeListener(script, func, name, ieName) {
    //Favor detachEvent because of IE9
    //issue, see attachEvent/addEventListener comment elsewhere
    //in this file.
    if (script.detachEvent && !isOpera) {
      //Probably IE. If not it will throw an error, which will be
      //useful to know.
      if (ieName) {
        script.detachEvent(ieName, func);
      }
    } else {
      script.removeEventListener(name, func, false);
    }
  }

  function removeListeners(script, onScriptLoad, onScriptError) {
    //Remove the listeners once here.
    removeListener(script, onScriptLoad, 'load', 'onreadystatechange');
    removeListener(script, onScriptError, 'error');
  }

  function require(url) {
    var module = define.modules[hashUrl(url)]
    load(module)
    return module.exports;
  }

  // load the module and pass it all its dependencies
  function load(module) {
    if (module.status !== 'loading') {
      return;
    }
    module.status = 'inCallback';
    module.callback.apply(module, module.dependencies.map(function (url) {
      if (url === 'module') {
        return module;
      } else if (url === 'exports') {
        return module.exports;
      } else if (url === 'require') {
        return require;
      }
      const dependency = define.modules[hashUrl(normalisePath(url))];
      return dependency ? dependency.exports : undefined;
    }).concat(module));
    module.status = 'loaded';
  }

  // this is used to validate ancestor modules once a child module has loaded
  function validateDependentModules(module) {
    const hashedUrl = hashUrl(module.url)
    for (var defineModuleUrl in define.modules) {
      var dependent = define.modules[defineModuleUrl]
      if (dependent.dependencies.indexOf(hashedUrl) >= 0) {
        dependent.status === 'loading'
        load(dependent)
        validateDependentModules(dependent)
      }
    }
  }

  // check if the all the dependencies are loaded
  // and load the module if so
  function validateModule(module) {
    if (module.status === 'loaded') {
      return true;
    }
    var dependenciesLoaded = true;
    for (var i = 0; i < module.dependencies.length; i++) {
      var url = module.dependencies[i];
      dependenciesLoaded = (
        url === 'exports' ||
        url === 'module' ||
        url === 'require'
        );
        if (dependenciesLoaded) {
          continue;
        }
        url = normalisePath(url);
        var dependency = define.modules[hashUrl(url)];
        dependenciesLoaded = (
          !!dependency && dependency.status === 'loaded'
        );
      if (!dependenciesLoaded) {
        break;
      }
    }
    if (dependenciesLoaded) {
      load(module);
      validateDependentModules(module)
      return true;
    }
  }

  function initModule(url, callback, dependencies, status) {
    const hashedUrl = hashUrl(url);
    var module = define.modules[hashedUrl];
    if (!module) {
      module = {
        url: url,
        exports: {},
      };
      define.modules[hashedUrl] = module;
    }
    module.callback = callback;
    module.dependencies = dependencies;
    module.status = status;
    return module;
  }

  function loadAsync(module, options) {
    // check if all dependencies for the module are resolved
    // in which case you should refetch the dependencies only if `force: true`
    if (!options.force && validateModule(module)) {
      return;
    }

    function onScriptLoad(evt) {
      var script = getScriptFrom(evt);
      removeListeners(script, onScriptLoad, onScriptError);
      validateModule(module);
    }

    function onScriptError(evt) {dependenciesLoaded
      var script = getScriptFrom(evt);
      removeListeners(script, onScriptLoad, onScriptError);
      throw new Error('Failed to load: ' + script.src + '\n\n' + evt); // better ways of rendering evt?
    }

    // load the dependencies using an async script tag
    module.dependencies.forEach(function (url) {
      if ((
          define.modules[hashUrl(url)]
          && !options.force
        )
        || url === 'module'
        || url === 'exports'
        || url === 'require'
      ) {
        return;
      }

      // only actually support loading js files for now
      if (!jsFileRegex.test(url)) {
        var nonJsDependency = initModule(url, function(){}, [], 'loading')
        validateModule(nonJsDependency)
        return
      }

      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.charset = 'utf-8';
      script.async = true;
      var params = [
        options.loadStyles && 'loadStyles=1',
        'noLoadWrap=1',
        'priorIds=' + define.priorIds.join(','),
      ].filter(p => p);
      for(var key in (options.params || {})) {
        params.push(key + '=' + options.params[key])
      }
      script.src = url + '?' + params.join('&');

      //Set up load listener. Test attachEvent first because IE9 has
      //a subtle issue in its addEventListener and script onload firings
      //that do not match the behavior of all other browsers with
      //addEventListener support, which fire the onload event for a
      //script right after the script execution. See:
      //https://connect.microsoft.com/IE/feedback/details/648057/script-onload-event-is-not-fired-immediately-after-script-execution
      //UNFORTUNATELY Opera implements attachEvent but does not follow the script
      //script execution mode.
      if (script.attachEvent &&
      //Check if script.attachEvent is artificially added by custom script or
      //natively supported by browser
      //read https://github.com/requirejs/requirejs/issues/187
      //if we can NOT find [native code] then it must NOT natively supported.
      //in IE8, script.attachEvent does not have toString()
      //Note the test for "[native code" with no closing brace, see:
      //https://github.com/requirejs/requirejs/issues/273
      !(script.attachEvent.toString && script.attachEvent.toString().indexOf('[native code') < 0) && !isOpera) {
        //Probably IE. IE (at least 6-8) do not fire
        //script onload right after executing the script, so
        //we cannot tie the anonymous define call to a name.
        //However, IE reports the script as being in 'interactive'
        //readyState at the time of the define call.
        useInteractive = true;

        script.attachEvent('onreadystatechange', onScriptLoad);
        //It would be great to add an error handler here to catch
        //404s in IE9+. However, onreadystatechange will fire before
        //the error handler, so that does not help. If addEventListener
        //is used, then IE will fire error before load, but we cannot
        //use that pathway given the connect.microsoft.com issue
        //mentioned above about not doing the 'script execute,
        //then fire the script load event listener before execute
        //next script' that other browsers do.
        //Best hope: IE10 fixes the issues,
        //and then destroys all installs of IE 6-9.
        //script.attachEvent('onerror', context.onScriptError);
      } else {
        script.addEventListener('load', onScriptLoad, false);
        script.addEventListener('error', onScriptError, false);
      }

      document.head.append(script);
    });
  }

  function define(_url, dependencies, callback, options) {
    var url = normalisePath(_url)
    dependencies = Array.isArray(dependencies) ? dependencies : [dependencies]
    options = options || {}
    if (!url) {
      throw new Error('You must provide a url when defining a module');
    }

    var module = initModule(url, callback, dependencies, 'loading')

    if (define.suspendedModules) {
      if (define.suspendedModules.indexOf(module) < 0) {
        define.suspendedModules.push(module)
      }
    } else {
      loadAsync(module, options)
    }
  };

  define.suspend = function() { define.suspendedModules = [] }
  define.resume = function() {
    var suspendedModules = define.suspendedModules || []
    define.suspendedModules = null
    for (var i = 0; i < suspendedModules.length; i++) {
      var module = suspendedModules[i]
      load(module)
    }
  }
  
  var requireAsync = (function initialiseRequire() {
    var anonymousModuleCount = 0;
    return function requireAsync(dependencies, callback, options) {
      var name = '/__anonymous__' + anonymousModuleCount++
      define(name, dependencies, function() {
        callback.apply(this, arguments);
        delete define.modules[hashUrl(name)];
      }, options);
    };
  })();

  this.requireAsync = requireAsync
  return define
}).apply(this);

this.define.modules = {};
this.define.priorIds = [];
