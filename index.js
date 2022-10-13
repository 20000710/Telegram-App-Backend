const express = require("express");
const cors = require('cors');
const { createServer } = require("http");
const { Server } = require("socket.io");
const bodyParser = require('body-parser');
const helmet = require('helmet');
const xssClean = require('xss-clean');
const { HOST, PORT, APP_URL } = require('./helpers/env');
const app = express();
app.use(xssClean());
app.use(cors());
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:3000'
    }
});

app.use(bodyParser.json());
app.use(
    helmet({
        crossOriginResourcePolicy: false,
    }),
);
app.use(express.static('public'));

// route here
app.use(require('./routes/auth.route'))
app.use(require('./routes/users.route'))


// io.use((socket, next) => {
//     const username = socket.handshake.auth.username;
//     if (!username) {
//       return next(new Error("invalid username"));
//     }
//     socket.username = username;
//     next();
// });

// io.use((socket, next) => {
//     const username = socket.handshake.auth.username;
//     if (!username) {
//         return next(new Error("invalid username"));
//     }
//     socket.username = username;
//     next();
// });

// io.on("connection", (socket) => {
//     // fetch existing users
//     const users = [];
//     for (let [id, socket] of io.of("/").sockets) {
//         users.push({
//             userID: id,
//             username: socket.username,
//         });
//     }
//     socket.emit("users", users);

//     // notify existing users
//     socket.broadcast.emit("user connected", {
//         userID: socket.id,
//         username: socket.username,
//     });

//     // forward the private message to the right recipient
//     socket.on("private message", ({ content, to }) => {
//         socket.to(to).emit("private message", {
//             content,
//             from: socket.id,
//         });
//     });

//     // notify users upon disconnection
//     socket.on("disconnect", () => {
//         socket.broadcast.emit("user disconnected", socket.id);
//     });
// });  
var clients =[];

io.on("connection", (socket) => {
    console.log(`ada perangkat yang terhubung dengan id ${socket.id}`)
    socket.on('messageAll', ({ message, user }) => {
        const current = new Date();
        let time = current.toLocaleTimeString();
        io.emit('messageBE', { user, message, date: time })
    })
    socket.on('messagePrivate', ({ message, id, user }) => {
        const current = new Date;
        let time = current.toLocaleTimeString();
        socket.to(id).emit('messageBE', { user, message, date: time })
    })
    socket.on('inisialRoom', ({room, username})=> {
        console.log('room: ', room)
        console.log('username: ', username);
        socket.join(room)
    })
    socket.on('sendMessage',({sender,message,room})=>{
        console.log(sender,message,room);
        const current = new Date();
        let time = current.toLocaleTimeString();
        io.to(room).emit('newMessage', {sender,message,date:time})
    })
    socket.on('storeClientInfo', (data) => {
        let clientInfo = new Object();
        clientInfo.customId  = data.customId;
        clientInfo.clientId  = socket.id;
        clients.push(clientInfo);
    });
    socket.on('disconnect',()=>{
        console.log(`ada perangkat yang terputus dengan id ${socket.id}`);
    })
})

httpServer.listen(PORT, () => {
    console.log(`${APP_URL}`);
})
