document.addEventListener("DOMContentLoaded", async () => {
  const loginForm = document.getElementById("frmlogin");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("lgEmail").value;
      const password = document.getElementById("lgPassword").value;

      if (!email && !password) {
        alert("Please enter both email and password.");
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error("Login Failed: " + errorText);
        }

        const data = await response.json();
        localStorage.setItem("token", data.token);
        alert("Login Successful!");
        window.location.href = "dashboard.html";
      } catch (error) {
        console.error(" Login Error:", error);
        alert("Login Failed: " + error.message);
      }
    });
  }
});
