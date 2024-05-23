const express = require("express");
const router = express.Router();
const { parseURL, downloadCatalogs } = require("../controller/index");

router.get("/", parseURL);
router.get("/catalogs", downloadCatalogs);

module.exports = router;
