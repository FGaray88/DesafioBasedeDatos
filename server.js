const express = require("express");
const { Server: HttpServer } = require("http");
const { Server: SocketServer } = require("socket.io");
const { formatMessage } = require("./utils/utils")

// instancia modificada para el corriente desafio 
const Products = require("./db/db.container");
const products = new Products("productos");




// instancia aun no modificada para el corriente desafio
const Messages = require("./model/contMessages");
const messages = new Messages("./model/messages.json");

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


io.on("connection", async (socket) => {
    console.log("Nuevo usuario conectado");
    const productos = await products.getAll()
    console.log(productos);
    // HASTA ESTE LOG LLEGA EL ARRAY CORRECTAMENTE A productos || notese que ahora toda la funcion es async


    // A PARTIR DE LA SIGUIENTE LINEA ME DICE QUE productos NO ES ITERABLE, PERO SI ES UN ARRAY POR QUE NO ITERA?
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




