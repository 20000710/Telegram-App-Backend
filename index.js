const express = require("express");
const cors = require('cors');
const { createServer } = require("http");
const { Server } = require("socket.io");
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { failed } = require('./helpers/response');
const xssClean = require('xss-clean');
const { HOST, PORT, APP_URL } = require('./helpers/env');
const mainRouter = require("./routes/index.route");
const socketController = require("./controllers/socket.controller");
const app = express();
// middleware
app.use(express.urlencoded({extended: true}))
app.use(express.json());
app.use(xssClean());
app.use(cors());
const httpServer = createServer(app);
app.use(bodyParser.json());
app.use(
    helmet({
        crossOriginResourcePolicy: false,
    }),
);
app.use(express.static('public'));

// route here
app.use("/api/v1", mainRouter);
app.all('*', (req, res) => {
    failed(res, {
        code: 503,
        status: 'error',
        message: `Service unavailable`,
        error: [],
    });
});

const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:3000',
        credentials: true
    },
});
io.on("connection", (socket) => {
    console.log('New user connected to socket');
    socketController(io, socket);
})


// running server
httpServer.listen(PORT, () => {
    console.log(`running on ${APP_URL}`);
})
