[![CI](https://github.com/pheeel/smart-contract-tests/actions/workflows/ci.yml/badge.svg)](https://github.com/pheeel/smart-contract-tests/actions/workflows/ci.yml)
# smart-contract-tests

## How to run locally
Build the frontend image:
```sh
$ docker pull evercoinx/faraway:nft-collection-deployer-frontend
$ docker run -p 3000:3000 <Frontend Image ID>   
```

Build the backend image:
```sh
$ docker pull evercoinx/faraway:nft-collection-deployer-backend
$ docker run -p 4000:4000 <Backend Image ID>   
```

Run Tests:
```sh
$ npm run test
```


## How to run in CI

Go to [GitHub Action](https://github.com/pheeel/smart-contract-tests/actions/workflows/tests.yml) and trigger the job manually.

NOTE: The job doesn't work due to the missing specific setup on CI or problem with Metamask detection from the client side. The logs show that the app cannot trigger Metamask to connect.


## Additional note
Tests may fail due to non-isolated environment - the smartcontract can be triggered by other users causing changes in the app.
