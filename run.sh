env=$1

if [ -z $env ]; then
  echo 'environment is required.'
  exit 1
fi

cd ct_frontend
git fetch --all
git checkout $env
git reset --hard origin/$env
git pull
npm i

echo '** Done pulling git repository ct_frontend **'
aws s3 cp s3://cointelli-ec2-setup-files/ct-frontend/ct-frontend-$env.env ct-frontend-$env.env
NODE_ENV=$env npm run build

echo '** Done building ct_frontend **'
pm2 stop all
pm2 delete all
NODE_ENV=$env npm run start-ec2

echo '** Done restarting ct_frontend **'