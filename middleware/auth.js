function auth(req, res, next) {
    if (req.session.user != undefined) {
      if (req.session.user.profile != undefined && req.session.user.profile == 1) {
        next();
      } else {
          res.redirect("/login");
      }
    } else {
      res.redirect("/login");
    }
}


module.exports = auth