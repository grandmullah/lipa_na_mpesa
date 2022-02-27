
const { getOAuthToken } = require("./deposit")
const axios = require('axios')
const  { publicEncrypt, constants }  = require( "crypto")
const { resolve } =  require("path")
const { readFileSync } =  require("fs")


const {db} = require('./helpers/firbase')



async function Withdrawal (req) {
 
    const consumer_key_b2c = process.env.consumer_key_b2c
    const consumer_secret_b2c = process.env.consumer_secret_b2c
    console.log('here',consumer_key_b2c)
    const auth =  await getOAuthToken(consumer_key_b2c,consumer_secret_b2c)
    console.log(auth)
    const data = readFileSync(resolve(process.env.path));
    const privateKey = String(data);
    var security =   encryptStringWithRsaPublicKey(process.env.password,privateKey)

    console.log(security)
    let re = await withdraw(auth,security,req.amount,req.phoneNumber)
    return re
 
}


async function withdraw(token,security,amount,phoneNumber ) {


try{
    // console.log('hapa',security)
    auth = "Bearer " + token ;
    // send the request

    response = await axios.default.post('https://api.safaricom.co.ke/mpesa/b2c/v1/paymentrequest',{
    "InitiatorName":  `${process.env.InitiatorName}`,
    "SecurityCredential": `${security}`,
    "CommandID": "BusinessPayment",
    "Amount": amount,
    "PartyA":`${process.env.b2cCode}`,
    "PartyB": phoneNumber,
    "Remarks": "remarks",
    "QueueTimeOutURL": `${process.env.b2c_timeout}`,
    "ResultURL": `${process.env.b2c_callback}`,
    "Occasion": "remarks"
    },{
        headers:{
            "Authorization":auth
        }
    })

    console.log(response.data)
    const cityRef = db.collection('withdrawals').doc(response.data.ConversationID);

      await cityRef.set(response.data)
    //   await cityRef.update({address:req.address})
    return {
        success:true,
        message:response.data
    };

}catch(err){
    console.log(err)
    return {
        success:false,
        message:err
    };

};
    //res.status(err_code).send(
}





const encryptStringWithRsaPublicKey = function(toEncrypt, publicKey) {
    var buffer = Buffer.from(toEncrypt,'utf8');
    var encrypted = publicEncrypt({key:publicKey, padding: constants.RSA_PKCS1_PADDING}, buffer);
    return encrypted.toString("base64");
  };




  module.exports ={
      Withdrawal
  }