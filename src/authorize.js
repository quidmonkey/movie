'use strict';

const jwt = require('jsonwebtoken');

const { getIAMPolicy, isAuthorized } = require('./utils');

module.exports.authorize = async (event) => {
  const { authorizationToken, methodArn } = event;

  try {
    const { user } = jwt.verify(authorizationToken, process.env.JWT_SECRET);
    const { scopes, username } = user;
    const effect = isAuthorized(scopes, methodArn) ? 'Allow' : 'Deny';
    const context = { user: JSON.stringify(user) };
    const policyDocument = getIAMPolicy(
      username,
      effect,
      methodArn,
      context
    );

    return policyDocument;
  } catch (err) {
    throw new Error(err);
  }
};
