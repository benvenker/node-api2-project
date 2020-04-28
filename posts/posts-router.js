const express = require("express");
const posts = require("../data/db");
const router = express.Router();

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
