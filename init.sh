# The init.sh initializes ec2 server after being created.

sudo apt update

# Install NVM
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
source ~/.profile
nvm install 14.17
nvm use 14.17

npm i pm2 -g

git config --global credential.helper store
git clone https://github.com/timtwim/ct_frontend.git

cd ct_frontend

# Setup ~/ct_frontend/.env

npm i
NODE_ENV=staging npm run build
cross-env NODE_ENV=staging pm2 start --name ct_frontend ./node_modules/nuxt/bin/nuxt.js -- start