



// importing the dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const { stkDeposit } = require('./controllers/deposit');
const {confirmation,B2c_confirmation } = require('./controllers/confirm');
const { Withdrawal } = require('./controllers/withdraw');
// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger.json');
require('dotenv').config()
// const { add_device } = require('./controllers/send');
// const { verify } = require('./controllers/verify');
// const { verify_app } = require('./controllers/appVerify');

// defining the Express app
const app = express();


// adding Helmet to enhance your API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
// app.use(morgan('combined'));

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// defining an endpoint 
app.post('/api/deposit', async (req, res) => {
  console.log(req.body )
  let resp = await stkDeposit(req.body)
  console.log(resp)
   if(resp){
    return res.status(200).json({
      status:"true"
    })
   }
   return res.status(400).json({
     status:"failed"
   })
});
app.post('/api/withdraw', async (req, res) => {
  console.log(req.body )
  let resp = await Withdrawal(req.body)
  console.log(resp)
   if(resp.success){
    return res.status(200).json({
      status:true
    })
   }
   return res.status(400).json({
     status:false
   })
});
app.post('/api/callback', async (req, res) => {
    console.log(req.body.Body.stkCallback )
    await confirmation(req.body.Body.stkCallback)
    // console.log(resp)
  //    if(resp){
  //     return res.status(200).json({
  //       status:"true"
  //     })
  //    }
  //    return res.status(400).json({
  //      status:"failed"
  //    })
  });

  app.post('/api/timeout', async (req, res) => {
    console.log(req.body )
    
    // console.log(resp)
  //    if(resp){
  //     return res.status(200).json({
  //       status:"true"
  //     })
  //    }
  //    return res.status(400).json({
  //      status:"failed"
  //    })
  });

  app.post('/api/cb', async (req, res) => {
    console.log(req.body)
    await B2c_confirmation(req.body.Result)
    // console.log(resp)
  //    if(resp){
  //     return res.status(200).json({
  //       status:"true"
  //     })
  //    }
  //    return res.status(400).json({
  //      status:"failed"
  //    })
  });

// starting the server
app.listen(6001, () => {
  console.log('listening on port 6001');
});