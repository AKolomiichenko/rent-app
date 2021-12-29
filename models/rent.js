const mongoose = require("mongoose");
const Review = require('./review');
const Schema = mongoose.Schema;

const TypeSchema = new Schema({
    name: {
        type: String,
        required: true
}
});
const StyleSchema = new Schema({
    name: {
        type: String,
        required: true
}
});
const ImageSchema = new Schema({
    url: String,
    filename: String
});
ImageSchema.virtual("thumbnail").get(function() {
    return this.url.replace("/upload", "/upload/w_200");
});
const CostumeSchema = new Schema({
    title: String,
    images: [ImageSchema],
    price: Number,
    types: [{
        type: Schema.Types.ObjectId,
        ref: "Type"
    }],
    styles: [{
        type: Schema.Types.ObjectId,
        ref: "Style"
    }],
    cities: [
        {type: String}
    ],
    geometry: [{
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }],
    description: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});
CostumeSchema.post("findOneAndDelete", async function (doc) {
    if(doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
});
module.exports = {
    "CostumeModel": mongoose.model("Costume", CostumeSchema),
    "TypeModel": mongoose.model("Type", TypeSchema),
    "StyleModel": mongoose.model("Style", StyleSchema)
};