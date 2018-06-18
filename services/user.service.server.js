module.exports = function (app) {
  app.get('/api/user', findAllUsers);
  app.get('/api/user/:userId', findUserById);
  app.post('/api/user', createUser);
  app.get('/api/profile', profile);
  app.post('/api/logout', logout);
  app.post('/api/login', login);
  app.put('/api/user', updateUser);

  var userModel = require('../models/user/user.model.server');

  function login(req, res) {
    var credentials = req.body;
    userModel
      .findUserByCredentials(credentials)
      .then(function(user) {
        if (user !== null) {
          if (user._id !== undefined) {
            req.session['currentUser'] = user;
            res.json(user);
          } else {
            res.send(false);
          }
        } else {
          res.send(false);
        }
      });
  }

  function logout(req, res) {
    req.session.destroy();
    res.send(200);
  }

  function findUserById(req, res) {
    var id = req.params['userId'];
    userModel.findUserById(id)
      .then(function (user) {
        res.json(user);
      })
  }

  function profile(req, res) {
    res.send(req.session['currentUser']);
  }

  function createUser(req, res) {
    var user = req.body;
    userModel.createUser(user)
      .then(function (user) {
        req.session['currentUser'] = user;
        res.send(user);
      })
  }

  function updateUser(req, res) {
    var user = req.body;
    return userModel.updateUser(user)
      .then(function () {
        req.session['currentUser'] = user;
        res.json(user);
      });
  }

  function findAllUsers(req, res) {
    var username = req.query['username'];

    if (username) {
      userModel.findUserByUsername(username)
        .then(function (users) {
          res.json(users);
        });
    }
    else {
      userModel.findAllUsers()
        .then(function (users) {
          res.json(users);
        });
    }
  }
}
