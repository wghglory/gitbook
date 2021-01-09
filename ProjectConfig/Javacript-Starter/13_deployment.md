# Deployment

## Why Separate the UI and API?

1.  Simple, low-risk, UI only deploys
1.  Separates concerns
    - Separate teams
    - Less to understand
    - Scale back-end separately
1.  Cheap UI hosting (hosting only static files)
1.  Serve UI via a content delivery network
1.  Use the API tech you like

## Cloud hosting

amazon web services microsoft azure Heroku firebase google cloud platform github (static files only) Surge (static files only)

## Hosting javascript-starter-kit-api(API) to [Heroku](http://heroku.com)

We separate API and UI.

The repository is at <https://github.com/wghglory/javascript-starter-kit-api>. See some configurations needed there for heroku. This api repository will be hosted in heroku.

- app.json - describe app to heroku
- Procfile - command that heroku should run

## Deploy static files(UI) to [Surge](http://surge.sh)

package.json:

```javascripton
"deploy": "surge ./dist"
```

```shell
npm run build -s
npm run deploy
```

### Reference

- React starter: <http://andrewhfarmer.com/starter-project/>
- Angular starter: <https://github.com/gianarb/awesome-angularjs>
