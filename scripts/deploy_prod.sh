#!/bin/bash

source ~/.bash_profile
nvm use
git pull
yarn
yarn build
sudo chown -R worker:www-data dist/
sudo chmod -R u+rwX,go+rX,go-w dist/
