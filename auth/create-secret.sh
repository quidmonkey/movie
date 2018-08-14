#!/bin/bash
cwd=$(dirname ${BASH_SOURCE[0]})

if [ ! -f $cwd/secrets.json ]; then 
  echo "~~~ Missing secrets.json. Generating file."
  uuid=$(uuidgen | sed 's/-//g')
  echo "{"  > $cwd/secrets.json
  echo "  \"JWT_SECRET\": \"$uuid\"" >> $cwd/secrets.json
  echo "}" >> $cwd/secrets.json
else
  echo "~~~ secrets.json found. No need to generate."
fi
