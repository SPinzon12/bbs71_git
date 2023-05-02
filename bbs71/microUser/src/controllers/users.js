const User = require("../models/user");
const bcrypt = require("bcryptjs");

const login = async (req, res) => {
  const { user, password } = req.body;
  try {
    const usuario = await User.findOne({ user: user });

    if (!usuario) {
      return res.status(401).json({
        error: "El usuario no existe",
      });
    }

    const passwordValid = await bcrypt.compare(password, usuario.password);

    if (!passwordValid) {
      return res.status(401).json({
        error: "Credenciales inválidas",
      });
    }

    res.status(200).json({
      ok: true,
      usuario,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error del servidor",
    });
  }
};

const inUser = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      ok: true,
      users,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      ok: false,
      err,
    });
  }
};

module.exports = {
  login,
  inUser,
};
