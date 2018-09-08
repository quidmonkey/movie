const fetch = require('node-fetch');

const {
  getOpts,
  getToken,
  getURL
} = require('./misc-utils');

const listMovies = async () => {
  const token = await getToken();

  const listOpts = getOpts({
    headers: {
      Authorization: token
    }
  });
  const res = await fetch(getURL('/movies'), listOpts);

  console.log('~~~ res', await res.json());
};

listMovies();
