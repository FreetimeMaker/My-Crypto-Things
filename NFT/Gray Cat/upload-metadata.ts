import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { createBundlrUploader } from "@metaplex-foundation/umi-uploader-bundlr";
import { keypairIdentity, createSignerFromKeypair } from "@metaplex-foundation/umi";
import fs from "fs";

// --- LOAD WALLET SECRET KEY ---
const secret = JSON.parse(fs.readFileSync("id.json", "utf8"));
const secretKey = new Uint8Array(secret);

// --- INIT UMI ---
const umi = createUmi("https://rpc.shyft.to/solana/mainnet?api_key=JrLUALKtWcq0ucmW");

// --- CREATE UMI KEYPPAIR ---
const umiKeypair = umi.eddsa.createKeypairFromSecretKey(secretKey);

// --- WRAP INTO FULL SIGNER ---
const signer = createSignerFromKeypair(umi, umiKeypair);

// --- SET IDENTITY + PAYER ---
umi.use(keypairIdentity(signer));
umi.payer = signer;

// --- CREATE UPLOADER ---
const uploader = createBundlrUploader(umi);

(async () => {
    const metadata = {
        name: "Grey Cat NFT",
        symbol: "GCNFT",
        description: "A cute grey cat NFT",
        image: "https://gateway.irys.xyz/FPPjaZ828MGUYFn6MVMcDJjZRaChG4A2A8rxNoKvbpU",
        attributes: [{ trait_type: "Mood", value: "Normal" }],
    };

    const uri = await uploader.uploadJson(metadata);
    console.log("Metadata URI:", uri);
})();
