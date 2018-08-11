'use strict';

const jwt = require('jsonwebtoken');

const { getIAMPolicy, isAuthorized } = require('./utils');

module.exports.authorize = (event, context, callback) => {
  const { authorizationToken, methodArn } = event;

  jwt.verify(authorizationToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      callback('Unauthorized');
    } else {
      const { user } = decoded;
      const { scopes, username } = user;
      const effect = isAuthorized(scopes, methodArn) ? 'Allow' : 'Deny';
      const context = { user: JSON.stringify(user) };

      const policyDocument = getIAMPolicy(
        username,
        effect,
        methodArn,
        context
      );

      callback(null, policyDocument);
    }
  });
};
