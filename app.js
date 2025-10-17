// =======================
// MHA Explorer — app.js
// =======================

// قائمة التوكنات التجريبية (يمكن استبدالها ببيانات حقيقية لاحقًا)
const tokens = [
  {
    name: "Bitcoin",
    symbol: "BTC",
    desc: "The first decentralized cryptocurrency.",
    logo: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
    website: "https://bitcoin.org",
    explorer: "https://www.blockchain.com/explorer"
  },
  {
    name: "Ethereum",
    symbol: "ETH",
    desc: "Smart contract platform for decentralized apps.",
    logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    website: "https://ethereum.org",
    explorer: "https://etherscan.io"
  },
  {
    name: "Solana",
    symbol: "SOL",
    desc: "High-performance blockchain for scalable DApps.",
    logo: "https://cryptologos.cc/logos/solana-sol-logo.png",
    website: "https://solana.com",
    explorer: "https://explorer.solana.com"
  },
  {
    name: "BNB",
    symbol: "BNB",
    desc: "Utility token for Binance ecosystem.",
    logo: "https://cryptologos.cc/logos/bnb-bnb-logo.png",
    website: "https://www.binance.com",
    explorer: "https://bscscan.com"
  },
  {
    name: "Cardano",
    symbol: "ADA",
    desc: "Third-generation blockchain platform for smart contracts.",
    logo: "https://cryptologos.cc/logos/cardano-ada-logo.png",
    website: "https://cardano.org",
    explorer: "https://cardanoscan.io"
  }
];

// =========================
// عرض قائمة التوكنات
// =========================
const tokenList = document.getElementById("tokenList");
const searchInput = document.getElementById("search");

function renderTokenList(filter = "") {
  tokenList.innerHTML = "";
  tokens
    .filter(t => t.name.toLowerCase().includes(filter.toLowerCase()))
    .forEach(token => {
      const div = document.createElement("div");
      div.className = "token-item";
      div.innerHTML = `<strong>${token.name}</strong> (${token.symbol})`;
      div.onclick = () => showTokenDetails(token);
      tokenList.appendChild(div);
    });
}

searchInput.addEventListener("input", e => {
  renderTokenList(e.target.value);
});

renderTokenList();

// =========================
// عرض تفاصيل التوكن
// =========================
function showTokenDetails(token) {
  document.getElementById("detailLogo").innerHTML = `<img src="${token.logo}" alt="${token.name}" width="64">`;
  document.getElementById("detailName").textContent = token.name;
  document.getElementById("detailSymbol").textContent = token.symbol;
  document.getElementById("detailDesc").textContent = token.desc;
  updateDetailLinks(token.website, token.explorer);
}

// =========================
// أزرار Website و Explorer
// =========================
function updateDetailLinks(website, explorer) {
  const websiteBtn = document.getElementById("detailWebsite");
  const explorerBtn = document.getElementById("detailExplorer");

  if (website) {
    websiteBtn.href = website;
    websiteBtn.classList.remove("hidden");
  } else {
    websiteBtn.classList.add("hidden");
  }

  if (explorer) {
    explorerBtn.href = explorer;
    explorerBtn.classList.remove("hidden");
  } else {
    explorerBtn.classList.add("hidden");
  }
}

// =========================
// الأسعار الجانبية (Live Prices)
// =========================
const trackedCoins = ["bitcoin", "ethereum", "solana", "dogecoin"];

async function loadPrices() {
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${trackedCoins.join(",")}&vs_currencies=usd`
    );
    const data = await res.json();

    const priceList = document.getElementById("priceList");
    priceList.innerHTML = "";

    trackedCoins.forEach(coin => {
      const li = document.createElement("li");
      li.textContent = `${coin.toUpperCase()}: $${data[coin].usd.toLocaleString()}`;
      priceList.appendChild(li);
    });
  } catch (err) {
    console.error("Error fetching prices:", err);
  }
}

loadPrices();
setInterval(loadPrices, 60000);

// =========================
// الشريط الذكي (Smart Live Ticker)
// =========================
const tickerCoins = ["bitcoin", "ethereum", "solana", "dogecoin", "bnb", "cardano"];
let previousPrices = {};

async function loadTicker() {
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${tickerCoins.join(",")}&vs_currencies=usd`
    );
    const data = await res.json();

    const tickerContent = document.getElementById("tickerContent");
    tickerContent.innerHTML = "";

    tickerCoins.forEach(coin => {
      const newPrice = data[coin]?.usd;
      const oldPrice = previousPrices[coin];
      let color = "#ccc";

      if (oldPrice !== undefined) {
        if (newPrice > oldPrice) color = "#0f0";
        else if (newPrice < oldPrice) color = "#f33";
      }

      const span = document.createElement("span");
      span.className = "ticker-item";
      span.textContent = `${coin.toUpperCase()}: $${newPrice.toLocaleString()}`;
      span.style.color = color;

      tickerContent.appendChild(span);
      previousPrices[coin] = newPrice;
    });
  } catch (err) {
    console.error("Ticker error:", err);
  }
}

loadTicker();
setInterval(loadTicker, 60000);
