const { request, response } = require("express")

const validarAdminRole = (req = request, res = response, next) => {

    if(!req.userAuth) return res.status(500).json({
        msg: 'Verificación de role fallida, token no validado correctamente'
    });

    const {rol, nombre} = req.userAuth;

    if(rol !== 'ADMIN_ROLE') return res.status(401).json({
        msg: `${nombre} no tiene permisos de Administrador`
    });

    next();

}

const tieneRole = ( ...roles ) => {

    return (req = request, res = response, next) => {

        if(!req.userAuth) return res.status(500).json({
            msg: 'Verificación de role fallida, token no validado correctamente'
        });

        if(!roles.includes(req.userAuth.rol)) return res.status(401).json({
            msg: `El usuario ${req.userAuth.nombre} no tiene los permisos suficientes para realizar la operación`
        });

        next();
    }
}

module.exports = {
    validarAdminRole,
    tieneRole
}