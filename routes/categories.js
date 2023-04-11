const { Router } = require('express'); // Función o metodo para generar las rutas de la aplicación
const { check } = require('express-validator'); // Metodo "check" para validar parametros de payload

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT, validarAdminRole } = require('../middlewares');
const { 
    crearCategoria, 
    obtenerCategoriasById, 
    obtenerCategorias, 
    actualizarCategoria,
    eliminarCategoria
} = require('../controllers/categories');
const { existeCategoriaById } = require('../helpers/db-validators');

const router = Router();

// Obtener todas las categorias - público
router.get('/', obtenerCategorias);

// Obtener una categoria por ID - público
router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeCategoriaById),
    validarCampos
], obtenerCategoriasById);

// Crear categoria - privado - Cualquier persona con token válido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);

// Actualizar categoria por ID - privado - Cualquier persona con token válido
router.put('/:id',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeCategoriaById),
    validarCampos
], actualizarCategoria);

// Borrar categoria - privado - Solo personas con role Admin
router.delete('/:id', [
    validarJWT,
    validarAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeCategoriaById),
    validarCampos
], eliminarCategoria);

module.exports = router;