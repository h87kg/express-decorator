import * as express from "express";
import { Router } from "express";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import { Param, getClazz } from './decorator'

/**
 * Extract parameters from request.
 */
function extractParameters(req, res, params: Param[]) {
    let args = [];
    if (!params) return;

    let paramHandlerTpe = {
        'query': (paramName: string) => req.query[paramName],
        'path': (paramName: string) => req.params[paramName],
        'form': (paramName: string) => req.body[paramName],
        'cookie': (paramName: string) => req.cookies && req.cookies[paramName],
        'header': (paramName) => req.get(paramName),
        'request': () => req,
        'response': () => res,
    }

    params.forEach(param => {
        args.push(paramHandlerTpe[param.type](param.name))
    })

    return args;
}

/**
 * Register Service Class.
 * 
 * ```
 * RegisterService(express, [services])
 * ```
 */
export function RegisterService(app, serviceClazzes: any[]) {
   
    let router = Router();

    serviceClazzes.forEach(ServiceClazz => {
        let meta = getClazz(ServiceClazz.prototype);
        let serviceInstance = new ServiceClazz();
        let routes = meta.routes;

        for (const methodName in routes) {
            let methodMeta = routes[methodName];
            let httpMethod = methodMeta.httpMethod;
            let middlewares = methodMeta.middlewares;

            // express router callback
            let fn = (req, res, next) => {
                let params = extractParameters(req, res, methodMeta['params']);
                let result = ServiceClazz.prototype[methodName].apply(serviceInstance, params);

                if (result instanceof Promise) {
                    result.then(value => {
                        !res.headersSent && res.send(value);
                    }).catch(err => {
                        next(err);
                    });
                } else if (result !== undefined) {
                    !res.headersSent && res.send(result);
                }
            };

            // register sub route
            let params: any[] = [methodMeta.subUrl];
            middlewares && (params = params.concat(middlewares));
            params.push(fn);
            router[httpMethod].apply(router, params);
        }

        // register base router.
        let params: any[] = [meta.baseUrl, bodyParser.json(), cookieParser()];
        meta.middlewares && (params = params.concat(meta.middlewares));
        params.push(router);
        app.use.apply(app, params);
    })
}