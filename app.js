const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");

const campgroundRoute = require("./routes/campgrounds");
const reviewRoute = require("./routes/reviews");

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
app.use(express.static(path.join(__dirname, "public")))

app.use("/campgrounds", campgroundRoute);
app.use("/campgrounds/:cid/reviews", reviewRoute);


app.get("/", (req, res) => {
    res.render("home");
})

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
