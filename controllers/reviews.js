const {CostumeModel} = require("../models/rent");
const Review = require("../models/review");

module.exports.createReview = async(req, res) => {
    const costume = await CostumeModel.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    costume.reviews.push(review);
    await review.save();
    await costume.save();
    req.flash("success", "Ваш отзыв опубликован!")
    res.redirect(`/costumes/${costume._id}`);
};
module.exports.deleteReview = async(req, res) => {
    const {id, reviewID} = req.params;
    await CostumeModel.findByIdAndUpdate(id, {$pull: {reviews: reviewID}});
    await Review.findByIdAndDelete(reviewID);
    req.flash("success", "Отзыв удален!");
    res.redirect(`/costumes/${id}`);
};