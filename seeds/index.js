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
        const price = Math.floor(Math.random() * 35) + 10;
        const cg = new Campground({
            location: `${cities[rand].city}, ${cities[rand].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            price,
            image: 'https://source.unsplash.com/1600x900?camping',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Error, doloribus quis repellat quam consequatur illum aut. Minima voluptas eveniet consectetur exercitationem facilis, distinctio optio dolore voluptates debitis rem autem molestias.'
        })
        await cg.save();
    }
}

seedDb().then(() => {
    mongoose.connection.close();
});