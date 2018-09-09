const { argv } = require('yargs');
const faker = require('faker');
const fs = require('fs');
const https = require('https');

const { merge, req } = require('../src/utils');

const { domain } = argv;
const GRAPHQL_FORMATS = ['BLURAY', 'DVD', 'STREAMING'];
const FORMATS = ['Blu-Ray', 'DVD', 'Streaming'];

/**
 * Get a randomly selected movie format
 * @param {Array<string>} formats Movie formats
 * @return {string}               Movie format
 */
const getFormat = (formats) => {
  const index = Math.floor(Math.random() * formats.length);
  return formats[index];
};
module.exports.getFormat = getFormat;

/**
 * Get a Movie model
 * @return {Object} Movie model
 */
const getGraphQLMovie = () => {
  return {
    title: faker.random.word(),
    format: getFormat(GRAPHQL_FORMATS),
    length: `${Math.round(Math.random() * 999)} min`,
    releaseYear: 1900 + Math.round(Math.random() * 200),
    rating: 1 + Math.round(Math.random() * 4)
  };
};
module.exports.getGraphQLMovie = getGraphQLMovie;

/**
 * Get a Movie model
 * @return {Object} Movie model
 */
const getMovie = () => {
  return {
    title: faker.random.word(),
    format: getFormat(FORMATS),
    length: `${Math.round(Math.random() * 999)} min`,
    releaseYear: 1900 + Math.round(Math.random() * 200),
    rating: 1 + Math.round(Math.random() * 4)
  };
};
module.exports.getMovie = getMovie;

/**
 * Merge fetch options with local cert HTTPS data
 * @param {Object} opts Merged fetch options
 */
const getOpts = (opts) => {
  const agent = new https.Agent({
    ca: fs.readFileSync('auth/cert.pem'), 
  });
  const httpsOpts = domain ? {} : { agent };

  return merge(opts, httpsOpts);
};
module.exports.getOpts = getOpts;

/**
 * Get an Auth token
 * @return {string} Auth token
 */
const getToken = async () => {
  const user = {
    username: Date.now().toString(),
    password: Date.now().toString()
  };
  const opts = getOpts({
    method: 'POST',
    body: JSON.stringify(user)
  });
  const userUrl = getURL('/movies/user');

  const userRes = await req(userUrl, opts);
  console.log('~~~ userRes', userRes);

  const tokenUrl = getURL('/movies/token');
  const { token } = await req(tokenUrl, opts);
  console.log('~~~ token', token);

  return token;
};
module.exports.getToken = getToken;

/**
 * Append domain to a URI
 * @param {string} uri  Domain URI path
 * @return {string}     URL
 */
const getURL = (uri) => {
  const origin = domain || 'https://localhost:3000';
  return `${origin}${uri}`;
};
module.exports.getURL = getURL;
