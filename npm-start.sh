#!/bin/bash

# Building CSS
cd www/
npm install
npm run nwjs:prebuild --if-present
cd ../

# Building web contents
rm -rf _www_2 || true
mkdir -p _www_2/
./node_modules/.bin/webpack -c webpack.config.js || exit 0
./node_modules/.bin/webpack -c webpack.config.js --env main || exit 0

rm -rf _www || true
cp -r www _www
if [[ $OSTYPE == 'darwin'* ]]; then
    ditto _www_2/ _www
else
    rsync -a _www_2/ _www/
fi
rm -rf _www_2

# Removing type="module"
grep -rl "type=\"module\"" ./_www | xargs sed -i 's/type="module"//g'

echo "Starting app..."
node nwjs-start.js
#rm -rf _www
