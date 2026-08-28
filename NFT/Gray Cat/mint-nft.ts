import { Connection } from "@solana/web3.js";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplCore, create } from "@metaplex-foundation/mpl-core";
import { keypairIdentity, createSignerFromKeypair, generateSigner } from "@metaplex-foundation/umi";
import fs from "fs";

// Wallet laden
const secret = JSON.parse(fs.readFileSync("id.json", "utf8"));
const secretKey = new Uint8Array(secret);

// Connection mit explizitem WS-Endpoint
const connection = new Connection(
    "https://mainnet.helius-rpc.com/?api-key=5dd7803b-bb01-4226-a23f-6c5e5516b7ef",
    {
        commitment: "confirmed",
        wsEndpoint: "wss://mainnet.helius-rpc.com/?api-key=5dd7803b-bb01-4226-a23f-6c5e5516b7ef",
    }
);

// UMI init + Core-Plugin
const umi = createUmi(connection).use(mplCore());

// UMI-Keypair + Signer
const umiKeypair = umi.eddsa.createKeypairFromSecretKey(secretKey);
const signer = createSignerFromKeypair(umi, umiKeypair);
umi.use(keypairIdentity(signer));
umi.payer = signer;

(async () => {
    // Neuer Signer = die Adresse des NFTs selbst
    const asset = generateSigner(umi);

    const tx = await create(umi, {
        asset,
        name: "Grey Cat NFT",
        uri: "https://arweave.net/2nO8IX3MMap7EbISi0-puiWWq3aWYeLVlHwrCIpcI0c", // deine Metadata-URI
    }).sendAndConfirm(umi);

    console.log("NFT gemintet!");
    console.log("Asset-Adresse:", asset.publicKey);
    console.log("Signatur:", tx.signature);
})();