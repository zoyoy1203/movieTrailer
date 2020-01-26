
const Router = require('koa-router');
const { resolve } = require('path');
const _ = require('lodash');
const glob = require('glob');

const symbolPrefix = Symbol('prefix');
const routerMap = new Map();

const isArray = c => _.isArray(c) ? c : [c];
export class Route {
    constructor (app, apiPath) {
        this.app = app;
        this.apiPath = apiPath;
        this.router = new Router();
    }

    init () {
        glob.sync(resolve(this.apiPath, '**/*.js')).forEach(require);
        // 处理所有路由中匹配到的所有路由子项
        for (let [conf, controller] of routerMap) {
            const controllers = isArray(controller);
            const prefixPath = conf.target[symbolPrefix];
            if ( prefixPath) prefixPath = normalizePath(prefixPath);
            const routerPath = prefixPath + conf.path;
            this.router[conf.method](routerPath, ...controllers)
        }
        this.app.use(this.router.routes())
        this.app.use(this.router.allowedMethods())
    }
}

const normalizePath = path => path.startsWith('/') ? path : `/${path}`

const router = conf => (target, key, descriptor) => {
    conf.path = normalizePath(conf.path)
    routerMap.set({
        target: target,
        ...conf
    }, target[key])
    
}

export const Controller = path => target => (target.prototype[symbolPrefix] = path)

export const Get = path => router({
    method: 'get',
    path: path
});

export const Post = path => router({
    method: 'post',
    path: path
});

export const Put = path => router({
    method: 'put',
    path: path
});

export const Del = path => router({
    method: 'del',
    path: path
});

export const Use = path => router({
    method: 'use',
    path: path
});

export const All = path => router({
    method: 'all',
    path: path
});