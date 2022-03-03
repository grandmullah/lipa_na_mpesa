const axios = require('axios')
var moment = require('moment-timezone');
moment().tz("Africa/Nairobi").format();
const {db} = require('./helpers/firbase')

async function stkDeposit (req) {

    let consumer_key = process.env.consumerKey
    let consumer_secret =process.env.consumer_secret
    const auth = await getOAuthToken(consumer_key,consumer_secret)
    let data = await lipaNaMpesaOnline(auth,req)
    return data


}


async function getOAuthToken(consumer_key,consumer_secret){


    let url =  'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';

    //form a buffer of the consumer key and secret
    let buffer = new Buffer.from(consumer_key+":"+consumer_secret);

    let auth = `Basic ${buffer.toString('base64')}`;

    try{

        let {data} = await axios.get(url,{
            "headers":{
                "Authorization":auth
            }
        });

        token = data['access_token'];

        return token;

    }catch(err){

        return err

    }
    
};


async function lipaNaMpesaOnline(token,req){
    
    let auth = `Bearer ${token}`;       

    //getting the timestamp
    let timestamp = moment(moment.now()).format("YYYYMMDDHHmmss");

    let url =process.env.lipa_url;
    let bs_short_code = process.env.Shortcode;
    let passkey = process.env.passkey;

    let password = new Buffer.from(`${bs_short_code}${passkey}${timestamp}`).toString('base64');
    let transaction_type = "CustomerPayBillOnline";
    let amount = req.amount; //you can enter any amount
    let partyA = req.phoneNumber; //should follow the format:2547xxxxxxxx
    let partyB = bs_short_code;
    let phoneNumber = req.phoneNumber; //should follow the format:2547xxxxxxxx
    let callBackUrl =process.env.callback_url ;
    let accountReference = "alex";
    let transaction_desc = "Test new tech";

    try {

        let data = await axios.post(url,{
            "BusinessShortCode":bs_short_code,
            "Password":password,
            "Timestamp":timestamp,
            "TransactionType":transaction_type,
            "Amount":amount,
            "PartyA":partyA,
            "PartyB":partyB,
            "PhoneNumber":phoneNumber,
            "CallBackURL":callBackUrl,
            "AccountReference":accountReference,
            "TransactionDesc":transaction_desc
        },{
            "headers":{
                "Authorization":auth
            }
        }).catch(console.log);
       console.log(data.data)
       const cityRef = db.collection('transactions').doc(data.data.CheckoutRequestID);

         await cityRef.set(data.data)
         await cityRef.update({address:req.address})
        

        return {
            success:true,
            message:data.data
        };

    }catch(err){
        console.log(err)
        return {
            success:false,
            message:err
        };

    };
};

module.exports= {
    stkDeposit,
    getOAuthToken
}