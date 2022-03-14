import {NMEA} from "../../../../src/NMEA";

export namespace Positioning {

    export namespace Global {

        import Descriptor = NMEA.Decorators.Descriptor;

        export class Latitude {

            @Descriptor(Number)
            val: Number;
            @Descriptor(String)
            heading: "N" | "S"

        }

        export class Longitude {

            @Descriptor(Number)
            val: Number;
            @Descriptor(String)
            heading: "E" | "W"


        }

    }

}

import Latitude = Positioning.Global.Latitude;
import Longitude = Positioning.Global.Longitude;
import MetricValue = NMEA.Types.MetricValue;
const {NMEA_0183} = NMEA.Types.Packets;

export default {
    prefix: "GP",
    packet: NMEA_0183,
    descriptions: [
        {
            prefix: "GGA", explanation: "Fix information", schema: {
                utc: String,
                latitude: Latitude,
                longitude: Longitude,
                fixQuality: Number,
                HDOP: Number,
                altitude: MetricValue,
                HOGAE: MetricValue,
                timeSinceLastUpdate: String,
                referenceStationId: String,
                checksum: String
            }
        },
        {
            prefix: "GLL", explanation: "Global Positioning System Fix Data", schema: {
                latitude: Latitude,
                longitude: Longitude,
                checksum: String
            }
        },
        {
            prefix: "GSA", explanation: "GPS DOP and active satellites", schema: {
                mode: String,
                gps_mode: Number,
                ids: (msg, indexAccessor) => {
                    let ids = new Array<any>(12);
                    for (let i = 0; i < ids.length; i++) {
                        ids[i] = msg[i] !== "" ? Number(msg[i]) : undefined;
                    }
                    indexAccessor._ += ids.length
                    return ids;
                },
                PDOP: Number,
                HDOP: Number,
                VDOP: Number,
                checksum: String
            }
        },
        {
            prefix: "RMC", explanation: "Recommended minimum specific GPS/Transit data", schema: {
                utc: String,
                status: String,
                latitude: Latitude,
                longitude: Longitude,
                groundSpeedKnots: Number,
                trueCourse: Number,
                date: Number,
                variation: MetricValue,
                checksum: String
            }
        },
        {
            prefix: "ZDA", explanation: "Date & Time", schema: {
                utc: String,
                day: Number,
                month: Number,
                year: Number,
                local_zone: {
                    hours: Number,
                    minutes: Number
                }
            }
        },
        {
            prefix: "VTG", explanation: "Track made good and ground speed", schema: {
                trackMadeGood: Number,
                _T: String,
                _1: undefined,
                _2: undefined,
                groundSpeedKnots: Number,
                _N:String,
                groundSpeedKMPH: Number,
                _K: String,
                checksum: String
            }
        }
    ]
}