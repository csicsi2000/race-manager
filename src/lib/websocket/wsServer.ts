import { ConnectionStatus } from "$lib/_types/enums/connectionStatus";
import { SensorSettings } from "$lib/_types/sensorSettings";
import { connectedIP, connection, sensorReadings, sensorSetting } from "$lib/stores/serverStatus";
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
        if (localSettings != null || localSettings != "") {
            sensorSetting.set(JSON.parse(localSettings as string) as SensorSettings);
        } else {
            sensorSetting.set(new SensorSettings());
        }
        sensorSetting.subscribe(x => {
            if (WsServer.ws) {
                let jsonString = JSON.stringify(x)
                WsServer.ws.send(jsonString);
                localStorage.setItem(settingsName, jsonString);
            }
        });
        connectedIP.subscribe(x => {
            if(WsServer.ws){
            WsServer.ws.close();}
            console.log(x)
            if (x != null) {
                console.log("Try connecting to " + x);
                this.StartWebsocket(x);
            }
        })
    }

    StartWebsocket(server: string) {
        connection.set(ConnectionStatus.DISCONNECTED);
        if (server == null || server == "") {
            console.warn("Missing websocket server info");
            return;
        }
        try {
            console.log("Connection to websocket")
            connection.set(ConnectionStatus.DISCONNECTED);
            WsServer.ws = new WebsocketBuilder(server)
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
            return;
        }


    }

    // Function to output & echo received messages
    echoOnMessage = (i: Websocket, ev: MessageEvent) => {
        console.log(`received message: ${ev.data}`);
        //i.send(`echo: ${ev.data}`);
        sensorReadings.set(ev.data);
    };

    serverOpened = () => {
        console.log("Connection succeded");

        connection.set(ConnectionStatus.CONNECTED);
    }

    serverClosed = () => {
        connection.set(ConnectionStatus.DISCONNECTED);
    }
}