/*
 * Copyright (c) 2013, Intel Corporation, Jaguar Land Rover
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

/** 
 * @module Services
 */

/**
 * Class provides AMB related functionality utilizing `tizen.vehicle` API for signals used in HTML applications. This component is usually initialized by {{#crossLink "Bootstrap"}}{{/crossLink}} class
 * and can be later accessed using {{#crossLink "Bootstrap/carIndicator:property"}}{{/crossLink}} property. Signals recognized by this class needs to be registered in property
 * {{#crossLink "CarIndicator/_mappingTable:property"}}{{/crossLink}}.
 *
 * To attach and detach to particular property register new callback object using {{#crossLink "Bootstrap/carIndicator:addListener"}}{{/crossLink}} method, e.g.:
 *
 *     var listenerId = bootstrap.carIndicator.addListener({ 
 *        onSteeringWheelAngleChanged: function(newValue){
 *           // Process new value
 *        },
 *        onWheelBrakeChanged : function(newValue){
 *           // Process new value
 *        }
 *     });
 *
 *     // Unregister listener
 *     bootstrap.carIndicator.removeListener(listenerId);
 *
 * Currently following signals are recognized:
 *
 * * SteeringWheelAngle
 *   * SteeringWheelAngle
 * * WheelBrake
 *   * Engaged
 * * TirePressure
 *   * leftFront
 *   * rightFront
 *   * leftRear
 *   * rightRear
 * * DoorStatus
 *   * ChildLockStatus
 * * WindowStatus
 *   * FrontDefrost
 *   * RearDefrost
 * * HVAC
 *   * FanSpeed
 *   * TargetTemperatureRight
 *   * TargetTemperatureLeft
 *   * SeatHeaterRight
 *   * SeatHeaterLeft
 *   * AirConditioning
 *   * AirRecirculation
 *   * AirflowDirection
 * * LightStatus
 *   * Hazard
 *   * Head
 *   * Parking
 * * BatteryStatus
 * * FullBatteryRange
 * * ExteriorTemperature
 *   * Exterior
 * * InteriorTemperature
 *   * Interior
 * * WheelInformation
 *   * FrontWheelRadius
 * * AvgKW
 *   * AvgKW
 * * VehicleSpeed
 * * Odometer
 * * Transmission
 *   * ShiftPosition
 * * ExteriorBrightness
 * * NightMode
 * * DirectionIndicationINST
 * * DirectionIndicationMS
 * * ACCommand
 * * RecircReq
 * * FrontTSetRightCmd
 * * FrontTSetLeftCmd
 * * FrontBlwrSpeedCmd
 * * HeatedSeatFRModeRequest
 * * HeatedSeatFRRequest
 * * HeatedSeatFLModeRequest
 * * HeatedSeatFLRequest
 * * FLHSDistrCmd
 * * FRHSDistrCmd
 *
 * @class CarIndicator
 * @constructor
 */

var CarIndicator = function () {
	"use strict";
	console.info("Starting up service CarIndicator");
};

function parseInteger(value) {
	"use strict";
	return parseInt(value, 10);
}

function parseTirePressure(value) {
	"use strict";
	var floatValue = parseFloat(value).toFixed(2);
	if (floatValue > 180 && floatValue < 220) {
		floatValue = "OK";
	}
	return floatValue;
}

/**
 * Array of registered listeners
 * @type Object
 * @property _listeners
 * @private
 */
CarIndicator.prototype._listeners = {};

/**
 * Array of registered listener IDs.
 * @type Array
 * @property _listenerIDs
 * @private
 */
CarIndicator.prototype._listenerIDs = [];

/**
 * Signal mapping table.
 * Each entry should form an object
 * @property _mappingTable
 * @private
 * @type Object
 */
