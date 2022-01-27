/* eslint-disable */
import {
	COGNITO_BASE_URL,
	COGNITO_CLIENT_ID,
	COGNITO_POOL_ID,
	COGNITO_SIGN_IN_REDIRECT,
    COGNITO_SIGN_OUT_REDIRECT,
	COGNITO_REGION,
	COGNITO_RESPONSE_TYPE,
	COGNITO_SCOPE,
} from '~/utils/constants';

const config = {
    "aws_project_region": COGNITO_REGION,
    "aws_cognito_region": COGNITO_REGION,
    "aws_user_pools_id": COGNITO_POOL_ID,
    "aws_user_pools_web_client_id": COGNITO_CLIENT_ID,
    "oauth": {
        "domain": COGNITO_BASE_URL,
        "scope": COGNITO_SCOPE ? COGNITO_SCOPE.split(',') : [],
        "redirectSignIn": COGNITO_SIGN_IN_REDIRECT,
        "redirectSignOut": COGNITO_SIGN_OUT_REDIRECT,
        "responseType": COGNITO_RESPONSE_TYPE
    },
    "federationTarget": "COGNITO_USER_POOLS"
};

export default config;
