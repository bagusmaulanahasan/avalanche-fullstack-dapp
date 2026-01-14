const connectBtn = document.getElementById("connectBtn");
const statusEl = document.getElementById("status");
const addressEl = document.getElementById("address");
const studentInfoEl = document.getElementById("student-info");
const networkEl = document.getElementById("network");
const balanceEl = document.getElementById("balance");
const errorMsgEl = document.getElementById("error-msg");
const AVALANCHE_FUJI_CHAIN_ID = "0xa869";
function shortenAddress(address) {
    if (!address) return "-";
    return `${address.substring(0, 6)}...${address.substring(
        address.length - 4
    )}`;
}

function formatAvaxBalance(balanceWei) {
    const balance = parseInt(balanceWei, 16);
    return (balance / 1e18).toFixed(4);
}
function resetState() {
    statusEl.textContent = "Not Connected";
    statusEl.style.color = "#ffffff";
    addressEl.textContent = "-";
    studentInfoEl.textContent = "";
    networkEl.textContent = "-";
    balanceEl.textContent = "-";
    connectBtn.disabled = false;
    connectBtn.textContent = "Connect Wallet";
    errorMsgEl.textContent = "";
}

async function connectWallet() {
    errorMsgEl.textContent = "";

    if (typeof window.ethereum === "undefined") {
        alert("Core Wallet tidak terdeteksi. Silakan install Core Wallet.");
        return;
    }

    try {
        statusEl.textContent = "Connecting...";

        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
        });

        const address = accounts[0];
        handleAccountSuccess(address);
    } catch (error) {
        console.error(error);
        statusEl.textContent = "Connection Failed ❌";

        errorMsgEl.textContent = `Error: ${
            error.message || "User rejected request"
        }`;
    }
}

async function handleAccountSuccess(address) {
    addressEl.textContent = shortenAddress(address);

    studentInfoEl.textContent = "Nama: Bagus Maulana Hasan | NIM: 221011400240";

    connectBtn.disabled = true;
    connectBtn.textContent = "Wallet Connected";

    try {
        const chainId = await window.ethereum.request({
            method: "eth_chainId",
        });

        if (chainId === AVALANCHE_FUJI_CHAIN_ID) {
            networkEl.textContent = "✅ Avalanche Fuji Testnet";
            statusEl.textContent = "Connected ✅";
            statusEl.style.color = "#4cd137";
            errorMsgEl.textContent = "";

            const balanceWei = await window.ethereum.request({
                method: "eth_getBalance",
                params: [address, "latest"],
            });

            balanceEl.textContent = formatAvaxBalance(balanceWei);
        } else {
            networkEl.textContent = "❌ Wrong Network";
            statusEl.textContent = "Please switch to Avalanche Fuji";
            statusEl.style.color = "#fbc531";
            balanceEl.textContent = "-";
        }
    } catch (err) {
        errorMsgEl.textContent = "Error fetching network data.";
    }
}
if (window.ethereum) {
    window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
            handleAccountSuccess(accounts[0]);
        } else {
            resetState();
        }
    });

    window.ethereum.on("chainChanged", (chainId) => {
        window.location.reload();
    });
}

connectBtn.addEventListener("click", connectWallet);
