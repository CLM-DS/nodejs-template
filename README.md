# Nodejs Template Rest Api

NodeJS Template with CLM dev standards.

## Folder Struct

### app

All files and directories, which are responsible for implementing the business logic and the implementation of a rest api

#### config

The config folder contains all the information on the variables and values ​​used to connect to the different services of the application and its environment values.

#### constants

The constans folder contains all the static values ​​that do not vary within the application, so that it can be used in all implementations in this handling a unified language

#### controllers

The controllers folder contains all the declarations of the handlers responsible for handling the requests made in this section, it indicates the validations that are applied to the request and with which scheme these validations are performed.

#### listeners

This folder contains the initialization of the event brokers, as well as the definition of the listeners of the events that are published.

#### migrations

This folder contains all the scripts that perform data updates within the database or necessary initial loads of these

#### routes

This folder contains all the definitions of the routes and the access methods to these, be GET, POST, PUT, DELETE, PATCH and the controllers responsible for handling requests

#### schemas

This folder contains all the input data validation schemas

#### server

this folder contains all implementation of a koa server and the basic middleware of this

#### services

This folder contains all the implementation of the business logic and that is delegated by the event listeners and the http request controllers


## Middleware

For resources or instances of objects used within the entire scope of the application, a middleware must be created, which injects these into the controllers so that it is transmitted to the context in each request.

Example from middleware

``` js
    /**
     * Added resource to context
     * @returns {(ctx: import('.').ContextStd, next: import('koa').Next) => import('koa')}
     */
    const resourceMiddleware = (resource) => async (ctx, next) => {
    ctx.resource = resource;
    await next();
    return ctx;
    };

    module.exports = resourceMiddleware;
```

Added middleware to app

``` js
const useMiddleware = (args = {}) => {
    app.use(monitorMiddleware());
};
```

### test

Las pruebas unitarias deben realizarse dentro de la carpeta test/unit, cualquier mock que usen estas que sea comun para otras pruebas unitarias como el context deben ubicarse en el directorio test/mock

### Configuration

All the configuration variables regardless of the origin must be loaded in the config, located in the config directory in the index.js file, since these will be loaded at startup and will allow their use in the rest of the application.


### Database 

The use of the mongo db, is already configured, you only need to configure the values ​​of string connection and datasource

Example

``` js
const handlerRequest = async (ctx) => {
    const query = { dummy: '1' };
    const res = await ctx.db.findOne(query)
    ctx.body = res;
}
```

For more information about using the db, check the documentation inside the **app/utils/wrapperDB** file


### Log

The pine log is already configured by default, it is injected into the context through middleware

``` js
const handlerRequest = (ctx) => {
    ctx.log.info('this dummy log');
}
```

### Broker

The valid broker types to implement are the following: **pubsub**, **kafka** and **servicebus**

#### Configuration

The broker configuration must be loaded in the configuration key called "brokerConfig", this is recommended to be a value key where each key will be, the configuration of a specific broker.

Example

``` js
    const loadConfig = (secrets) => ({
    brokerConfig: {
        "pubsub-1": {
            type: 'pubsub'
        },
        "kafka-1": {
            type: 'kafka',
            kafkaOption: {
                brokers: [],
                clientId: ""
            }
        },
        "servicebus-1": {
            type: 'servicebus',
            serviceBusStrCnn: "service bus string connection"
        }
    }
  }),
```

For more information about kafka configuration, [textvisit this link](https://kafka.js.org/docs/configuration)

To access the settings you must take the context and access the **config** key

``` js
    const value = ctx.config.KEY_VALUE_CONFIG;
```


### Validations 

The implementation of validations, the useValidation function is used on the endpoint in the controller, sent the element to validate, that is, header or body.

Example

``` js
    router.get('/status/healthy',
        useValidation([{
            property: 'body',
            scheme,
        }, {
            property: 'header',
            schemeHeader,

        }], handlerFuntion)
    );
```

