const { argv } = require('yargs');
const fetch = require('node-fetch');
const fs = require('fs');
const https = require('https');

const { merge } = require('./movies/utils');

const { domain } = argv;

const getURL = (uri) => {
  const origin = domain || 'https://localhost:3000';
  return `${origin}${uri}`;
};

const getOpts = (opts) => {
  const agent = new https.Agent({
    ca: fs.readFileSync('auth/cert.pem'), 
  });
  const httpsOpts = domain ? {} : { agent };

  return merge(opts, httpsOpts);
};

const listMovies = async () => {
  const user = {
    username: Date.now().toString(),
    password: Date.now().toString()
  };
  const opts = getOpts({
    method: 'POST',
    body: JSON.stringify(user)
  });

  const userRes = await fetch(getURL('/movies/user'), opts);
  console.log('~~~ userRes', await userRes.json());

  const tokenRes = await fetch(getURL('/movies/token'), opts);
  const { token } = await tokenRes.json();

  console.log('~~~ token', token);

  const listOpts = getOpts({
    headers: {
      Authorization: token
    }
  });
  const listRes = await fetch(getURL('/movies'), listOpts);

  console.log('~~~ listRes json', await listRes.json());
};

listMovies();