CarIndicator.prototype._mappingTable = {
	/*
	 ZONE_None   = 000000;
	 ZONE_Front  = 000001;
	 ZONE_Middle = 000010;
	 ZONE_Right  = 000100;
	 ZONE_Left   = 001000;
	 ZONE_Rear   = 010000;
	 ZONE_Center = 100000;
	 */
	"InCarTemp": {					            // Used as subscribe name in tizen.vehicle.subscribe(), unless subscribeName is defined below.
		// DON'T ask me why.  (I said ***don't*** ask!)
		propertyName: "inCarTemp",		        // Key of data value in returned tuple from subscribe
		onChangedSignalName: "InsideTemp",	    // the middle piece of on*something*Changed (case is ignored, value is arbitrary but must match your on<X>Changed name.)
		subscribeName: "InCarTemp",		        // Name in tizen.vehicle.subscribe(), if defined will be used instead of key of this object
		conversionFunction: parseInteger,       // Conversion function (see entries below...)
		zone: "000000"
	},
	/* this is for steeringWheel game controler */
	"SteeringWheelAngle": {
		propertyName: "SteeringWheelAngle",
		onChangedSignalName: "SteeringWheelAngle",
		subscribeName: "SteeringWheelAngle",
		conversionFunction: function (value) {
			"use strict";
			value = parseInt(value, 10);
			var returnValue = 0;
			if (value <= 180 && value > 0) {
				returnValue = (1 * (value / 6)) - 30;
			} else if (value <= 360 && value > 180) {
				returnValue = ((value - 179) / 6);
			} else if (value === 0) {
				returnValue = -30;
			}
			return returnValue;
		},
		zone: "000000"

	},
	"WheelBrake": {
		propertyName: "Engaged",
		onChangedSignalName: "WheelBrake",
		subscribeName: "WheelBrake",
		zone: "000000"
	},
	/* end steeringWheel game controler*/
	"TirePressureLeftFront": {
		propertyName: "leftFront",
		onChangedSignalName: "tirePressureLeftFront",
		subscribeName: "TirePressure",
		conversionFunction: parseTirePressure,
		zone: "000000"
	},
	"TirePressureRightFront": {
		propertyName: "rightFront",
		onChangedSignalName: "tirePressureRightFront",
		subscribeName: "TirePressure",
		conversionFunction: parseTirePressure,
		zone: "000000"
	},
	"TirePressureLeftRear": {
		propertyName: "leftRear",
		onChangedSignalName: "tirePressureLeftRear",
		subscribeName: "TirePressure",
		conversionFunction: parseTirePressure,
		zone: "000000"
	},
	"TirePressureRightRear": {
		propertyName: "rightRear",
		onChangedSignalName: "tirePressureRightRear",
		subscribeName: "TirePressure",
		conversionFunction: parseTirePressure,
		zone: "000000"
	},
	"ChildLock": {
		propertyName: "ChildLockStatus",
		onChangedSignalName: "childLock",
		subscribeName: "DoorStatus",
		zone: "000000"
	},
	"FrontDefrost": { // "FrontDefrosterStatus", actually 0..3
		propertyName: "HFSCommand",
		onChangedSignalName: "frontDefrost",
		subscribeName: "HFSCommand",
		zone: "000000"
	},
	"RearDefrost": { // "RearDefrosterStatus", actually values 0..3!
		propertyName: "HRWCommand",
		onChangedSignalName: "rearDefrost",
		subscribeName: "HRWCommand",
		zone: "000000"
	},
	"FanSpeed": { // FrontBlwrSpeedCmd
		propertyName: "FrontBlwrSpeedCmd",
		onChangedSignalName: "fanSpeed",
		subscribeName: "FrontBlwrSpeedCmd",
		conversionFunction: parseInteger,
		zone: "000000"
	},
	// --> Should not be separate from "FrontTSetRightCmd"
	"TargetTemperatureRight": {    // FrontTSetRightCmd
		propertyName: "frontTSetRightCmd",
		onChangedSignalName: "targetTemperatureRight",
		subscribeName: "FrontTSetRightCmd",
		conversionFunction: parseInteger,
		zone: "000000"
	},
	// --> Should not be separate from "FrontTSetLeftCmd"
	"TargetTemperatureLeft": {     // FrontTSetLeftCmd
		// propertyName : "TargetTemperature",
		propertyName: "frontTSetLeftCmd",
		onChangedSignalName: "targetTemperatureLeft",
		// subscribeName : "HVAC",
		subscribeName: "FrontTSetLeftCmd",
		conversionFunction: parseInteger,
		// zone : "001000"
		zone: "000000"
	},
	"Hazard": {     // This is not an actual value on the JLR can bus...
		propertyName: "Hazard",
		onChangedSignalName: "hazard",
		subscribeName: "LightStatus",
		zone: "000000"
	},
	"Head": {
		propertyName: "Head",
		onChangedSignalName: "frontLights",
		subscribeName: "LightStatus",
		zone: "000000"
	},
	"Parking": {
		propertyName: "Parking",
		onChangedSignalName: "rearLights",
		subscribeName: "LightStatus",
		zone: "000000"
	},
	"AirConditioning": {
		propertyName: "ACCommand",
		onChangedSignalName: "fan",
		subscribeName: "ACCommand",
		zone: "000000"
	},
	"AirRecirculation": {
		propertyName: "RecircReq",
		onChangedSignalName: "airRecirculation",
		subscribeName: "RecircReq",
		zone: "000000"
	},
	"AirflowDirection": {
		propertyName: "FLHSDistrCmd",
		onChangedSignalName: "airflowDirection",
		subscribeName: "FLHSDistrCmd",
		conversionFunction: parseInteger,
		zone: "000000"
	},
	"BatteryStatus": {
		propertyName: "BatteryStatus",
		onChangedSignalName: "batteryStatus",
		subscribeName: "BatteryStatus",                 // Added by pfh
		conversionFunction: parseInteger,
		zone: "000000"
	},
	"FullBatteryRange": {
		propertyName: "FullBatteryRange",
		onChangedSignalName: "fullBatteryRange",
		subscribeName: "FullBatteryRange",              // Added by pfh
		conversionFunction: parseInteger,
		zone: "000000"
	},
	"AmbientTemp": {
		propertyName: "ambientTemp",
		onChangedSignalName: "outsideTemp",
		subscribeName: "AmbientTemp",
		conversionFunction: parseInteger,
		zone: "000000"
	},
	"WheelAngle": {
		propertyName: "FrontWheelRadius",
		onChangedSignalName: "wheelAngle",
		subscribeName: "WheelInformation",
		conversionFunction: parseInteger,
		zone: "000000"
	},
	"Weather": {
		propertyName: "Weather",
		onChangedSignalName: "weather",
		subscribeName: "Weather",
		conversionFunction: parseInteger,
		zone: "000000"
	},
	"AvgKW": {
		propertyName: "AvgKW",
		onChangedSignalName: "avgKW",
		subscribeName: "AvgKW",
		conversionFunction: function (newValue) {
			"use strict";
			return parseFloat(newValue).toFixed(2);
		},
		zone: "000000"
	},
	"VehicleSpeed": {  // These values should be correct, but are not set-able.
		propertyName: "VehicleSpeed",
		onChangedSignalName: "speed",
		subscribeName: "VehicleSpeed",
		conversionFunction: parseInteger,
		zone: "000000"
	},
	"Odometer": {
		propertyName: "Odometer",
		onChangedSignalName: "odoMeter",
		subscribeName: "Odometer",
		conversionFunction: parseInteger,
		zone: "000000"
	},
	"TransmissionShiftPosition": {
		propertyName: "ShiftPosition",
		onChangedSignalName: "gear",
		conversionFunction: function (value) {
			"use strict";
			switch (value) {
				case 0:
					value = "N";
					break;
				case 64:
					value = "C";
					break;
				case 96:
					value = "D";
					break;
				case 128:
					value = "R";
					break;
				case 255:
					value = "P";
					break;
			}
			return value;
		},
		subscribeName: "Transmission",
		zone: "000000"
	},
	"Randomize": {
		propertyName: "Randomize",
		onChangedSignalName: "randomize",
		subscribeName: "Randomize",
		zone: "000000"
	},
	"ExteriorBrightness": {
		propertyName: "ExteriorBrightness",
		subscribeName: "ExteriorBrightness",
		onChangedSignalName: "exteriorBrightness",
		zone: "000000"
	},
	"NightMode": {
		propertyName: "NightMode",
		subscribeName: "NightMode",
		onChangedSignalName: "nightMode",
		zone: "000000"
	},
	"DirectionIndicationINST": {
		propertyName: "DirectionIndicationINST",
		onChangedSignalName: "DirectionIndicationINST",
		subscribeName: "DirectionIndicationINST",
		zone: "000000"
	},
	"DirectionIndicationMS": {
		propertyName: "DirectionIndicationMS",
		onChangedSignalName: "DirectionIndicationMS",
		subscribeName: "DirectionIndicationMS",
		zone: "000000"
	},
	"ACCommand": {
		propertyName: "ACCommand",
		onChangedSignalName: "ACCommand",
		subscribeName: "ACCommand",
		zone: "000000"
	},
	"RecircReq": {
		propertyName: "RecircReq",
		onChangedSignalName: "RecircReq",
		subscribeName: "RecircReq",
		zone: "000000"
	},
	"FrontTSetRightCmd": {
		propertyName: "FrontTSetRightCmd",
		onChangedSignalName: "FrontTSetRightCmd",
		subscribeName: "FrontTSetRightCmd",
		zone: "000000"
	},
	"FrontTSetLeftCmd": {
		propertyName: "FrontTSetLeftCmd",
		onChangedSignalName: "FrontTSetLeftCmd",
		subscribeName: "FrontTSetLeftCmd",
		zone: "000000"
	},
	"FrontBlwrSpeedCmd": {
		propertyName: "FrontBlwrSpeedCmd",
		onChangedSignalName: "FrontBlwrSpeedCmd",
		subscribeName: "FrontBlwrSpeedCmd",
		zone: "000000"
	},
	"HeatedSeatFRModeRequest": {
		propertyName: "HeatedSeatFRModeRequest",
		onChangedSignalName: "HeatedSeatFRModeRequest",
		subscribeName: "HeatedSeatFRModeRequest",
		zone: "000000"
	},
	"HeatedSeatFRRequest": {
		propertyName: "HeatedSeatFRRequest",
		onChangedSignalName: "SeatHeaterRight",
		subscribeName: "HeatedSeatFRRequest",
		zone: "000000"
	},
	"HeatedSeatFLModeRequest": {
		propertyName: "HeatedSeatFLModeRequest",
		onChangedSignalName: "HeatedSeatFLModeRequest",
		subscribeName: "HeatedSeatFLModeRequest",
		zone: "000000"
	},
	"HeatedSeatFLRequest": {
		propertyName: "HeatedSeatFLRequest",
		onChangedSignalName: "SeatHeaterLeft",
		subscribeName: "HeatedSeatFLRequest",
		zone: "000000"
	},
	"FLHSDistrCmd": {
		propertyName: "FLHSDistrCmd",
		onChangedSignalName: "FLHSDistrCmd",
		subscribeName: "FLHSDistrCmd",
		zone: "000000"
	},
	"FRHSDistrCmd": {
		propertyName: "FRHSDistrCmd",
		onChangedSignalName: "FRHSDistrCmd",
		subscribeName: "FRHSDistrCmd",
		zone: "000000"
	},
	// Engine status: use this to determine if engine is on or not, via;
	// bootstrap.carIndicator.getStatus("EngineRunningStatus");
	"EngineRunningStatus": {
		propertyName: "EngineRunningStatus",
		onChangedSignalName: "EngineRunningStatus",
		subscribeName: "EngineRunningStatus",
		zone: "000000"
	},
};

