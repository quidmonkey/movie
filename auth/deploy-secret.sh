#!/bin/bash

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

##
#
# Arguments:
#   1. json key name
#   2. json filepath
#
# Returns:
#   None
#
##
function deploy_json_secret() {
  local key=$1
  local json_filepath=$2

  LOCAL_SECRET=$(get_json_value "cat $json_filepath" $key)

  [ -z "$LOCAL_SECRET" ] && echo "$key is not set" && exit 1

  AWS_RES=$(aws ssm get-parameters --names "$key")
  AWS_SECRET=$(get_json_value "echo $AWS_RES" "Value")

  if [ -z "$AWS_SECRET" ] || [ "$LOCAL_SECRET" != "$AWS_SECRET" ]; then
    echo "~~~ Deploying New Key to SSM"
    aws ssm put-parameter --overwrite --name $key --type String --value $LOCAL_SECRET
  else
    echo "~~~ $key up-to-date. No SSM deploy needed."
  fi
}

deploy_json_secret $@
