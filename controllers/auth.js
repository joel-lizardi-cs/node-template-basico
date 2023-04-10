const { response, request } = require("express");
const bcryptjs = require('bcryptjs');

const User = require('../models/user');

const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

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

const googleSingIn = async(req = request, res = response) => {
    
    const { id_token } = req.body;

    try {

        const { name, picture, email } = await googleVerify(id_token);

        // Verificar si usuario existe
        let user = await User.findOne({correo: email});

        if(!user) {

            // Crear usuario
            const data = {
                nombre: name,
                correo: email,
                password: process.env.DEFAULT_PASSWORD,
                img: picture,
                google: true
            };

            user = new User(data);
            await user.save();

        }

        // Si el usuario en DB
        if(!user.estado) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        // Generar la JWT
        const token = await generarJWT(user.id);

        res.json({
            user,
            token
        });

    } catch(error) {

        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        });

    }

}

module.exports = {
    login,
    googleSingIn
}