const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Campground = require("./models/campground");


mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp")

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected!");
})

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))


app.get("/", (req, res) => {
    res.render("home");
})

app.get("/campgrounds", async (req, res) => {
    const camp = new Campground({ title: "Arcadia National Park", price: "39.99" });
    await camp.save();
    res.send(camp);
})

app.listen(3300, () => {
    console.log("Serving on port 3300")
})
