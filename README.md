# digital-data-queue

## Introduction

digital-data-queue (ddq) is a helper / middleware library between a "datalayer" or "data queue" and Tag Management / tracking solutions. It promotes the use of a vendor agnostic datalayer.

### Features
- Consumes events passed into an data (event) queue or datalayer.
- Trigger listeners (connectors) on events in the queue
- Events are merged into a data model (object)
- Transform / filter data
- Replay events
- Debugging module

### Benefits
- No vendor specific knowledge required (e.g. vendor libraries), plain Javascript arrays and objects.
- No vendor lock-in / vendor agnostic, swap out vendors (TMS / DMP / tracking solutions) more easily.
- Datalayer not tied to vendor specific requirements.
- Lightweight (+/- 10 KB)
- Suitable for single page / event-driven applications .

### Use case examples
- Connect one or multiple event listeners (e.g. Tag Management Systems / tracking vendors)
- Connect data validators (e.g. JSON schema validation)
- Transform data to specific formats / business requirements before data is send to event listeners
- Switch queue listeners based on environments / sections of your application (websites vs hybrid applications)

## Get started
You can use the minified version of digital-data-queue included in this repository (ddq.min.js) or build your own version (see instructions below).

### Datalayer / Data queue
Example of a dataqueue (or datalayer) holding basic page information. The array "digitalData" holds objects that represents events and corresponding data. The digital-data-queue library is initialized on this array.

```js
// Defining digitalData array
window.digitalData = window.digitalData || []; 

// Example: Page event
digitalData.push({
	event: "page", // Eventtype
	page_type: "product_detail",
	product: [{
		product_id: "12345",
		product_name: "Red shoes",
		category: "Shoes",
		category_id: "456"
	}],
	user_id: "999999"
});

// Example: Click event
digitalData.push({
	event: "click", // Eventtype
	event_category: "product",
	product: [{
		product_id: "12345",
		product_name: "Red shoes",
		category: "Shoes",
		category_id: "456"
	}]
});
```

### Define eventlistener(s) / connector(s)
The event listener is fired on every new event in the queue or events that are already in the queue when initializing the library

```js
function eventListener(model,event,originalEvent) {
	// Do things
	console.log(event);
}
```

param | description    
---------------|--------------
model           | Merged data queue model        
event           | Transformed event data (original event when not tranfsormed)
originalEvent   | Original event       

### Initialize DigitalDataQueue on digitalData

```js
// When event listener(s) are depending on other libraries (e.g. Tag Management Systems), be sure these libraries are loaded first.

var _ddq = new DigitalDataQueue(digitalData, 'test_queue', [eventListener, secondEventListener], { 
	history: true, // Process history. Default: true 
	debug: false, // Force debug mode. Default: false Enable debug mode with the following command in your console "document.cookie="ddq_debug=true";"
	transform: false, // Transform data before processing. Default: false
	transformHandler: function(event) { return event; } // Transform function. Should always return event;
});
```

### Interact with the data queue model

```js
// Get values from the model
_ddq.get('page_type');
_ddq.get('product.product_id');
```

### Debugging

Enter the following command to set the debug cookie and enable debugging (console logs)

```js
document.cookie="ddq_debug=true";
```

## Build instructions

### Prerequisites

* [Install Node.js and npm](http://nodejs.org/download/)

```sh
$ cd digital-data-queue
$ npm install -g webpack
$ npm install
```

## Build
```sh
$ npm run build
```

## Authors

* **Krisjan Oldekamp**
* **Folkert Mudde**

## Acknowledgments

* Inspired by Google's data-layer-helper used within Google Tag Manager (https://github.com/google/data-layer-helper)
* Customer Experience Digital Data Layer (CEDDL) (https://www.w3.org/2013/12/ceddl-201312.pdf)

## To-do

* Optimization for long running applications
* Optimize browser tests

## License

This software is licensed under the Apache 2 license, quoted below.

> Copyright 2017-2019 Oogst [[https://www.oogstonline.nl](https://www.oogstonline.nl/)]

> Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

> [[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)]

> Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

