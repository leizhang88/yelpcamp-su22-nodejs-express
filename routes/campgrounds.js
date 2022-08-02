const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const { isLoggedIn, isAuthor, validateCampground } = require("../utils/middleware");
const campgroundController = require('../controllers/campgrounds');

router.get("/", catchAsync(campgroundController.index))

router.get("/new", isLoggedIn, campgroundController.renderNewForm)

router.post("/", isLoggedIn, validateCampground, catchAsync(campgroundController.createCampground))

router.get("/:id", catchAsync(campgroundController.showCampground))

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgroundController.renderEditForm))

router.put("/:id", isLoggedIn, isAuthor, validateCampground, catchAsync(campgroundController.editCampground))

router.delete("/:id", isLoggedIn, isAuthor, catchAsync(campgroundController.deleteCampground))

module.exports = router;