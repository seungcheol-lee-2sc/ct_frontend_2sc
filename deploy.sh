KEY_PATH=~/dev/keys/aws/cointelli/cointelli-ec2.pem

env=$1
if [ -z $env ]; then
  env=staging # staging is a default environment.
fi

echo "** Deploying to $env environment **"

if [ $env = staging ]; then
  asgName=ct-frontend-staging-asg
elif [ $env = qa ]; then
  asgName=ct-frontend-qa-asg
else
  echo "$env is not a valid environment."
  exit 1
fi

echo "** Running run.sh on EC2 instances in the auto scale group $asgName **"
for ID in $(aws autoscaling describe-auto-scaling-instances --output text --query "AutoScalingInstances[?AutoScalingGroupName=='$asgName'].InstanceId");
do
  ec2ip=$(aws ec2 describe-instances --instance-ids $ID --output text --query "Reservations[].Instances[].PublicIpAddress")
  echo "Running run.sh on $ec2ip"
  ssh ubuntu@$ec2ip -i $KEY_PATH -o "StrictHostKeyChecking no" "./ct_frontend/run.sh $env"
done