# NMEA0183-Decoder
NMEA0183 Schema based decoder

```typescript
    import {NMEA} from "../src/NMEA";
    
    import Positioning from "../res/schemas/NMEA/0183/Positioning";
    import Instrumentation from "../res/schemas/NMEA/0183/Instrumentation";
    import Weather from "../res/schemas/NMEA/0183/Weather";
    
    NMEA.Decoder.register(Positioning, Instrumentation, Weather) //Registering Schemas
    
    let message = NMEA.Decoder.decode("$GPRMC,122708.469,A,3459.973994,S,13830.007822,E,4.7,15.0,140322,,,*02"); //NMEA Message
    
    console.log("Message: " , message) //OUTPUT
```

### Schema
```typescript
{
    prefix: "RMC", explanation: "Recommended minimum specific GPS/Transit data", schema: {
        utc: String,
        status: String,
        latitude: Latitude, //Custom class definition file:res/schemas/NMEA/0183/Positioning.ts
        longitude: Longitude, //Custom class definition file:res/schemas/NMEA/0183/Positioning.ts
        groundSpeedKnots: Number,
        trueCourse: Number,
        date: Number,
        variation: MetricValue, //Custom class definition file:src/NMEA.ts
        checksum: String
    }
}
``` 

### Console output
```typescript
Message:  {
  utc: [String: '122708.469'],
  status: [String: 'A'],
  latitude: Latitude { val: [Number: 3459.973994], heading: [String: 'S'] },
  longitude: Longitude { val: [Number: 13830.007822], heading: [String: 'E'] },
  groundSpeedKnots: [Number: 4.7],
  trueCourse: [Number: 15],
  date: [Number: 140322],
  variation: MetricValue { val: [Number: 0], unit: [String: ''] },
  checksum: [String: '*02']
}
```

### JSON output
```json
{
   "utc":"122708.469",
   "status":"A",
   "latitude":{
      "val":3459.973994,
      "heading":"S"
   },
   "longitude":{
      "val":13830.007822,
      "heading":"E"
   },
   "groundSpeedKnots":4.7,
   "trueCourse":15,
   "date":140322,
   "variation":{
      "val":0,
      "unit":""
   },
   "checksum":"*02"
}
```


