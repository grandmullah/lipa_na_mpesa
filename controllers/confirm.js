const ethers = require('ethers')
const {db} = require('./helpers/firbase')
const {abi }= require('./helpers/abi')

const Provider = new ethers.providers.InfuraProvider.getWebSocketProvider('ropsten')
const Wallet = new ethers.Wallet(process.env.key,Provider)


const usdContract  = new ethers.Contract('0xC9656CcFf4Bb3A00C1115d6C6A5faDFF20Eb016d',abi,Wallet)

async function confirmation(data) {

    const cityRef = db.collection('transactions').doc(data.CheckoutRequestID);

    const resp = await cityRef.update(data)
    const ge =(await cityRef.get()).data()

    let addr = await ge.address
    console.log(typeof ge.TxHash)
    

    if (data.ResultCode === 0 && typeof ge.TxHash === 'undefined'){
        console.log("here",data.CallbackMetadata.Item[0].Value)
        const amount =  ethers.utils.parseEther(`${data.CallbackMetadata.Item[0].Value}`)
        let tx = await  usdContract.mint(addr,amount)
        let receipt = await tx.wait()
        console.log(receipt.transactionHash)
        await cityRef.set({TxHash:`${receipt.transactionHash}`})

    }

    return true
}

module.exports = {
    confirmation
}