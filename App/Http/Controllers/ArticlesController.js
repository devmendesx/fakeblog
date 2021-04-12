const app = require("express");
const router = app.Router();

router.get("/articles", (req, res) => {
  res.send("Rota de Artigos");
});

module.exports = router;

