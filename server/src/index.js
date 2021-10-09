const express = require('express')
const helmet = require('helmet')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
require('dotenv').config()
require('./Database')

const corsOptions = {
    credentials: true,
    origin: 'http://localhost:3000',
    methods: 'GET,PUT,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 200
}

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors(corsOptions))
app.use(helmet.contentSecurityPolicy())
app.use(helmet.dnsPrefetchControl())
app.use(helmet.expectCt())
app.use(helmet.frameguard())
app.use(helmet.hidePoweredBy())
app.use(helmet.hsts())
app.use(helmet.ieNoOpen())
app.use(helmet.noSniff())
app.use(helmet.permittedCrossDomainPolicies())
app.use(helmet.referrerPolicy())
app.use((req, res, next) => {
    res.setHeader('X-XSS-Protection', '1; mode=block')
    next()
})
app.use(morgan('tiny'))

app.use('/api/auth', require('./Routes/Auth'))
app.use('/api/user', require('./Routes/User'))
app.use('/api/form', require('./Routes/Form'))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`The server has started on port: ${PORT}`)
})
