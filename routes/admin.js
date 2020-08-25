const auth = require("../middleware/auth");
const bcrypt = require("bcryptjs");
const _ = require("lodash");
const { Magazine, validate } = require("../models/magazine");
const express = require("express");
const router = express.Router();



router.post("/magazine", async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    magazine = new Magazine(_.pick(req.body, ["title", "author", "day", "month", "year", "short_desc", "description"]));
    await magazine.save();

    const token = magazine.generateAuthToken();
    res
        .header("x-auth-token", token)
        .header("access-control-expose-headers", "x-auth-token")
        .send(_.pick(magazine, ["_id", "title", "author", "day", "month", "year", "short_desc", "description"]));
});

module.exports = router;
