# 4Geeks
4Geeks is a course management platform for the EPN Software Club.
This project has been developed with a PERN (Postgres, Express, ReactJs, NodeJs) stack using TypeScript.
## Requirements
- Node Js 14.XX
- Yarn (optional)
- Docker

This project use Docker to control all software architecture.
First of all you need to setup all environment variables, create a `.env` file in the root project directory.
> In this repository you can found an `.env.example` file that contains all needed environment variables for this project.

## Run this project
First you need to use `docker-compose` to setup the Postgres Database service with this command:
```
docker-compose up -d db
```
Then you can install all project dependencies:
```
yarn
```
Now you can run your project in a dev environment:
```
yarn start:dev
```