const { ApiPromise, WsProvider } = require('@polkadot/api');

async function main(){
    const provider = new WsProvider('wss://helloworld.qubitvision.io');
    const api = await ApiPromise.create({ provider });

    var args = process.argv.slice(2);

    if(args.length > 0){
        try{
            const latestNumber = (await api.rpc.chain.getBlock()).block.header.number.toNumber();
            const hash = /^[0-9]+$/.test(args[0]) ? await api.rpc.chain.getBlockHash(args[0]) : args[0];
            //const latestNumber = latestBlock.block.header.number.toNumber();
           // console.log("input " + args[0] + " latest: " + hash);

            if(/^[0-9]+$/.test(args[0])){
                if(Number(args[0]) > latestNumber){
                    console.log("Block given (" + args[0] + ") is greater then current block " + latestNumber);
                    process.exit(0);
                }
            }
            
            const blockHash = await api.rpc.chain.getBlockHash(latestNumber);
            //console.log(blockHash.toHuman());

            const header = await api.rpc.chain.getHeader(blockHash);
            console.log(" \nFrom custom substrate : wss://helloworld.qubitvision.io \n");
            console.log("Block Number     : " + header.number.toNumber());
            console.log("Block Hash       : " + header.hash.toHuman());
            console.log("Parent Hash      : " + header.parentHash.toHuman());
            console.log("Extrinsics Root  : " + header.extrinsicsRoot.toHuman());
            console.log("State Root       : " + header.stateRoot.toHuman());

            process.exit(0);
            
        }
        catch(error){
            console.error(error);
        }

    }
    else{
        console.log("Latest Block:\n");
        api.rpc.chain.subscribeNewHeads((header) =>{
        console.log("From custom substrate : wss://helloworld.qubitvision.io \n");
        console.log("Block Number   : " + header.number.toNumber());
        console.log("Block Hash     : " + header.hash.toHuman());
        console.log("Parent Hash    : " + header.parentHash.toHuman());
        console.log("Extrinsics Root: " + header.extrinsicsRoot.toHuman());
        console.log("State Root     : " + header.stateRoot.toHuman());

        process.exit(0);
    });
    }
}

main()
