const { costumeSchema, reviewSchema } = require("../schemas.js");
const ExpressError = require("./ExpressError");
const {CostumeModel} = require("../models/rent");
const Review = require("../models/review");

module.exports.validateCostume = (req, res, next) => {
    const {error} = costumeSchema.validate(req.body);
    if(error){
        throw new ExpressError("Данные указаны некорректно!", 400);
    } else {
        next();
    };
};
module.exports.validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError("Данные указаны некорректно!", 400);
    } else {
        next();
    };
};
module.exports.isLoggedIn = (req, res, next) =>{
    if(!req.isAuthenticated()) {
        req.flash("error", "Войдите на сайт");
        return res.redirect("/login");
    }
    next();
};
module.exports.isReviewAuthor = async (req, res, next) => {
    const {id, reviewID} = req.params;
    const review = await Review.findById(reviewID);
    if (!review.author.equals(req.user._id) && !req.user.isAdmin) {
        req.flash("error", "Вы не можете выполнить это действие");
        return res.redirect(`/costumes/${id}`);
    };
    next();
};