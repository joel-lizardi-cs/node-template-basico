const { request, response } = require('express');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const validarJWT = async(req = request, res = response, next) => {

    const token = req.header('x-token');

    if(!token) return res.status(401).json({
        msg: "No hay token en la petición"
    });

    try {

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        const userAuth =  await User.findById(uid);

        // Validar que exista usuario
        if(!userAuth) return res.status(401).json({
            msg: 'Token no válido - Usuario no existe DB'
        });

        // Validar que el uid sea válido (estado: true)
        if(!userAuth.estado) return res.status(401).json({
            msg: 'Token no válido - Usuario no válido'
        });

        req.userAuth = userAuth;

        next();

    } catch (error) {

        console.log(error);
        return res.status(401).json({
            msg: "Token no valido"
        });

    }

}

module.exports = {
    validarJWT
}