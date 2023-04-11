const express = require('express'); // Paquete/Dependencia/Framework para generar un sitio Web (API para este proyecto)
const cors = require('cors'); // Middleware para habilitar CORS
const fileUpload = require('express-fileupload'); //Middleware para permitir carga de archivos

const { dbConnection } = require('../database/config'); // Obtener modulo de conexión a MongoDB

class Server {

    constructor() {

        this.app = express();
        this.port = process.env.PORT || 3000;

        // Routes Path
        this.paths = {
            auth:       '/api/auth',
            buscar:     '/api/buscar',
            categories: '/api/categories',
            uploads:    '/api/uploads',
            users:      '/api/users',
            productos:  '/api/productos'
        }

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

        //FileUpload - Carga de Archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));


    }

    routes() {
        
        // API AUTH
        this.app.use(this.paths.auth, require('../routes/auth'));

        // API Buscar
        this.app.use(this.paths.buscar, require('../routes/buscar'));

        // API Categories
        this.app.use(this.paths.categories, require('../routes/categories'));

        // API Productos
        this.app.use(this.paths.productos, require('../routes/productos'));

        // API Uploads
        this.app.use(this.paths.uploads, require('../routes/uploads'));

        // API Users
        this.app.use(this.paths.users, require('../routes/users'));

    }

    listen() {

        this.app.listen(this.port, () => {
            console.log("Servidor corriendo en el puerto ", this.port);
        });

    }

}

module.exports = Server;
