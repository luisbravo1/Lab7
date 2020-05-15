const API_TOKEN = '2abbf7c3-245b-404f-9473-ade729ed4653';

// GET bookmark by title
function fetchGetByTitleBookmark(title) {
  let urlCall = `/bookmark?title=${title}`
  let settings = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${API_TOKEN}`
    }
  };

  fetch(urlCall, settings)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      alert('Error: ' + response.statusText);
      throw new Error(response.statusText);
    })
    .then(responseJSON => {
      console.log(responseJSON);
      let results = document.querySelector('.results');

      results.innerHTML = '';

      for(let i = 0; i < responseJSON.length; i++) {
        results.innerHTML += 
        `<div>
          <ul>
            <li>ID: ${responseJSON[i].id}</li>
            <li>Title: ${responseJSON[i].title}</li>
            <li>Description: ${responseJSON[i].description}</li>
            <li>URL: ${responseJSON[i].url}</li>
            <li>Rating: ${responseJSON[i].rating}</li> 
          </ul>
        </div>`
      }
    })
    .catch(err => {
      console.log(err.message);
    })
}

// UPDATE bookmark
function fetchUpdateBookmark(id, title, description, url, rating) {
  let urlCall = `/bookmark/${id}`
  let data = {
    id: id,
    title: title,
    description: description,
    url: url,
    rating: Number(rating)
  };
  let settings = {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };

  fetch(urlCall, settings)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      alert('Error: ' + response.statusText);
      throw new Error(response.statusText);
    })
    .then(responseJSON => {
      console.log(responseJSON);
      fetchListBookmarks();
    })
    .catch(err => {
      console.log(err.message);
    })
}

// DELETE bookmark by id
function fetchDeleteBookmark(id) {
  let urlCall = `/bookmark/${id}`
  let settings = {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${API_TOKEN}`
    }
  };

  fetch(urlCall, settings)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      alert('Error: ' + response.statusText);
      throw new Error(response.statusText);
    })
    .then(responseJSON => {
      console.log(responseJSON);
      fetchListBookmarks();
    })
    .catch(err => {
      console.log(err.message);
    })
}

// POST new bookmark
function fetchAddBookmark(title, description, url, rating) {
  let urlCall = '/bookmarks'
  let data = {
    title: title,
    description: description,
    url: url,
    rating: Number(rating)
  };
  let settings = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };

  fetch(urlCall, settings)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      alert('Error: ' + response.statusText);
      throw new Error(response.statusText);
    })
    .then(responseJSON => {
      console.log(responseJSON);
      fetchListBookmarks();
    })
    .catch(err => {
      console.log(err.message);
    })
}

// GET all bookmarks
function fetchListBookmarks() {
  let url = '/bookmarks';
  let settings = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${API_TOKEN}`
    }
  };

  fetch(url, settings)
    .then(response => {
      if (response.ok) {
        return response.json();
      }

      throw new Error(response.statusText);
    })
    .then(responseJSON => {
      let results = document.querySelector('.results');

      results.innerHTML = '';

      for(let i = 0; i < responseJSON.length; i++) {
        results.innerHTML += 
        `<div>
          <ul>
            <li>ID: ${responseJSON[i].id}</li>
            <li>Title: ${responseJSON[i].title}</li>
            <li>Description: ${responseJSON[i].description}</li>
            <li>URL: ${responseJSON[i].url}</li>
            <li>Rating: ${responseJSON[i].rating}</li> 
          </ul>
        </div>`
      }
    })
    .catch(err => {
      console.log(err.message);
    })

}

function watchAddBookmarkForm() {
  let addBookmarksForm = document.querySelector('.form-add-bookmark');

  addBookmarksForm.addEventListener('submit', (event) => {
    event.preventDefault();
    let title = document.getElementById('bookmarkTitle').value;
    let description = document.getElementById('bookmarkDescription').value;
    let url = document.getElementById('bookmarkURL').value;
    let rating = document.getElementById('bookmarkRating').value;
    document.getElementById('bookmarkTitle').value = '';
    document.getElementById('bookmarkDescription').value = '';
    document.getElementById('bookmarkURL').value = '';
    document.getElementById('bookmarkRating').value = '';
    fetchAddBookmark(title, description, url, rating);
  });
}

function watchDeleteBookmarkForm() {
  let deleteBookmarksForm = document.querySelector('.form-delete-bookmark');

  deleteBookmarksForm.addEventListener('submit', (event) => {
    event.preventDefault();
    let id = document.getElementById('bookmarkID').value;
    document.getElementById('bookmarkID').value = '';
    fetchDeleteBookmark(id);
  });
}

function watchUpdateBookmarkForm() {
  let updateBookmarksForm = document.querySelector('.form-update-bookmark');

  updateBookmarksForm.addEventListener('submit', (event) => {
    event.preventDefault();
    let id = document.getElementById('bookmarkUpdateID').value;
    let title = document.getElementById('bookmarkUpdateTitle').value;
    let description = document.getElementById('bookmarkUpdateDescription').value;
    let url = document.getElementById('bookmarkUpdateURL').value;
    let rating = document.getElementById('bookmarkUpdateRating').value;
    document.getElementById('bookmarkUpdateID').value = '';
    document.getElementById('bookmarkUpdateTitle').value = '';
    document.getElementById('bookmarkUpdateDescription').value = '';
    document.getElementById('bookmarkUpdateURL').value = '';
    document.getElementById('bookmarkUpdateRating').value = '';
    fetchUpdateBookmark(id, title, description, url, rating);
  });
}

function watchGetBookmarkForm() {
  let getByTitleBookmarksForm = document.querySelector('.form-getByTitle-bookmark');

  getByTitleBookmarksForm.addEventListener('submit', (event) => {
    event.preventDefault();
    let title = document.getElementById('bookmarkGetByTitle').value;
    document.getElementById('bookmarkGetByTitle').value = '';
    fetchGetByTitleBookmark(title);
  });
}

function init() {
  fetchListBookmarks();
  watchAddBookmarkForm();
  watchDeleteBookmarkForm();
  watchUpdateBookmarkForm();
  watchGetBookmarkForm();
}

init();