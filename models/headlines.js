const Joi = require("joi");
const mongoose = require("mongoose");

const headlineSchema = new mongoose.Schema({
  likes: Number,
  author: String,
  title: String,
  body: String,
});

const Headline = mongoose.model("Headline", headlineSchema);

async function createHeadline() {
  const headline = new Headline({
    likes: 12,
    author: "Satwik",
    title: "First Mongo stuff",
    body: "Evening train was shaking I purified it with imperfect flowers",
  });

  createHeadline();
  const result = await headline.save();

  console.log(result);
}

function validateHeadline(headline) {
  const schema = {
    // likes: Joi.number(),
    author: Joi.string().min(4).required(),
    title: Joi.string().min(4).required(),
    body: Joi.string().min(4).required(),
  };

  return Joi.validate(headline, schema);
}

exports.Headline = Headline;
exports.validate = validateHeadline;
