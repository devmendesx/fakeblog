const app = require("express")
const router = app.Router()

const Article = require("../../Models/Articles")
const Category = require("../../Models/Category")
const Slugify = require("slugify")

const ArticlesFolder = "modules/admin/articles"
const articlesAdd = ArticlesFolder + "/add"
const articlesIndex = ArticlesFolder + "/index"
const articlesEdit = ArticlesFolder + "/edit"

/**
 * @author Matheus Henrique
 * @description Rotas para APIs e Views
 */
/* Rota principal de artigos */
router.get("/articles", (req, res) => {
  res.send("Rota de Artigos")
})


/* Rotas de Views*/
router.get("/admin/articles/add", (req, res) => {
  Category.findAll().then((categories) => {
    res.render(articlesAdd, { categories: categories })
  })
})

router.get("/admin/articles", (req,res) =>{
  Article.findAll({ include: [{model:Category}]}).then((articles) => {
    res.render(articlesIndex, {articles: articles})
  })
})

/* Rotas para as APIs*/

router.post("/api/articles", (req,res) => {
  let title = req.body.title
  let body = req.body.body
  let category = req.body.category

    Article.create({
      title: title,
      slug: Slugify(title).toLowerCase(),
      body: body,
      categoryId: category
    }).then( () => res.redirect("/articles")) 
})
router.post("/api/articles/destroy/:id", (req, res) => {
  let id = req.params.id;
  if (id != undefined && !isNaN(id)) {
    Article.destroy({
      where: { id: id },
    }).then(() => res.redirect("/admin/articles"));
  } else res.redirect("/admin/articles");
});
module.exports = router;
