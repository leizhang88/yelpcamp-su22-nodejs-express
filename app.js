const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const Campground = require("./models/campground");
const Review = require("./models/review");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const { campgroundSchema, reviewSchema } = require("./utils/joi-schemas");

const campgroundRoute = require("./routes/campgrounds");

mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp")

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected!");
})

const app = express();

app.engine("ejs", ejsMate)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))


const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(e => e.message).join(', ');
        throw new ExpressError(msg, 400);
    } else {
        next()
    }
}


app.use("/campgrounds", campgroundRoute);


app.get("/", (req, res) => {
    res.render("home");
})



app.post("/campgrounds/:id/reviews", validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.delete("/campgrounds/:cid/reviews/:rid", catchAsync(async (req, res) => {
    const { cid, rid } = req.params;
    await Campground.findByIdAndUpdate(cid, { $pull: { reviews: rid } });
    await Review.findByIdAndDelete(rid);
    res.redirect(`/campgrounds/${cid}`)
}))

app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404))
})

app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) { err.message = "Oh no, something went wrong..." }
    res.status(status).render("error", { err })
})

app.listen(3300, () => {
    console.log("Serving on port 3300")
})
