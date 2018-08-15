#!/bin/bash
CWD=$(dirname ${BASH_SOURCE[0]})

if [ ! -f $CWD/secrets.json ]; then 
  echo "~~~ Missing secrets.json. Generating file."
  uuid=$(uuidgen | sed 's/-//g')
  echo "{"  > $CWD/secrets.json
  echo "  \"JWT_SECRET\": \"$uuid\"" >> $CWD/secrets.json
  echo "}" >> $CWD/secrets.json
else
  echo "~~~ secrets.json found. No need to generate."
fi
