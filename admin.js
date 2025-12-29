const API_BASE = "https://trustracapitalfx.onrender.com";
const token = localStorage.getItem("token");

if (!token) {
  location.href = "index.html";
}

document.getElementById("logout").onclick = () => {
  localStorage.clear();
  location.href = "index.html";
};

async function api(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {})
    }
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

// 📊 Load Stats
async function loadStats() {
  const data = await api("/api/admin/stats");

  document.getElementById("stats").innerHTML = `
    <p>Total Users: <strong>${data.users}</strong></p>
    <p>Total Accounts: <strong>${data.accounts}</strong></p>
    <p>Total Transactions: <strong>${data.transactions}</strong></p>
  `;
}

// 👥 Load Users
async function loadUsers() {
  const data = await api("/api/admin/users");
  const container = document.getElementById("users");
  container.innerHTML = "";

  data.forEach(user => {
    const div = document.createElement("div");
    div.className = "account";
    div.innerHTML = `
      <span>${user.email}</span>
      <span>${user.status}</span>
      <button onclick="toggleUser('${user.id}')">
        ${user.status === "active" ? "Disable" : "Enable"}
      </button>
    `;
    container.appendChild(div);
  });
}

// 🔁 Toggle User Status
async function toggleUser(id) {
  await api(`/api/admin/users/${id}/toggle`, { method: "POST" });
  loadUsers();
}

// 💸 Load Transactions
async function loadTransactions() {
  const data = await api("/api/admin/transactions");
  const container = document.getElementById("transactions");
  container.innerHTML = "";

  data.forEach(tx => {
    const div = document.createElement("div");
    div.className = "account";
    div.innerHTML = `
      <span>${tx.currency} ${tx.amount}</span>
      <span>${tx.status}</span>
      <small>${new Date(tx.timestamp).toLocaleString()}</small>
    `;
    container.appendChild(div);
  });
}

loadStats();
loadUsers();
loadTransactions();
