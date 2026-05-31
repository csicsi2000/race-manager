import { ConnectionStatus } from "$lib/_types/enums/connectionStatus";
import { SensorSettings } from "$lib/_types/sensorSettings";
import { parseSensorPayload } from "$lib/services/lapCounter";
import { connectedSensorIP, connection, sensorReadings, sensorSetting } from "$lib/stores/serverStatus";
import {
    ArrayQueue,
    ConstantBackoff,
    Websocket,
    WebsocketBuilder,
    WebsocketEvent,
} from "websocket-ts";

const settingsName = "SensorSettings";
export class WsServer {
    static ws: Websocket;
    constructor() {
        let localSettings = localStorage.getItem(settingsName);
        if (localSettings) {
            try {
                sensorSetting.set({ ...new SensorSettings(), ...JSON.parse(localSettings) });
            } catch {
                sensorSetting.set(new SensorSettings());
            }
        } else {
            sensorSetting.set(new SensorSettings());
        }
        sensorSetting.subscribe(x => {
            let jsonString = JSON.stringify(x)
            if (WsServer.ws) {
                if (WsServer.ws.readyState === WebSocket.OPEN) {
                    WsServer.ws.send(jsonString);
                }
            }
            localStorage.setItem(settingsName, jsonString);
        });
        connectedSensorIP.subscribe(x => {
            if(WsServer.ws){
            WsServer.ws.close();}
            console.log(x)
            if (x) {
                console.log("Try connecting to " + x);
                if (this.StartWebsocket(x)) {
                    this.startPing();
                }
            }
        });
    }

    savedServer: string = "";
    StartWebsocket(server: string): boolean {
        this.savedServer = server;
        connection.set(ConnectionStatus.DISCONNECTED);
        if (server == null || server == "") {
            console.warn("Missing websocket server info");
            return false;
        }
        const websocketUrl = normalizeWebsocketUrl(server);
        try {
            console.log("Connection to websocket")
            connection.set(ConnectionStatus.DISCONNECTED);
            WsServer.ws = new WebsocketBuilder(websocketUrl)
                .withBuffer(new ArrayQueue())           // buffer messages when disconnected
                .withBackoff(new ConstantBackoff(1000))
                .onReconnect((i, ev) => this.serverOpened()) 
                .onOpen((i, ev) => this.serverOpened()) 
                .onClose( (i, ev) =>  this.serverClosed())
                .onError( (i, ev) =>  this.serverClosed())
                .onMessage((i, ev) => this.echoOnMessage(i,ev))// retry every 1s
                .build();
        } catch {
            console.error("Invalid websocket address");
            return false;
        }
        return true;
    }

    // Function to output & echo received messages
    echoOnMessage = (i: Websocket, ev: MessageEvent) => {
        console.log(`received message: ${ev.data}`);
        if(ev.data == "Pong"){
            this.pinged = false;
            return;
        }
        //i.send(`echo: ${ev.data}`);
        const parsed = parseSensorPayload(ev.data);
        if (!parsed) {
            console.warn("Sensor message was not usable", ev.data);
            return;
        }
        sensorReadings.set(parsed);
    };

    serverOpened = () => {
        console.log("Connection succeded");

        connection.set(ConnectionStatus.CONNECTED);
    }

    serverClosed = () => {
        console.log("Server closed");
        connection.set(ConnectionStatus.DISCONNECTED);
    }

    pingInterval:number = -1;
    pinged: boolean = false;

    private startPing = () =>{
        clearInterval(this.pingInterval);

        this.pingInterval = setInterval(async () => {
            if (!WsServer.ws) {
                clearInterval(this.pingInterval);
                return;
            }
            if (WsServer.ws.readyState === WebSocket.OPEN) {
              // Send a ping message
              WsServer.ws.send("Ping");
              this.pinged = true;
              await this.delay(2000);
              if(this.pinged){
                console.log("Pong not received.");
                this.StartWebsocket(this.savedServer);
                clearInterval(this.pingInterval);
              }
            }
          }, 5000);
    }

    private delay(ms: number) {
        return new Promise( resolve => setTimeout(resolve, ms) );
    }
}

function normalizeWebsocketUrl(server: string) {
    const trimmed = server.trim();
    if (trimmed.startsWith("ws://") || trimmed.startsWith("wss://")) {
        return trimmed;
    }
    return `ws://${trimmed}`;
}
