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

export function processCommand(command, model) {
    if (!isString(command[0])) return;
    const path = command[0].split('.');
    const method = path.pop();
    const args = command.slice(1);
    let target = model;
    for (let i = 0; i < path.length; i++) {
        if (target[path[i]] === undefined) return;
        target = target[path[i]];
    }
    target[method](...args);
}

export function expandKeyValue(key, value) {
    const result = {};
    let target = result;
    const split = key.split('.');
    for (let i = 0; i < split.length - 1; i++) {
        target = target[split[i]] = {};
    }
    target[split[split.length - 1]] = value;
    return result;
}

export function hasOwn(value, key) {
    return Object.prototype.hasOwnProperty.call(Object(value), key);
}

export function getObjectType(value) {
    return Object.prototype.toString.call(value)
}

export function isArray(value) {
    return (typeof Array.isArray === 'function' && Array.isArray(value)) || getObjectType(value) === '[object Array]'
}

export function isFunction(value) {
    return typeof value === 'function' || getObjectType(value) === '[object Function]'
}

export function isString(value) {
    return typeof value === 'string' || getObjectType(value) === '[object String]'
}

export function isObject(value) {
    return value !== null && typeof value === 'object'
}

export function isPlainObject(value) {
    return isObject(value) && value.__proto__ === Object.prototype
}

export function merge(from, to) {
    for (const property in from) {
        if (hasOwn(from, property)) {
            const fromProperty = from[property];
            if (isArray(fromProperty)) {
                if (!isArray(to[property])) to[property] = [];
                merge(fromProperty, to[property]);
            } else if (isPlainObject(fromProperty)) {
                if (!isPlainObject(to[property])) to[property] = {};
                merge(fromProperty, to[property]);
            } else {
                to[property] = fromProperty;
            }
        }
    }
}

export function clone(object) {
    return isObject(object) ? JSON.parse(JSON.stringify(object)) : {}; // TO-DO: Check in future, doesn't support cloning of functions
}

export function getCookie(name) {
    var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? v[2] : null;
}

export function setCookie(name, value, days) {
    var d = new Date;
    d.setTime(d.getTime() + 24*60*60*1000*days);
    document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
}

export function logConsole(model, event, sourceEvent) {
    console.log('%c(digital-data-queue)', 'color: blue; font-weight: bold;');
    console.log(' EVENTDATA (TRANSFORMED) %o', event);
    console.log(' EVENTDATA (SOURCE) %o', sourceEvent);
    console.log(' MODELSTATE %o', model);
    if (isFunction(window.ddqDebugger)) {
        window.ddqDebugger(model, event, sourceEvent);
    }
}