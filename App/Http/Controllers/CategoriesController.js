const app = require("express");
const Category = require("../../Models/Category")
const Slugify = require("slugify")
const router = app.Router();

const categoriesFolder = "modules/categories";
const categoriesAdd = categoriesFolder + "/add";
const categoriesIndex = categoriesFolder + "/index"

/* Categories Routes Controller*/

router.get("/admin/categories/add", (req, res) => {
  res.render(categoriesAdd);
});

router.get("/admin/categories", (req,res) => {
  Category.findAll().then( categories => {
    res.render(categoriesIndex, {categories: categories});
  })
})

router.post("/api/categories", (req,res) => {
  let title = req.body.title;
  if (title != undefined) {
    Category.create({
      title: title,
      slug: Slugify(title),
    }).then(() => res.redirect("/"));
  } else res.redirect("/admin/categories/new");
  

})

module.exports = router;
