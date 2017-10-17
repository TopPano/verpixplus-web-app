# verpixplus-web-app
Web application for Verpix.

## Development and Build

### Prerequisites

* Install [Node.js](https://nodejs.org/).

* Clone the project to your file system:

```bash
git clone https://github.com/TopPano/verpixplus-web-app
```

* Go into the project directory

```bash
cd ./verpixplus-web-app
```

* Install dependencies

```bash
npm install
npm install -g pm2
sudo apt-get install libfontconfig
```

### Development

* Run in development mode that will hot re-build the webapp when you modify source files. The URL of webapp is http://localhost:8000/.

```bash
npm run dev
```

### Test

```bash
# TODO: The webapp is not well tested yet. Help please.
```

### Build

* Build the webapp in production. The output files are in `public/static/build`.

```bash
npm run build
```

* Start the webapp. The URL of webapp is http://localhost:8000/.

```bash
npm start
```

* Stop the webapp.

```bash
npm stop
```

### As a Docker service

* Build an image.

```bash
docker build --build-arg API_ROOT=http://$Domain_name/api STATIC_URL=http://$Domain_name ./
```

* Create a container.

```bash
docker create -p 8000:8000 $imageId
```

* Start the container

```bash
docker start $containerId
```

## Contributing

### Coding Style Guildline

- Javscript: [Aribnb Javscript Style Guildine](https://github.com/airbnb/javascript)
- React: [Aribnb React/JSX Style Guildine](https://github.com/airbnb/javascript/tree/master/react)
