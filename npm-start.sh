#!/bin/bash

cd www/
npm run nwjs:prebuild --if-present
cd ../

rm -rf _www || true
cp -r www _www
./node_modules/.bin/webpack -c webpack.config.js || exit 0
./node_modules/.bin/webpack -c webpack.config.js --env main || exit 0

# Removing type="module"
grep -rl "type=\"module\"" ./_www | xargs sed -i 's/type="module"//g'

echo "Starting app..."
node nwjs-start.js
#rm -rf _www
