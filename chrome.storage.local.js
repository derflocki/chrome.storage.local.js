if(__DEV__) {
	console.log("def");
}
if (typeof window !== 'undefined') {
	if (!(window.chrome && window.chrome.storage && window.chrome.storage.local)) {
		if (window.localStorage) {
			var window_localStorage = window.localStorage;
			var prefix = "chrome.storage.local.";
			var __listeners = [];
			var isFunc = function(obj) {
				return !!(obj && obj.constructor && obj.call && obj.apply);
			};
			var addListener = function(callback) {
				if (!isFunc(callback)) {
					return;
				}
				console.log("adding onChanged Listener", callback);
				__listeners.push(callback);
			};
			var fireChange = function(newValues) {
				//@see: https://developer.chrome.com/extensions/storage#event-onChanged
				//TODO: loop over all listeners and fire changes
				//function(object changes, string areaName) {...};
				//
				//changes are StorageChange instances
				//StorageChange
				//
				//properties
				//any	(optional) oldValue	
				//The old value of the item, if there was an old value.
				//
				//any	(optional) newValue	
				//The new value of the item, if there is a new value.
				if (__listeners.length === 0) {
					return;
				}
				var changes = {};
				var keys = Object.keys(newValues);
				var isArray = newValues.constructor === Array;
				for (var i = 0; i < keys.length; i++) {
					var k = keys[i];
					changes[k] = {
						newValue: isArray ? null : newValues[k]
					};
				}
				__listeners.forEach(function(listener) {
					listener.call(null, changes, "local");
				});
			};
			var shiv = {
				set: function(items, callback) {
					window.setTimeout(function() {
						var keys = Object.keys(items);
						for (var i = 0; i < keys.length; i++) {
							window_localStorage.setItem(prefix + keys[i], JSON.stringify(items[keys[i]]));
						}
						if (callback) {
							window.setTimeout(callback, 0);
						}
						//TODO: invoke listeners
						fireChange(items);
					}, 0);
				},
				get: function(keys, callback) {
					window.setTimeout(function() {
						var keys_to_fetch = [];
						var defaults = {};
						var items = {};
						var i = 0,
							key = "";
						if (keys === null) {
							for (i = 0; i < window_localStorage.length; i++) {
								key = window_localStorage.key(i);
								if (key.substr(0, prefix.length) === prefix) {
									items[key.substr(prefix.length)] = JSON.parse(window_localStorage.getItem(key));
								}
							}
						} else {
							switch (Object.prototype.toString.call(keys)) {
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
							for (i = 0; i < keys_to_fetch.length; i++) {
								key = keys_to_fetch[i];
								if (window_localStorage.hasOwnProperty(prefix + key)) {
									items[key] = JSON.parse(window_localStorage.getItem(prefix + key));
								} else {
									if (defaults.hasOwnProperty(key)) {
										items[key] = defaults[key];
									}
								}
							}
						}
						if (callback) {
							callback(items);
						}
					}, 0);
				},
				getBytesInUse: function(keys, callback) {
					window.setTimeout(function() {
						//TODO: just a stub for now
						callback(-1);
					}, 0);
				},
				remove: function(keys, callback) {
					window.setTimeout(function() {
						var keys_to_fetch = [];
						if (typeof keys === 'string') {
							keys_to_fetch = [keys];
						} else {
							keys_to_fetch = keys;
						}
						for (i = 0; i < keys_to_fetch.length; i++) {
							key = keys_to_fetch[i];
							if (window_localStorage.hasOwnProperty(prefix + key)) {
								window_localStorage.removeItem(prefix + key);
							}
						}
						if (callback) {
							callback();
						}
						//TODO: invoke listeners
					}, 0);
				},
				clear: function() {
					/* removes all items from storage */
					var removed = [];
					for (i = window_localStorage.length; i > 0; i--) {
						key = window_localStorage.key(i - 1);
						if (key.substr(0, prefix.length) === prefix) {
							window_localStorage.removeItem(key);
							removed.push(key);
						}
					}
					//TODO: invoke listeners
				}
			};
			if (!window.chrome) {
				window.chrome = {
					storage: {
						local: shiv,
						onChanged: {
							addListener: addListener
						}
					}
				};
			} else {
				window.chrome.storage = {
					local: shiv,
					onChanged: {
						addListener: addListener
					}
				};
			}
		}
	}
}
