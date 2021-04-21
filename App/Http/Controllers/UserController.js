const express = require("express");
const router = express.Router();
const User = require("../../Models/User");
const bcrypt = require("bcryptjs");

const usersFolder = "modules/admin/users";
const usersAdd = usersFolder + "/add";
const usersIndex = usersFolder + "/index";
const usersEdit = usersFolder + "/edit";

/* View Routes for Admin Users */
router.get("/admin/users", (req, res) => {
  let user = req.session.user;
  User.findAll().then((users) => {
    res.render(usersIndex, {
      breadcrumb: "Administração de Usuários",
      users: users,
      user: user,
    });
  });
});

router.get("/admin/users/add", (req, res) => {
  let user = req.session.user;
  res.render(usersAdd, {
    breadcrumb: "Criar novo usuário",
    user: user,
  });
});

router.get("/admin/users/:id", (req, res) => {
  let user = req.session.user;
  let id = req.params.id;
  User.findByPk(id).then((users) => {
    if (users != undefined)
      res.render(usersEdit, {
        users: users,
        breadcrumb: "Administração de Usuários",
        user: user,
      });
    else res.render("/admin/users");
  });
});
/* Routes for users API*/
/* Inserir usuário*/
router.post("/api/users", (req, res) => {
  let username = req.body.username;
  let name = req.body.name;
  let password = req.body.password;
  let email = req.body.email;
  let profile = req.body.profile;
  let encripthash = bcrypt.genSaltSync(15);
  password = bcrypt.hashSync(password, encripthash);

  User.findOne({ where: { email: email } }).then((userEmail) => {
    User.create({
      username: username,
      name: name,
      password: password,
      email: email,
      profile: profile,
    })
      .then(() => {
        res.redirect("/admin/users");
      })
      .catch((error) => console.log(error));
  });
});

/* Excluir usuário*/
router.post("/api/users/destroy/:id", (req, res) => {
  let id = req.params.id;
  if (id != undefined && !isNaN(id)) {
    User.destroy({
      where: { id: id },
    }).then(() => res.redirect("/admin/users"));
  } else res.redirect("/admin/users");
});

/* Editar usuário*/
router.post("/api/users/:id", (req, res) => {
  let id = req.params.id;
  let username = req.body.username;
  let name = req.body.name;
  let password = req.body.password;
  let email = req.body.email;
  let profile = req.body.profile;
  let encripthash = bcrypt.genSaltSync(15);
  password = bcrypt.hashSync(password, encripthash);
  User.update(
    {
      username: username,
      name: name,
      password: password,
      email: email,
      profile: profile,
    },
    { where: { id: id } }
  ).then(() => {
    res.redirect("/admin/users");
  });
});

router.post("/authenticate", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  User.findOne({ where: { username: username } }).then((user) => {
    if (user != undefined) {
      let compare = bcrypt.compareSync(password, user.password);
      if (compare) {
        req.session.user = {
          id: user.id,
          email: user.email,
          name: user.name,
          username: user.username,
          profile: user.profile,
        };
        req.session.loginFailure = false;
        req.session.loginMessage = "";
        res.redirect("/");
      } else {
        req.session.loginFailure = true;
        req.session.loginMessage = "Senha inválida";
        res.redirect("/login");
      }
    } else if (user == null) {
      req.session.loginFailure = true;
      req.session.loginMessage = "Usuário inválido";
      res.redirect("/login");
    }
  });
});
module.exports = router;
