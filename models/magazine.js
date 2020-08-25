const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");

const magazineSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
    },
    author: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255,
    },
    day: {
        type: Number,
        required: true,
    },
    month: {
        type: Number,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    short_desc: {
        type: String,
        required: true,
        minlength: 10
    },
    description: {
        type: String,
        required: true,
        minlength: 10
    },
    isAdmin: Boolean,
});

magazineSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        {
            _id: this._id,
            title: this.title,
            author: this.author,
            day: this.day,
            month: this.month,
            year: this.year,
            short_desc: this.short_desc,
            description: this.description,
        },
        config.get("jwtPrivateKey")
    );
    return token;
};

const Magazine = mongoose.model("Magazine", magazineSchema);

function validateMagazine(magazine) {
    const schema = {
        title: Joi.string().min(2).max(50).required(),
        author: Joi.string().min(3).max(255).required(),
        day: Joi.number().required(),
        month: Joi.number().required(),
        year: Joi.number().required(),
        short_desc: Joi.string().min(10).required(),
        description: Joi.string().min(10).required(),
    };

    return Joi.validate(magazine, schema);
}

exports.Magazine = Magazine;
exports.validate = validateMagazine;
