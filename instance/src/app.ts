import express, { Application } from 'express'
import mongoose from 'mongoose'
import morgan from 'morgan'
import compression from 'compression'
import 'module-alias/register'
import ErrorMiddleware from '@/middlewares/error.middleware'
import IController from '@/interfaces/IController'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import process from 'process'
import ExpressMongoSanitize from 'express-mongo-sanitize'
import corsOption from '@/configs/corsOption'

class App {
    private express: Application
    private port: number

    constructor(controllers: IController[], port: number){
        this.express = express()
        this.port = port

        this.initializeMiddlewares()
        this.initializeControllers(controllers)
        this.initializeErrorHandling()
    }

    private initializeMiddlewares():void {
        this.express.use(helmet())
        this.express.use(corsOption)
        this.express.use(morgan('dev'))
        this.express.use(express.json())
        this.express.use(express.urlencoded({ extended: false }))
        this.express.use(compression())
        this.express.use(ExpressMongoSanitize())
        this.express.use(cookieParser())
    }

    private initializeControllers(controllers: IController[]): void {
        controllers.forEach((controller) => {
            this.express.use('/', controller.router)
        })
    }

    private initializeErrorHandling(): void {
        this.express.use(ErrorMiddleware)
    }
    /**
     * Creates connection with database and starts running the backend server
     */
    public async startServer(): Promise<void> {
        const { MONGODB_URI_CLOUD } = process.env

        mongoose.set('strictQuery', false)
        await mongoose.connect(`${MONGODB_URI_CLOUD}`)
        .then(() => {
            this.express.listen(this.port, () => {
                process.env.NODE_ENV == 'development' ?  console.log(`Server running at ${this.port}`) : ''
            })

            process.env.NODE_ENV == 'development' ?  console.log('DB connected.') : ''
        })
        .catch((error) => {
            process.env.NODE_ENV == 'development' ? console.log(`Error connecting to database /n ${error}`) : ''
            throw new Error(error)
        })
    }
}

export default App