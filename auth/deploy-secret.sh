#!/bin/bash

cwd=$(dirname ${BASH_SOURCE[0]})

##
# Get the value of a given key in a json file
#
# Arguments:
#   1. json src cmd (either filepath or string) i.e. "cat path/to/file.json" or "echo $json_blob"
#   2. json key
#
# Returns:
#   Value of given json key
#
##
function get_json_value() {
  local src=$1
  local key=$2

  $src | grep -o "\"$key\": \"[^\"]*" | grep -o '[^"]*$'
}

JWT_SECRET=$(get_json_value "cat $cwd/secrets.json" "JWT_SECRET")

[ -z "$JWT_SECRET" ] && echo "JWT_SECRET is not set" && exit 1

AWS_RES=$(aws ssm get-parameters --names "JWT_SECRET")
AWS_JWT_SECRET=$(get_json_value "echo $AWS_RES" "Value")

if [ -z "$AWS_JWT_SECRET" ] || [ "$JWT_SECRET" != "$AWS_JWT_SECRET" ]; then
  echo "~~~ Deploying New Key to SSM"
  aws ssm put-parameter --overwrite --name JWT_SECRET --type String --value $JWT_SECRET
else
  echo "~~~ JWT_SECRET up-to-date. No SSM deploy needed."
fi
