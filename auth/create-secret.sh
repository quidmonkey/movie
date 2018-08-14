#!/bin/bash
cwd=$(dirname $0)

if [ ! -f $cwd/secrets.json ]; then 
  uuid=$(uuidgen | sed 's/-//g')
  echo "{"  > $cwd/secrets.json
  echo "  \"JWT_SECRET\":\"$uuid\"" >> $cwd/secrets.json
  echo "}" >> $cwd/secrets.json
fi