/**
 * Created by paulha on 2/28/14.
 */

/**
 *   Comparison function to compare field names without regard to capitalization,
 *   intended to be passed as compareFunction parameter of findEntryWithValue.
 *
 *   Scans fields of object, looking for any field who's name matches fieldName, ignoring
 *   capitalization, and who's value also matches searchValue.  Returns boolean true on match, else false.
 *
 *   Terminates scan on first field name match found--this may not be the desired behavior because there
 *   could be multiple fields with alternate capitalizations of the same field name.
 *
 *   @param object      Object to be searched for matching fields.  Will normally be a map of some kind.
 *   @param fieldName   Test, name of the field to search for-- Case will be ignored.
 *   @param searchValue Return "true" when the found field has this value
 */
compareNoCase = function (object, fieldName, searchValue) {
	if (object == undefined || fieldName == undefined || searchValue == undefined) return false
	for (var prop in object) {
		// -- Search for a property name (lowercased) that matches the fieldName (also lowercased)...
		if (prop.toLowerCase && fieldName.toLowerCase ? prop.toLowerCase() == fieldName.toLowerCase() : prop == fieldName) {

			// -- If you found them, check to see if the value matches, using a case insensitive compare where possible:
			return object[prop].toLowerCase && searchValue.toLowerCase ?
				object[prop].toLowerCase() == searchValue.toLowerCase() :   // both have toLowerCase()
				object[prop] == searchValue;                                // one doesn't have toLowerCase()...
		}
	}
	return false;
};

