require('dotenv').config()
require('express-async-errors')


const express = require('express')
const app = express()

const connectDB = require('./db/connect')

const fileUpload = require('express-fileupload')

const authRouter = require('./routes/authRoutes')
const userRouter = require('./routes/userRoutes')
const productRouter = require('./routes/productRoutes')
const reviewRouter = require('./routes/reviewRoutes')
const orderRouter = require('./routes/orderRoutes')

const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize')


const morgan = require('morgan')
const cookieParser = require('cookie-parser')

const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

app.set('trust proxy', 1);
app.use(
    rateLimiter({
        windowMs: 15 * 60 * 1000,
        max: 60,
    })
)
app.use(helmet())
app.use(xss())
app.use(mongoSanitize())
app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))

app.use(express.static('./public'))
app.use(fileUpload())
const corsOptions = {
    origin: 'https://ecommerce-node-6onb.onrender.com',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true
}
app.use(cors(corsOptions))



app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/products', productRouter)
app.use('/api/v1/reviews', reviewRouter)
app.use('/api/v1/orders', orderRouter)


app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 4200

const start = async () => {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => console.log(`Server is listening on port ${port}`))
}


start()