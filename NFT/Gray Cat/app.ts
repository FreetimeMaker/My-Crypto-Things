import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { createBundlrUploader } from "@metaplex-foundation/umi-uploader-bundlr";
import { keypairIdentity, createSignerFromKeypair } from "@metaplex-foundation/umi";
import fs from "fs";

// Wallet laden
const secret = JSON.parse(fs.readFileSync("id.json", "utf8"));
const secretKey = new Uint8Array(secret);

// UMI mit funktionierendem RPC
const umi = createUmi("https://rpc.shyft.to/solana/mainnet?api_key=JrLUALKtWcq0ucmW");

// UMI-Keypair erzeugen
const umiKeypair = umi.eddsa.createKeypairFromSecretKey(secretKey);

// Signer erzeugen
const signer = createSignerFromKeypair(umi, umiKeypair);

// Signer setzen
umi.use(keypairIdentity(signer));
umi.payer = signer;

// Bundlr-Uploader
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