/**
 *   Utility function to search a mapping object for objects that contain a property having a specified value.
 *
 *   @param mapObject       An (map) object containing other (map) objects (e.g., a hash of hashes).
 *   @param propertyName    Textual name of the property for which to search.
 *   @param searchValue     When propertyName is found, check for this value.
 *   @param {undefined | Array | Object}    accumulatorCollection   If undefined, the first match found
 *                          in mapObject is returned.  If this is an array, all matches are found and
 *                          appended to the returned array.  If this is a (map) object, each match in
 *                          inserted into the resulting object under the original key.
 *   @param {undefined | function(object, propertyName, searchValue)} compareFunction  If undefined, look
 *                          for exact property name and value match.  If function is provided, function
 *                          should return true to cause the current entry to be added to the output results.
 *
 */
function findEntryWithValue(mapObject, propertyName, searchValue, accumulatorCollection, compareFunction) {
	//
	// -- accumulatorCollection and compareFunction are both optional and may be in any order
	//    to make the calling code more readable.  So the first job is to sort out what's been passed
	//
	var coll = typeof(compareFunction) == "object" ?
		compareFunction :
		(typeof(accumulatorCollection) == "object" ? accumulatorCollection : undefined);
	var func = typeof(compareFunction) == "function" ?
		compareFunction :
		(typeof(accumulatorCollection) == "function" ? accumulatorCollection : undefined);

	var result = coll;  //  accumulatorCollection;

	// -- Use either the passed in compare routine or provide a default comparison...
	var compare = typeof( func ) == "function" ? func :
		function (object, fieldName, searchValue) {
			return object[fieldName] == searchValue;
		};

	// -- Scan the mapping object for matching properties and either return the found entry or
	//    add it to the output list
	for (var entry in mapObject) {
		if (compare(mapObject[entry], propertyName, searchValue)) {
			if (Array.isArray(result)) {
				result.push(mapObject[entry]);
			} else if (typeof( result ) == "object") {
				result[ entry ] = mapObject[entry];
			} else {
				return mapObject[entry];
			}
		}
	}
	return result;
}

