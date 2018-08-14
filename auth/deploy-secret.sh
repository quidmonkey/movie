#!/bin/bash

cwd=$(dirname $0)

##
# Get the value of a given key in a json file
#
# Arguments:
#   1. json filepath
#   2. json key
#
# Returns:
#   Value of given json key
#
##
function get_json_value() {
  local filepath=$1
  local key=$2

  grep -o "\"$key\": \"[^\"]*" $filepath | grep -o '[^"]*$'
}

JWT_SECRET=$(get_json_value $cwd/secrets.json "JWT_SECRET")

[ -z "$JWT_SECRET" ] && echo "JWT_SECRET is not set" && exit 1

aws ssm put-parameter --overwrite --name JWT_SECRET --type String --value $JWT_SECRET
