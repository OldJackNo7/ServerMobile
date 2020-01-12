import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from "koa-bodyparser";
import {timingLogger, exceptionHandler, jwtConfig} from './utils';
import {router as noteRouter} from './note';
import {router as authRouter} from './auth';
import {router as catRouter} from './cats';
import jwt from 'koa-jwt';
import cors from '@koa/cors';

const app = new Koa();

app.use(cors());
app.use(timingLogger);
app.use(exceptionHandler);
app.use(bodyParser());

const prefix = '/api';

// public
const publicApiRouter = new Router({prefix});
publicApiRouter.use('/auth', authRouter.routes());
app.use(publicApiRouter.routes()).use(publicApiRouter.allowedMethods());

app.use(jwt(jwtConfig));

// protected
const protectedApiRouter = new Router({prefix});
protectedApiRouter.use('/item', noteRouter.routes()).use('/cat', catRouter.routes());
app.use(protectedApiRouter.routes()).use(protectedApiRouter.allowedMethods());

if (!module.parent) {
    app.listen(80);
    console.log('started on port 80');
}
