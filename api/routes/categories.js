const express = require("express");
const router = express.Router();

const { getCategory } = require("../controllers/categories");

router.get("/:categoryID", getCategory);

module.exports = router;
