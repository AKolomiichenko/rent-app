const User = require("../models/user");

module.exports.renderRegister = (req, res) => {
    res.render("register");
};
module.exports.register = async(req, res, next) => {
    try {
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash("success", "Добро пожаловать!");
            res.redirect("/costumes");
        });
    } catch(e) {
        req.flash("error", "Что-то пошло не так!");
        res.redirect("register");
    }
};
module.exports.renderLogin = (req, res) => {
    res.render("login");
};
module.exports.login = (req, res) => {
    req.flash("success", "С возвращением!");
    const redirectUrl = req.session.returnTo || '/costumes';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};
module.exports.logout = (req, res) => {
    req.logout();
    req.flash("success", "Вы вышли из аккаунта");
    res.redirect("/costumes");
};