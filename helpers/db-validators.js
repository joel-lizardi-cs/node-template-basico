const Role = require('../models/role'); // Modelo o esquema de los roles
const User = require('../models/user'); // Instancia de Modelo Users

const esRolValido = async(rol = '') => {

    const existeRol = await Role.findOne({rol});
    if(!existeRol) throw new Error(`El rol ${rol} no es válido`);

}

const emailExiste = async(email = '') => {

    // Verificar si el correo existe
    const existeEmail = await User.findOne({ correo });
    if(existeEmail) throw new Error(`El correo ${email}, ya esta registrado`);

}

const existeUserById = async(id = '') => {

    const existeUser = await User.findById(id);
    if(!existeUser) throw new Error(`El id "${id}" no existe`);

}

module.exports = {
    esRolValido,
    emailExiste,
    existeUserById
}