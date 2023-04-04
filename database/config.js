const mongoose = require('mongoose'); // Paquete/dependencia para realizar la conexión a MongoDB

const dbConnection = async() => { // Modulo con las configuraciones para la conexión a MongoDB

    try {

        await mongoose.connect(process.env.MONGODB_ATLAS);

        console.log("DB Ok");

    } catch(error) {
        console.log(error);
        throw new Error('Error con la conexión a la DB');
    }

}

module.exports = {
    dbConnection
}