# ct_frontend


## Env Setup
```bash
# Install node v16.13.1 or higher version by using nvm
```
Create ct-frontend-development.env file
```
COGNITO_RESPONSE_TYPE
COGNITO_SCOPE
COGNITO_BASE_URL
COGNITO_CLIENT_ID
COGNITO_POOL_ID
COGNITO_REGION
STRAPI_BASE
CT_BACK
CT_FRONT
PAYPAL_CLIENT_ID
PAYPAL_URL
REWARDFUL_KEY
REWARDFUL_CAMPAIGN_ID
GOOGLE_MAP_API_KEY
RECAPTCHA_SITE_KEY
HUB_SPOT_ID
```

## Build Setup

```bash
$ cd ct_frontend
```

```bash
$ npm install
```

```bash
# Serve with hot reload at localhost:3000
$ npm run dev

# Generate static project
$ npm run generate
```

## Info

1. In order to run ct_front correctly, ct and ct_cms is need to be ran first.
2. Install the below vscode extensions
  - Vetur (required)
  - Prettier - Code formatter (required)
  - Material Design Icons Intellisense (required)
  - ESLint (required)
3. Eslint Auto-fix on save
  - Go [menu] - [settings] (ctrl + ,)
  - Search 'eslint'
  - 'eslint validate' - click 'edit in setting.json'
  - Add codes down below
```
"editor.codeActionsOnSave": {
  "source.fixAll.eslint": true
},
```

Ref)<br />
1 [Nuxt.js docs](https://nuxtjs.org)<br />
2 [Nuxt.js with Typescript](https://typescript.nuxtjs.org/)


