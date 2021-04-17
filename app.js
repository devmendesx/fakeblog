/**
 * @author Matheus Mendes
 * App feito para conhecimento prévio sobre NodeJs, que futuramente somente será usando para APIs.
 */

/* Variables for development which is used to instance the App*/
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/server");
const user = require("./database/user")
const session = require("express-session")


/* Controllers Imports*/
const ArticlesController = require("./App/Http/Controllers/ArticlesController");
const CategoriesController = require("./App/Http/Controllers/CategoriesController");
const UsersController = require("./App/Http/Controllers/UserController")
/* Models Imports*/
const Article = require("./App/Models/Articles");
const Category = require("./App/Models/Category");
const User = require("./App/Models/User")

/* Set body parser to use formules, remember that BodyParser is */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
/* Session */ 
app.use(
  session({
    secret: "blog-db-nodejs",
    cookie: { maxAge: 31536000 },
    saveUninitialized: true,
    resave: true,
  })
);

/* Routes for Controllers*/

app.use("/", ArticlesController);
app.use("/", CategoriesController);
app.use("/",UsersController)


/* View engine being set */
app.set("view engine", "ejs");

/** static files */
app.use(express.static(__dirname + "/public"));

/** database authenticate */
connection
  .authenticate()
  .then(() => {
    console.log("Conexão criada com sucesso!");
  })
  .catch((error) => console.log(error));

app.get("/", (req, res) => {
  let user = req.session.user
  Category.findAll().then((categories) => {
    Article.findAll({ include: [{ model: Category }] }).then((articles) => {
      res.render("index", {
        categories: categories,
        articles: articles,
        breadcrumb: "Inicio",
        user: user
      });
    });
  });
});
 /* Login */
app.get("/login", (req,res) => {
  let message = req.session.loginMessage;
  let fail = req.session.loginFailure;
  res.render("login", {
    breadcrumb: "Login",
    fail: fail,
    message: message,
  });
})

app.get("/logout", (req,res) => {
  req.session.user = undefined
  res.redirect("/")
})

app.listen(80, () => {
  console.log("Porta 8080 do projeto!");
});
