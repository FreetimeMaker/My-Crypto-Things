import { percentAmount, generateSigner, signerIdentity, createSignerFromKeypair } from '@metaplex-foundation/umi'
import { TokenStandard, createAndMint, mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplCore } from "@metaplex-foundation/mpl-core";
import secret from './id.json';
import { Connection } from "@solana/web3.js";

const connection = new Connection(
    "https://mainnet.helius-rpc.com/?api-key=5dd7803b-bb01-4226-a23f-6c5e5516b7ef",
    {
        commitment: "confirmed",
        wsEndpoint: "wss://mainnet.helius-rpc.com/?api-key=5dd7803b-bb01-4226-a23f-6c5e5516b7ef",
    }
);

// UMI init + Core-Plugin
const umi = createUmi(connection).use(mplCore());

const userWallet = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secret));
const userWalletSigner = createSignerFromKeypair(umi, userWallet);

const metadata = {
    name: "SolWidth Token",
    symbol: "WIDTH",
    uri: "ipfs://bafkreihmds274gp5gasmpkzn3sjk3srvjpzhw4tekiumq3ogkfdx5dmqc4",
};

const mint = generateSigner(umi);
umi.use(signerIdentity(userWalletSigner));
umi.use(mplTokenMetadata())

createAndMint(umi, {
    mint,
    authority: umi.identity,
    name: metadata.name,
    symbol: metadata.symbol,
    uri: metadata.uri,
    sellerFeeBasisPoints: percentAmount(0),
    decimals: 8,
    amount: 1000000_00000000,
    tokenOwner: userWallet.publicKey,
    tokenStandard: TokenStandard.Fungible,
}).sendAndConfirm(umi)
    .then(() => {
        console.log("Successfully minted 1 million tokens (", mint.publicKey, ")");
    })
    .catch((err) => {
        console.error("Error minting tokens:", err);
    });