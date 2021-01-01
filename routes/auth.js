const {Router} = require('express');
const {check} = require('express-validator');
const {validateFields} = require('../middlewares/validate-fields');
const {validateJWT} = require('../middlewares/vaidate-jwt');
const router = Router();

const {createUser, login, revalidateToken} = require('../controllers/auth');

router.post('/new',
    [
        check('name', 'E nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser de 6 carateres').isLength({min: 6}),
        validateFields
    ], createUser);

router.post('/', [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password debe de ser de 6 carateres').isLength({min: 6}),
    validateFields
], login);

router.get('/renew', validateJWT, revalidateToken);

module.exports = router;
