const { request, response } = require("express");
const { ObjectId } = require('mongoose').Types;

const { User, Category, Producto } = require('../models');

const coleccionesPermitidas = [
    'categorias',
    'productos',
    'productos-por-categoria',
    'roles',
    'usuarios'
];

const buscarCategorias = async(termino = '', res = response) => {

    try {

        const isMongoID = ObjectId.isValid(termino);

        if(isMongoID){

            const categoria = await Category.findById(termino);

            return res.json({
                results: (categoria) ? [categoria] : []
            });

        }

        const regex = new RegExp(termino, 'i');

        const categorias = await Category.find({ nombre: regex, estado: true });

        return res.json({
            results: categorias
        });

    } catch(error) {
        res.status(500).json({
            msg: 'No fue posible buscar por categoria',
            error
        });
    }

}

const buscarProductos = async(termino = '', res = response) => {

    try {

        const isMongoID = ObjectId.isValid(termino);
    
        if(isMongoID){
    
            const producto = await Producto.findById(termino).populate('categoria', 'nombre');
    
            return res.json({
                results: (producto) ? [producto] : []
            });
    
        }
    
        const regex = new RegExp(termino, 'i');
    
        const productos = await Producto.find({ nombre: regex, estado: true }).populate('categoria', 'nombre');
    
        return res.json({
            results: productos
        });

    } catch(error) {
        res.status(500).json({
            msg: 'No fue posible buscar por Productos',
            error
        });
    }

}

const buscarProductosPorCategoria = async(termino = '', res = response) => {

    try {

        const isMongoID = ObjectId.isValid(termino);
    
        if(isMongoID) {
    
            const producto = await Producto.find({ categoria: ObjectId(termino), estado: true })
                                        .select('nombre precio descripcion disponible')
                                        .populate('categoria', 'nombre');
    
            return res.json({
                results: (producto) ? [producto] : []
            });
    
        }
    
        const regex = new RegExp(termino, 'i');
     
        const categorias = await Category.find({ nombre: regex, estado: true});

        if(!categorias.length) {
            return res.status(400).json({
                msg: `No hay resultados de busqueda con ${termino}`
            });
        }

        const query = {
            $or: [...categorias.map(c => { return { categoria: c._id } } )],
            $and: [{ estado: true }]
        }
        
        const [total, productos] = await Promise.all([
            Producto.countDocuments(query),
            Producto.find(query).select('nombre precio descripcion disponible').populate('categoria', 'nombre')
        ]);
        
        /*const productos = await Producto.find({
            $or: [...categorias.map( categoria => ({
                categoria: categoria._id
            }))],
            $and: [{ estado: true }]
        })
        .select('nombre precio descripcion disponible')
        .populate('categoria', 'nombre');*/
     
        res.json({
            total,
            results: productos
        });

    } catch(error) {
        res.status(500).json({
            msg: 'No fue posible buscar Productos por Categoria',
            error
        });
    }

}

const buscarUsuarios = async(termino = '', res = response) => {

    try {

        const isMongoID = ObjectId.isValid(termino);
    
        if(isMongoID) {
            
            const usuario = await User.findById(termino);
    
            return res.json({
                results: (usuario) ? [usuario] : []
            });
    
        }
    
        const regex = new RegExp(termino, 'i');
    
        const usuarios = await User.find({ 
            $or: [{ nombre: regex }, { correo: regex }],
            $and: [{ estado: true }]
        });
    
        return res.json({
            results: usuarios
        });

    } catch(error) {
        res.status(500).json({
            msg: 'No fue posible buscar por Usuarios',
            error
        });
    }

}

const buscar = async(req = request, res = response) => {

    const { coleccion, termino } = req.params;

    if(!coleccionesPermitidas.includes(coleccion)) return res.status(400).json({
        msg: `Colección ${coleccion}, no permitida`
    });

    switch (coleccion) {
        case 'categorias':
            buscarCategorias(termino, res);
            break;
        case 'productos':
            buscarProductos(termino, res);
            break;
        case 'productos-por-categoria':
            buscarProductosPorCategoria(termino, res);
            break;
        case 'usuarios':
            buscarUsuarios(termino, res);
            break;
        default:
            res.status(500).json({
                msg: 'No se realizo este tipo de búsqueda'
            });
    }

}

module.exports = {
    buscar
}