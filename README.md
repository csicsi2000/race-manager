# Race Manager

Race Manager is a Svelte PWA and ESP32/ESP8266 firmware for turning an analog Carrera Go track into a digital-like lap counter.

Current focus:

- Practice mode with per-lane lap timing.
- Race mode with start lights, lap order, and spoken lap cues.
- WebSocket sensor bridge that can be opened from any browser on the same network.
- Easy local correction when a crash, marshal reset, or sensor bounce creates a bad lap.

Future digital car/controller control is tracked separately in [FUTURE_DIGITAL_PLAN.md](./FUTURE_DIGITAL_PLAN.md).

## Web App

```bash
pnpm install
pnpm dev
```

Open the local URL printed by Vite, then go to Settings and enter the ESP sensor address:

```text
ws://192.168.x.x
```

The app also accepts the bare IP address and adds `ws://` automatically.

Useful settings:

- `Analog threshold`: sent to the ESP for future analog sensor modes.
- `Minimum lap time`: filters impossible laps after double triggers or car resets.
- `Lane count`: how many sensor lanes to read.
- `Voice lap cues`: browser speech announcements for lap progress.

## ESP Firmware

The active PlatformIO project is:

```text
ESP_Board_Codes/Central_Server/nonAsyncWifiCounter_withScreen_TextOnly
```

Build/upload examples:

```bash
pio run -d ESP_Board_Codes/Central_Server/nonAsyncWifiCounter_withScreen_TextOnly -e esp8266 -t upload
pio run -d ESP_Board_Codes/Central_Server/nonAsyncWifiCounter_withScreen_TextOnly -e esp32dev -t upload
```

On first boot, the board starts a Wi-Fi setup AP:

```text
SSID: RaceM-Server
Password: admin1234
```

After it joins Wi-Fi:

- WebSocket sensor stream: `ws://SENSOR_IP:80`
- Built-in test page: `http://SENSOR_IP:81`

## Hardware

See [HARDWARE.md](./HARDWARE.md) for wiring diagrams and sensor mounting options.

Recommended setup is one IR break-beam per lane. Reflective IR modules are fine for prototyping but need more careful calibration.

## Bad Lap Handling

Use several layers together:

- Hardware: clean sensor alignment and short wires.
- Firmware: debounce on sensor state changes.
- App: minimum lap time filter.
- UI: `Undo last` and per-lap `Delete`.

This keeps the race usable when a car flies off and is put back near the lap line.
