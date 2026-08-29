const {
  Connection,
  Keypair,
  clusterApiUrl,
} = require("@solana/web3.js");
const {
  mintToChecked,
  getMint,
  getOrCreateAssociatedTokenAccount,
} = require("@solana/spl-token");
const fs = require("fs");
const path = require("path");

// ---------- Konfiguration ----------

// Netzwerk: "devnet", "testnet" oder "mainnet-beta"
const CLUSTER = "mainnet";

// Pfad zu deiner Keypair-Datei (JSON-Array, z.B. ~/.config/solana/id.json)
const KEYPAIR_PATH = path.join(require("os").homedir(), ".config", "solana", "id.json");

// Mint-Adresse deines bestehenden Tokens
const MINT_ADDRESS = "56Dr6vJLmemdzGpMnPSM1AuqXc21xcK4vVUpw6dHCj5w";

// Wallet-Adresse, die die neuen Token erhalten soll
// (kann die eigene Wallet sein, ATA wird automatisch erstellt/gefunden)
const RECIPIENT_ADDRESS = "8xB5kxQMHr44czWYdNZTrwvho17SW23KEnAMxe7V85RR";

// Menge in "sichtbaren" Token (Decimals werden automatisch berücksichtigt)
const AMOUNT_TO_MINT = Number(1000000);

// ------------------------------------

function loadKeypair(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Keypair-Datei nicht gefunden: ${filePath}`);
  }
  const secret = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return Keypair.fromSecretKey(Uint8Array.from(secret));
}

async function main() {
  const { PublicKey } = require("@solana/web3.js");

  if (MINT_ADDRESS === "56Dr6vJLmemdzGpMnPSM1AuqXc21xcK4vVUpw6dHCj5w" || RECIPIENT_ADDRESS === "8xB5kxQMHr44czWYdNZTrwvho17SW23KEnAMxe7V85RR") {
    console.error(
      "Bitte MINT_ADDRESS und RECIPIENT_ADDRESS setzen (per .env, Umgebungsvariable oder direkt im Script)."
    );
    process.exit(1);
  }

  console.log(`Verbinde mit Cluster: ${CLUSTER}`);
  const connection = new Connection(clusterApiUrl(CLUSTER), "confirmed");

  console.log(`Lade Keypair aus: ${KEYPAIR_PATH}`);
  const payer = loadKeypair(KEYPAIR_PATH);
  console.log(`Payer / Mint Authority: ${payer.publicKey.toBase58()}`);

  const mintPubkey = new PublicKey(MINT_ADDRESS);
  const recipientPubkey = new PublicKey(RECIPIENT_ADDRESS);

  // Mint-Info abrufen (u.a. für Decimals und Sicherheits-Check der Authority)
  const mintInfo = await getMint(connection, mintPubkey);
  console.log(`Decimals: ${mintInfo.decimals}`);

  if (!mintInfo.mintAuthority) {
    console.error(
      "Diese Mint Authority wurde bereits revoked. Es kann kein weiteres Supply geprägt werden."
    );
    process.exit(1);
  }

  if (mintInfo.mintAuthority.toBase58() !== payer.publicKey.toBase58()) {
    console.error(
      `Deine Wallet (${payer.publicKey.toBase58()}) ist nicht die Mint Authority (${mintInfo.mintAuthority.toBase58()}).`
    );
    process.exit(1);
  }

  // Ziel-Token-Account (ATA) holen oder erstellen
  console.log("Prüfe/erstelle Associated Token Account für Empfänger...");
  const destinationTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mintPubkey,
    recipientPubkey
  );
  console.log(`Ziel-Token-Account: ${destinationTokenAccount.address.toBase58()}`);

  // Menge unter Berücksichtigung der Decimals berechnen (als BigInt für Präzision)
  const amountInSmallestUnit =
    BigInt(AMOUNT_TO_MINT) * BigInt(10 ** mintInfo.decimals);

  console.log(
    `Präge ${AMOUNT_TO_MINT} Token (${amountInSmallestUnit.toString()} kleinste Einheiten)...`
  );

  const signature = await mintToChecked(
    connection,
    payer,                          // zahlt Gebühren
    mintPubkey,                      // Mint-Adresse
    destinationTokenAccount.address,  // Ziel-ATA
    payer,                             // Mint Authority (muss signieren)
    amountInSmallestUnit,               // Menge in kleinster Einheit
    mintInfo.decimals                    // Decimals zur Absicherung
  );

  console.log("✅ Erfolgreich geprägt!");
  console.log(`Transaction Signature: ${signature}`);
  console.log(
    `Solscan: https://solscan.io/tx/${signature}${CLUSTER !== "mainnet-beta" ? `?cluster=${CLUSTER}` : ""}`
  );
}

main().catch((err) => {
  console.error("Fehler beim Minting:", err);
  process.exit(1);
});