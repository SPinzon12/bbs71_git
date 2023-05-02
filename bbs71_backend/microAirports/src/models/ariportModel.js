const { Schema, model } = require('mongoose');

const AirportSchema = Schema(
    {
        departure: {
            airport: {
                origin: { type: String },
                originAirportID: { type: Number },
                originCityName: { type: String }
            },
            crsDepTime: { type: String },
            depTime: { type: String },
            depDelay: { type: Number },
            depDel15: { type: Number },
            wheelsOff: { type: String },
            taxiOut: { type: Number }
        },

        arrival: {
            airport: {
                dest: { type: String },
                destAirportID: { type: Number },
                destCityName: { type: String }
            },
            crsArrTime: { type: String },
            arrTime: { type: String },
            arrDelay: { type: Number },
            arrDel15: { type: Number },
            wheelsOn: { type: String },
            taxiIn: { type: Number }
        },

        aircraft: {
            tailNumber: { type: String }
        },

        airline: {
            name: { type: String },
            iata: { type: String }
        },

        route: {
            from: {
                origin: { type: String },
                originAirportID: { type: Number }
            },
            to: {
                dest: { type: String },
                destAirportID: { type: Number }
            },
            distance: { type: Number },
            crsElapsedTime: { type: String },
            actualElapsedTime: { type: String }
        },
        flightInfo: {
            flightDate: { type: Date },
            isCancelled: { type: Boolean },
            isDiverted: { type: Boolean },
            airTime: { type: String },
            flightNumber: { type: String }
        }
    }
);

AirportSchema.method('toJSON', function () {
    const { __v, _id, flightInfo, ...object } = this.toObject();
    object.id = _id;
    object.flightInfo = {
        ...flightInfo,
        flightDate: flightInfo.flightDate.toISOString().slice(0, 10)
    };
    return object
});
module.exports = model('flights', AirportSchema)