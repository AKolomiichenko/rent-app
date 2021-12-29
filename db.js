if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
};
const mongoose = require('mongoose');
const UserModel = require("./models/user");
const adminPassword = process.env.USER_PASSWORD;
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/rent-app';

mongoose.connect(dbUrl);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const userData = {
    email: "whitepeacockcw@gmail.com",
    username: "NatalyShilo",
    isAdmin: true
};

const seedDB = async () => {
    await UserModel.deleteMany({});
    const user = new UserModel(userData);
    const admin = await UserModel.register(user, adminPassword);

};

seedDB().then(() => {
    mongoose.connection.close();
});