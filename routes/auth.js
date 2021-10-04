const { Router } = require('express');
const { check } = require('express-validator');

const { crearUsuario, loginUsuario, renovarToken } = require('../controllers/auth');
const { inputValidationResults } = require('../middlewares/validation-results');
const { validateJWT } = require('../middlewares/validation-jwt');

const router = Router();

router.post(
  '/new',
  [
    check('name', 'El nombre de usuario es obligatorio.').notEmpty(),
    check('email', 'El correo es obligatorio.').notEmpty().isEmail(),
    check('password', 'La contraseña es obligatoria').notEmpty(),
    check('password', 'Debe tener minimo 6 caracteres').isLength({ min: 6 }),
    inputValidationResults,
  ],
  crearUsuario
);

router.post(
  '/',
  [
    check('email', 'El correo es obligatorio.').notEmpty().isEmail(),
    check('password', 'La contraseña es obligatoria').notEmpty(),
    check('password', 'Debe tener minimo 6 caracteres').isLength(6),
    inputValidationResults,
  ],
  loginUsuario
);

router.get('/renew', [validateJWT], renovarToken);

module.exports = router;
