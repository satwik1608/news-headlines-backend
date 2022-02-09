const express = require("express");
const Joi = require("joi");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
app.use(cors());
require("./middleware/prod")(app);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});
app.use(express.json());
mongoose
  .connect("mongodb://localhost/headlines")
  .then(console.log("Connecting to mongodb..."))
  .catch((err) => console.error("Some error occured"));

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

  const result = await headline.save();

  console.log(result);
}

// createHeadline();

app.get("/api/headlines", async (req, res) => {
  const headlines = await Headline.find().sort({ author: 1 });

  res.send(headlines);
});

app.post("/api/headlines", async (req, res) => {
  const { error } = validate(req.body);
  console.log(error);
  if (error) return res.status(400).send(error.details[0].message);

  let headline = new Headline({
    author: req.body.author,
    title: req.body.title,
    body: req.body.body,
    likes: 0,
  });

  headline = await headline.save();
  res.send(headline);
});

app.put("/api/headlines/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const headline = await Headline.findByIdAndUpdate(
    req.params.id,
    {
      author: req.body.author,
      title: req.body.title,
      body: req.body.body,
    },
    { new: true }
  );
  if (!headline)
    return res.status(404).send("Headline with given ID not found");

  res.send(headline);
});

app.put("/api/headlines/like/:id", async (req, res) => {
  const headline = await Headline.findByIdAndUpdate(
    req.params.id,
    {
      likes: req.body.likes,
    },
    { new: true }
  );

  res.send(headline);
});

app.delete("/api/headlines/:id", async (req, res) => {
  const headline = await Headline.findByIdAndDelete(req.params.id);

  if (!headline)
    return res.status(404).send("The headline with given ID not found");

  res.send(headline);
});

app.get("/api/headlines/:id", async (req, res) => {
  const headline = await Headline.findById(req.params.id);
  if (!headline)
    return res.status(404).send("The headline with given ID not found");
  res.send(headline);
});

function validate(headline) {
  const schema = {
    // likes: Joi.number(),
    author: Joi.string().min(4).required(),
    title: Joi.string().min(4).required(),
    body: Joi.string().min(4).required(),
  };

  return Joi.validate(headline, schema);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
