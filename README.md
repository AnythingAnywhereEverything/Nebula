# Nebula

Currently work in progress


Nebula is a project 2 year last semester.
The purpose is for education only.


Nebula is a marketplace that user can create their own shop for sell and buy their products.

## Table of contents
1.[Prerequisites](#prerequisites)


2.[Getting start](#getting-started)

## Prerequisites
- Docker
- Redis (optional)
- postgres (optional)

## Getting started

On windows
```
docker compose -f docker-compose-full.yml up --build

// * If you already build
docker compose -f docker-compose-full.yml up
```


On Linux
```
docker-compose -f docker-compose-full.yml up --build

// * If you already build
docker-compose -f docker-compose-full.yml up
```

### Note
* If you already have Redis and postgres, you can run ```docker-compse.yml``` instead.
