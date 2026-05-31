# Future Digital Control Plan

The current milestone is a reliable lap counter. Digital car control should be a separate system so lap timing stays dependable while the control protocol evolves.

## Target Architecture

| Unit | Hardware | Role |
| --- | --- | --- |
| Race server | ESP32 at track or the web app host | Session state, car IDs, penalties, safety modes |
| Car module | ESP32-C3 / ESP32-S3 mini, motor driver, voltage regulator | Receives throttle/brake/lane-change commands and drives the motor |
| Controller | ESP32, trigger potentiometer or hall trigger, lane-change button | Sends driver inputs wirelessly |
| Track accessories | ESP32 or simple driver boards | Lane changers, pit sensors, start lights |

Use ESP-NOW for low-latency controller-to-car messages first. Add Wi-Fi/WebSocket telemetry later for dashboards.

## Safer First Car Prototype

Start with an onboard battery or a bench power supply before using track rails for power.

```text
Battery + -> motor driver VM
Battery - -> common GND
Regulator 3.3V -> ESP 3V3
ESP PWM GPIO -> motor driver PWM/IN
ESP direction/brake GPIO -> motor driver IN
Motor driver OUT -> slot car motor
```

Do not connect raw track voltage to an ESP pin. If powering from the rails later, use a bridge rectifier, bulk capacitor, buck regulator, fuse/polyfuse, and voltage measurement divider.

## Protocol Phases

1. Controller prototype
   - Read trigger value.
   - Send `{controllerId, throttle, brake, laneChange}` over ESP-NOW at 50-100 Hz.
   - Add packet sequence numbers and failsafe timeout.

2. Car module prototype
   - Pair one controller to one car.
   - Smooth throttle with a small ramp to avoid brownouts.
   - Stop motor if no valid packet arrives for 250 ms.

3. Race manager integration
   - Assign controller IDs to racers in the web app.
   - Show live throttle, battery, RSSI, and connection warnings.
   - Add race control states: grid, countdown, green, yellow, red, pit.

4. Lane changing
   - Add track-side lane changer modules with their own ESP or wired control.
   - Car sends lane-change intent; race server authorizes if the section is safe.
   - Track module fires a solenoid/servo for a bounded pulse, then reports completion.

5. Digital rules
   - Car IDs and controller pairing.
   - Pit lane speed limiter.
   - False start detection from throttle before lights out.
   - Penalty queue and drive-through/pit-stop rules.

## Reliability Requirements

- Every command packet needs a sequence number and timestamp.
- Cars must fail to motor-off, not last-throttle-held.
- Race server should keep working if one controller disconnects.
- Track power and ESP logic need isolation or properly designed shared ground.
- Keep lap sensors independent from car control so timing still works during wireless experiments.
