const form = document.getElementById("bmiForm");
const resultDiv = document.getElementById("result");
const historyDiv = document.getElementById("history");
const showHistoryBtn = document.getElementById("showHistory");

// Handle form submission
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const weight = parseFloat(document.getElementById("weight").value);
  const height = parseFloat(document.getElementById("height").value);
  const unit = document.getElementById("unit").value;

  try {
    const response = await fetch("/bmi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ weight, height, unit }),
    });

    const data = await response.json();
    console.log("Backend response:", data); // 👈 debug log

    if (response.ok) {
      resultDiv.innerHTML = `
        <h3>Result</h3>
        <p><strong>BMI:</strong> ${data.bmi}</p>
        <p><strong>Category:</strong> ${data.category}</p>
        <p><strong>Tip:</strong> ${data.tip}</p>
      `;
    } else {
      resultDiv.innerHTML = `<p style="color:red;">${data.detail || "Error calculating BMI."}</p>`;
    }

    resultDiv.classList.remove("hidden");
  } catch (error) {
    console.error("Error:", error);
    resultDiv.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
    resultDiv.classList.remove("hidden");
  }
});

// Load history with delete buttons
showHistoryBtn.addEventListener("click", loadHistory);

async function loadHistory() {
  try {
    const response = await fetch("/bmi/history");
    const history = await response.json();

    if (history.length === 0) {
      historyDiv.innerHTML = "<p>No history found.</p>";
    } else {
      let table = `
        <h3>BMI History</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>BMI</th>
              <th>Category</th>
              <th>Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
      `;

      history.forEach(entry => {
        table += `
          <tr>
            <td>${entry.id}</td>
            <td>${entry.bmi}</td>
            <td>${entry.category}</td>
            <td>${new Date(entry.timestamp).toLocaleString()}</td>
            <td>
              <button class="delete-btn" onclick="deleteRecord(${entry.id})">🗑️ Delete</button>
            </td>
          </tr>
        `;
      });

      table += "</tbody></table>";
      historyDiv.innerHTML = table;
    }

    historyDiv.classList.remove("hidden");
  } catch (error) {
    console.error("History error:", error);
    historyDiv.innerHTML = `<p style="color:red;">Error loading history: ${error.message}</p>`;
    historyDiv.classList.remove("hidden");
  }
}

// Delete a BMI record
async function deleteRecord(id) {
  if (!confirm(`Delete record #${id}?`)) return;

  try {
    const response = await fetch(`/bmi/${id}`, {
      method: "DELETE"
    });

    const result = await response.json();
    alert(result.message);

    // Refresh history
    loadHistory();
  } catch (error) {
    alert("Failed to delete: " + error.message);
  }
}
