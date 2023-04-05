const { response, request } = require("express");
const bcryptjs = require('bcryptjs');

const User = require('../models/user');
const { generarJWT } = require("../helpers/generar-jwt");

const login = async(req =  request, res = response) => {

    const { correo, password } = req.body;

    try {

        // Verificar si correo existe
        const user = await User.findOne({correo});
        if(!user) return res.status(400).json({
            msg: 'Usuario/Password no son correctos - Correo'
        });

        // Verificar si usuario esta activo
        if(!user.estado) return res.status(400).json({
            msg: 'Usuario/Password no son correctos - Estado: False'
        });

        // Verificar contraseña
        const validPassword = bcryptjs.compareSync(password, user.password);
        if(!validPassword) return res.status(400).json({
            msg: 'Usuario/Password no son correctos - Password'
        });

        // Generar la JWT
        const token = await generarJWT(user.id);

        res.json({
            user,
            token
        });

    } catch(error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador del back'
        });
    }

}

module.exports = {
    login
}