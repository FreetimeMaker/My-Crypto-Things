import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { keypairIdentity, createSignerFromKeypair, createGenericFile } from "@metaplex-foundation/umi";
import { Keypair } from "@solana/web3.js";
import fs from "fs";

// --- WALLET LADEN ---
const secret = JSON.parse(fs.readFileSync("id.json", "utf8"));
const keypair = Keypair.fromSecretKey(Uint8Array.from(secret));

// --- UMI INITIALISIEREN ---
const umi = createUmi("https://api.mainnet-beta.solana.com");

// SIGNER SETZEN
umi.use(keypairIdentity(createSignerFromKeypair(umi, keypair)));

// IRYS UPLOADER
umi.use(irysUploader());

(async () => {
    const imageBuffer = fs.readFileSync("./cat.png");

    // UMI-kompatible Datei erzeugen
    const file = createGenericFile(imageBuffer, "cat.png", {
        contentType: "image/png",
    });

    // WICHTIG: Irys erwartet ein ARRAY
    const [uri] = await umi.uploader.upload([file]);

    console.log("Image URI:", uri);
})();
