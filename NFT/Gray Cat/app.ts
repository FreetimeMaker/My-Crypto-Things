import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplTokenMetadata, createNft } from "@metaplex-foundation/mpl-token-metadata";
import { keypairIdentity, createSignerFromKeypair, generateSigner, percentAmount } from "@metaplex-foundation/umi";
import fs from "fs";

// --- LOAD WALLET SECRET KEY ---
const secret = JSON.parse(fs.readFileSync("id.json", "utf8"));
const secretKey = new Uint8Array(secret);

// --- INIT UMI ---
const umi = createUmi("https://rpc.shyft.to/solana/mainnet?api_key=JrLUALKtWcq0ucmW");

// --- CREATE A UMI KEYPPAIR ---
const umiKeypair = umi.eddsa.createKeypairFromSecretKey(secretKey);

// --- WRAP IT INTO A FULL SIGNER (IMPORTANT) ---
const signer = createSignerFromKeypair(umi, umiKeypair);

// --- SET IDENTITY + PAYER ---
umi.use(keypairIdentity(signer));
umi.payer = signer;

// --- LOAD TOKEN METADATA PLUGIN ---
umi.use(mplTokenMetadata());

(async () => {
    const mint = generateSigner(umi);

    await createNft(umi, {
        mint,
        name: "Grey Cat NFT",
        symbol: "GCNFT",
        uri: "https://gateway.irys.xyz/FPPjaZ828MGUYFn6MVMcDJjZRaChG4A2A8rxNoKvbpU",
        sellerFeeBasisPoints: percentAmount(10),
    }).sendAndConfirm(umi);

    console.log("NFT Mint Address:", mint.publicKey.toString());
})();
