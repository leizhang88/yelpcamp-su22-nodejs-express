const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp")

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected!");
})

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDb = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const rand = Math.floor(Math.random() * 1000);
        const cg = new Campground({
            location: `${cities[rand].city}, ${cities[rand].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        })
        await cg.save();
    }
}

seedDb().then(() => {
    mongoose.connection.close();
});