// upload-metadata.ts
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { createArweaveUploader } from "@metaplex-foundation/umi-uploader-arweave";

const umi = createUmi("https://api.mainnet-beta.solana.com");
const uploader = createArweaveUploader(umi);

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
