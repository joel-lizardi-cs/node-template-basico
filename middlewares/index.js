
const validarCampos = require('../middlewares/validar-campos'); //Middleware personalizado para revisar si existen errores al validar los campos
const validarJWT = require('../middlewares/validar-jwt'); // Valida el JsonwebToken (x-token) para poder utilizar la API
const validarRoles = require('../middlewares/validar-roles'); // Valida que solo sea rol Admin (validarAdminRole), valida que el usuario contenga algun rol permitido (tieneRole)
const validarArchivoSubir = require('../middlewares/validar-archivo'); // Valida que exista el parametro "archivo" en el payload de la API

module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...validarRoles,
    ...validarArchivoSubir
}