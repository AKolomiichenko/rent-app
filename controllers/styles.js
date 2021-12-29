const {StyleModel} = require("../models/rent");
module.exports.index = async (req, res) => {
    if (!req.user || !req.user.isAdmin) {
        req.flash("error", "Вы не можете выполнить это действие");
        return res.redirect("/costumes");
    }
    const allStyles = await StyleModel.find({});
    res.render("styles", {allStyles})
};
module.exports.createStyle = async (req, res) => {
    const name = req.body.style.name;   
    const newStyle = new StyleModel();
    newStyle.name = name;
    if (!req.user.isAdmin) {
        req.flash("error", "Вы не можете выполнить это действие");
        return res.redirect("/costumes");
    } else {
        await newStyle.save();
        req.flash("success", "Новый стиль добавлен!");
        res.redirect("/styles");
    }
};
module.exports.deleteStyle = async (req, res) => {
    if (!req.user.isAdmin) {
        req.flash("error", "Вы не можете выполнить это действие");
        return res.redirect("/costumes");
    };
    const {id} = req.params;
    const oneStyle = await StyleModel.findByIdAndDelete(id);
    if(!oneStyle){
        req.flash("error", "Такого стиля не существует!");
        return res.redirect("/styles");
    };
    req.flash("success", "Стиль удален!");
    res.redirect("/styles");
};