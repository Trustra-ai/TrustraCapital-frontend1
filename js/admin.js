const API = "https://trustracapitalfx.onrender.com";
const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

// Hard security redirect
if (!token || role !== "admin") {
  window.location.replace("index.html");
}

// ==========================
// Admin Stats
// ==========================
fetch(`${API}/api/admin/stats`, {
  headers: {
    Authorization: `Bearer ${token}`
  }
})
.then(res => {
  if (!res.ok) throw new Error("Unauthorized");
  return res.json();
})
.then(data => {
  document.getElementById("stats").innerHTML = `
    <p><strong>Users:</strong> ${data.users}</p>
    <p><strong>Accounts:</strong> ${data.accounts}</p>
    <p><strong>Transactions:</strong> ${data.transactions}</p>
  `;
})
.catch(() => {
  alert("Session expired. Login again.");
  localStorage.clear();
  window.location.replace("index.html");
});

// ==========================
// Admin Users List
// ==========================
fetch(`${API}/api/admin/users`, {
  headers: {
    Authorization: `Bearer ${token}`
  }
})
.then(res => res.json())
.then(users => {
  document.getElementById("users").innerHTML = users.map(u => `
    <div class="user-row">
      <span>${u.email}</span>
      <span class="${u.disabled ? 'disabled' : 'active'}">
        ${u.disabled ? "Disabled" : "Active"}
      </span>
      <button onclick="toggleUser('${u._id}')">
        ${u.disabled ? "Enable" : "Disable"}
      </button>
    </div>
  `).join("");
});

// ==========================
// Toggle User Status
// ==========================
function toggleUser(id) {
  fetch(`${API}/api/admin/users/${id}/toggle`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then(res => {
    if (!res.ok) throw new Error();
    location.reload();
  })
  .catch(() => alert("Action failed"));
}

// ==========================
// Logout
// ==========================
document.getElementById("logoutBtn").onclick = () => {
  localStorage.clear();
  window.location.replace("index.html");
};
