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
        window.location.href = "appointments.html";
      } catch (error) {
        console.error(" Login Error:", error);
        alert("Login Failed: " + error.message);
      }
    });

    const signupForm = document.getElementById("frmsignup");
    if (signupForm) {
      signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = document.getElementById("Name").value;
        const email = document.getElementById("Email").value;
        const phone = document.getElementById("Phone").value;
        const password = document.getElementById("Password").value;

        if (!name || !email || !phone || !password) {
          alert(" Please enter all fields.");
          return;
        }

        try {
          const response = await fetch(
            "http://localhost:5000/api/auth/register",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name, email, phone, password }),
            }
          );

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error("Signup Failed: " + errorText);
          }

          const data = await response.json();
          alert("Signup Successful!!");
          window.location.href = "login.html";
        } catch (error) {
          console.error("Signup Error:", error);
          alert("Signup Failed: " + error.message);
        }
      });
    }
  }
});
