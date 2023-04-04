const { response, request } = require('express');

const bcryptjs = require('bcryptjs'); // Paquete para encriptar las contraseñas
const User = require('../models/user'); // Instancia de Modelo Users

const usersGet = async(req = request, res = response) => {

    //const {q, nombre = 'No name', apiKey, page = 1, limit} = req.query;
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    //const users = await User.find(query).skip(desde).limit(limite);

    //const total = await User.countDocuments(query);

    const [total, users] = await Promise.all([
        User.countDocuments(query),
        User.find(query).skip(desde).limit(limite)
    ]);

    res.json({
        total,
        users
    });
}

const usersPost = async(req = request, res = response) => {

    const { nombre, correo, password, rol } = req.body; // Obtener el payload (body)
    const user = new User({nombre, correo, password, rol}); // Crear una instancia nueva de User
    
    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);

    // Guardar en DB
    await user.save();

    //Devolver una respuesta exitosa
    res.json({user});
}

const usersPut = async(req = request, res = response) => {

    const { id } = req.params;
    const { _id, password, google, ...resto } = req.body;

    // TODO validar vs BD
    if(password) {
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const user = await User.findByIdAndUpdate(id, resto);

    res.json({user});
}

const usersDelete = async(req, res = response) => {

    const { id } = req.params;

    // Borrar fisicamente
    // const user = await User.findByIdAndDelete(id);

    // Borrar logicamente
    const user = await User.findByIdAndUpdate(id, { estado: false });

    res.json({
        user
    });
}

const usersPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - Controller'
    });
}


module.exports = {
    usersGet,
    usersPost,
    usersPut,
    usersDelete,
    usersPatch
}