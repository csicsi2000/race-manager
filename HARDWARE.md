# Race Manager Hardware Setup

This project expects one ESP32 or ESP8266 at the start/finish line. It reads one sensor per lane and broadcasts this WebSocket payload:

```json
{"type":"change","millis":123456,"slot_status":[true,false],"raw":[0,1]}
```

`slot_status[n]` becomes `true` while lane `n + 1` is blocked. The web app records a lap on the rising edge from `false` to `true`.

## Default Firmware Pins

| Board | Lane 1 | Lane 2 | OLED SDA | OLED SCL |
| --- | --- | --- | --- | --- |
| ESP8266 NodeMCU | D5 / GPIO14 | D6 / GPIO12 | D2 / GPIO4 | D1 / GPIO5 |
| ESP32 DevKit | GPIO25 | GPIO26 | GPIO21 | GPIO22 |

The firmware uses `INPUT_PULLUP`, so the simplest sensor output is active-low: clear lane = HIGH, car detected = LOW.

## Best Physical Counter: IR Break-Beam Bridge

Use this when reliability matters. Put an IR emitter on one side of each lane and a receiver on the other side, aimed across the slot lane. A passing car breaks the beam.

### Wiring Per Lane

Emitter side:

```text
3.3V or 5V -> 220 ohm resistor -> IR LED anode
IR LED cathode -> GND
```

Receiver module side:

```text
Receiver VCC -> 3.3V
Receiver GND -> GND
Receiver OUT -> ESP lane GPIO
```

If your receiver module only runs from 5V, do not feed its 5V output directly into an ESP GPIO. Use a level shifter or a divider:

```text
Receiver OUT -> 10k resistor -> ESP GPIO
ESP GPIO -> 20k resistor -> GND
```

Mounting notes:

- Put the beams on a small gantry just above body height or across the side of each lane.
- Shield the receiver with heat-shrink or a short black tube so room light does not trigger it.
- Keep lane beams separated; a car in lane 1 should not block lane 2.

## Easy Prototype: Reflective IR Modules

TCRT5000 / KY-033 style modules can work if you can mount them very close to the car path.

```text
Module VCC -> 3.3V
Module GND -> GND
Module DO  -> ESP lane GPIO
```

Tune the module trimmer until the module changes state only when a car passes. Reflective sensors are more sensitive to car color, ambient light, and mounting height than break-beams, so use the app's minimum lap time filter to reject double triggers.

## Optional OLED

The firmware supports a 128x64 SSD1306 I2C OLED at address `0x3C`. The board still runs if no OLED is installed.

```text
OLED VCC -> 3.3V
OLED GND -> GND
OLED SDA -> board SDA pin from the table
OLED SCL -> board SCL pin from the table
```

## Error Handling Strategy

- Firmware debounce rejects very short electrical flickers.
- Web app minimum lap time rejects impossible laps after a crash, marshal reset, or sensor bounce.
- Each racer table has `Undo last` and per-lap `Delete` controls for manual correction.
- Use the ESP test page at `http://SENSOR_IP:81` to verify raw WebSocket messages before racing.
- If cars are placed back on the lap line after flying off, wait until the lane is clear before continuing so the app sees a clean false-to-true edge next lap.

## Setup Flow

1. Flash the firmware from `ESP_Board_Codes/Central_Server/nonAsyncWifiCounter_withScreen_TextOnly`.
2. Power the ESP. If it cannot connect to saved Wi-Fi, connect to the `RaceM-Server` setup AP with password `admin1234`.
3. Open the app settings and enter `ws://SENSOR_IP` or just `SENSOR_IP`.
4. Set lane count, minimum lap time, and voice cues.
5. Open practice mode and pass a car through each lane to verify counting.
