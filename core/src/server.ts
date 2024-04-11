import 'dotenv/config'
import 'module-alias/register'
import * as yaml from 'js-yaml'
import fs from 'fs';
import App from './app'

// import controller
import AuthController from './resources/auth/auth.controller'
import UserController from './resources/user/user.controller'
import ProjectController from './resources/project/project.controller';
import BucketController from './resources/bucket/controller.bucket';
import logger from './utils/logger';

const app = new App([new AuthController(), new UserController(), new ProjectController(), new BucketController()], Number(process.env.PORT) || 4002)

//Connect to DB and run server
app.startServer();

export default app;