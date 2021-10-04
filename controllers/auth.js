const { request, response } = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const { createJTW } = require('../helpers/jwt');

const crearUsuario = async (req = request, res = response) => {
  const { name, email, password } = req.body;
  try {
    // Verificar si no existe un correo igual
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ ok: false, msg: 'El correo ya esta registrado.' });

    // Crear usuario con el modelo
    const newUser = new User(req.body);

    // Encriptar la  contraseña
    const salt = bcrypt.genSaltSync();
    newUser.password = bcrypt.hashSync(password, salt);

    // Generar JWT
    const token = await createJTW(newUser.id, newUser.name);

    // Crear usuario en BD
    await newUser.save();

    // Generar respuesta exitosa
    res.status(201).json({
      ok: true,
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: 'Ponerse en contacto con el administrador',
    });
  }
};

const loginUsuario = async (req = request, res = response) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ ok: false, msg: 'El correo no esta registrado.' });

    // Verificar la contraseña
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) return res.status(400).json({ ok: false, msg: 'La contraseña es incorrecta.' });

    // Generar JWT
    const token = await createJTW(user.id, user.name);

    res.status(200).json({
      ok: true,
      id: user.id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: 'Pongase en contacto con el administrador.',
    });
  }
};

const renovarToken = async (req = request, res = response) => {
  const { id } = req;
  try {
    let user = await User.findById(id);
    if (!user) return res.status(400).json({ ok: false, msg: 'El usuario no existe.' });

    const { name, email } = user;
    const token = await createJTW(id, name);

    res.json({
      ok: true,
      id,
      name,
      email,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: 'Pongase en contacto con el administrador.',
    });
  }
};

module.exports = {
  crearUsuario,
  loginUsuario,
  renovarToken,
};
