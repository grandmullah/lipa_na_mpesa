const ethers = require('ethers')
const {db} = require('./helpers/firbase')
const {abi }= require('./helpers/abi')






async function confirmation(data) {

    const cityRef = db.collection('transactions').doc(data.CheckoutRequestID);

    const resp = await cityRef.update(data)
    const ge =(await cityRef.get()).data()

    let addr = await ge.address
    console.log(typeof ge.TxHash)
    

    if (data.ResultCode === 0 && typeof ge.TxHash === 'undefined'){
        await cityRef.set({TxHash:`receipt.transactionHash`})
        console.log("here",data.CallbackMetadata.Item[0].Value)
        const amount =  ethers.utils.parseEther(`${data.CallbackMetadata.Item[0].Value}`)
        let receipt = await web3(addr,amount)
        console.log(receipt.transactionHash)
        await cityRef.update({TxHash:`${receipt.transactionHash}`})

    }

    
}

async function web3 (addr,amount) {
    try {
        const Provider = new ethers.providers.InfuraProvider.getWebSocketProvider('ropsten')
        const Wallet = new ethers.Wallet(process.env.key,Provider)
        const usdContract  = new ethers.Contract('0x8029fAE2dC8C491D7496b1Fb78fB365C4eE90A55',abi,Wallet)
        let tx = await  usdContract.mint(addr,amount,{ gasLimit: 1000000})
        console.log(tx)
        return await tx.wait()
    } catch (error) {
        console.log(error)
    }

}

async function burn (addr,amount) {
    try {
        const Provider = new ethers.providers.InfuraProvider.getWebSocketProvider('ropsten')
        const Wallet = new ethers.Wallet(process.env.key,Provider)
        const usdContract  = new ethers.Contract('0x8029fAE2dC8C491D7496b1Fb78fB365C4eE90A55',abi,Wallet)
        let tx = await  usdContract.burnFrom(addr,amount,{ gasLimit: 1000000})
        console.log(tx)
        return await tx.wait()
    } catch (error) {
        console.log(error)
    }

}

async function B2c_confirmation(data) {

    const cityRef = db.collection('withdrawals').doc(data.ConversationID);

    const resp = await cityRef.update(data)
    const ge =(await cityRef.get()).data()

    let addr = await ge.address
    console.log(typeof ge.TxHash)
    

    if (data.ResultCode === 0 && typeof ge.TxHash === 'undefined'){
        await cityRef.update({TxHash:`receipt.transactionHash`})
        console.log("here",data.ResultParameters.ResultParameter[0].Value)
        const amount =  ethers.utils.parseEther(`${data.ResultParameters.ResultParameter[0].Value}`)
        let receipt =  await burn(addr,amount)
       
        console.log(receipt.transactionHash)
      let cx =   await cityRef.update({TxHash:`${receipt.transactionHash}`})
      console.log(cx)

    }

    return true
}





module.exports = {
    confirmation,
    B2c_confirmation
}