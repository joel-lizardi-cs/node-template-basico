const { request, response } = require('express');
const { Producto } = require('../models');

const obtenerProductos = async(req = request, res = response) => {

    // Paginado
    const { limite = 5, desde = 0 } = req.query;

    // Activo
    const query = { estado: true };

    // Total productos
    const [ total, productos ] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('user', 'nombre')
            .populate('categoria', 'nombre')
            .skip(desde)
            .limit(limite)
    ]);

    res.json({
        total,
        productos
    });

}

const obtenerProductosById = async(req = request, res = response) => {

    const { id } = req.params;

    const producto = await Producto.findById(id)
                                .populate('user', 'nombre')
                                .populate('categoria', 'nombre');

    res.json(producto);

}

const crearProducto = async(req = request, res = response) => {
    
    const { estado, usuario, ...body} = req.body;

    const productoDB = await Producto.findOne({nombre: body.nombre});

    if(productoDB) return res.status(400).json({
        msg: `El producto ${productoDB.nombre}, ya existe`
    });

    // Generar la data del producto
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        user: req.userAuth._id
    }

    const producto = new Producto(data);

    //Guardar en DB
    await producto.save();

    res.status(201).json({
        producto
    });
}

const actualizarProducto = async(req = request, res = response) => {

    const { id } = req.params;

    const { estado, usuario, ...data} = req.body;

    if(data.nombre) {
        data.nombre = data.nombre.toUpperCase()
    }

    data.user = req.userAuth._id;

    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

    res.json({producto});

}

const eliminarProducto = async(req = request, res = response) => {

    const { id } = req.params;

    const producto = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.json({producto});

}

module.exports = {
    obtenerProductos,
    obtenerProductosById,
    crearProducto,
    actualizarProducto,
    eliminarProducto
}