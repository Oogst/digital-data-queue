// Add as a Tealium extension, fire before load once.
// Disable default pageview / view() event on load, since the DDQ connector uses the "page" event.

// Declare
window.digitalData = window.digitalData || [];

// Settings
var connector = 'ddq-connector-tealium';

// Push Tealium ready event
digitalData.push({
    "event": "tealium.ready",
    "timestamp": Date.now()
});

// Mapping digitalData events to Tealium iQ / Tag Management
function tealiumConnector(model, event, sourceEvent) {
   
    // Declare utag_data / UDO (Tealium datalayer)
    window.utag_data = window.utag_data || [];
   
    // Tealium specific transformations
    var _event = event;
    var _model = model;
    
    // Mapping digital-data-queue events to Tealium
    if (typeof _event.event != 'undefined') {
        switch(_event.event) {
            case "page":
                window.utag_data = _event;
                window.utag.view(window.utag_data, function() { window.utag.DB("digital-data-queue: Event: \"" + _event.event + "\" to utag.view()"); });
                break;
            default:
                _model.event_name = _model.event;
                // Depending on situation, also possible to use event instead of model
                window.utag.link(_model, function() { window.utag.DB("digital-data-queue: Event : \"" + _event.event + "\" to utag.link()"); });
        }
    } else {
        // No event property set
    }
}

// Init Digital Data Queue model
window.digitalDataQueue = new DigitalDataQueue(digitalData, connector, [tealiumConnector], { 
    history: true,
    debug: false,
    transform: false,
    transformHandler: function(event) { return event; }
});
