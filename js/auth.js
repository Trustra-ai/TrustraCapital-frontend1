const API = "https://trustracapitalfx.onrender.com";

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = email.value;
  const password = password.value;
  const msg = document.getElementById("message");

  try {
    const res = await fetch(`${API}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      msg.textContent = data.error || "Login failed";
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.user.role);

    window.location.href =
      data.user.role === "admin"
        ? "admin.html"
        : "dashboard.html";

  } catch {
    msg.textContent = "Network error";
  }
});
