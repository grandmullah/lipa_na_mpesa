
const { getOAuthToken } = require("./deposit")
const axios = require('axios')
const  { publicEncrypt, constants }  = require( "crypto")
const { resolve } =  require("path")
const { readFileSync } =  require("fs")





async function Withdrawal () {
 
     const consumer_key_b2c = process.env.consumer_key_b2c
     const consumer_secret_b2c = process.env.consumer_secret_b2c
     console.log('here',consumer_key_b2c)
     const auth =  await getOAuthToken(consumer_key_b2c,consumer_secret_b2c)
     console.log(auth)
     const data = readFileSync(resolve('/Users/Biegon/Desktop/pro/payment/ProductionCertificate.cer'));
     const privateKey = String(data);
     var security =   encryptStringWithRsaPublicKey('mm+ReAz4#1',privateKey)
    
     console.log(security)
      let re = await withdraw(auth,security,'10','254724341383')
      return re.data
 
}


async function withdraw(token,security,amount,phoneNumber ) {


try{
    // console.log('hapa',security)
    auth = "Bearer " + token ;
    // send the request
    response = await axios.default.post('https://api.safaricom.co.ke/mpesa/b2c/v1/paymentrequest',{
    "InitiatorName": "webapibulk",// `${process.env.InitiatorName}`,
    "SecurityCredential": `${security}`,
    "CommandID": "BusinessPayment",
    "Amount": amount,
    "PartyA": '3030019', // process.env.B2cCode,
    "PartyB": phoneNumber,
    "Remarks": "remarks",
    "QueueTimeOutURL": `https://e2f3-196-98-182-53.ngrok.io/api/timeout`,
    "ResultURL": `https://e2f3-196-98-182-53.ngrok.io/api/cb`,
    "Occasion": "remarks"
    },{
        headers:{
            "Authorization":auth
        }
    })


    return response

}catch(error) {
    console.log(error)
    // in case of an error, get the code and the message.
    // let err_code = error.response.status;
    let err_msg = error
    // send to the client
    return {
        message:err_msg,
        data :{}
    }

    //res.status(err_code).send(
}


}


const encryptStringWithRsaPublicKey = function(toEncrypt, publicKey) {
    var buffer = Buffer.from(toEncrypt,'utf8');
    var encrypted = publicEncrypt({key:publicKey, padding: constants.RSA_PKCS1_PADDING}, buffer);
    return encrypted.toString("base64");
  };




  module.exports ={
      Withdrawal
  }