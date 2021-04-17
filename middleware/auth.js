function auth(req, res, next) {
    console.log(req.session.user.profile)
    if(req.session.user.profile == 1){
        next();
    }else{
        res.redirect('/')
    }
}


module.exports = auth