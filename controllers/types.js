const {TypeModel} = require("../models/rent");
module.exports.index = async (req, res) => {
    if (!req.user || !req.user.isAdmin) {
        req.flash("error", "Вы не можете выполнить это действие");
        return res.redirect("/costumes");
    }
    const allTypes = await TypeModel.find({});
    res.render("types", {allTypes});
};
module.exports.createType = async (req, res) => {
    const name = req.body.type.name;   
    const newType = new TypeModel();
    newType.name = name;
    if (!req.user.isAdmin) {
        req.flash("error", "Вы не можете выполнить это действие");
        return res.redirect("/costumes");
    } else {
        await newType.save();
        req.flash("success", "Новый тип добавлен!");
        res.redirect("/types");
    }
};
module.exports.deleteType = async (req, res) => {
    if (!req.user.isAdmin) {
        req.flash("error", "Вы не можете выполнить это действие");
        return res.redirect("/costumes");
    };
    const {id} = req.params;
    const oneType = await TypeModel.findByIdAndDelete(id);
    if(!oneType){
        req.flash("error", "Такого типа не существует!");
        return res.redirect("/types");
    };
    req.flash("success", "Стиль удален!");
    res.redirect("/types");
};