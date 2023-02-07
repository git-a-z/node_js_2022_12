import http from "http";
import { Server } from 'socket.io';
import fs from "fs";
import path from "path";

const host = "localhost";
const port = 3000;

const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    const filePath = path.join(process.cwd(), "./index.html");
    const rs = fs.createReadStream(filePath);

    rs.pipe(res);
  }
});

const io = new Server(server);
let userCount = 1;

io.on('connection', (socket) => {
  socket.nickname = `User ${userCount++}`;
  console.log(`Websocket connetcted ${socket.id}, ${socket.nickname}`);
  socket.broadcast.emit('NEW_CONN_EVENT', { msg: `${socket.nickname} connected` });
  socket.emit('NEW_CONN_EVENT', { msg: `Welcome, ${socket.nickname}!` });

  socket.on("disconnect", (reason) => {
    console.log(`Websocket disconnected ${socket.id} due to ${reason}, ${socket.nickname}`);
    socket.broadcast.emit('LOST_CONN_EVENT', { msg: `${socket.nickname} disconnected` });
  });

  socket.on('CLIENT_MSG_EVENT', (data) => {
    socket.broadcast.emit('SERVER_MSG_EVENT', { msg: `${socket.nickname}: ${data.msg}` });
    socket.emit('SERVER_MSG_EVENT', { msg: `Me: ${data.msg}` });
  })
})

server.listen(port, host, () => console.log(`Server running at http://${host}:${port}`));