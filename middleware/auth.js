const API_KEY = '2abbf7c3-245b-404f-9473-ade729ed4653';

function authenticate(req, res, next) {
  let token = req.headers.authorization;

  if (!token) {
    token = req.query.apiKey;
  }

  if (!token) {
    token = req.headers['book-api-key'];
  }

  if (!token) {
    res.statusMessage = 'You need to send authorization token';
    return res.status(401).end();
  }

  if (token !== `Bearer ${API_KEY}`&& token !==`${API_KEY}`) {
    res.statusMessage = 'The authorization token is invalid';
    return res.status(401).end();
  }

  next();
}

module.exports = authenticate;