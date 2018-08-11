/**
  * Returns an IAM policy document for a given user and resource.
  * @param {String} principalId User Id
  * @param {String} Effect      Allow / Deny
  * @param {String} Resource    Resource ARN
  * @param {String} context     Response context
  * @returns {Object}           PolicyDocument
  */
 module.exports.getIAMPolicy = (principalId, Effect, Resource, context) => {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect,
          Resource
        },
      ],
    },
    context
  };
};

/**
 * Is the user authorized to acess the AWS resource?
 * @param {Array<string>} scopes  List of user access scopes
 * @param {string} methodArn      Lambda AWS ARN
 * @return {boolean}              True, if user is authorized; false, otherwise
 */
module.exports.isAuthorized = (scopes, methodArn) => {
  if (scopes.includes('*')) {
    return true;
  }

  for (const scope of scopes) {
    if (methodArn.includes(scope)) {
      return true;
    }
  }

  return false;
};
