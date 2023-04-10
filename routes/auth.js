const { Router } = require('express'); // Función o metodo para generar las rutas de la aplicación
const { check } = require('express-validator'); // Metodo "check" para validar parametros de payload

const { login, googleSingIn } = require('../controllers/auth'); // Todas las funciones/metodos/APIs que realizaran procesamiento de los datos
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post('/login', [
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], login);

router.post('/google', [
    check('id_token', 'ID Token de Google es necesario').not().isEmpty(),
    validarCampos
], googleSingIn);

module.exports = router;