var assert = chai.assert;

describe('DigitalDataQueue', function() {
	var _ddq;
	var digitalData = [];
	var eventListenerSpy;

	before(function() {
    	//eventListenerSpy = sinon.spy(model, event, originalEvent);
    	eventListenerSpy = sinon.spy();
    	_ddq = new DigitalDataQueue(digitalData, 'test_queue', [eventListenerSpy], { 
			history: true, 
			debug: false,
			transform: true,
			transformHandler: function(event) {
				event.d = 'e';
				if (typeof event.b != 'undefined') { event.b = event.b.toUpperCase(); }
				return event;
			}
		});
  	});

  	describe('Init', function() {
		it('should contain required properties and corresponding types', function() {
			assert.typeOf(_ddq.queue, 'string');
			assert.typeOf(_ddq.version, 'string');
			assert.typeOf(_ddq.digitalData, 'array');
			assert.typeOf(_ddq.listeners, 'array');
			assert.typeOf(_ddq.model, 'object');
			assert.typeOf(_ddq.options, 'object');
			assert.typeOf(_ddq._exec, 'boolean');
			assert.typeOf(_ddq._listeners, 'number');
			assert.typeOf(_ddq._transformed, 'array');
			assert.typeOf(_ddq._unprocessed, 'array');
		});
		it('should contain 1 event listener', function() {
			assert.equal(_ddq._listeners, 1);
		});
	});

	describe('Basic functionality', function() {
		
		before(function() {
			digitalData.push({
				'event': 'a',
				'b': 'c',
				'f': {
					'a': 'b',
					'c': 'd',
					'e': [1,2,3],
					'h': [6,7]
				},
				'h': [6,7]
			});
		});	

		describe('<Event> listener functionality', function() {
			
	  		it('should activate listener 1 time', function() {
				assert.equal(eventListenerSpy.callCount, 1);
		    });
		    it('should have 3 arguments', function() {
				assert.equal(eventListenerSpy.args[0].length, 3);
		    });
		    it('arguments should be of type object', function() {
				assert.typeOf(eventListenerSpy.args[0][0], 'object');
				assert.typeOf(eventListenerSpy.args[0][1], 'object');
				assert.typeOf(eventListenerSpy.args[0][2], 'object');
		    });
		});
		describe('<Event> data & transform', function() {
		    it('eventlistener argument (originalEvent) should match (untransformed) datalayer event', function() {
				var eventData = {
					'event': 'a',
					'b': 'c',
					'f': {
						'a': 'b',
						'c': 'd',
						'e': [1,2,3],
						'h': [6,7]
					},
					'h': [6,7]
				};
				assert.deepEqual(eventListenerSpy.args[0][2], eventData);
		    });
		    it('eventlistener argument (originalEvent) should match (untransformed) datalayer event in digitalData[]', function() {
				assert.deepEqual(eventListenerSpy.args[0][2], digitalData[0]);
		    });
		    it('eventlistener argument (originalEvent) should match (untransformed) datalayer event in _ddq.digitalData[]', function() {
				assert.deepEqual(eventListenerSpy.args[0][2], _ddq.digitalData[0]);
		    });
			it('eventlistener argument (event) should match (transformed) datalayer event', function() {
				var eventDataTransformed = {
					'event': 'a',
					'b': 'C',
					'd': 'e',
					'f': {
						'a': 'b',
						'c': 'd',
						'e': [1,2,3],
						'h': [6,7]
					},
					'h': [6,7]
				};
				assert.deepEqual(eventListenerSpy.args[0][1], eventDataTransformed);
				assert.equal(_ddq.get('b'), 'C');
				assert.equal(_ddq.get('d'), 'e');
		    });
		    it('eventlistener argument (model) should match (transformed) datalayer event', function() {
				var model = {
					'event': 'a',
					'b': 'C',
					'd': 'e',
					'f': {
						'a': 'b',
						'c': 'd',
						'e': [1,2,3],
						'h': [6,7]
					},
					'h': [6,7]
				};
				assert.deepEqual(eventListenerSpy.args[0][0], model);
		    });
		});
		describe('<Model> merging', function() {
			before(function() {
				digitalData.push({
					'event': 'b',
					'b': 'x',
					'f': {
						'a': 'z',
						'f': 'g',
						'e': [4]
					},
					'h': { 
						'm': 's'
					}
				});
			});	

			it('should overwrite <String> to <String>', function() {
				assert.equal(eventListenerSpy.args[1][0].b, 'X');
				assert.equal(eventListenerSpy.args[1][0].f.a, 'z');
				assert.equal(_ddq.get('f.a'), 'z');
			});

			it('should recursively merge <Object> to <Object>', function() {
				assert.deepEqual(eventListenerSpy.args[1][0].f, {
					'a': 'z',
					'c': 'd',
					'f': 'g',
					'e': [4,2,3],
					'h': [6,7]
				});
				assert.equal(_ddq.get('f.e.0'), 4);
				assert.equal(_ddq.get('f.h.1'), 7);
			});

			it('should recursively merge <Array> to <Array>', function() {
				assert.deepEqual(eventListenerSpy.args[1][0].f.e, [4,2,3]);
				assert.equal(_ddq.get('f.e.1'), 2);
			});

			it('should overwrite <Array> to <Object>', function() {
				assert.deepEqual(eventListenerSpy.args[1][0].h, { 'm': 's' });
			});
		});
	});	
});