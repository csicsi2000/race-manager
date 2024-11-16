#if defined(ESP8266)
#include <ESP8266WiFi.h>
// #include <ESP8266WebServer.h>
#include <ESPAsyncTCP.h>

#elif defined(ESP32)
#include <WiFi.h>
#include <AsyncTCP.h>
#endif

// #define WEBSOCKETS_NETWORK_TYPE NETWORK_ESP8266_ASYNC
// #include <ESPAsyncWebServer.h>
#include <WebSocketsServer.h>
#include <WiFiManager.h>
#include <ArduinoJson.h>

const char *SLOT_STATUS = "slot_status";
const char *MILLIS = "millis";
const char *THRESHOLD = "threshold";

const int playerCount = 2;

WebSocketsServer webSocket(80, "*");
String chipModel;
unsigned long startTime;
int threshold = 100;

void setup() {
  Serial.begin(115200);

#if defined(ESP8266)
  chipModel = "ESP8266";
  Serial.println(chipModel);
  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, HIGH);
#else  // ESP32
  chipModel = "ESP32";
#endif

  Serial.println(chipModel);
  setupWifi();
  setupWebSocket();
}

void setupWebSocket() {
  webSocket.begin();
  webSocket.onEvent(webSocketEvent);
  Serial.println("Websocket started");
}

void setupWifi() {
  bool res;

  long randNumber = random(10000);
  String wifiName = "LapCounter_Prototype";  // + String(randNumber);
  WiFiManager wm;

  res = wm.autoConnect(wifiName.c_str(), "admin1234");

  if (!res) {
    Serial.println("Failed to connect");
    ESP.restart();
  } else {
    Serial.println("Connected");
    Serial.println(WiFi.localIP());
  }
}

void webSocketEvent(uint8_t num, WStype_t type, uint8_t *payload, size_t length) {
  switch (type) {
    case WStype_DISCONNECTED:
      Serial.printf("[%u] Disconnected!\n", num);
      break;
    case WStype_CONNECTED:
      Serial.printf("[%u] Connected from %s\n", num, webSocket.remoteIP(num).toString().c_str());
      break;
    case WStype_TEXT:
      handleWebSocketMessage(payload, length);
      break;
  }
}

void handleWebSocketMessage(uint8_t *payload, size_t length) {
  String message = (char *)payload;
  StaticJsonDocument<96> doc;
  DeserializationError error = deserializeJson(doc, message);
  if (error) {
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.f_str());
    return;
  }

  threshold = doc[THRESHOLD];
  Serial.print("New threshold: " + String(threshold));
}

void notifyClients(String sensorReadings) {
  webSocket.broadcastTXT(sensorReadings);
}

StaticJsonDocument<96> previousReading;
void loop() {
  unsigned long currentTime = millis();
  unsigned long elapsedTime = currentTime - startTime;

  if (elapsedTime >= 1000) {
    StaticJsonDocument<96> newReading;
    newReading["millis"] = String(millis());
    JsonArray slot_status = newReading.createNestedArray("slot_status");
    slot_status.add(true);
    slot_status.add(false);

    for(int i = 0; i < playerCount; i++){
      if ((bool)newReading[SLOT_STATUS][i] != (bool)previousReading[SLOT_STATUS][i]){

        break;
      }
    }

    String result = "";
    serializeJson(newReading, result);
    // move up in production
    notifyClients(result);

    previousReading = newReading;
    Serial.println(result);
    Serial.println(currentTime);

    startTime = currentTime;
  }

  webSocket.loop();
}

StaticJsonDocument<96> getJsonSensorData() {
  StaticJsonDocument<96> doc;
  doc["millis"] = String(millis());
  JsonArray slot_status = doc.createNestedArray("slot_status");
  slot_status.add(true);
  slot_status.add(false);

  return doc;
}

String getJsonInfo() {
  StaticJsonDocument<96> doc;
  doc["track_type"] = "Analog";
  doc["sensor_type"] = "Hall effect";
  doc["chip_Model"] = chipModel;

  String result = "";
  serializeJson(doc, result);
  return result;
}
