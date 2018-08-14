#!/bin/bash

cwd=$(dirname $0)

source $cwd/.secret

[ -z "$JWT_SECRET" ] && echo "JWT_SECRET is not set" && exit 1

aws ssm put-parameter --overwrite --name JWT_SECRET --type String --value $JWT_SECRET
