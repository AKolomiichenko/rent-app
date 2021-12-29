const {CostumeModel, TypeModel, StyleModel} = require("../models/rent");
const {cloudinary} = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
    const types = await TypeModel.find({});
    const styles = await StyleModel.find({});
    const selectedType = req.query.type;
    const selectedStyle = req.query.style;
    let searchArray = [];
    let searchQuery = null;
    if (selectedStyle) searchArray.push({ "styles" : {"$in": [selectedStyle] }});
    if (selectedType) searchArray.push({ "types" : {"$in": [selectedType] }});
    if (searchArray.length > 1) {
        searchQuery = {"$and": searchArray}
    } else {
        searchQuery = searchArray;
    }
    const allCostumes = await CostumeModel.find(Object.assign({}, ...searchArray));
    res.render("index", {allCostumes, types, styles, selectedStyle, selectedType});
};
module.exports.renderNewForm = async(req, res) => {
    if (!req.user || !req.user.isAdmin) {
        req.flash("error", "Вы не можете выполнить это действие");
        return res.redirect("/costumes");
    }
    const types = await TypeModel.find({});
    const styles = await StyleModel.find({});
    res.render("new", {types, styles});
};
module.exports.createCostume = async (req, res) => {
    if (!req.user.isAdmin) {
        req.flash("error", "Вы не можете выполнить это действие");
        return res.redirect("/costumes");
    }
    const limit = req.body.costume.cities.split(", ").length;
    const geoData = await geocoder.forwardGeocode({
        types: ["place"],
        query: req.body.costume.cities,
        limit: limit
    }).send();
    const newCostume = new CostumeModel(req.body.costume);
    const places = geoData.body.features.map(item => item.geometry);
    newCostume.geometry = places;
    newCostume.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    newCostume.author = req.user._id;
    await newCostume.save();
    req.flash("success", "Новый костюм добавлен!");
    res.redirect(`/costumes/${newCostume._id}`);
};
module.exports.showCostume = async (req, res) => {
    const oneCostume = await CostumeModel.findById(req.params.id).populate({path: "reviews", populate: {path: "author"}});
    if(!oneCostume){
        req.flash("error", "Такого костюма не существует!");
        return res.redirect("/costumes");
    };
    res.render("show", {oneCostume}); 
};
module.exports.renderEditForm = async (req, res) => {
    const {id} = req.params;
    const types = await TypeModel.find({});
    const styles = await StyleModel.find({});
    const oneCostume = await CostumeModel.findById(id);
    if(!oneCostume){
        req.flash("error", "Такого костюма не существует!");
        return res.redirect("/costumes");
    };
    res.render("edit", {oneCostume, types, styles});
};
module.exports.updateCostume = async (req, res) => {
    const {id} = req.params;
    const limit = req.body.costume.cities.split(", ").length;
    const geoData = await geocoder.forwardGeocode({
        types: ["place"],
        query: req.body.costume.cities,
        limit: limit
    }).send();
    const places = geoData.body.features.map(item => item.geometry);
    const costumeEdit = await CostumeModel.findByIdAndUpdate(id, {...req.body.costume, geometry: places});
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    costumeEdit.images.push(...imgs);
    costumeEdit.author = req.user._id;
    if (!req.user.isAdmin) {
        req.flash("error", "Вы не можете выполнить это действие");
        return res.redirect("/costumes");
    } else {
    await costumeEdit.save();
    if(req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await costumeEdit.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});
    };
    req.flash("success", "Информация о костюме обновлена!");
    res.redirect(`/costumes/${costumeEdit._id}`);
}};
module.exports.deleteCostume = async (req, res) => {
    const {id} = req.params;
    const costumeDelete = await CostumeModel.findById(id);
    costumeDelete.author = req.user._id;
    if (!req.user.isAdmin) {
        req.flash("error", "Вы не можете выполнить это действие");
        return res.redirect("/costumes");
    } else {
    await CostumeModel.findByIdAndDelete(id); 
    req.flash("success", "Костюм удален!");
    res.redirect("/costumes");
}};