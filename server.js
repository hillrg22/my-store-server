const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const PORT = process.env.PORT || 4000
const app = express()


// Middleware
app.use(cors())
  // morgan provides logging info to console
app.use(morgan('dev'))

// Router files


// Routes
app.get('/api/test', (req, res, next)=> {
  res.json({
    message: 'Route working'
  })
})

// Error handling









app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`)
})
