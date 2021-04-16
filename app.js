/**
 * @author Matheus Mendes
 * App feito para conhecimento prévio sobre NodeJs, que futuramente somente será usando para APIs.
 */

/* Variables for development which is used to instance the App*/
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/server");

/* Controllers Imports*/
const ArticlesController = require("./App/Http/Controllers/ArticlesController");
const CategoriesController = require("./App/Http/Controllers/CategoriesController");

/* Models Imports*/
const Article = require("./App/Models/Articles");
const Category = require("./App/Models/Category");

/* Set body parser to use formules, remember that BodyParser is */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* Routes for Controllers*/

app.use("/", ArticlesController);
app.use("/", CategoriesController);

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
  Category.findAll().then((categories) => {
    Article.findAll().then((articles) => {
      res.render("index",{categories: categories, articles: articles}); 
    })
  });
});

app.listen(80, () => {
  console.log("Porta 8080 do projeto!");
});
