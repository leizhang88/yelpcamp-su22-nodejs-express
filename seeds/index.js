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
    for (let i = 0; i < 30; i++) {
        const rand = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 35) + 10;
        const cg = new Campground({
            location: `${cities[rand].city}, ${cities[rand].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            price,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Error, doloribus quis repellat quam consequatur illum aut. Minima voluptas eveniet consectetur exercitationem facilis, distinctio optio dolore voluptates debitis rem autem molestias.',
            author: '62e7f7a130255854cbb4455c',
            images: [
                {
                    url: 'https://res.cloudinary.com/dx4seg5ka/image/upload/v1659485215/YelpCamp/dy4bzkaigh3vmoyy4yv4.jpg',
                    filename: 'YelpCamp/dy4bzkaigh3vmoyy4yv4'
                },
                {
                    url: 'https://res.cloudinary.com/dx4seg5ka/image/upload/v1659481810/YelpCamp/kcxkkpg7eumne4i8lfie.jpg',
                    filename: 'YelpCamp/kcxkkpg7eumne4i8lfie'
                }
            ],
            geometry: {
                type: 'Point',
                coordinates: [cities[rand].longitude, cities[rand].latitude]
            }
        })
        await cg.save();
    }
}

seedDb().then(() => {
    mongoose.connection.close();
});