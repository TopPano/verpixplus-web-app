# verpixplus-web-app
Web application for Verpix Plus.

## As a service

* Build image

    ```sh 
    $ docker build --build-arg API_ROOT=http://$Domain_name/api STATIC_URL=http://$Domain_name ./
    ```

* Create container

    ```sh
    $ docker create -p 8000:8000 $imageId
    ```

* Start container

    ```sh
    $ docker start $containerId
    ```

## Getting Started

### Prerequisites

Install dependent npm modules.
```
$ npm install
$ npm install -g pm2
```

Install dependent libraries for running tests.
```
$ sudo apt-get install libfontconfig
```


### Usages
```bash
# Start for development (with auto watching)
$ npm run dev 

# Just build the production version of files
$ npm run build

# Start for production
$ npm run build
$ npm start

# Run unit tests
$ npm test
# or Run unit tests with auto watching
$ npm run test:watch
```
Please read `package.json` to see more usages.

## Contributing
### Coding Style Guildline
- Javscript: [Aribnb Javscript Style Guildine](https://github.com/airbnb/javascript)
- React: [Aribnb React/JSX Style Guildine](https://github.com/airbnb/javascript/tree/master/react)
