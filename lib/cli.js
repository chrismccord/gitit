(function() {
  var exec, fs, path, spawn, _ref;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  fs = require('fs');
  path = require('path');
  _ref = require('child_process'), spawn = _ref.spawn, exec = _ref.exec;
  this.Gitit = {
    opened: false,
    open: function(url) {
      if (this.opened) {
        return;
      }
      this.opened = true;
      return exec("open " + url);
    },
    hostURL: function(host, user, repo) {
      switch (host) {
        case "github.com":
          return "https://" + host + "/" + user + "/" + repo;
          break;
      }
    },
    actions: {
      ".git/config": function(filePath) {
        return fs.readFile(filePath, __bind(function(err, data) {
          var host, matched, repo, user, _ref;
          _ref = data.toString().match(/.*\[remote\s[\"\']origin[\"\']\][^\[]*.*url\s?=\s?.*@(.*):(.*)\/(.*)\.git\n/), matched = _ref[0], host = _ref[1], user = _ref[2], repo = _ref[3];
          if ((host != null) && (user != null) && (repo != null)) {
            return this.open(this.hostURL(host, user, repo));
          }
        }, this));
      },
      "package.json": function(filePath) {
        var package, url, _ref, _ref2;
        package = require(filePath);
        url = (_ref = (_ref2 = package.repository) != null ? _ref2.url : void 0) != null ? _ref : "";
        if (url.length === 0 && package.name.toString().length > 0) {
          url = "'https://github.com/search?utf8=✓&q=" + package.name + "&type=Everything&start_value=1'";
        }
        if (url.length > 0) {
          return this.open(url);
        }
      }
    },
    run: function() {
      var action, file, relativePath, _ref, _ref2, _results;
      relativePath = (_ref = process.argv[2]) != null ? _ref : "";
      _ref2 = this.actions;
      _results = [];
      for (file in _ref2) {
        action = _ref2[file];
        _results.push(__bind(function(file, action) {
          var filePath;
          filePath = path.resolve(path.join(relativePath, file));
          return path.exists(filePath, __bind(function(exists) {
            if (exists && !this.opened) {
              return action.call(this, filePath);
            }
          }, this));
        }, this)(file, action));
      }
      return _results;
    }
  };
}).call(this);
