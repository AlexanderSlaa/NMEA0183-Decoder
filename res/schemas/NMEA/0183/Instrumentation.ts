import {NMEA} from "../../../../src/NMEA";
import Packets = NMEA.Types.Packets;
import MetricValue = NMEA.Types.MetricValue;

export default {
    prefix: "II",
    packet: Packets.NMEA_0183,
    descriptions: [
        {
            prefix: "HDT", explanation: "True Heading", schema: {heading: Number, _T: String, checksum: String}
        },
        {
            prefix: "RPM", explanation: "Revolutions", schema: {
                source: String,
                source_number: Number,
                rpm: Number,
                pitch: String,
                status: String,
                checksum: String
            }
        },
        {
            prefix: "VHW", explanation: "Water speed and heading", schema: {
                degressTrue: Number,
                _T: String,
                degressMagnetic: Number,
                _M: String,
                waterSpeedKnots: Number,
                _N: String,
                kmph: Number,
                _K: String,
                checksum: String
            }
        },
        {
            prefix: "MTW", explanation: "Mean Temperature of Water", schema: {
                temperature: MetricValue,
                checksum: String
            }
        }
    ]
}