/**
 * Return a string that duplicates the passed in string except the first character in the returned string
 * is guaranteed to be lower case.
 *
 * @param s
 * @returns {string}
 */
function makeFirstLowerCase(s) {
	return s[0].toLowerCase() + s.substring(1)
}

/**
 * Return a string that duplicates the passed in string except the first character in the returned string
 * is guaranteed to be upper case.
 *
 * @param s
 * @returns {string}
 */
function makeFirstUpperCase(s) {
	return s[0].toUpperCase() + s.substring(1)
}

/* End paulha...  */

/**
 * This method adds listener object for car events. Object should define function callbacks taking signal names from mapping table, e.g.:
 * @example
 *     {
 *        onBatteryChange: function(newValue, oldValue) {}
 *     }
 * Methods are called back with new and last known values.
 * @method addListener
 * @param callback {Object} object with callback functions.
 * @return {Integer} WatchID for later removal of listener.
 */
CarIndicator.prototype.addListener = function (aCallbackObject) {
	"use strict";
	var id = Math.floor(Math.random() * 1000000);
	var self = this;
	this._listeners[id] = aCallbackObject;
	this._listenerIDs.push(id);

	// If tizen isn't available, warn and go through the motions anyway.
	if (!tizen) console.warn("Tizen API is not available, cannot subscribe to signals", aCallbackObject);

	//  var subscribeCallback = function (data) {
	//	    self.onDataUpdate(data, self);
	//  };
	for (var i in aCallbackObject) {
		var prop = i.replace("on", "").replace("Changed", "");

		var mapping = findEntryWithValue(this._mappingTable, "onChangedSignalName", prop, compareNoCase);
		// console.debug("findEntryWithValue -->", mapping);

		// Update subscription count... 0 if undefined else ++
		mapping.subscribeCount = mapping.subscribeCount + 1 || 1;

		// get the assigned zone for this signal (Ultimately, we're going to pretty much ignore zone for now...)
		var zone = parseInt(mapping.zone, 2);

		// This seems pretty late to test for this...
		if (tizen) {
			// Do an initial get() to read the current value for the subscribed data.
			// todo: check what's going on with all this "nightmode" stuff...
			if (!( mapping.subscribeName.toString().trim().toLowerCase() === "nightmode" && id === this._listenerIDs[0] )) {
				var setUpData = tizen.vehicle.get(mapping.subscribeName, zone);

				// --> Note that we don't need to use the subterfuge below because the content of mapping
				//     won't change in this case...
				self.onDataUpdate(setUpData, self, mapping, id);
			}

			//
			//  A bit tricky-- We want to preserve the mapping entry we found above for onDataUpdate when it gets called
			//  later.  But addListener() will get called many times and mapping has a different value for each signal.
			//  This anonymous function serves to retain the mapping entry value at the time of the subscribe without
			//  letting subsequent subscribes (to other signals) modify the context for the current subscribe.
			//
			var setupCallback = function() {
				var stable_mapping = mapping;
				tizen.vehicle.subscribe(mapping.subscribeName, function (data) { self.onDataUpdate(data, self, stable_mapping );	}, zone);
			}();
		}
	}

	return id;
};
/**
 * This method is call as callback if data oon tizen.vehicle was change onDataUpdate
 * @method onDataUpdate
 * @param data {object} object whit new data.
 * @param self {object} this carIndicator Object.
 * @param mapping {object} mapping entry from _mappingTable.
 * @param listenersID {int} id of listener.
 */
