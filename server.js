require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const jwt = require('express-jwt')
const jwksRsa = require('jwks-rsa')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)


const PORT = process.env.PORT || 4000
const app = express()

// Set up Auth0 configuration
const authConfig = {
  domain: 'dev-0sd3i2ce.auth0.com',
  audience: 'http://localhost:4000'
}

// Define middleware that validates incoming bearer tokens
// using JWKS from dev-0sd3i2ce.auth0.com
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`
  }),

  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithm: ['RS256']
})


// Middleware

app.use(cors())
// morgan provides logging info to console
app.use(morgan('dev'))
app.use(express.json())


// Sequelize Models
const db = require('./models')
const Category = db.Category
const Product = db.Product


// Router files


// Routes
// eslint-disable-next-line
app.get('/api/test', (req, res, next)=> {
  res.json({
    message: 'Route working'
  })

  // const error = new Error('it blew up')
  // next(error)
})

app.get('/api/categories', (req, res, next)=> {
  Category.findAll()
    .then(categories => {
      res.json({
        categories
      })
    })
    .catch(error => {
      next(error)
    })
})

app.get('/api/products', (req, res, next) =>{
  Product.findAll({
    include: [{ model: Category}]
  })
    .then(products => {
      res.json({
        products
      })
    })
    .catch(error => {
      next(error)
    })
})

app.get('/api/products/:id', (req, res, next) => {
  const id = req.params.id

  Product.findByPk(id, {
    include: [{ model: Category }]
  })
    .then(product => {
      res.json({ product })
    })
    .catch(error => {
      console.log(error)
    })
})

app.post('/api/checkout', async (req, res, next) => {
  // Create the session
  const lineItem = req.body
  const lineItems = [lineItem]

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel'
    })
    // Send session to client
    res.json({ session })
  }
  catch (error) {
    next(error)
  }
})

// Test endpoint that must be called with an access token
app.get('/api/external', checkJwt, (req, res) => {
  res.json({
    msg: 'Your Access Token was successfully validated!'
  })
})


// Error handling

app.use(notFound)
app.use(errorHandler)

// eslint-disable-next-line
function notFound(req, res, next) {
  res.status(404).send({error: 'Not found!', status: 404, url: req.originalUrl})
}

// eslint-disable-next-line
function errorHandler(err, req, res, next) {
  console.error('ERROR', err)
  const stack =  process.env.NODE_ENV !== 'production' ? err.stack : undefined
  res.status(500).send({error: err.message, stack, url: req.originalUrl})
}




app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`)
})
