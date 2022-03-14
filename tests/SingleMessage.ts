
import {NMEA} from "../src/NMEA";

import Positioning from "../res/schemas/NMEA/0183/Positioning";
import Instrumentation from "../res/schemas/NMEA/0183/Instrumentation";
import Weather from "../res/schemas/NMEA/0183/Weather";

NMEA.Decoder.register(Positioning, Instrumentation, Weather)

let message = NMEA.Decoder.decode("$GPRMC,122708.469,A,3459.973994,S,13830.007822,E,4.7,15.0,140322,,,*02");

console.log("Message: " , message)
