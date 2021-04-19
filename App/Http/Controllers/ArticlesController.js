const app = require("express")
const router = app.Router()

const Article = require("../../Models/Articles")
const Category = require("../../Models/Category")
const Slugify = require("slugify")

const ArticlesFolder = "modules/admin/articles"
const articlesAdd = ArticlesFolder + "/add"
const articlesIndex = ArticlesFolder + "/index"
const articlesEdit = ArticlesFolder + "/edit"
const auth = require("../../../middleware/auth");
const { default: slugify } = require("slugify")

/**
 * @author Matheus Henrique
 * @description Rotas para APIs e Views
 */
/* Rota principal de artigos */
router.get("/articles", (req, res) => {
  let user = req.session.user;
  res.send("Rota de Artigos")
})


/* Rotas de Views*/
router.get("/admin/articles/add",auth, (req, res) => {
  let user = req.session.user
  Category.findAll().then((categories) => {
    res.render(articlesAdd, { categories: categories, breadcrumb: "Administração de Artigos", user:user})
  })
})

router.get("/admin/articles",auth, (req,res) =>{
  let user = req.session.user;
  Article.findAll({
    include: [{ model: Category }],
    order: [["createdAt", "DESC"]],
  }).then((articles) => {
    res.render(articlesIndex, {
      articles: articles,
      breadcrumb: "Administração de Artigos",
      user: user,
    });
  });
})
router.get("/admin/articles/edit/:id", auth, (req,res) =>{
  let id = req.params.id
  let user = req.session.user;
  Article.findByPk(id).then( article => {
    if(article != undefined){
      Category.findAll().then((categories) =>{
        res.render(articlesEdit, {
          article: article,
          categories: categories,
          breadcrumb: "Edição de Artigo",
          user: user,
        });
      }) 
    }else{
      res.redirect("/admin/articles")
    }
  }).catch(error => res.redirect("/"))
})

/* Rotas para as APIs*/

router.post("/api/articles",auth, (req,res) => {
  let title = req.body.title
  let body = req.body.body
  let category = req.body.category

    Article.create({
      title: title,
      slug: Slugify(title).toLowerCase(),
      body: body,
      categoryId: category
    }).then( () => res.redirect("/")) 
})
router.post("/api/articles/destroy/:id", auth,(req, res) => {
  let id = req.params.id;
  if (id != undefined && !isNaN(id)) {
    Article.destroy({
      where: { id: id },
    }).then(() => res.redirect("/admin/articles"));
  } else res.redirect("/admin/articles");
});

router.post("/api/articles/edit/:id", auth, (req,res) =>{
  let id = req.params.id
  let title = req.body.title;
  let body = req.body.body;
  let category = req.body.category;

  Article.update({title:title,body:body,categoryId:category, slug:slugify(title).toLowerCase()},{where:{id:id}})
  .then( () =>{
    res.redirect("/admin/articles")
  }).catch(err => {
    res.redirect("/")
  })

})
module.exports = router;
