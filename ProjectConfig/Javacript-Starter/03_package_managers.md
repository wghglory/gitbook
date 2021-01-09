# Package Managers

npm, bower, jspm, jam, volo

npm is best, because it offers everything, like linting, transpiling, etc.

## Security Scanning

Anyone can creates npm package, so we need to security scanning.

- retire.js
- node security platform (better)

### Usage of node security platform

```shell
npm install -g nsp
cd your-project
nsp check   # result usually: (+) No known vulnerabilities found
```

#### When to Run Security Check

    Manually          - Easy to forget
    npm install       - May be issue later
    production build  - Expensive to change
    pull request      - Expensive to change
    npm start         - Slows start slightly
