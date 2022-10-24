const express = require("express");
const { Server: HttpServer } = require("http");
const { Server: SocketServer } = require("socket.io");
const { formatMessage } = require("./utils/utils")
const dbconfig = require("./db/config")

// instancia modificada para el corriente desafio 
const Container = require("./db/db.container");
const products = new Container(dbconfig.mariaDB, "productos");
const messages = new Container(dbconfig.sqlite, "mensajes");



// instancia aun no modificada para el corriente desafio
/* const Messages = require("./model/contMessages");
const messages = new Messages("./model/messages.json"); */

const PORT = process.env.PORT || 8080;
const app = express();
const httpServer = new HttpServer(app);
const io = new SocketServer(httpServer);

const users = [];


// Middlewares
app.use(express.static("./public"));
app.use(express.json());
app.use(express.urlencoded({extended: false}))


httpServer.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
});

const dataTest = [
    {
        id: 16,
        name: 'Conga ',
        thumbnail: 'https://http2.mlstatic.com/D_NQ_NP_2X_808063-MLA44860963831_022021-F.webp',
        description: 'Pantalla OLED T',
        price: 1300000,
        stock: 500,
        code: 1016
    }
]

const dataTest2 = {
    id: 16,
    name: 'Conga ',
    thumbnail: 'https://http2.mlstatic.com/D_NQ_NP_2X_808063-MLA44860963831_022021-F.webp',
    description: 'Pantalla OLED T',
    price: 1300000,
    stock: 500,
    code: 1016
}


io.on("connection", async (socket) => {
    console.log("Nuevo usuario conectado");
    const productos = await products.getAll()
    socket.emit("products", [...productos]);
    const mensajes = messages.getAll()
    socket.emit("messages", mensajes);
    socket.on("new-product", (data) => {
        const addProduct =  products.save(data)
        io.emit("products", [...productos]);
    });
    socket.on("new-message", (data) => {
        const newUser = {
            id: socket.id,
            username: data.user
        }
        users.push(newUser)
        const author = users.find(user => user.id === socket.id);
        const newMessage = formatMessage(socket.id, author.username, data.text);
        const addMessage = messages.save(newMessage)
        io.emit("chat-message", newMessage);
    });
});




