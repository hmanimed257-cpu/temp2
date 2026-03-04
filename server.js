const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let lastData = { temp:0, hum:0 };

wss.on("connection", ws => {

  console.log("Client connected");

  ws.send(JSON.stringify(lastData));

  ws.on("message", msg => {

    lastData = JSON.parse(msg);

    // Broadcast to all clients
    wss.clients.forEach(client=>{
      if(client.readyState === WebSocket.OPEN){
        client.send(JSON.stringify(lastData));
      }
    });

  });

});

server.listen(3000, ()=> console.log("Server running"));