CarIndicator.prototype.onDataUpdate = function (data, self, mapping, listenersID) {
	"use strict";

	if (data == undefined) return;

	var zone = data.zone.toString(2);
	//var mapping;

	// Scan properties that comes from the AMB object, including time, sequence, etc.
	// todo: There's an opportunity to gain some advantage here cause mapping will tell us the name of the value entry
	for (var property in data) {
		// check that it's an inherent property, not an inherited one
		if (!data.hasOwnProperty(property)) continue;

		// Ignore time, zone, and *Sequence fields
		if (property == "time" || property == "zone" || property.search("Sequence") !== -1) continue;

		mapping = findEntryWithValue(this._mappingTable, "propertyName", property, compareNoCase);

		// (Ignoring zone here, because it doesn't pertain to how we're defining signals now...)
		// todo: It should now be impossible for mapping to be undefined...
		if (mapping) {
			var value = data[property];

			// if a conversion function is defined, call it else the value is what's just been read.
			value = mapping.conversionFunction ? mapping.conversionFunction(value) : value;

			var previousValue = self.status[mapping.onChangedSignalName];

			// -- Only run callback if the value has actually changed.
			//    Also, here's that peculiar "nightMode" thing again.
			console.debug("AMB property " +  previousValue + " -> " + value);
			if (previousValue !== value || property.toUpperCase() === "nightMode".toUpperCase()) {
				console.debug("AMB property '" + property + "' has changed to new value:" + value);
				self.status[ mapping.onChangedSignalName ] = value;

				var callbackName = "on"+makeFirstUpperCase( mapping.onChangedSignalName )+"Changed";
				var listener;

				if (listenersID) {
					//
					// --> Handle the first callback than occurs as a result of setting up a the subscribe:
					//
					//     (Actually, it's not clear to me why this has to be handled separately from other callbacks...)
					//     I notice is that this will call only the newly subscribed routine with a value.
					//
					listener = self._listeners[listenersID];

					if (typeof (listener[callbackName]) === 'function') {
						try {
							listener[callbackName](value, previousValue);
						} catch (ex) {
							console.error("Error occured while executing listener", ex);
						}
					}
				} else {
					for (var i in self._listeners) {
						if (!self._listeners.hasOwnProperty(i)) continue;

						listener = self._listeners[i];
						if (typeof (listener[callbackName]) === 'function') {
							try {
								listener[callbackName](value, previousValue);
							} catch (ex) {
								console.error("Error occured while executing listener", ex);
							}
						}
					}
				}
			}

		} else {
			console.warn("Mapping for property '", property, " in ", data, "' is not defined");
		}
	}
};

