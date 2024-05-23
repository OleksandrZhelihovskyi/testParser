const express = require("express");
const router = express.Router();
const { parseURL, downloadCatalogs } = require("../controller/index");

router.get("/", (req,res)=>{
    res.json('App is running!')
});
router.get("/data", parseURL);
router.get("/catalogs", downloadCatalogs);

module.exports = router;
