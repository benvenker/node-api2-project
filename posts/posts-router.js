const express = require("express");
const posts = require("../data/db");
const router = express.Router();

router.post("/", (req, res) => {
  const { title, contents } = req.body;
  console.log({ title, contents });

  if (!title || !contents) {
    return res.status(400).json({
      errorMessage: "Please provide title and contents for the post.",
    });
  }
  posts
    .insert({ title, contents })
    .then((post) => res.status(201).json({ message: "Post created" }))
    .catch((err) =>
      res
        .status(500)
        .json({
          error: "There was an error while saving the post to the database",
        })
    );
});

// GET the posts
router.get("/", (req, res) => {
  posts
    .find()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error retrieving the posts",
      });
    });
});

module.exports = router;
