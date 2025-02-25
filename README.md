# E-Commerce Backend

> The server side of Multi-language E-Commerce website similar to `dubbizzle`

## Technologies Used:

- NodeJS (ExpressJS)
- MySQL
- JWT
- Redis
- JOI for validations
- Google Translate
- ESLint and Prettier for code formatting consistency
- integrating circleCI for connection with private cloud machine to automat CI/CD process

## Run for development:
1. Make sure `redis` installed and running correctly
2. Create an .env.development file having following keys:
```sh
NODE_ENV=development
PORT=8000 # or any other port
JWT_SECRET=...
DB_HOST=...
DB_PORT=...
DB_USER=...
DB_NAME=...
DB_CONNECTION_LIMIT=...
REDIS_URL=redis://localhost:6379 # or used URL
CACHE_EXPIRE_TIME=...
# i used "api.4whats.net" for WhatsApp OTP messaging 
WA_INSTANCE_ID=...
WA_TOKEN=...
UPLOADS_DIR=/[website]/uploads/ # replace [website] with your website name
```
3. Clone and install dependencies
```sh
git clone https://github.com/tarek99samy/ecommerce-backend.git
cd ecommerce-backend
npm install
```
4. Run script
```sh
npm run start
```

## Run for production:
> Just create another .env.production file having corresponding keys and it will be ready for deployment
