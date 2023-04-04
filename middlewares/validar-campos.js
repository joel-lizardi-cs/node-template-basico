const { validationResult } = require('express-validator'); // Paquete para obtener la respuesta de las validaciones de parametros

const validarCampos = (req, res, next) => {

    const error = validationResult(req); // Obtener errores de validaciones (si es que existen)
    if(!error.isEmpty()) return res.status(400).json(error);

    next();

}

module.exports = {
    validarCampos
}