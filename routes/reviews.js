const express = require("express");
const router = express.Router({ mergeParams: true });
const Campground = require("../models/campground");
const Review = require("../models/review");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const { validateReview } = require("../utils/middleware");

router.post("/", validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.cid);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Posted review")
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete("/:rid", catchAsync(async (req, res) => {
    const { cid, rid } = req.params;
    await Campground.findByIdAndUpdate(cid, { $pull: { reviews: rid } });
    await Review.findByIdAndDelete(rid);
    req.flash("success", "Deleted review")
    res.redirect(`/campgrounds/${cid}`)
}))

module.exports = router;