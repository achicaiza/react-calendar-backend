const {Router} = require('express');
const {check} = require('express-validator');
const {getEvents, createEvent, updateEvent, deleteEvent} = require("../controllers/events");
const {isDate} = require('../helpers/isDate');
const {validateJWT} = require('../middlewares/vaidate-jwt');
const {validateFields} = require('../middlewares/validate-fields');

const router = Router();
//Todas las peticiones tienen que pasar por la validación del JWT
router.use(validateJWT);

//Obtener eventos
router.get('/', getEvents);

//Crear un nuevo evento
router.post('/', [
    check('title', 'El título es obigatorio').not().isEmpty(),
    check('start', 'Fecha de inicio es obligatorio').custom(isDate),
    check('end', 'Fecha de finalización es obligatorio').custom(isDate),
    validateFields
], createEvent);

//Actualizar evento
router.put('/:id', updateEvent);

//Eliminar evento
router.delete('/:id', deleteEvent);

module.exports = router;
