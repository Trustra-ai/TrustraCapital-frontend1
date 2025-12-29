const API_BASE = "https://trustracapitalfx.onrender.com";

const serverStatus = document.getElementById("serverStatus");
const serverStatusFooter = document.getElementById("serverStatusFooter");
const loginForm = document.getElementById("loginForm");
const errorMessage = document.getElementById("errorMessage");

// ✅ Server status check (NO fake /health route)
async function checkServerStatus() {
  try {
    const res = await fetch(API_BASE, { method: "HEAD" });

    if (res.ok) {
      serverStatus.textContent = "Online • Global Infrastructure";
      serverStatusFooter.textContent = "Online • Global Infrastructure";
      serverStatus.style.color = "#22c55e";
      serverStatusFooter.style.color = "#22c55e";
    } else {
      throw new Error();
    }
  } catch {
    serverStatus.textContent = "Offline • Try Again Later";
    serverStatusFooter.textContent = "Offline • Try Again Later";
    serverStatus.style.color = "#ef4444";
    serverStatusFooter.style.color = "#ef4444";
  }
}

checkServerStatus();

// ✅ Login
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorMessage.textContent = "";

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      errorMessage.textContent = data.error || "Login failed";
      return;
    }

    localStorage.setItem("token", data.token);
    alert("Login successful");
  } catch {
    errorMessage.textContent = "Network error. Please try again later.";
  }
});
