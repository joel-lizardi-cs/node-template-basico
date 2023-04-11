const {
    Category,   // Modelo/Instancia/Esquema de Categorias
    Role,       // Modelo/Instancia/Esquema de Roles
    User,       // Modelo/Instancia/Esquema de Usuarios
    Producto    // Modelo/Instancia/Esquema de Productos
} = require('../models');

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

const existeCategoriaById = async(id = '') => {

    const existeCategoria = await Category.findById(id);
    if(!existeCategoria) throw new Error(`El id ${id}, no existe`);

}

const existeProductoById = async(id = '') => {

    const existeProducto = await Producto.findById(id);
    if(!existeProducto) throw new Error(`El id ${id}, no existe`);

}

const coleccionesPermitidas = (coleccion = '', colecciones = []) => {

    const incluida = colecciones.includes(coleccion);

    if(!incluida) throw new Error(`La colección ${coleccion}, no es permitida`);

    return true;

}

module.exports = {
    esRolValido,
    emailExiste,
    existeUserById,
    existeCategoriaById,
    existeProductoById,
    coleccionesPermitidas
}