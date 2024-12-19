# User Service

This project is a Docker-based application that includes both a backend and a frontend service. The backend is built with NestJS, and the frontend is built with React.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Building Docker Images](#building-docker-images)
- [Running the Application](#running-the-application)
- [Accessing the Application](#accessing-the-application)
- [Stopping the Application](#stopping-the-application)
- [Folder Structure](#folder-structure)

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Installation

**Clone the repository:**

```bash
git clone https://github.com/your-username/user_service.git
cd user_service
```

## Building Docker Images

```bash
docker-compose build
```

## Running the Application

```bash
docker-compose up
```

## Accessing the Application

- Frontend (React app): http://localhost:8080
- Backend (NestJS API): http://localhost:3000

## Stopping the Application

```bash
docker-compose down
```

## Folder Structure

```bash
user_service/
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── src/
│   └── ...
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── public/
│   ├── src/
│   └── ...
├── docker-compose.yml
└── README.md
```


