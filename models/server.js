const express = require('express'); // Paquete/Dependencia/Framework para generar un sitio Web (API para este proyecto)
const cors = require('cors'); // Middleware para habilitar CORS

const { dbConnection } = require('../database/config'); // Obtener modulo de conexión a MongoDB

class Server {

    constructor() {

        this.app = express();
        this.port = process.env.PORT || 3000;

        // Routes Path
        this.usersRoutePath = '/api/users';

        // Conexión DB
        this.connectarDB();

        // Middlewares
        this.middlewares();

        // Rutas de la aplicación
        this.routes();

    }

    async connectarDB() {
        await dbConnection();
    }

    middlewares() {

        // CORS
        this.app.use(cors());

        // Lectura y Pasrseo del Body
        this.app.use(express.json());

        // Directorio Publico
        this.app.use(express.static('public'));

    }

    routes() {
        
        // API Users
        this.app.use(this.usersRoutePath, require('../routes/users'));

    }

    listen() {

        this.app.listen(this.port, () => {
            console.log("Servidor corriendo en el puerto ", this.port);
        });

    }

}

module.exports = Server;
