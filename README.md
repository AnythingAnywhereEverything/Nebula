# Nebula

Currently unfinished

Nebula is a project 2 year SE last semester project.

*This repo purpose is for educational purposes only.*

Nebula is a marketplace that user can create their own shop for sell and buy their products.

## Table of contents
1. [Prerequisites](#prerequisites)
2. [Getting start](#getting-started)

## Prerequisites
- Docker
- Redis (optional)
- postgres (optional)

## Getting started

On windows
```sh
# first run
docker compose -f docker-compose-full.yml up --build

# after first run
docker compose -f docker-compose-full.yml up
```


On Linux
```bash
# first run
docker-compose -f docker-compose-full.yml up --build

# after first run
docker-compose -f docker-compose-full.yml up
```

### Note
*If you already have Redis and postgres, you can run `docker compose up` directly.
