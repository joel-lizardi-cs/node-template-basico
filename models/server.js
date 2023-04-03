const express = require('express');
const cors = require('cors');

class Server {

    constructor() {

        this.app = express();
        this.port = process.env.PORT || 3000;

        // Routes Path
        this.usersRoutePath = '/api/users';

        // Middlewares
        this.middlewares();

        // Rutas de la aplicación
        this.routes();

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
        
        this.app.use(this.usersRoutePath, require('../routes/users'));

    }

    listen() {

        this.app.listen(this.port, () => {
            console.log("Servidor corriendo en el puerto ", this.port);
        });

    }

}

module.exports = Server;
