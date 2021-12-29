if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
};
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const ExpressError = require("./utilities/ExpressError");
const catchAsync = require("./utilities/catchAsync");
const methodOverride = require("method-override");
const {CostumeModel} = require("./models/rent");
const Review = require("./models/review");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const {isLoggedIn, validateCostume, validateReview, isReviewAuthor} = require("./utilities/middleware");
const { costumeSchema, reviewSchema } = require("./schemas.js");
const costumes = require("./controllers/costumes");
const reviews = require("./controllers/reviews");
const users = require("./controllers/users");
const styles = require("./controllers/styles");
const types = require("./controllers/types");
const multer  = require('multer');
const {storage} = require("./cloudinary");
const upload = multer({storage});
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/rent-app';
const MongoStore = require("connect-mongo");
const secret = process.env.SECRET;

const store = app.use(session({
    secret,
    store: MongoStore.create({
        mongoUrl: dbUrl,
        touchAfter: 24 * 3600
    })
}));

store.on("error", function(e){
    console.log("Session store error", e)
});

const sessionConfig = {
    store: store,
    name: "rent",
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

app.use(session(sessionConfig));
app.use(flash());
app.use(mongoSanitize());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(helmet({contentSecurityPolicy: false}));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use((req, res, next) => {
    if(!["/login", "/register", "/", "/favicon.ico"].includes(req.originalUrl)) {
        req.session.returnTo = req.originalUrl
    };
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

mongoose.connect(dbUrl, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
const db = mongoose.connection;
db.on("error", console.error.bind (console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/instructions", (req, res) => {
    res.render("instructions");
});

app.get("/costumes", catchAsync(costumes.index));

app.get("/costumes/new", isLoggedIn, costumes.renderNewForm);

app.post("/costumes", isLoggedIn, upload.array("image"), validateCostume, catchAsync(costumes.createCostume));

app.get("/costumes/:id", catchAsync(costumes.showCostume));

app.get("/costumes/:id/edit", isLoggedIn, catchAsync(costumes.renderEditForm));

app.put("/costumes/:id", isLoggedIn, upload.array("image"), validateCostume, catchAsync(costumes.updateCostume));

app.delete("/costumes/:id", isLoggedIn, catchAsync(costumes.deleteCostume));

app.post("/costumes/:id/reviews", isLoggedIn, validateReview, catchAsync(reviews.createReview));

app.delete("/costumes/:id/reviews/:reviewID", isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

app.get("/register", users.renderRegister);

app.post("/register", catchAsync(users.register));

app.get("/login", users.renderLogin);

app.post("/login", passport.authenticate("local", 
{failureRedirect: "/login", failureFlash: 'Имя пользователя или пароль введены неправильно!'}), users.login);

app.get("/logout", users.logout);

app.get("/styles", isLoggedIn, catchAsync(styles.index));

app.post("/styles", isLoggedIn, catchAsync(styles.createStyle));

app.delete("/styles/:id", isLoggedIn, catchAsync(styles.deleteStyle));

app.get("/types", isLoggedIn, catchAsync(types.index));

app.post("/types", isLoggedIn, catchAsync(types.createType));

app.delete("/types/:id", isLoggedIn, catchAsync(types.deleteType));

app.all("*", (req, res, next) => {
    next(new ExpressError("Страница не найдена!", 404));
});

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if (!err.message) err.message = "Что-то пошло не так!";
    res.status(statusCode).render("error", {err});
});

app.listen(3000);