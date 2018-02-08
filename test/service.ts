import { Path, GET, POST, DELETE, PUT, PathParam, QueryParam, FormParam, CookieParam, HeaderParam, Request, Response } from '../src/main'

function testMiddleware1(req, res, next) {
    req.body.test1 = "test1"
    next();
}

function testMiddleware2(req, res, next) {
    req.body.test2 = "test2"
    next();
}

@Path('/user', [testMiddleware1])
export class TestService {

    @GET('/:id', [testMiddleware2])
    list( @PathParam('id') id: string, @QueryParam('name') name: string, @Request req) {
        return [id, name, req.body.test1, req.body.test2]
    }

    @DELETE('/:id')
    delete( @PathParam('id') id) {
        return id;
    }

    @POST('')
    create( @FormParam('user') user, @Request req) {
        return user;
    }

    @PUT('')
    update( @FormParam('user') user) {
        return user;
    }

    @GET('/test/resundefined')
    resUndefined( @Response res) {
        res.send('custom response');
    }

    @GET('/test/cookie')
    testCookie( @CookieParam('name') cookieName, @CookieParam('xx') p2) {

        return Promise.resolve([cookieName, p2]);
    }

    @GET('/test/header')
    testHeader( @HeaderParam('Cookie') cookieName, @HeaderParam('User-Agent') p2) {

        return Promise.resolve([cookieName, p2]);
    }
}   
