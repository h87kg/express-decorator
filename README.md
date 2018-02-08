## Express decorator
a light-weight module to build TypeScript application with Express decorators


## Install
```
npm install express-decorator
```

## Features
- Use `@Path` to register express route for class.
- Use `@GET/@DELETE/@POST/@PUT` to register sub-route path for a method,
- Inject request parameters from `@PathParam/@QueryParam/@FormParam/CookieParam/HeaderParam`
- Inject Request,Response From express request.
- Support inject midware.

## Quick Start

Create firsr restfult service.
```javascript
@Path('/user', [ testMiddleware2 ])
export class UserService {

    @GET('/:id', [ testMiddleware1 ])
    list( @PathParam('id') id: string, @QueryParam('name') name: string) {
        return [id, name]
    }

    @DELETE('/:id')
    delete( @PathParam('id') id) {
        return [id];
    }

    @POST('')
    create( @FormParam('user') user) {
        return user;
    }

    @PUT('')
    update( @FormParam('user') user, @Response response, @Request request) {
        ...
        return user;
    }

    @GET('/test/cookie')
    testCookie( @CookieParam('name') p1, @CookieParam('xx') p2) {

        return Promise.resolve([p1, p2]);
    }

    @GET('/test/header')
    testHeader( @HeaderParam('Cookie') p1, @HeaderParam('User-Agent') p2) {

        return Promise.resolve([p1, p2]);
    }
} 

// midware
function testMiddleware1(req, res, next) {
    req.body.test1 = "test1"
    next();
}

function testMiddleware2(req, res, next) {
    req.body.test2 = "test2"
    next();
}
```

Register your service class
```javascript
var app = express();

app.get('/', function (req, res) {
    res.send('Hello World!');
});

RegisterService(app, [UserService]);

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
})

```

## API
- `Path(baseUrl: string, middlewares?:Funtion[])`
- `GET(subUrl: string, middlewares?:Funtion[])`
- `DELETE(subUrl: string, middlewares?:Funtion[])`
- `POST(subUrl: string, middlewares?:Funtion[])`
- `DELETE(subUrl: string, middlewares?:Funtion[])`
- `PathParam(paramName: string)`
- `QueryParam(paramName: string)`
- `FormParam(paramName: string)`
- `CookieParam(paramName: string)`
- `HeaderParam(paramName: string)`
- `Request`
- `Response`
- `RegisterService(expressInstance, services:any[])`
