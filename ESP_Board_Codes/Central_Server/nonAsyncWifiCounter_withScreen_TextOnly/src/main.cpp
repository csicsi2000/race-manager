#if defined(ESP8266)
#include <ESP8266WiFi.h>
#include <ESPAsyncTCP.h>
#include <ESP8266mDNS.h>
#include <LittleFS.h>
#elif defined(ESP32)
#include <WiFi.h>
#include <AsyncTCP.h>
#include <ESPmDNS.h>
#include <LittleFS.h>
#endif

#include <ArduinoJson.h>
#include <ESPAsyncWebServer.h>
#include <WebSocketsServer.h>
#include <DNSServer.h>

#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <Wire.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1
#define SCREEN_ADDRESS 0x3C

#if defined(ESP8266)
const uint8_t OLED_SDA_PIN = 4;   // D2
const uint8_t OLED_SCL_PIN = 5;   // D1
const uint8_t DEFAULT_LANE_PINS[] = {14, 12}; // D5, D6
#else
const uint8_t OLED_SDA_PIN = 21;
const uint8_t OLED_SCL_PIN = 22;
const uint8_t DEFAULT_LANE_PINS[] = {25, 26};
#endif

const uint8_t LANE_COUNT = sizeof(DEFAULT_LANE_PINS) / sizeof(DEFAULT_LANE_PINS[0]);
const char *AP_NAME = "RaceM-Server";
const char *AP_PASSWORD = "admin1234";
const unsigned long HEARTBEAT_MS = 1000;
const unsigned long SENSOR_DEBOUNCE_MS = 35;

struct LaneState {
  uint8_t pin;
  bool active;
  bool lastRawActive;
  unsigned long changedAt;
};

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);
AsyncWebServer httpServer(80);
WebSocketsServer webSocket(81, "*");
const byte DNS_PORT = 53;
DNSServer dnsServer;

LaneState lanes[LANE_COUNT];
bool displayReady = false;
unsigned long lastHeartbeatAt = 0;
int threshold = 100;

void setupDisplay();
void drawStatus(const char *line1, const char *line2 = "", const char *line3 = "", const char *line4 = "");
void setupWifi();
void setupHttpServer();
void setupWebSocket();
void setupSensors();
void webSocketEvent(uint8_t num, WStype_t type, uint8_t *payload, size_t length);
void handleWebSocketMessage(uint8_t num, uint8_t *payload, size_t length);
void broadcastSensorState(const char *eventType);
void pollSensors();
bool readLaneActive(uint8_t pin);

void setup() {
  Serial.begin(115200);
  delay(100);

  setupDisplay();
  setupSensors();
  setupWifi();
  setupHttpServer();
  setupWebSocket();
  broadcastSensorState("boot");
}

void loop() {
  dnsServer.processNextRequest();
#if defined(ESP8266)
  MDNS.update();
#endif
  webSocket.loop();
  pollSensors();

  const unsigned long now = millis();
  if (now - lastHeartbeatAt >= HEARTBEAT_MS) {
    lastHeartbeatAt = now;
    broadcastSensorState("heartbeat");
  }
}

void setupDisplay() {
  Wire.begin(OLED_SDA_PIN, OLED_SCL_PIN);
  displayReady = display.begin(SSD1306_SWITCHCAPVCC, SCREEN_ADDRESS);
  if (!displayReady) {
    Serial.println(F("OLED not found; continuing without display."));
    return;
  }

  display.setTextColor(SSD1306_WHITE);
  display.setTextSize(1);
  drawStatus("Race Manager", "Starting sensor");
}

void drawStatus(const char *line1, const char *line2, const char *line3, const char *line4) {
  if (!displayReady) {
    return;
  }

  display.clearDisplay();
  display.setCursor(0, 0);
  display.println(line1);
  display.println(line2);
  display.println(line3);
  display.println(line4);
  display.display();
}

void setupSensors() {
  for (uint8_t i = 0; i < LANE_COUNT; i++) {
    lanes[i] = {DEFAULT_LANE_PINS[i], false, false, 0};
    pinMode(lanes[i].pin, INPUT_PULLUP);
  }
}

