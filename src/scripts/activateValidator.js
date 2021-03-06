const config = require("../../config.json");
const {Bech32} = require("@cosmjs/encoding");
const {BroadcastMsg, HD_DERIVATION} = require("./utils.js");
const {MsgActivate} = require("../../dist/oracle/v1/tx.js");
const {DirectSecp256k1HdWallet, Registry} = require("@cosmjs/proto-signing");

async function main() {
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
        config.mnemonic,
        {
            hdPaths: [HD_DERIVATION],
            prefix: "odin"
        }
    );
    const [account] = await wallet.getAccounts();

    const typeUrlMsgActivate = "/oracle.v1.MsgActivate";

    const msg = {
        validator: Bech32.encode('odinvaloper', Bech32.decode(account.address).data),
    };

    const registry = new Registry();
    registry.register(typeUrlMsgActivate, MsgActivate);

    let msgAny = {
        typeUrl: typeUrlMsgActivate,
        value: msg,
    };

    await BroadcastMsg(wallet, registry, msgAny);
}

main();
