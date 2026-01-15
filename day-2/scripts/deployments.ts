import { viem } from "hardhat";
import Artifact from "../artifacts/contracts/Lock.sol/Lock.json";

async function main() {
    // 1. Siapkan Client
    const [walletClient] = await viem.getWalletClients();
    const publicClient = await viem.getPublicClient();

    console.log("Deploying with account:", walletClient.account.address);

    // 2. HITUNG UNLOCK TIME
    // Ambil waktu sekarang (dalam detik)
    const currentTimestampInSeconds = Math.round(Date.now() / 1000);
    // Tambahkan 10 menit (600 detik) agar aman dari delay jaringan
    const unlockTime = BigInt(currentTimestampInSeconds + 600);

    // 3. Tentukan jumlah AVAX yang mau dikunci
    // Misalnya 0.001 AVAX (satuan Wei)
    const lockedAmount = BigInt(1000000000000000); 

    // 4. Deploy Contract
    const hash = await walletClient.deployContract({
        abi: Artifact.abi,
        bytecode: Artifact.bytecode as `0x${string}`,
        // PENTING: Masukkan unlockTime ke dalam array args
        args: [unlockTime], 
        // PENTING: Kirim value (AVAX) untuk dikunci
        value: lockedAmount, 
    });

    console.log("Deployment tx hash:", hash);

    // 5. Tunggu konfirmasi blok
    const receipt = await publicClient.waitForTransactionReceipt({
        hash,
    });

    console.log("✅ Lock contract deployed at:", receipt.contractAddress);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});