void setupWifi() {
  WiFi.mode(WIFI_AP_STA);
  WiFi.begin();
  
  drawStatus("WiFi setup", "Connecting...");
  unsigned long start = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - start < 10000) {
    delay(500);
    Serial.print(".");
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nConnected to WiFi.");
    WiFi.mode(WIFI_STA);
  } else {
    Serial.println("\nFailed to connect. Starting AP.");
    WiFi.mode(WIFI_AP);
    WiFi.softAP(AP_NAME, AP_PASSWORD);
  }

  IPAddress myIP = (WiFi.status() == WL_CONNECTED) ? WiFi.localIP() : WiFi.softAPIP();
  Serial.print(F("IP address: "));
  Serial.println(myIP);
  
  if (!MDNS.begin("racemanager")) {
    Serial.println("Error setting up MDNS responder!");
  } else {
    Serial.println("mDNS responder started");
    MDNS.addService("http", "tcp", 80);
    MDNS.addService("ws", "tcp", 81);
  }

  dnsServer.start(DNS_PORT, "*", myIP);
  drawStatus("Connected", myIP.toString().c_str(), "racemanager.local", "HTTP: 80 WS: 81");
}

void setupHttpServer() {
  if(!LittleFS.begin()) {
    Serial.println("An Error has occurred while mounting LittleFS");
  }

  httpServer.serveStatic("/", LittleFS, "/").setDefaultFile("index.html");

  httpServer.onNotFound([](AsyncWebServerRequest *request) {
    if (request->method() == HTTP_OPTIONS) {
      request->send(200);
    } else {
      IPAddress myIP = (WiFi.status() == WL_CONNECTED) ? WiFi.localIP() : WiFi.softAPIP();
      request->redirect("http://" + myIP.toString());
    }
  });

  httpServer.begin();
}

void setupWebSocket() {
  webSocket.begin();
  webSocket.onEvent(webSocketEvent);
  Serial.println(F("WebSocket started on port 80."));
}

void webSocketEvent(uint8_t num, WStype_t type, uint8_t *payload, size_t length) {
  switch (type) {
  case WStype_CONNECTED:
    Serial.printf("[%u] Connected from %s\n", num, webSocket.remoteIP(num).toString().c_str());
    webSocket.sendTXT(num, "{\"type\":\"hello\",\"device\":\"race-manager-sensor\"}");
    broadcastSensorState("connect");
    break;
  case WStype_DISCONNECTED:
    Serial.printf("[%u] Disconnected\n", num);
    break;
  case WStype_TEXT:
    handleWebSocketMessage(num, payload, length);
    break;
  default:
    break;
  }
}

void handleWebSocketMessage(uint8_t num, uint8_t *payload, size_t length) {
  String message;
  message.reserve(length);
  for (size_t i = 0; i < length; i++) {
    message += static_cast<char>(payload[i]);
  }

  if (message == "Ping") {
    webSocket.sendTXT(num, "Pong");
    return;
  }

  StaticJsonDocument<192> doc;
  DeserializationError error = deserializeJson(doc, message);
  if (error) {
    Serial.print(F("Invalid config JSON: "));
    Serial.println(error.f_str());
    return;
  }

  if (doc["threshold"].is<int>()) {
    threshold = doc["threshold"].as<int>();
    Serial.printf("Threshold set to %d\n", threshold);
  }
}

void pollSensors() {
  const unsigned long now = millis();
  bool changed = false;

  for (uint8_t i = 0; i < LANE_COUNT; i++) {
    const bool rawActive = readLaneActive(lanes[i].pin);
    if (rawActive != lanes[i].lastRawActive) {
      lanes[i].lastRawActive = rawActive;
      lanes[i].changedAt = now;
    }

    if (rawActive != lanes[i].active && now - lanes[i].changedAt >= SENSOR_DEBOUNCE_MS) {
      lanes[i].active = rawActive;
      changed = true;
      Serial.printf("Lane %u %s at %lu\n", i + 1, rawActive ? "active" : "clear", now);
    }
  }

  if (changed) {
    broadcastSensorState("change");
  }
}

bool readLaneActive(uint8_t pin) {
  return digitalRead(pin) == LOW;
}

void broadcastSensorState(const char *eventType) {
  StaticJsonDocument<256> doc;
  doc["type"] = eventType;
  doc["millis"] = millis();
  JsonArray slotStatus = doc.createNestedArray("slot_status");
  JsonArray raw = doc.createNestedArray("raw");

  for (uint8_t i = 0; i < LANE_COUNT; i++) {
    slotStatus.add(lanes[i].active);
    raw.add(digitalRead(lanes[i].pin));
  }

  String payload;
  serializeJson(doc, payload);
  webSocket.broadcastTXT(payload);
}
