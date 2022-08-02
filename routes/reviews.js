const express = require("express");
const router = express.Router({ mergeParams: true });
const Campground = require("../models/campground");
const Review = require("../models/review");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../utils/middleware");
const reviewController = require('../controllers/reviews');

router.post("/", isLoggedIn, validateReview, catchAsync(reviewController.createReview))

router.delete("/:rid", isLoggedIn, isReviewAuthor, catchAsync(reviewController.deleteReview))

module.exports = router;