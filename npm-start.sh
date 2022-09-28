#!/bin/bash

# Building CSS
cd www/
npm install
npm run nwjs:dist --if-present
cd ../

# Building web contents
rm -r _www || true
mkdir -p _www/
./node_modules/.bin/webpack -c webpack.config.js || exit 0
./node_modules/.bin/webpack -c webpack.config.js --env main || exit 0

rm -rf ./obfuscated_code
cp -r ./_www ./obfuscated_code

rm -rf _www
cp -r www _www
find _www -name "*.js" -type f -delete
find _www -name "*.sh" -type f -delete
find _www -name "*.scss"  -type f -delete
find _www -name "*.scssc" -type f -delete
find _www -name ".DS_Store" -type f -delete
rm -rf _www/node_modules
if [[ $OSTYPE == 'darwin'* ]]; then
    ditto obfuscated_code/ _www
else
    rsync -a obfuscated_code/ _www/
fi
rm -r obfuscated_code

# Removing empty folders
find _www -empty -type d -delete

# NW.js run
echo "Starting app..."
node nwjs-start.js
#rm -rf _www
