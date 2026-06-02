import bs58 from "bs58";
import fs from "fs";

// Deinen Phantom Private Key hier einfügen (Base58)
const phantomPrivateKey = "4mfxY5tiRkYLWu17Bwa83eiQj1k6apVUy1QVZoyjejySDhtqeVXCzxi9JPpVLu91Qn5ocx3Bk8TcodZk6jSTw4R8";

const secretKey = bs58.decode(phantomPrivateKey);

fs.writeFileSync("id.json", JSON.stringify(Array.from(secretKey)));

console.log("id.json wurde erstellt!");
