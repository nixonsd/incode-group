# incode-group
The application was produced due to testing purposes. The application can be spread under the MIT license. The application is a simple implementation in Node.js (using the Nest.js framework) of a simple web application with authorization and authentication.

## Requirements
- PostgreSQL Running
- Node.js and npm

## Clone repository
Use the command to clone this repository to your computer:
``` bash
$ git clone https://github.com/nixonsd/incode-group.git
```

If you want to clone it into the existing folder use:
```bash
$ cd ./desired-folder
$ git clone https://github.com/nixonsd/incode-group.git .
```

## Installation
Create the environmental file `.env` (or use the system environment on its own) and fill this file as shown in the `.env.example` file that you have in your repository.

### Example
```bash
# !!! > Do not use these variables on production! These variables are exposed!

### Example
# Set level of application
NODE_ENV=production

# App
APP_VERSION=0.0.1
APP_PORT=3000

# Init
INIT_ADMIN_NAME=Boris
INIT_ADMIN_SURNAME=Johnson
INIT_ADMIN_EMAIL=testemail@gmail.com
INIT_ADMIN_PASSWORD="KGhqXE'U6=eJ)8k9"

# PostgreSQL
POSTGRE_HOST=localhost
POSTGRE_PORT=5432
POSTGRE_USER=postgres
POSTGRE_PASS=12345678
POSTGRE_DATABASE=test

# Auth
JWT_ACCESS_SECRET=aAjXpuQ6f6Gne4Hy5BuU1VFWhTSV3iumdnjPJR60nDIejHh6CLIXK4rYRzB2DPuAB+o55EEFCiqNLTuLRWpVfpkP0wOZK7GiHUtO4r36PNIH4L2PDO5iBwHLYe921nwKtptDO5m1isUvY15RfRolkWWGbuqe87cVVRZT76vlhcfxSB5a85TM61BYvBtrs9rUbFnsfnYLaQJZ3arYJV7a6sPSs1E+InD2H+tk4dUrg675t+0b6IlyDT+6Ll0CovzDjnupuG60Ku9XKu7xIjNlrXCPxX6uXow/q3eICfY8aMwNSwqzej6VblVvwQGTrdWxjj1VEOEEd0+8Z2zpqdgdwQ==
JWT_REFRESH_SECRET=4t/RQuzs8ohBDcNgk9WHLgICyCDXxLd6hVgw1R7alxB7NRHq45CgpieA4nHF6ENXEBp6uP1tFtwQiFD7FY0mloMpkNBxk4vL/1ng5qTUuycuAH34c7v6sI3IwfLobOR3x1IaKHa9sQRDw/7LqTSUfSn3wdhED+7TF5jcrKidBP6U6MloyAheOBQmCVap9VuHEuzUM0OBTt+3nFKQw28hC4L3QyOFIS6TMqvipc0nGjHRs4qZdZ/WfXSOhXNKg0KGcTWnGx7ygkKbziSd4NKe8i2M8Z/wLeM9nI9NfpwhLbyariOUEJZXwPB+cbZ1GUEtr/vBN9XtGBfj8E4c5KcGIw==
```

Before usage, you must install all required dependencies with the command below:
```bash
$ npm install
```
To create the database entity and initial user (check `INIT_ADMIN_*` `.env` variables), run:
```bash
$ npm run start:init:db
```
You have all the prerequisites installed. 

## Documentation
The documentation is provided using [Swagger](https://swagger.io/), reach it by running your application by accessing the endpoint (by GET request):
```
http://localhost:3000/swagger-api
```

## Running the app

```bash
# watch mode
$ npm run start:dev

# development
$ npm run start

# production mode
$ npm run start:prod
```

## License
Use the code base on your own needs without any limitations. The application is distributed under MIT License.
