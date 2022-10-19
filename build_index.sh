npx tsc
echo "#!/usr/bin/env node" > ./index.js
echo "" >> ./index.js
cat ./index_build/index.js >> ./index.js
rm -r ./index_build