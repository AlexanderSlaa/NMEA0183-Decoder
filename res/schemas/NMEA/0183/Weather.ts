import {NMEA} from "../../../../src/NMEA";
import NMEA_0183 = NMEA.Types.Packets.NMEA_0183;
import MetricValue = NMEA.Types.MetricValue;

export default {
    prefix: "WI",
    packet: NMEA_0183,
    descriptions: [
        {
            prefix: "MWV", explanation: "Wind Speed and Angle", schema: {
                angle: Number,
                reference: String,
                speed: MetricValue,
                status: String,
                checksum: String
            }
        }
    ]
}