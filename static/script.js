const form = document.getElementById("bmiForm");
const resultText = document.getElementById("resultText");
const resultSection = document.getElementById("result");
const bodyImage = document.getElementById("bodyImage");
const clearBtn = document.getElementById("clearBtn");
const showHistoryBtn = document.getElementById("showHistory");
const deleteAllBtn = document.getElementById("deleteAll");
const historyDiv = document.getElementById("history");

// Submit form → POST to /bmi
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const weight = parseFloat(document.getElementById("weight").value);
  const height = parseFloat(document.getElementById("height").value);
  const unit = document.getElementById("units").value;

  const response = await fetch("/bmi", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ weight, height, unit })
  });

  const data = await response.json();

  // Select image based on category
  const imageMap = {
    "Underweight": "body_underweight.png",
    "Normal weight": "body_normal.png",
    "Overweight": "body_overweight.png",
    "Obesity": "body_obesity.png"
  };

  resultText.innerHTML = `
    <h3>Your BMI: ${data.bmi}</h3>
    <p><strong>Category:</strong> ${data.category}</p>
    <p><strong>Tip:</strong> ${data.tip}</p>
  `;

  bodyImage.src = imageMap[data.category] || "";
  bodyImage.alt = data.category;
  bodyImage.classList.remove("hidden");
  resultSection.classList.remove("hidden");
});

// Clear result
clearBtn.addEventListener("click", () => {
  document.getElementById("weight").value = "";
  document.getElementById("height").value = "";
  resultText.innerHTML = "";
  resultSection.classList.add("hidden");
  bodyImage.classList.add("hidden");
});

// Load history → GET /bmi/history
showHistoryBtn.addEventListener("click", loadHistory);

async function loadHistory() {
  const response = await fetch("/bmi/history");
  const history = await response.json();

  if (!history.length) {
    historyDiv.innerHTML = "<p>No history yet.</p>";
    historyDiv.classList.remove("hidden");
    return;
  }

  let table = `
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

  history.forEach(record => {
    table += `
      <tr>
        <td>${record.id}</td>
        <td>${record.bmi}</td>
        <td>${record.category}</td>
        <td>${new Date(record.timestamp).toLocaleString()}</td>
        <td><button class="delete-btn" onclick="deleteRecord(${record.id})">Delete</button></td>
      </tr>
    `;
  });

  table += "</tbody></table>";
  historyDiv.innerHTML = table;
  historyDiv.classList.remove("hidden");
}

// Delete single record → DELETE /bmi/{id}
async function deleteRecord(id) {
  if (!confirm(`Delete record #${id}?`)) return;

  const response = await fetch(`/bmi/${id}`, { method: "DELETE" });
  const result = await response.json();
  alert(result.message);
  loadHistory();
}

// Delete all records → DELETE /bmi/all
deleteAllBtn.addEventListener("click", async () => {
  if (!confirm("Delete all BMI records?")) return;

  const response = await fetch("/bmi/all", { method: "DELETE" });
  const result = await response.json();
  alert(result.message);
  historyDiv.innerHTML = "";
});
