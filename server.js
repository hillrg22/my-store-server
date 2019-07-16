const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const PORT = process.env.PORT || 4000
const app = express()


// Middleware
app.use(cors())
// morgan provides logging info to console
app.use(morgan('dev'))


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
