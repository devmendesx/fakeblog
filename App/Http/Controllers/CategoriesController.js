const app = require("express")
const Category = require("../../Models/Category")
const Slugify = require("slugify")
const router = app.Router()

const categoriesFolder = "modules/admin/categories"
const categoriesAdd = categoriesFolder + "/add"
const categoriesIndex = categoriesFolder + "/index"
const categoriesEdit = categoriesFolder + "/edit"

/**
 * @author Matheus Henrique
 * @description Rotas para APIs e Views
 */
/* Rotas para Views*/
let breadcrumbAdmin = 'Administração de Categorias'
/* Rota para formulário de nova categoria*/
router.get("/admin/categories/add", (req, res) => {
  res.render(categoriesAdd, {breadcrumb: breadcrumbAdmin})
})

/*  Rota para listar todas as categorias.*/
router.get("/admin/categories", (req, res) => {
  Category.findAll().then((categories) => {
    res.render(categoriesIndex, {
      categories: categories,
      breadcrumb: breadcrumbAdmin,
    });
  })
})

/* Rota para editar uma categoria */
router.get("/admin/categories/:id", (req, res) => {
  let id = req.params.id;
  Category.findByPk(id).then((category) => {
    if (category != undefined)
      res.render(categoriesEdit, {
        category: category,
        breadcrumb: breadcrumbAdmin,
      });
    else res.render("/admin/categories")
  })
})

/* Rotas para as APIs*/

/*  Rota para salvar nova categoria */
router.post("/api/categories", (req, res) => {
  let title = req.body.title;
  if (title != undefined) {
    Category.create({
      title: title,
      slug: Slugify(title).toLowerCase(),
    }).then(() => res.redirect("/admin/categories"))
  } else res.redirect("/admin/categories/new")
})

/*  Rota para deletar uma categoria*/
router.post("/api/categories/destroy/:id", (req, res) => {
  let id = req.params.id;
  if (id != undefined && !isNaN(id)) {
    Category.destroy({
      where: { id: id },
    }).then(() => res.redirect("/admin/categories"))
  } else res.redirect("/admin/categories")
})

/* Rota para editar uma categoria */
router.post("/api/categories/:id", (req, res) => {
  let id = req.params.id;
  let title = req.body.title;

  Category.update(
    { title: title, slug: Slugify(title).toLowerCase() },
    { where: { id: id } }
  ).then(() => {
    res.redirect("/admin/categories")
  })
})

module.exports = router;
