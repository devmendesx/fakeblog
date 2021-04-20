const app = require("express");
const Category = require("../../Models/Category");
const Article = require("../../Models/Articles");
const Slugify = require("slugify");
const router = app.Router();

/* Admin folders */
const categoriesFolder = "modules/admin/categories";
const categoriesAdd = categoriesFolder + "/add";
const categoriesIndex = categoriesFolder + "/index";
const categoriesEdit = categoriesFolder + "/edit";

/* Blog final folders*/ 
const categoriesFinalFolder = "modules/categories"
const categoriesFinalAdd = categoriesFinalFolder + "/add";
const categoriesFinalIndex = categoriesFinalFolder + "/index";
const categoriesFinalEdit = categoriesFinalFolder + "/edit";

let breadcrumbAdmin = "Administração de Categorias";

/**
 * @author Matheus Henrique
 * @description Rotas para APIs e Views
 */
/* Rotas para Views*/
/* Rota para listar artigos por categoria*/
router.get("/categories/:slug", (req, res) => {
  let slug = req.params.slug;
  let listArticles = {};
  let listCategories = {};
  let user = req.session.user
  Article.findAll({
    include: [{ model: Category }],
    order: [["createdAt", "DESC"]],
  })
    .then((articles) => {
      listArticles = articles;
    })
    .catch((error) => console.log(error));
  Category.findAll()
    .then((categories) => {
      listCategories = categories;
    })
    .catch((error) => console.log(error));

  Category.findOne({ where: { slug: slug }, include: [{ model: Article }] })
    .then((category) => {
      res.render(categoriesFinalIndex, {
        listArticles: category.articles,
        categories: listCategories,
        articles: listArticles,
        user: user,
        breadcrumb: category.title,
      });
    })
    .catch((error) => console.log(error));
});

/* Rota para formulário de nova categoria*/
router.get("/admin/categories/add", (req, res) => {
  let user = req.session.user;
  res.render(categoriesAdd, { breadcrumb: breadcrumbAdmin, user: user });
});

/*  Rota para listar todas as categorias.*/
router.get("/admin/categories", (req, res) => {
  let user = req.session.user;
  Category.findAll().then((categories) => {
    res.render(categoriesIndex, {
      categories: categories,
      breadcrumb: breadcrumbAdmin,
      user: user,
    });
  });
});

/* Rota para editar uma categoria */
router.get("/admin/categories/:id", (req, res) => {
  let user = req.session.user;
  let id = req.params.id;
  Category.findByPk(id).then((category) => {
    if (category != undefined)
      res.render(categoriesEdit, {
        category: category,
        breadcrumb: breadcrumbAdmin,
        user: user,
      });
    else res.render("/admin/categories");
  });
});

/* Rotas para as APIs*/

/*  Rota para salvar nova categoria */
router.post("/api/categories", (req, res) => {
  let title = req.body.title;
  if (title != undefined) {
    Category.create({
      title: title,
      slug: Slugify(title).toLowerCase(),
    }).then(() => res.redirect("/admin/categories"));
  } else res.redirect("/admin/categories/new");
});

/*  Rota para deletar uma categoria*/
router.post("/api/categories/destroy/:id", (req, res) => {
  let id = req.params.id;
  if (id != undefined && !isNaN(id)) {
    Category.destroy({
      where: { id: id },
    }).then(() => res.redirect("/admin/categories"));
  } else res.redirect("/admin/categories");
});

/* Rota para editar uma categoria */
router.post("/api/categories/:id", (req, res) => {
  let id = req.params.id;
  let title = req.body.title;

  Category.update(
    { title: title, slug: Slugify(title).toLowerCase() },
    { where: { id: id } }
  ).then(() => {
    res.redirect("/admin/categories");
  });
});

module.exports = router;
