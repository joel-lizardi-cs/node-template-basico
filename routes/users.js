const { Router } = require('express'); // Función o metodo para generar las rutas de la aplicación
const { check } = require('express-validator'); // Metodo "check" para validar parametros de payload

// Exportaciones Middlewares
const { validarCampos, validarJWT, validarAdminRole, tieneRole } = require('../middlewares'); // Llamada a index con los require necesarios para procesar las validaciones de middleware

// Exportaciones Helpers
const { esRolValido, emailExiste, existeUserById } = require('../helpers/db-validators'); // Helper para validar si el rol ingresado es válido

// Exportaciones Controllers
const { usersGet, usersPut, usersPost, usersDelete, usersPatch } = require('../controllers/users'); // Todas las funciones/metodos/APIs que realizaran procesamiento de los datos

const router = Router();

router.get('/', usersGet);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe ser más de 6 letras').isLength({min: 6}),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom(emailExiste),
    // check('rol', 'No es un rol válido').isIn('ADMIN_ROLE','USER_ROLE'),
    check('rol').custom(esRolValido),
    validarCampos
], usersPost);

router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUserById),
    check('rol').custom(esRolValido),
    validarCampos
], usersPut);

router.delete('/:id', [
    validarJWT,
    //validarAdminRole, // Valida que sea solo ADMIN_ROLE
    tieneRole('ADMIN_ROLE','VENTAS_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUserById),
    validarCampos
], usersDelete);

router.patch('/', usersPatch);

module.exports = router;