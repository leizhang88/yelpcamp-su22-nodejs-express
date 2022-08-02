const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const campground = await Campground.findById(req.params.cid);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Posted review")
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteReview = async (req, res) => {
    const { cid, rid } = req.params;
    await Campground.findByIdAndUpdate(cid, { $pull: { reviews: rid } });
    await Review.findByIdAndDelete(rid);
    req.flash("success", "Deleted review")
    res.redirect(`/campgrounds/${cid}`)
}