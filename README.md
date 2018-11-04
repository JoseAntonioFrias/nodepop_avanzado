# Nodepop

## Application of sale of second-hand items.

** Practice Backend Advanced for KeepCoding WEB DEVELOPMENT BOOTCAMP **

## Previous requirements

```
* Node v8.11.3  ( node -v )
* install npm 5.6.0  ( npm -v )
* Git repo
* MongoDB 4.0.  
```

## Install

```shell
    git clone https://github.com/...
    cd nodepop_avanzado or mkdir nodepop_avanzado, if folder does not exist
    npm install
```
Copy .env.example to .env and review the values.


## Database

To initialize the database use:

```shell
npm run install_db
```

## Run

To start the application in production use:

```shell
npm start
```


## Development

To run the application in development use:

```shell
npm run dev
```

## Microservice

To run the microservice:

```shell
npm run microservice
```

## Test

To run the tests:

```shell
npm test
```


## Eslint

To run ESLint:

```shell
npm run eslint
```




# API REST Authenticate ( JWT Autenticación )

### Create JWT jasonwebtoken [POST]
+ Request
    + Headers
        
            Accept: application/json

     + Attributes: (Object).
        + email: String,
        + password: String,
       
+ Response 200
    
    + Headers
            
            Accept: application/json




# API REST Ads ( Anuncios )

API to manage ads.

## Ads [/]
Resource representing collection of ads

+ Attributes (object)
    + anuncios (array[Anuncio])

### Get ads [GET]
+ Request
    
    + Headers
        
            Accept: application/json

    + parameters: for filters, pagination and order. No required.

        + Filters  
            + tag
            + nombre
            + venta
            + precio   

        + pagination  
            + skip 
            + limit 

        + order       
            + sort            

+ Response 200 (application/json;charset=UTF-8) 
    

### Create ad [POST]
+ Request
    + Headers
        
            Accept: application/json

     + Attributes: (Object).
        + nombre: String,
        + venta: Boolean,
        + precio: Number,
        + foto: String,
        + tags: [String]

+ Response 200
    
    + Headers
            
            Accept: application/json


## Ad [/tags]
Resource representing a collection of existing tags.

+ Request
    
    + Headers
        
            Accept: application/json

    + Parameters
        + tags : Database field to make distinct clausule


+ Response 200 (application/json;charset=UTF-8) 

    + Attributes (object)
        + tags (array[tags])

