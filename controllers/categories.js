const { request, response } = require('express');
const { Category } = require('../models');

const obtenerCategorias = async(req = request, res = response) => {

    // Paginado
    const { limite = 5, desde = 0 } = req.query;

    // Activo
    const query = { estado: true };

    // Total categorias
    const [ total, categorias ] = await Promise.all([
        Category.countDocuments(query),
        Category.find(query)
            .populate('user', 'nombre')
            .skip(desde)
            .limit(limite)
    ]);

    res.json({
        total,
        categorias
    });

}

const obtenerCategoriasById = async(req = request, res = response) => {

    const { id } = req.params;

    const categoria = await Category.findById(id).populate('user', 'nombre');

    res.json(categoria);

}

const crearCategoria = async(req = request, res = response) => {
    
    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Category.findOne({nombre});

    if(categoriaDB) return res.status(400).json({
        msg: `La categoría ${categoriaDB.nombre}, ya existe`
    });

    // Generar la data de la categoria
    const data = {
        nombre,
        user: req.userAuth._id
    }

    const categoria = new Category(data);

    //Guardar en DB
    await categoria.save();

    res.status(201).json({
        categoria
    });
}

const actualizarCategoria = async(req = request, res = response) => {

    const { id } = req.params;

    const { estado, user, ...data} = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.user = req.userAuth._id;

    const categoria = await Category.findByIdAndUpdate(id, data, { new: true });

    res.json({categoria});

}

const eliminarCategoria = async(req = request, res = response) => {

    const { id } = req.params;

    const categoria = await Category.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.json({categoria});

}

module.exports = {
    obtenerCategorias,
    obtenerCategoriasById,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
}