/**
 * This method removes previously added listener object. Use WatchID returned from addListener method.
 *
 * @deprecated  This function uses a feature (unsubscribe) that is NOT implemented in the tizen.vehicle interface to AMB!
 *              Current code never calls this routine.
 *
 * @method      removeListener
 *
 * @param       aId {Integer} WatchID.
 */
// todo: It really should be enough to remove the callback routine from the callback list...
CarIndicator.prototype.removeListener = function (aId) {
	//
	// todo:    Not clear that this actually works-- what if there are multiple subscribes?  How do we
	//          unsubscribe the right one?  Probably need to use something that is handle based...
	//
	"use strict";
	var listener = this._listeners[aId];

	for (var i in listener) {
		if (listener.hasOwnProperty(i)) {
			var prop = i.replace("on", "").replace("Changed", "");

			for (var signal in this._mappingTable) {
				if (this._mappingTable.hasOwnProperty(signal)) {
					var mapping = this._mappingTable[signal];

					if (mapping.subscribeCount === 0) { // Last signal, unscubscribe
						// TODO: Note that this function does not exist!
						tizen.vehicle.unsubscribe(signal);
						mapping.subscribeCount = undefined;
					} else if (typeof (mapping.subscribeCount) !== 'undefined') {
						mapping.subscribeCount--;
					}
				}
			}
		}
	}

	this._listeners[aId] = undefined;
};

/**
 * status object
 * @property status
 * @type Object
 * @private
 */
