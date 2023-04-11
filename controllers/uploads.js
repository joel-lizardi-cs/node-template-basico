const { request, response } = require("express");
const path = require('path');
const fs = require('fs');

const { subirArchivo } = require("../helpers");
const { User, Producto } = require('../models');

const cargarArchivo = async(req = request, res = response) => {

    try {

        const { coleccion } = req.params;

        let archivo;

        switch (coleccion) {
            case 'archivos':

                const archivosPermitidos = ['txt', 'md'];
                archivo = await subirArchivo(req.files, archivosPermitidos, 'archivos');

                break;
            case 'imagenes':

                archivo = await subirArchivo(req.files, undefined, 'imagenes');

                break;
            default:
                return res.status(500).json({
                    msg: 'No se realizo el guardado del archivo/imagen'
                });
        }

        return res.json({archivo});

    } catch(error) {

        return res.status(400).json({msg: error});

    }

}

const actualizarImagen = async(req = request, res = response) => {

    try {

        const { id, coleccion } = req.params;

        let modelo;

        switch(coleccion) {
            case 'usuarios':

                modelo = await User.findById(id);
                if(!modelo) return res.status(400).json({
                    msg: `No existe un usuario con el ID ${id}`
                });

                break;
            case 'productos':

                modelo = await Producto.findById(id);
                if(!modelo) return res.status(400).json({
                    msg: `No existe un producto con el ID ${id}`
                });

                break;
            default:
                return res.status(500).json({
                    msg: 'No se realizo la actualización de la imagen'
                });
        }

        // Limpiar Imagenes Previas
        if(modelo.img) {

           // Borrar imagen del servidor
           const pathImagen =  path.join(__dirname, '../uploads', coleccion, modelo.img);
           if(fs.existsSync(pathImagen)) fs.unlinkSync(pathImagen);

        }

        const archivo = await subirArchivo(req.files, undefined, coleccion);
        modelo.img = archivo;
    
        await modelo.save();
    
        return res.json({modelo});

    } catch(error) {

        return res.status(400).json({msg: error});

    }

}

const mostrarImagen = async(req = request, res = response) => {

    try {

        const { id, coleccion } = req.params;

        let modelo;

        switch(coleccion) {
            case 'usuarios':

                modelo = await User.findById(id);
                if(!modelo) return res.status(400).json({
                    msg: `No existe un usuario con el ID ${id}`
                });

                break;
            case 'productos':

                modelo = await Producto.findById(id);
                if(!modelo) return res.status(400).json({
                    msg: `No existe un producto con el ID ${id}`
                });

                break;
            default:
                return res.status(500).json({
                    msg: 'No se obtuvo la imagen'
                });
        }

        // Verificar si existe la imagen
        if(modelo.img) {

           // Obtener path de la imagen
           const pathImagen =  path.join(__dirname, '../uploads', coleccion, modelo.img);
           if(fs.existsSync(pathImagen)) return res.sendFile(pathImagen);

        }

        const pathImage =  path.join(__dirname, '../assets/no-image.jpg');
        return res.sendFile(pathImage);

    } catch(error) {

        return res.status(400).json({msg: error});

    }

}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen
}