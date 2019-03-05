#!/bin/bash

if [[ "$OSTYPE" == "linux-gnu" ]]; then
        sudo apt-get install build-essential curl git m4 ruby texinfo libbz2-dev libcurl4-openssl-dev libexpat-dev libncurses-dev zlib1g-dev
        sudo apt-get install nodejs
        sudo npm install npm -g 
        npm install express --save
        npm install firebase-admin --save
elif [[ "$OSTYPE" == "darwin"* ]]; then
        brew install node@8
        sudo npm install npm -g 
        npm install express --save
        npm install firebase-admin --save
else
    echo "OS not recognized"

fi