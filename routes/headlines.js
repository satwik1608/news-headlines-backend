const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { Headline, validate } = require("../models/headlines");
const express = require("express");
const mongoose = require("mongoose");
const { User } = require("../models/users");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const headlines = await Headline.find().sort({ author: 1 });

    res.send(headlines);
  } catch (ex) {
    console.log(ex);
  }
});

router.post("/", auth, async (req, res) => {
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

router.put("/:id", async (req, res) => {
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

router.put("/like/:id", async (req, res) => {
  const headline = await Headline.findByIdAndUpdate(
    req.params.id,
    {
      likes: req.body.likes,
    },
    { new: true }
  );

  res.send(headline);
});

router.delete("/:id", [auth], async (req, res) => {
  const headline = await Headline.findByIdAndDelete(req.params.id);

  if (!headline)
    return res.status(404).send("The headline with given ID not found");

  res.send(headline);
});

router.get("/:id", async (req, res) => {
  const headline = await Headline.findById(req.params.id);
  if (!headline)
    return res.status(404).send("The headline with given ID not found");
  res.send(headline);
});

module.exports = router;
