const API = "https://trustracapitalfx.onrender.com";
const token = localStorage.getItem("token");

if (!token) location.href = "index.html";

fetch(`${API}/api/accounts`, {
  headers: { Authorization: `Bearer ${token}` }
})
.then(res => res.json())
.then(data => {
  const div = document.getElementById("accounts");
  div.innerHTML = data.accounts.map(a =>
    `<p>${a.currency}: ${a.balance}</p>`
  ).join("");
});

document.getElementById("logoutBtn").onclick = () => {
  localStorage.clear();
  location.href = "index.html";
};
