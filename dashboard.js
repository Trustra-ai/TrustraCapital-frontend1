const API_BASE = "https://trustracapitalfx.onrender.com";
const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "index.html";
}

const accountsDiv = document.getElementById("accounts");
const txForm = document.getElementById("txForm");
const txMessage = document.getElementById("txMessage");
const logoutBtn = document.getElementById("logoutBtn");

// 🔐 Logout
logoutBtn.onclick = () => {
  localStorage.removeItem("token");
  window.location.href = "index.html";
};

// 📊 Load accounts
async function loadAccounts() {
  try {
    const res = await fetch(`${API_BASE}/api/accounts`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to load accounts");
    }

    accountsDiv.innerHTML = "";

    data.accounts.forEach(acc => {
      const div = document.createElement("div");
      div.className = "account";
      div.innerHTML = `
        <span>${acc.currency} Account</span>
        <strong>${acc.balance.toLocaleString()}</strong>
      `;
      accountsDiv.appendChild(div);
    });

  } catch (err) {
    accountsDiv.innerHTML = `<p style="color:red;">${err.message}</p>`;
  }
}

loadAccounts();

// 💸 Send transaction
txForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  txMessage.textContent = "";

  const payload = {
    fromAccount: fromAccount.value,
    toAccount: toAccount.value,
    amount: Number(amount.value),
    currency: currency.value
  };

  try {
    const res = await fetch(`${API_BASE}/api/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      txMessage.style.color = "#ef4444";
      txMessage.textContent = data.error || "Transaction failed";
      return;
    }

    txMessage.style.color = "#22c55e";
    txMessage.textContent = `Transaction successful (ID: ${data.transactionId})`;

  } catch {
    txMessage.style.color = "#ef4444";
    txMessage.textContent = "Network error";
  }
});
