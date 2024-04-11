import 'dotenv/config'
import 'module-alias/register'
import * as yaml from 'js-yaml'
import fs from 'fs';
import App from './app'

// import controller
import AuthController from './resources/auth/auth.controller'
import UserController from './resources/user/user.controller'
import CustomController from './resources/custom/custom.controller'
import BucketController from './resources/bucket/controller.bucket';
import logger from './utils/logger';

if (!fs.existsSync('./backly.yaml')) throw new Error("Unable to run server instance. No project configuration file found.")

const parsedSchema: any = yaml.load(fs.readFileSync('./backly.yaml', 'utf8'));

const app = new App([new AuthController, new UserController, new CustomController, new BucketController], Number(process.env.PORT) || 4001)

//Connect to DB and run server
app.startServer();

export default parsedSchema;





