const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const uuid = require('uuid');
const mongoose = require('mongoose');
const { Bookmarks } = require('./models/bookmarkModel');
const { DATABASE_URL, TOKEN, PORT } = require('./config');

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
app.get('/bookmarks', ( req, res ) => {
  console.log('Getting all existing bookmarks...');
  Bookmarks
    .getAllBookmarks()
    .then(result => {
      return res.status(201).json(result);
    })
    .catch(err => {
      res.statusMessage = "Something went wrong with the database, try again."
      return res.status(500).end()
    });
});

// GET bookmarks by title
app.get('/bookmark', ( req, res ) => {
  console.log('Getting bookmarks by title...');
  console.log(req.query);
  let title = req.query.title;

  if (!title) {
    res.statusMessage = "Please specify a title";
    return res.status(406).end();
  }

  Bookmarks
    .getBookmarks({title})
    .then(result => {
      if (result.length < 1) {
        res.statusMessage = "No results found";
        return res.status(404).end();
      }
      return res.status(201).json(result);
    })
    .catch(err => {
      res.statusMessage = "Something went wrong with the database, try again."
      return res.status(500).end()
    });
});

// POST bookmark
app.post('/bookmarks', jsonParser, ( req, res ) => {
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

  Bookmarks
    .createBookmark(newPost)
    .then(result => {
      return res.status(201).json(result);
    })
    .catch(err => {
      res.statusMessage = "The POST could not be resolved"
      return res.status(500).end()
    });
});

// DELETE bookmark by id
app.delete('/bookmark/:id', (req, res) => {
  console.log('Deleting post by id...');
  let id = req.params.id;

  Bookmarks
    .deleteBookmark({id})
    .then(result => {
      if (result.length < 1) {
        res.statusMessage = 'There are no posts with id: ' + id;
        return res.status(404).end();
      }
      return res.status(201).json(result);
    })
    .catch(err => {
      res.statusMessage = "Something went wrong with the database, try again."
      return res.status(500).end()
    });
});

// PATCH bookmark
app.patch('/bookmark/:id', jsonParser, ( req, res ) => {
  console.log('Updating a bookmark...')
  console.log(req.body);
  let pid = req.params.id;
  let id = req.body.id;
  let updatedBookmark = {};

  if (!id) {
    res.statusMessage = 'The id from the body is missing';
    return res.status(406).end();
  }

  if (pid !== id) {
    res.statusMessage = 'The id from the parameter does not match the id from the body'
    return res.status(409).end()
  }

  if (req.body.title) {
    updatedBookmark['title'] = req.body.title;
  }

  if (req.body.description) {
    updatedBookmark['description'] = req.body.description;
  }

  if (req.body.url) {
    updatedBookmark['url'] = req.body.url;
  }

  if (req.body.rating) {
    updatedBookmark['rating'] = req.body.rating;
  }

  Bookmarks
    .updateBookmark(id, updatedBookmark)
    .then(result => {
      if (!result) {
        res.statusMessage = 'There are no posts with id: ' + id;
        return res.status(404).end();
      }
      return res.status(201).json(result);
    })
    .catch(err => {
      res.statusMessage = "Something went wrong with the database, try again."
      return res.status(500).end()
    });
});

app.listen(PORT, () => {
  console.log('Running on port 8000...')

  new Promise((resolve, reject) => {
    const settings = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    };
    mongoose.connect(DATABASE_URL, settings, (err) => {
      if (err) {
        return reject(err);
      } else {
        console.log('Database connection established');
        return resolve();
      }
    })
  })
  .catch(err => {
    console.log(err);
  });
});

// Base url:      http://localhost:8000
// GET endpoint:  http://localhost:8000/bookmarks
// GET endpoint:  http://localhost:8000/bookmark?title=""
// POST endpoint: http://localhost:8000/bookmark
// DELETE endpoint: http://localhost:8000/bookmark/id
// PATCH endpoint: http://localhost:8000/bookmark/id