const express = require("express");
const { Server: HttpServer } = require("http");
const { Server: SocketServer } = require("socket.io");
const { formatMessage } = require("./utils/utils")
const dbconfig = require("./db/config")
const apiRoutes = require("./routers/app.routers");

const SQLClient = require("./db/db.container");
const products = new SQLClient(dbconfig.mariaDB, "productos");
const messages = new SQLClient(dbconfig.sqlite, "mensajes");




const PORT = process.env.PORT || 8080;
const app = express();
const httpServer = new HttpServer(app);
const io = new SocketServer(httpServer);

const users = [];


// Middlewares
app.use(express.static("./public"));
app.use(express.json());
app.use(express.urlencoded({extended: false}))


app.use("/", apiRoutes);


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

const mensajeTest = {
    username: 'Walter',
    text: 'Que honduras!',
    created_at: null
}





io.on("connection", async (socket) => {
    console.log("Nuevo usuario conectado");
    const productos = await products.getAll()
    socket.emit("products", [...productos]);
    const mensajes = await messages.getAll()
    socket.emit("messages", mensajes);
    socket.on("new-product", async (data) => {
        const addProduct =  await products.save(data)
        const productos = await products.getAll()
        io.emit("products", [...productos]);
    });
    socket.on("new-message", async (data) => {
        const newUser = {
            id: socket.id,
            username: data.user
        }
        users.push(newUser)
        const author = users.find(user => user.id === socket.id);
        const newMessage = formatMessage(socket.id, author.username, data.text);

        const { username, text, created_at } = newMessage
        await messages.save({ username, text, created_at })
        io.emit("chat-message", newMessage);
    });
});




