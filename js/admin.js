const API = "https://trustracapitalfx.onrender.com";
const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

if (!token || role !== "admin") location.href = "index.html";

fetch(`${API}/api/admin/stats`, {
  headers: { Authorization: `Bearer ${token}` }
})
.then(res => res.json())
.then(data => {
  document.getElementById("stats").innerHTML = `
    <p>Users: ${data.users}</p>
    <p>Accounts: ${data.accounts}</p>
    <p>Transactions: ${data.transactions}</p>
  `;
});

fetch(`${API}/api/admin/users`, {
  headers: { Authorization: `Bearer ${token}` }
})
.then(res => res.json())
.then(users => {
  document.getElementById("users").innerHTML = users
    .map(u => `<p>${u.email} (${u.status})</p>`)
    .join("");
});

document.getElementById("logoutBtn").onclick = () => {
  localStorage.clear();
  location.href = "index.html";
};
