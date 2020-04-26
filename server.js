const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const uuid = require('uuid');

const app = express();
const jsonParser = bodyParser.json();

const auth = require('./middleware/auth')

app.use(express.static('public'));
app.use(morgan('dev'));
app.use(auth);

const posts = [
  {
    id: uuid.v4(),
    title: 'Title1',
    description: 'Description1',
    url: 'url1',
    rating: 1
  },
  {
    id: uuid.v4(),
    title: 'Title2',
    description: 'Description2',
    url: 'url2',
    rating: 2
  },
  {
    id: uuid.v4(),
    title: 'Title3',
    description: 'Description3',
    url: 'url3',
    rating: 3
  }
];

// GET all bookmarks
app.get('/api/bookmarks', ( req, res ) => {
  console.log('Getting all existing bookmarks...');
  return res.status(200).json(posts);
});

// GET bookmarks by title
app.get('/api/bookmark', ( req, res ) => {
  console.log('Getting bookmarks by title...');
  console.log(req.query);
  let title = req.query.title;

  if (!title) {
    res.statusMessage = "Please specify a title";
    return res.status(406).end();
  }

  let results = posts.find(post => post.title === title);

  if (results.length < 1) {
    res.statusMessage = "No results found";
    return res.status(404).end();
  }

  return res.status(200).json(results);
});

// POST bookmark
app.post('/api/bookmarks', jsonParser, ( req, res ) => {
  console.log('Posting a new bookmark...')
  console.log(req.body);
  let {title, description, url, rating} = req.body;

  if (!title || !description || !url || !rating) {
    res.statusMessage = 'Fields missing in body';
    return res.status(406).end();
  }

  let newPost = {
    id: uuid.v4(),
    title: String(title),
    description: String(description),
    url: String(url),
    rating: parseInt(rating)
  };

  posts.push(newPost);
  return res.status(201).json(newPost);
});

// DELETE bookmark by id
app.delete('/api/bookmark/:id', (req, res) => {
  console.log('Deleting post by id...');
  let id = req.params.id;
  let postToDelete = posts.findIndex(post => post.id === id);

  if (postToDelete.length < 1) {
    res.statusMessage = 'There are no posts with id: ' + id;
    return res.status(404).end();
  }

  posts.splice(postToDelete, 1);
  return res.status(200).json({});
});

// PATCH bookmark
app.patch('/api/bookmark/:id', jsonParser, ( req, res ) => {
  console.log('Updating a bookmark...')
  console.log(req.body);
  let pid = req.params.id;
  let {id, title, description, url, rating} = req.body;

  if (!id) {
    res.statusMessage = 'The id from the body is missing';
    return res.status(406).end();
  }

  if (pid !== id) {
    res.statusMessage = 'The id from the parameter does not match the id from the body'
    return res.status(409).end()
  }

  let result = posts.find(post => {
    if (post.id === id) {
      if (title) post.title = title;
      if (description) post.description = description;
      if (url) post.url = url;
      if (rating) post.rating = rating;
      return post;
    }
  });

  if (!result) {
    res.statusMessage = 'There are no posts with id: ' + id;
    return res.status(404).end();
  }

  return res.status(202).json(result);
});

app.listen(8000, () => {
  console.log('Running on port 8000...')
});

// Base url:      http://localhost:8000
// GET endpoint:  http://localhost:8000/api/bookmarks
// GET endpoint:  http://localhost:8000/api/bookmark?title=""
// POST endpoint: http://localhost:8000/api/bookmark
// DELETE endpoint: http://localhost:8000/api/bookmark/id
// PATCH endpoint: http://localhost:8000/api/bookmark/id