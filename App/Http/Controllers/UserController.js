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
  User.findAll().then((users) => {
    res.render(usersIndex, {
      breadcrumb: "Administração de Usuários",
      users: users,
    });
  });
});

router.get("/admin/users/add", (req, res) => {
  res.render(usersAdd, {
    breadcrumb: "Criar novo usuário",
  });
});

/* Routes for users API*/

router.post("/api/users", (req, res) => {
  let username = req.body.username;
  let name = req.body.name;
  let password = req.body.password;
  let email = req.body.email;
  let profile = req.body.profile
  let encripthash = bcrypt.genSaltSync(15);
  password = bcrypt.hashSync(password, encripthash);

  User.findOne({ where: { email: email } }).then((userEmail) => {
    User.create({
      username: username,
      name: name,
      password: password,
      email: email,
      profile: profile
    })
      .then(() => {
        res.redirect("/admin/users");
      })
      .catch((error) => console.log(error));
  });
});

router.post("/authenticate", (req,res) =>{
  let username = req.body.username
  let password = req.body.password

  User.findOne({where: {username: username}}).then( (user) =>{
    if(user!=undefined){
      let compare = bcrypt.compareSync(password,user.password)
      if(compare) {
        req.session.user = {
          id: user.id,
          email: user.email,
          username: user.username,
          profile: user.profile
        }
        res.redirect("/")
      }else if(user == undefined){
        req.session.loginFailure = "Usuário inválido"
        res.redirect("/login")
      }else if(!compare){
       req.session.loginFailure = "Senha inválida";
       res.redirect("/login");
      }
    }
  })
})
module.exports = router;
