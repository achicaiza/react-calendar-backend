const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const {generateJWT} = require('../helpers/jwt');

const createUser = async (req, res) => {
    const {email, password} = req.body;
    try {
        let user = await Usuario.findOne({email});
        if (user) {
            return res.status(400).json({
                ok: false,
                mdg: 'Un usuario existe con ese correo'
            });
        }
        user = new Usuario(req.body);
        //Encriptar contraseña
        const salt = bcrypt.genSaltSync(10);
        user.password = bcrypt.hashSync(password, salt);
        await user.save();
        const token = await generateJWT(user.id, user.name);
        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Porfavor hable con el administrador'
        });
    }

};
const login = async (req, res) => {
    const {email, password} = req.body;
    try {
        let user = await Usuario.findOne({email});
        if (!user) {
            return res.status(400).json({
                ok: false,
                mdg: 'El usuario no existe con ese email'
            });
        }
        // Confirmar los passwords

        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña incorrecta'
            });
        }
        // Generar nuestro JWT
        const token = await generateJWT(user.id, user.name);
        res.json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });
    } catch (e) {
        res.status(500).json({
            ok: false,
            msg: 'Porfavor hable con el administrador'
        });
    }
};
const revalidateToken = async (req, res) => {
    const {uid, name} = req;
    const token = await generateJWT(uid, name);
    res.json({
        ok: true,
        token,
        uid,
        name
    });
};
module.exports = {
    createUser,
    login,
    revalidateToken
};
