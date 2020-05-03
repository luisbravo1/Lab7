const mongoose = require('mongoose');

const bookmarksSchema = mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  }
});

const bookmarksCollection = mongoose.model('bookmarks', bookmarksSchema);

const Bookmarks = {
  getAllBookmarks() {
    return bookmarksCollection
      .find()
      .then(bookmarks => {
        return bookmarks;
      })
      .catch(err => {
        return err;
      });
  },
  getBookmarks(title) {
    return bookmarksCollection
      .find(title)
      .then(bookmarks => {
        return bookmarks;
      })
      .catch(err => {
        return err;
      });
  },
  createBookmark(newBookmark) {
    return bookmarksCollection
      .create(newBookmark )
      .then(createdBookmark => {
        return createdBookmark;
      })
      .catch(err => {
        return err;
      });
  },
  deleteBookmark(id) {
    return bookmarksCollection
      .deleteOne(id)
      .then(deletedBookmark => {
        return deletedBookmark;
      })
      .catch(err => {
        return err;
      });
  },
  updateBookmark(id, bookmark) {
    return bookmarksCollection
      .findOneAndUpdate({id: id}, {$set: bookmark})
      .then(updatedBookmark => {
        return updatedBookmark;
      })
      .catch(err => {
        return err;
      });
  }
}

module.exports = { Bookmarks };
