const http = require('http');
const app = require('./app');
const dotenv = require('dotenv').config();
const { initializeSocket } = require('./socket');

const server = http.createServer(app);
const PORT = process.env.PORT;

initializeSocket(server);

server.listen(PORT, (req,res)=>{
    console.log(`server is running on port ${PORT}`);
});