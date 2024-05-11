import { w3cwebsocket as W3CWebSocket } from "websocket"

// let conn = new W3CWebSocket('ws://127.0.0.1:8000');
let conn = undefined;

let createNewConnection = () => {
  conn = new W3CWebSocket('ws://127.0.0.1:8000');
}

// export default {conn, createNewConnection}
export {conn, createNewConnection}
