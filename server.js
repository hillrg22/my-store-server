const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const PORT = process.env.PORT || 4000
const app = express()












app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`)
})