CarIndicator.prototype.status = {
	fanSpeed: 0,
	targetTemperatureRight: 0,
	targetTemperatureLeft: 0,
	hazard: false,
	frontDefrost: false,
	rearDefrost: false,
	frontLeftwhell: "",
	frontRightwhell: "",
	rearLeftwhell: "",
	rearRightwhell: "",
	childLock: false,
	frontLights: false,
	rearLights: false,
	fan: false,
	seatHeaterRight: 0,
	seatHeaterLeft: 1,
	airRecirculation: false,
	airflowDirection: 0,
	batteryStatus: 58,
	fullBatteryRange: 350,
	outsideTemp: 74.2,
	insideTemp: 68.2,
	wheelAngle: 0,
	weather: 1,
	avgKW: 0.28,
	speed: 65,
	odoMeter: 75126,
	gear: "D",
	nightMode: false,
	randomize: false,
	exteriorBrightness: 1000
};

/**
 * This method return status object in callback
 * @method getStatus
 *
 * @return  Returns the value of the signal
 *
 * @param   signalName  {string}    Name of the signal to retrieve
 *
 * @param   callback    {function}  Callback function.
 */
CarIndicator.prototype.getStatus = function (signalName, callback) {
	"use strict";
	var mappingEntry;
	var result = undefined;

	// Look up info for this signal
	mappingEntry = findEntryWithValue(this._mappingTable, "onChangedSignalName", signalName, compareNoCase);

	// -- If we found the entry, using the info there map the signalName onto the actual CAN bus name, and onto the name
	//    of the data value property in the object passed to tizen.vehicle.set (they aren't the same!)
	if (mappingEntry) {
		var mappingProperty = mappingEntry.propertyName;
		var objectName = mappingEntry.subscribeName;
		var propertyValue;

		propertyValue = tizen.vehicle.get( objectName );

		if (propertyValue) {
			result = propertyValue[makeFirstLowerCase(mappingProperty)];
		} else {
			console.debug("getStatus: Get ", signalName, mappingEntry, " --> ", propertyValue, " = tizen.vehicle.get( ", objectName, " )");
		}
		if (result == undefined) {
			console.debug("tizen.vehicle.get( ", objectName, " ) returns propertyValue = ", propertyValue, mappingEntry, mappingProperty, objectName);
		}
	} else {
		console.error("getStatus: Unable to map onChangedSignalName for ", signalName, " ) ", this._mappingTable);
	}
	if (!!callback) {
		callback(result);
	}
	return result;
};

/**
 * this method set status for property in tizen.vehicle and status object
 *
 * @method  setStatus
 *
 * @param   signalName {string}     Name of the signal to set (note this is *not* the CAN name for the signal!)
 *
 * @param   newValue {??}           Value to be assigned to signal.
 *
 * @param   text_status {string}    new status .
 *
 * @param   callback {function}     Unconditionally called at conclusion of setStatus(), regardless of other errors.
 *
 */
CarIndicator.prototype.setStatus = function (signalName, newValue, callback, zone) {
	"use strict";
	var mappingEntry;

	// Look up info for this signal
	mappingEntry = findEntryWithValue(this._mappingTable, "onChangedSignalName", signalName, compareNoCase);

	// -- If we found the entry, using the info there map the signalName onto the actual CAN bus name, and onto the name
	//    of the data value property in the object passed to tizen.vehicle.set (they aren't the same!)
	if (mappingEntry) {
		var mappingProperty = mappingEntry.propertyName;
		var objectName = mappingEntry.subscribeName;
		var propertyZone = parseInt(mappingEntry.zone, 2);
		var propertyValue = {};
		propertyValue[mappingProperty] = newValue;
		propertyValue.zone = propertyZone;

		tizen.vehicle.set(objectName, propertyValue, function (msg) {
			console.error("Set error for " + signalName + ": " + objectName + " - " + msg + " value: " + newValue);
			console.debug("setStatus: Set ", signalName, " zone ", zone, " --> tizen.vehicle.set( ", objectName, propertyValue, " )");
		});
	} else {
		console.error("setStatus: Unable to map onChangedSignalName for ", signalName, ":", zone, " ) ", this._mappingTable);
	}
	if (!!callback) {
		callback();
	}
};
