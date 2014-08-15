(function (window) {
	if(window.localStorage) {
		var window_localStorage = window.localStorage;
		var prefix = "chrome.storage.local.";
		var shiv = {
			set: function(items, callback) {
				window.setTimeout(function() {
					var keys = Object.keys(items);
					for (var i = 0; i < keys.length; i++) {
						window_localStorage.setItem(prefix+keys[i], JSON.stringify(items[keys[i]]));
					}
					if(callback) {
						window.setTimeout(callback,0);
					}
				},0);
			},
			get: function(keys, callback) {
				window.setTimeout(function() {
					var keys_to_fetch = [];
					var defaults = {};
					var items = {};
					var i=0, key="";
					if(keys === null) {
						for (i=0; i < window_localStorage.length; i++) {
							key = window_localStorage.key(i);
							if(key.substr(0,prefix.length) === prefix) {
								items[key.substr(prefix.length)] = JSON.parse(window_localStorage.getItem(key));
							}
						}
					} else {
						switch(Object.prototype.toString.call(keys)) {
							case '[object Array]':
								keys_to_fetch = keys;
								break;
							case '[object Object]':
								keys_to_fetch = Object.keys(keys);
								defaults = keys;
								break;
							case "[object String]":
								keys_to_fetch = [keys];
								break;
						}
						/*
						if (typeof keys === 'string') {
							keys_to_fetch = [keys];
						} else {
							if(typeof keys === 'object') {
								keys_to_fetch = Object.keys(keys);
								defaults = keys;
							} else {
								keys_to_fetch = keys;
							}
						}
						*/
						for (i=0; i < keys_to_fetch.length; i++) {
							key = keys_to_fetch[i];
							if(window_localStorage.hasOwnProperty(prefix + key)) {
								items[key] = JSON.parse(window_localStorage.getItem(prefix + key));
							} else {
								if(defaults.hasOwnProperty(key)) {
									items[key] = defaults[key];
								}
							}
						}
					}
					if(callback) {
						callback(items);
					}
				},0);
			},
			getBytesInUse: function(keys, callback) {
				window.setTimeout(function() {
					//TODO: just a stub for now
					callback(-1);
				},0);
			}, 
			remove: function(keys, callback) {
				window.setTimeout(function() {
					var keys_to_fetch = [];
					if (typeof keys === 'string') {
						keys_to_fetch = [keys];
					} else {
						keys_to_fetch = keys;
					}
					for (i=0; i < keys_to_fetch.length; i++) {
						key = keys_to_fetch[i];
						if(window_localStorage.hasOwnProperty(prefix + key)) {
							window_localStorage.removeItem(prefix + key);
						}
					}
					if(callback) {
						callback();
					}
				},0);
			}, clear: function() {
				/* removes all items from storage */
				for (i=window_localStorage.length; i > 0; i--) {
					key = window_localStorage.key(i-1);
					if(key.substr(0,prefix.length) === prefix) {
						window_localStorage.removeItem(key);
					}
				}
			}
		}
		if(!window.chrome) {
			window.chrome = {
				storage: {
					local: shiv 
				}
			};
		} else {
			window.chrome.storage = {
				local: shiv
			};
		}
	} 
})(this);
