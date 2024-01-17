#if defined(ESP8266)
#include <ESP8266WiFi.h>
//#include <ESP8266WebServer.h>
#include <ESPAsyncTCP.h>

#elif defined(ESP32)
#include <WiFi.h>
#include <AsyncTCP.h>
#endif

//#define WEBSOCKETS_NETWORK_TYPE NETWORK_ESP8266_ASYNC
//#include <ESPAsyncWebServer.h>
#include <WebSocketsServer.h>
#include <WiFiManager.h>
#include <Arduino_JSON.h>

const char* SLOT1 = "slot_1";
const char* SLOT2 = "slot_2";
const char* MILLIS = "millis";
const char* THRESHOLD = "threshold";

WebSocketsServer webSocket(80,"*");
String chipModel;
unsigned long startTime;
int threshold = 100;

void setup()
{
  Serial.begin(115200);

#if defined(ESP8266)
  chipModel = "ESP8266";
  Serial.println(chipModel);
  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, HIGH);
#else // ESP32
  chipModel = "ESP32";
#endif

  Serial.println(chipModel);
  setupWifi();
  setupWebSocket();
}

void setupWebSocket()
{
  webSocket.begin();
  webSocket.onEvent(webSocketEvent);
  Serial.println("Websocket started");
}

void setupWifi()
{
  bool res;

  long randNumber = random(10000);
  String wifiName = "LapCounter_Prototype"; // + String(randNumber);
  WiFiManager wm;

  res = wm.autoConnect(wifiName.c_str(), "admin1234");

  if (!res)
  {
    Serial.println("Failed to connect");
    ESP.restart();
  }
  else
  {
    Serial.println("Connected");
    Serial.println(WiFi.localIP());
  }
}

void webSocketEvent(uint8_t num, WStype_t type, uint8_t *payload, size_t length) {
  switch (type)
  {
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
  JSONVar parsedObject = JSON.parse(message);

  threshold = parsedObject[THRESHOLD];
  Serial.print("New threshold: " + String(threshold));
}

void notifyClients(String sensorReadings)
{
  webSocket.broadcastTXT(sensorReadings);
}

JSONVar previousReading;
void loop()
{
  unsigned long currentTime = millis();
  unsigned long elapsedTime = currentTime - startTime;

  if (elapsedTime >= 1000)
  {
    JSONVar newReading = getJsonSensorData();

    if ((bool)newReading[SLOT1] != (bool)previousReading[SLOT1] || (bool)newReading[SLOT2] != (bool)previousReading[SLOT2])
    {
    }
    // move up in production
    notifyClients(JSON.stringify(newReading));

    previousReading = newReading;
    Serial.println("One second has passed!");
    Serial.println(currentTime);

    startTime = currentTime;
  }

  webSocket.loop();
}

JSONVar getJsonSensorData()
{
  JSONVar res;
  res["slot_1"] = true;
  res["slot_2"] = false;
  res["millis"] = String(millis());

  return res;
}

JSONVar getJsonInfo()
{
  JSONVar res;
  res["track_type"] = "Analog";
  res["sensor_type"] = "Hall effect";
  res["chip_Model"] = chipModel;

  return res;
}
