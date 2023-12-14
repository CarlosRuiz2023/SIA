const { response, request } = require('express'); 
const Permiso = require('../../models/modelos/catalogos/permiso');

const permisosGet = async  (req = request, res = response) => {
    try {
        const query = { estatus: 1};
        const permiso = await Permiso.findAll({
            where: query,
        });

        res.status(200).json({
            ok:true,
            permiso
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Ha ocurrido un error, hable con el Administrador.',
            err: error
        });
    }

}



module.exports = {
    permisosGet,
};

