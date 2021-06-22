const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('./user');

const emailRegex = /\S+@\S+\.\S+/;
const passwordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,12})/;

const sendErrorsFromDB = (res, dbErrors) => {
  const errors = [];
  _.forIn(dbErrors.errors, error => {
    errors.push(error.message);
  });
  return res.status(400).json({ errors });
}

const login = (req, res, next) => {
  const email = req.body.email || '';
  const password = req.body.password;

  User.findOne({ email }).then((user) => {
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ _id: user._id, name: user.name, email: user.email }, process.env.AUTH_SECRET, {
        expiresIn: '1 day'
      });

      const { name, email } = user;
      return res.json({ name, email, token });
    } else {
      return res.status(400).json({ errors: ['Usuário/Senha inválidos'] });
    }
  }).catch(err => {
    return sendErrorsFromDB(res, err);
  });
};

const validateToken = (req, res, next) => {
  const token = req.body.token || '';
  jwt.verify(token, process.env.AUTH_SECRET, function (err, decoded) {
    return res.status(200).json({ valid: !err });
  });
}

const signup = (req, res, next) => {
  const name = req.body.name || '';
  const email = req.body.email || '';
  const password = req.body.password || '';
  const confirmPassword = req.body.confirm_password || '';

  if (!email.match(emailRegex)) {
    return res.status(400).json({ errors: ['O e-mail informado é inválido'] });
  }

  if (!password.match(passwordRegex)) {
    return res.status(400).json({ errors: ["Senha precisa ter: uma letra maiúscula, uma letra minúscula, um número, um caractere especial(@#$%) e tamanho entre 6 e 12."] })
  }

  const salt = bcrypt.genSaltSync();
  const passwordHash = bcrypt.hashSync(password, salt);
  if (!bcrypt.compareSync(confirmPassword, passwordHash)) {
    return res.status(400).json({ errors: ['Senhas não são iguais'] });
  }

  User.findOne({ email }, (err, user) => {
    if (err) {
      return sendErrorsFromDB(res, err);
    } else if (user) {
      return res.status(400).json({ errors: ['Usuário já cadastrado'] });
    } else {
      const newUser = new User({ name, email, password: passwordHash });
      newUser.save(err => {
        if (err) {
          return sendErrorsFromDB(res, err);
        } else {
          login(req, res, next);
        }
      })
    }
  })
}

module.exports = { login, signup, validateToken };