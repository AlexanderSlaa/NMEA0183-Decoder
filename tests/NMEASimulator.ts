import WebSocket from "ws";

import {NMEA} from "../src/NMEA";

import Positioning from "../res/schemas/NMEA/0183/Positioning";
import Instrumentation from "../res/schemas/NMEA/0183/Instrumentation";
import Weather from "../res/schemas/NMEA/0183/Weather";

NMEA.Decoder.register(Positioning, Instrumentation, Weather)

let webSocket = new WebSocket("ws://localhost:3000");
webSocket.on("open", (event) => {
    console.log(event);
})

webSocket.on("message", (data) => {
    data.toString().split("\r\n").forEach(item => {
        try {
            let output = NMEA.Decoder.decode(item);
            console.log(output);
        } catch (e) {
            console.error(e)
        }
    })
})

process.on("beforeExit", () => {
    webSocket.close();
})