document.addEventListener("DOMContentLoaded", async () => {
  //alert
  function showError(message) {
    const errorDiv = document.getElementById("formError");
    if (errorDiv) errorDiv.innerHTML = Array.isArray(message)
      ? message.map(m => `<div>${m}</div>`).join("")
      : `<div>${message}</div>`;
  }
  
  function showSuccess(message) {
    const successDiv = document.getElementById("formSuccess");
    if (successDiv) successDiv.textContent = message;
  }
  
  function clearMessages() {
    const errorDiv = document.getElementById("formError");
    const successDiv = document.getElementById("formSuccess");
    if (errorDiv) errorDiv.innerHTML = "";
    if (successDiv) successDiv.innerHTML = "";
  }
  
  
  
  //login
  const loginForm = document.getElementById("frmlogin");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("lgEmail").value.trim();
    const password = document.getElementById("lgPassword").value.trim();
    clearMessages();
    if (!email || !password) {
      showError("Please enter both email and password.");
      return;
    }

    try {
      const response = await fetch("https://dental-appointment-booking-1.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors && Array.isArray(data.errors)) {
          showError("Login failed:\n" + data.errors.join("\n"));
        } else {
          showError("Login failed: " + (data.message || "Unknown error"));
        }
        return;
      }

      // Success
      localStorage.setItem("token", data.token);
      showSuccess("Login Successful!");
      window.location.href = "appointments.html";

    } catch (error) {
      console.error("Login Error:", error);
      showAlert("Something went wrong. Please try again.");
    }
  });
}
    //signup
    const signupForm = document.getElementById("frmsignup");
    if (signupForm) {
      signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = document.getElementById("Name").value;
        const email = document.getElementById("Email").value;
        const phone = document.getElementById("Phone").value;
        const password = document.getElementById("Password").value;

        if (!name || !email || !phone || !password) {
          showError(" Please enter all fields.");
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
          showSuccess("Signup Successful!!");
          window.location.href = "login.html";
        } catch (error) {
          console.error("Signup Error:", error);
          showAlert("Signup Failed: " + error.message);
        }
      });
    }
  
  //fatch the data for display the appoinment confirmation page
  const appointmentForm = document.getElementById("appointmentForm");
  if (appointmentForm) {
    const token = localStorage.getItem("token");

    // Pre-fill values
    const storedDate = localStorage.getItem("appointmentDate");
    const storedTime = localStorage.getItem("appointmentTime");
    const storedClinic = localStorage.getItem("appointmentClinic");

    if (storedDate) {
      document.getElementById("appointmentDate").value = storedDate;
    }
    if (storedTime) {
      document.getElementById("appointmentTime").value = storedTime;
    }
    if (storedClinic) {
      document.getElementById("clinicSelect").value = storedClinic;
    }

    // Fetch patient profile using token
    if (token) {
      try {
        const res = await fetch(
          "http://localhost:5000/api/appointments/patientprofile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        if (res.ok) {
          document.getElementById("patientName").value = data.name || "";
          document.getElementById("patientEmail").value = data.email || "";
          document.getElementById("patientPhone").value = data.phone || "";
        } else {
          console.warn("Could not fetch patient data:", data.message);
        }
      } catch (err) {
        console.error("Error fetching patient profile:", err);
      }
    }

    // Submit logic
    appointmentForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const name = document.getElementById("patientName").value;
      const email = document.getElementById("patientEmail").value;
      const phone = document.getElementById("patientPhone").value;
      const clinic = document.getElementById("clinicSelect").value;
      const date = document.getElementById("appointmentDate").value;
      const time = document.getElementById("appointmentTime").value;
      const reason = document.getElementById("reason").value;

      localStorage.setItem("appointmentName", name);
      localStorage.setItem("appointmentEmail", email);
      localStorage.setItem("appointmentPhone", phone);
      localStorage.setItem("appointmentClinic", clinic);
      localStorage.setItem("appointmentDate", date);
      localStorage.setItem("appointmentTime", time);
      localStorage.setItem("appointmentReason", reason);

      window.location.href = "confirmation.html";
    });
  }
    //message alert
    function showAlert(message, type = "info") {
      const alertDiv = document.createElement("div");
      alertDiv.textContent = message;
      alertDiv.className = `custom-alert ${type}`; // Add styling
      document.body.appendChild(alertDiv);
    
      setTimeout(() => {
        alertDiv.remove();
      }, 3000);
    }

  //dashboard script
  const calendar = document.getElementById("calendar");
  const slotsContainer = document.getElementById("slots-container");
  const confirmBtn = document.getElementById("confirm-btn");
  const prevMonthBtn = document.getElementById("prevMonth");
  const nextMonthBtn = document.getElementById("nextMonth");
  const currentMonthText = document.getElementById("currentMonth");

  let selectedDate = null;
  let selectedSlot = null;
  let monthOffset = 0;

  function generateCalendar(monthOffset) {
    calendar.innerHTML = "";
    const today = new Date();
    const targetMonth = new Date(
      today.getFullYear(),
      today.getMonth() + monthOffset,
      1
    );
    const daysInMonth = new Date(
      targetMonth.getFullYear(),
      targetMonth.getMonth() + 1,
      0
    ).getDate();

    currentMonthText.textContent = targetMonth.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

    for (let i = 1; i <= daysInMonth; i++) {
      const dayElement = document.createElement("div");
      dayElement.classList.add("day");
      dayElement.textContent = i;

      const formattedDate = `${targetMonth.getFullYear()}-${(
        targetMonth.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${i.toString().padStart(2, "0")}`;
      const currentDate = new Date(formattedDate);

      if (currentDate < today.setHours(0, 0, 0, 0)) {
        dayElement.classList.add("disabled");
      } else {
        dayElement.addEventListener("click", () => {
          document
            .querySelectorAll(".day")
            .forEach((day) => day.classList.remove("selected"));
          dayElement.classList.add("selected");
          selectedDate = formattedDate;
          fetchAvailableSlots(selectedDate);
        });
      }

      calendar.appendChild(dayElement);
    }
  }

  function fetchAvailableSlots(date) {
    slotsContainer.innerHTML = "<p>Loading slots...</p>";

    fetch(`http://localhost:5000/api/appointments/slotsavailable/${date}`)
      .then((response) => response.json())
      .then((data) => {
        slotsContainer.innerHTML = "";
        if (!data.availableSlots || data.availableSlots.length === 0) {
          slotsContainer.innerHTML = "<p>No slots available for this day.</p>";
          return;
        }

        data.availableSlots.forEach((slot) => {
          const slotElement = document.createElement("div");
          slotElement.classList.add("time-slot");
          slotElement.textContent = slot;

          slotElement.addEventListener("click", () => {
            document
              .querySelectorAll(".time-slot")
              .forEach((s) => s.classList.remove("selected"));
            slotElement.classList.add("selected");
            selectedSlot = slot;
            confirmBtn.style.display = "block";
          });

          slotsContainer.appendChild(slotElement);
        });
      })
      .catch((error) => {
        console.error("Error fetching slots:", error);
        slotsContainer.innerHTML = "<p>Error loading slots.</p>";
      });
  }
  if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
      const token = localStorage.getItem("token");
      if (!token) {
        showError("Please log in first!");
        return;
      }

      if (!selectedDate || !selectedSlot) {
        showError("Please select a date and a time slot.");
        return;
      }

      localStorage.setItem("appointmentDate", selectedDate);
      localStorage.setItem("appointmentTime", selectedSlot);

      window.location.href = "bookappointment.html";
    });

    prevMonthBtn.addEventListener("click", () => {
      if (monthOffset > 0) {
        monthOffset -= 1;
        generateCalendar(monthOffset);
      }
    });

    nextMonthBtn.addEventListener("click", () => {
      if (monthOffset < 2) {
        monthOffset += 1;
        generateCalendar(monthOffset);
      }
    });

    generateCalendar(monthOffset);
  }

  //confirmation
  
});


