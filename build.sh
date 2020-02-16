echo '! remember to start the prod server before building !'
rm -rf ./dist
mkdir dist
cd dist
wget -r -nH http://localhost:4000/aapp.html
wget -r -nH http://localhost:4000/aapp/bapp.html
