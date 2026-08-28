import { Connection } from "@solana/web3.js";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { keypairIdentity, createSignerFromKeypair } from "@metaplex-foundation/umi";
import fs from "fs";

// --- LOAD WALLET SECRET KEY ---
const secret = JSON.parse(fs.readFileSync("id.json", "utf8"));
const secretKey = new Uint8Array(secret);

// --- CONNECTION MIT EXPLIZITEM WS-ENDPOINT ---
const connection = new Connection(
    "https://rpc.shyft.to/solana/mainnet?api_key=JrLUALKtWcq0ucmW",
    {
        commitment: "confirmed",
        wsEndpoint: "wss://rpc.shyft.to/solana/mainnet?api_key=JrLUALKtWcq0ucmW",
    }
);

// --- INIT UMI ---
const umi = createUmi(connection);

// --- CREATE UMI KEYPAIR ---
const umiKeypair = umi.eddsa.createKeypairFromSecretKey(secretKey);

// --- WRAP INTO FULL SIGNER ---
const signer = createSignerFromKeypair(umi, umiKeypair);

// --- SET IDENTITY + PAYER + UPLOADER PLUGIN ---
umi.use(keypairIdentity(signer));
umi.use(irysUploader());
umi.payer = signer;

(async () => {
    const metadata = {
        name: "Grey Cat NFT",
        symbol: "GCNFT",
        description: "A cute grey cat NFT",
        image: "https://gateway.irys.xyz/FPPjaZ828MGUYFn6MVMcDJjZRaChG4A2A8rxNoKvbpU",
        attributes: [{ trait_type: "Mood", value: "Normal" }],
    };

    const uri = await umi.uploader.uploadJson(metadata);
    console.log("Metadata URI:", uri);
})();