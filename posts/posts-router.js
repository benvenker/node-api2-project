const express = require('express');
const posts = require('../data/db');
const comments = require('../data/db');
const router = express.Router();

// Creates a post using the information sent inside the request body
router.post('/', async (req, res) => {
  try {
    const { title, contents } = req.body;

    if (!title || !contents) {
      return res.status(400).json({
        errorMessage: 'Please provide title and contents for the post.',
      });
    }
    const post = await posts.insert({ title, contents });
    if (post) res.status(201).json({ message: 'Post created' });
  } catch (err) {
    res.status(500).json({
      error: 'There was an error while saving the post to the database',
    });
  }
});

// Creates a comment for the post with the specified id using information
// sent inside of the request body
router.post('/:id/comments', async (req, res) => {
  try {
    if (!req.body.text) {
      return res
        .status(400)
        .json({ errorMessage: 'Please provide text for the comment.' });
    }
    const post = await posts.findById(req.params.id);
    if (post === undefined) {
      return res.status(404).json({
        message: 'The post with the specified ID does not exist.',
      });
    } else {
      const comment = await comments.insertComment({
        post_id: req.params.id,
        text: req.body.text,
      });
      if (comment) {
        res.status(201).json(comment);
      }
    }
  } catch (err) {
    res.status(500).json({
      error: 'There was an error while saving the comment to the database',
    });
  }
});

// GET a list of posts
router.get('/', (req, res) => {
  posts
    .find()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(error => {
      res.status(500).json({
        message: 'Error retrieving the posts',
      });
    });
});

// GET to /api/posts/:id
router.get('/:id', (req, res) => {
  posts
    .findById(req.params.id)
    .then(post => {
      post === undefined
        ? res
            .status(404)
            .json({ message: 'The post with the specified ID does not exist.' })
        : res.status(200).json(post);
    })
    .catch(err =>
      res
        .status(500)
        .json({ error: 'The post information could not be retrieved.' })
    );
});

// GET to /api/posts/:id/comments
router.get('/:id/comments', (req, res) => {
  posts
    .findById(req.params.id)
    .then(post => {
      post === undefined
        ? res
            .status(404)
            .json({ message: 'The post with the specified ID does not exist.' })
        : comments
            .findPostComments(req.params.id)
            .then(comments => res.status(200).json(comments));
    })
    .catch(err =>
      res
        .status(500)
        .json({ error: 'The comments information could not be retrieved.' })
    );
});

// DELETE post by ID
router.delete('/:id', (req, res) => {
  posts
    .findById(req.params.id)
    .then(post => {
      post === undefined
        ? res
            .status(404)
            .json({ message: 'The post with the specified ID does not exist.' })
        : posts.remove(req.params.id).then(post => res.status(200).json(post));
    })
    .catch(err =>
      res.status(500).json({ error: 'The post could not be removed' })
    );
});

// PUT to modify post by ID
router.put('/:id', (req, res) => {
  if (!req.body.title || !req.body.contents) {
    return res.status(400).json({
      errorMessage: 'Please provide title and contents for the post.',
    });
  }
  posts
    .findById(req.params.id)
    .then(post => {
      post === undefined
        ? res
            .status(404)
            .json({ message: 'The post with the specified ID does not exist.' })
        : posts
            .update(req.params.id, {
              title: req.body.title,
              contents: req.body.contents,
            })
            .then(post => res.status(200).json(post));
    })
    .catch(err =>
      res
        .status(500)
        .json({ error: 'The post information could not be modified.' })
    );
});

module.exports = router;
