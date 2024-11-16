#if defined(ESP8266)
#include <ESP8266WiFi.h>
//#include <ESP8266WebServer.h>
#include <ESPAsyncTCP.h>

#elif defined(ESP32)
#include <WiFi.h>
#include <AsyncTCP.h>
#endif

#include <WebSocketsServer.h>
#include <WiFiManager.h>
#include <ArduinoJson.h>

#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <qrcode.h>
#include <Wire.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1
#define SCREEN_ADDRESS 0x3C ///< See datasheet for Address; 0x3D for 128x64, 0x3C for 128x32

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);
QRCode qrcode;

const char* MESSAGE_CONFIGURE_WIFI[4] = { "Scan QR", "to setup", "WiFi", "" };
const char* MESSAGE_OPEN_WEBAPP[4] = { "Scan QR", "to open", "race manager", "webapp " };

const char *SLOT_STATUS = "slot_status";
const char *MILLIS = "millis";
const char *THRESHOLD = "threshold";

const int playerCount = 2;

WebSocketsServer webSocket(80,"*");
String chipModel;
unsigned long startTime;
int threshold = 100;

const char* wifiPassword = "admin1234";
String wifiName;


void setup()
{
  Serial.begin(115200);
  Wire.begin(14, 12);
  if(!display.begin(SSD1306_SWITCHCAPVCC, SCREEN_ADDRESS)) {
    Serial.println(F("SSD1306 allocation failed"));
    for(;;); // Don't proceed, loop forever
  }

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
  wifiName = "Race_M"; // + String(randNumber);
  WiFiManager wm;
  //wm.setSTAStaticIPConfig(IPAddress(192,168,1,99), IPAddress(192,168,1,1), IPAddress(255,255,255,0));
  wm.setAPCallback(configModeCallback);
  res = wm.autoConnect(wifiName.c_str(), wifiPassword);

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

  drawQrCode(("https://csicsi2000.github.io/race-manager?server="+WiFi.localIP().toString()).c_str(),MESSAGE_OPEN_WEBAPP);
}

void configModeCallback (WiFiManager *myWiFiManager) {
  Serial.println("Entered config mode");
    // Format the QR code string
  char qrCodeString[100]; // Adjust the size as needed
  snprintf(qrCodeString, sizeof(qrCodeString), "WIFI:S:%s;P:%s;;", wifiName.c_str(), wifiPassword);
  Serial.println(qrCodeString);
  drawQrCode(qrCodeString, MESSAGE_CONFIGURE_WIFI);
  Serial.println(WiFi.softAPIP());
  Serial.println(myWiFiManager->getConfigPortalSSID());
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

void notifyClients(String sensorReadings)
{
  webSocket.broadcastTXT(sensorReadings);
}

StaticJsonDocument<96> previousReading;
void loop()
{
  unsigned long currentTime = millis();
  unsigned long elapsedTime = currentTime - startTime;

  if (elapsedTime >= 1000)
  {
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
    Serial.println("One second has passed!");
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


void drawQrCode(const char* qrStr, const char* lines[]) {
  display.clearDisplay();
  Serial.println("Start qrcode drawing");
	uint8_t qrcodeData[qrcode_getBufferSize(4)];
	qrcode_initText(&qrcode, qrcodeData, 2, ECC_LOW, qrStr);
 
  // Text starting point
  int cursor_start_y = 5;
  int cursor_start_x = 0;
  int font_height = 12;

	// QR Code Starting Point
  int offset_x = 62;
  int offset_y = 15;

  for (int y = 0; y < qrcode.size; y++) {
      for (int x = 0; x < qrcode.size; x++) {
          int newX = offset_x + (2 * x);
          int newY = offset_y + (2 * y);

          if (qrcode_getModule(&qrcode, x, y)) {
							display.fillRect( newX, newY, 2, 2, 0);
          }
          else {
							display.fillRect( newX, newY, 2, 2, 1);
          }
      }
  }
  display.setTextColor(1,0);
  for (int i = 0; i < 4; i++) {
    display.setCursor(cursor_start_x,cursor_start_y+font_height*i);
    display.println(lines[i]);
  }
  display.display();
  Serial.println("Finish qrcode drawing");
}