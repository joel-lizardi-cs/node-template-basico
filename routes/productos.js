const { Router } = require('express'); // Función o metodo para generar las rutas de la aplicación
const { check } = require('express-validator'); // Metodo "check" para validar parametros de payload

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT, validarAdminRole } = require('../middlewares');
const { 
    obtenerProductos, 
    obtenerProductosById, 
    crearProducto, 
    actualizarProducto,
    eliminarProducto
} = require('../controllers/productos');
const { existeProductoById, existeCategoriaById } = require('../helpers/db-validators');

const router = Router();

// Obtener todos los productos - público
router.get('/', obtenerProductos);

// Obtener un producto por ID - público
router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeProductoById),
    validarCampos
], obtenerProductosById);

// Crear producto - privado - Cualquier persona con token válido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un ID válido').isMongoId(),
    check('categoria').custom(existeCategoriaById),
    validarCampos
], crearProducto);

// Actualizar producto por ID - privado - Cualquier persona con token válido
router.put('/:id',[
    validarJWT,
    //check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeProductoById),
    validarCampos
], actualizarProducto);

// Borrar producto - privado - Solo personas con role Admin
router.delete('/:id', [
    validarJWT,
    validarAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeProductoById),
    validarCampos
], eliminarProducto);

module.exports = router;