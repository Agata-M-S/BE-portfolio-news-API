# Northcoders News API



Welcome to my back end portfolio project. 
As part of an intensive 13-weeks Nortcoders Bootcamp I have been tasked with building an API for the purpose of accessing application data.

You can find the hosted version here : https://portfolio-news-api.onrender.com/api

To run my code locally you will need to clone this repo then create two environment variables in the root directory as follows:

.env.test
```
PGDATABASE=nc_news_test
```  
.env.development
```
PGDATABASE=nc_news
```
You will need at least Node -v 21.1.0 and PG version 8.7.3

To install dependencies and setup the database run the following commands in the terminal

```
npm install 
npm run setup-db
```

To seed local development database run the command
```
npm run seed
```

Command for running tests
```
npm test
```

There is no need to manually seed the test environment as the test suite is set up to reseed it before each test.