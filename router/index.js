const express = require("express");
const router = express.Router();
const { parseURL } = require("../controller/index");
router.get("/", parseURL);

module.exports = router;
