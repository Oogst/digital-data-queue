/** @license Copyright 2017-2019 Oogst. All rights reserved. */

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

"use strict";

import * as _lib from './digital-data-lib';

/**
* digital-data-queue library
*
* @class DigitalDataQueue
* @constructor
*/
class DigitalDataQueue {
	constructor(digitalData, queue, listeners = [], options = {}) {
		// Constructor
		this.queue = queue;
		this.version = '1.0';
		this.digitalData = digitalData;
		this.model = {};
		this.listeners = listeners;
		
		// Default options
		const defaults = {
			history: true,
			debug: false,
			transform: false,
			transformHandler: function(event) { return event; }
		};      

		let opts = Object.assign({}, defaults, options);
		this.options = {};
		Object.keys(defaults).forEach(prop => {
        	this.options[prop] = opts[prop];
   	 	});

		// Activate debug when cookie set
   	 	if (_lib.getCookie('ddq_debug') == 'true') {
   	 		this.options.debug = true;
   	 	}

   	 	// Activate console logs when debugging is enabled
   	 	if (this.options.debug === true) {
            this.listeners.push(_lib.logConsole);
        }

        // Private
		this._exec = false;
		this._unprocessed = [];
		this._transformed = [];
		this._listeners = this.listeners.length;

		// Process existing data / history
		this.processEvents(digitalData, !this.options.history);
		
		// Extend push() function
		const originalPush = digitalData.push;
	    digitalData.push = (...events) => {
	    	this.processEvents(events);
	    	return originalPush.apply(digitalData, events);
	    }
	}
	
	// Get key in model
	get(key) {
	    let target = this.model;
	    const split = key.split('.');
	    for (let i = 0; i < split.length; i++) {
	        if (target[split[i]] === undefined) return undefined;
	        target = target[split[i]];
	    }
	    return target;
	}

	// Set key in model
	set(key, value) {
		_lib.merge(_lib.expandKeyValue(key, value), this.model);
	}

	// Deep cloning of objects
	clone(object) {
		return _lib.clone(object);
	}

	// Get cookie helper function
	getCookie(name) {
		return _lib.getCookie(name);
	}

	// Set cookie helper function
	setCookie(name, value, days) {
		return _lib.setCookie(name, value, days);
	}

	// Process events in queue
    processEvents(events, skipListener) {
        this._unprocessed.push(...events);

        while (this._exec === false && this._unprocessed.length > 0) {
            // Raw event ready for processing
            const originalUpdate = this._unprocessed.shift(); // TO-DO -> Check deep clone / performance
            
            // Transform
            // Deepclone update for transforming, otherwise it would affect the original update
            const update = this.options.transform ? this.options.transformHandler(_lib.clone(originalUpdate)) : originalUpdate;
            this._transformed.push(update);

            if (_lib.isArray(update)) {
            	// Type Array -> Execute command
                _lib.processCommand(update, this.model);
            } else if (_lib.isFunction(update)) {
            	// Type Function -> Do nothing
            } else if (_lib.isPlainObject(update)) {
            	// Type PlainObject -> Merge
                for (const key in update) {
                    _lib.merge(_lib.expandKeyValue(key, update[key]), this.model);
                }
            } else {
            	// Type Other -> Do nothing
                continue;
            }
            if (!skipListener) {
            	// Execute listeners
                this._exec = true;
                if (_lib.isArray(this.listeners)) {
                	for (let i = 0; i < this._listeners; i++) {
        				if (_lib.isFunction(this.listeners[i])) {
        					// Deepclone event objects so adjustments within listener functions doesn't affect the queue
        					this.listeners[i](_lib.clone(this.model), _lib.clone(update), _lib.clone(originalUpdate));
        				}
    				}
    			}
                this._exec = false;
            }
        }
    }
}
window.DigitalDataQueue = DigitalDataQueue;