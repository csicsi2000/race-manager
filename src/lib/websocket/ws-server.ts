import { ConnectionStatus } from "$lib/_types/enums/connectionStatus";
import { connection, sensorReadings } from "$lib/stores/serverStatus";
import {
    ArrayQueue,
    ConstantBackoff,
    Websocket,
    WebsocketBuilder,
    WebsocketEvent,
} from "websocket-ts";

let ws: Websocket;

export function StartWebsocket(server: string) {
    if (server == null || server == "") {
        console.warn("Missing websocket server info");
        return;
    }
    ws = new WebsocketBuilder("ws://localhost:8080")
        .withBuffer(new ArrayQueue())           // buffer messages when disconnected
        .withBackoff(new ConstantBackoff(1000)) // retry every 1s
        .build();

    // Add event listeners
    ws.addEventListener(WebsocketEvent.open, () => serverOpened);
    ws.addEventListener(WebsocketEvent.close, () => serverClosed);
    ws.addEventListener(WebsocketEvent.message, echoOnMessage);
}

// Function to output & echo received messages
const echoOnMessage = (i: Websocket, ev: MessageEvent) => {
    console.log(`received message: ${ev.data}`);
    //i.send(`echo: ${ev.data}`);
    sensorReadings.set(ev.data);
};

const serverOpened = () => {
    connection.set(ConnectionStatus.CONNECTED);
}

const serverClosed = () => {
    connection.set(ConnectionStatus.DISCONNECTED);
}