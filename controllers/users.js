const { response, request } = require('express');

const usersGet = (req = request, res = response) => {

    const {q, nombre = 'No name', apiKey, page = 1, limit} = req.query;

    res.json({
        msg: 'get API - Controller',
        q,
        nombre,
        apiKey,
        page,
        limit
    });
}

const usersPost = (req = request, res = response) => {

    const body = req.body;
    //const {nombre, edad} = req.body;

    res.json({
        msg: 'post API - Controller',
        body//,
        //nombre,
        //edad
    });
}

const usersPut = (req = request, res = response) => {

    const {id} = req.params;

    res.json({
        msg: 'put API - Controller',
        id
    });
}

const usersDelete = (req, res = response) => {
    res.json({
        msg: 'delete API - Controller'
    });
}

const usersPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - Controller'
    });
}


module.exports = {
    usersGet,
    usersPost,
    usersPut,
    usersDelete,
    usersPatch
}