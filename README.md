# Jukeboxes
A simple REST API for a jukebox built using Express.

## Requirements
- Node 8.0 or above
- Express JS

## Running the server

To run the server directy using NodeJS:
Clone the git directory and navigate to this directory.

```
npm install
npm start
```

To run the dockerize app, there is additional requirement of installing docker in the machine. Once the docker is install, from the directory of the project execute following:

```
docker build -t jukeboxes .
docker run -d -p 3000:3000 --name jukebox jukeboxes
```

## To run the test and lint

To run the test:

```
npm test
```

To run the lint:

```
npm run lint
```

## Test the endpoint
Once the server is started, you can use postman or curl from the commandline to test it. There is only one endpoint for the app:

### GET /jukeboxes
It support following query parameters: 

- settingId - setting id (required)
- model - filter by model name (optional)
- offset - specifies at what index start the page (optional)
- limit - specifies the page size (optional)

Use curl method to get the specific settingId with the following command:
```
curl -i -X GET http://localhost:3000/jukeboxes?settingId=86506865-f971-496e-9b90-75994f251459&model=virtuo
```
