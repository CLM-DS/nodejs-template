# Nodejs Template Rest Api

NodeJS Template with CLM dev standards.

## Folder Struct

### app
### docs
### test


### Validations 

The implementation of validations, the useValidation function is used on the endpoint in the controller, sent the element to validate, that is, header or body.

Example

``` js
    router.get('/status/healthy',
        useValidation([{
            property: 'body',
            scheme,
        }], handlerFuntion)
    );
```

