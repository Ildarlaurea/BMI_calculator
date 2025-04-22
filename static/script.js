const form = document.getElementById("bmiForm");
const resultText = document.getElementById("resultText");
const resultSection = document.getElementById("result");
const bodyImage = document.getElementById("bodyImage");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const weight = parseFloat(document.getElementById("weight").value);
  const height = parseFloat(document.getElementById("height").value);
  const unit = document.getElementById("units").value;

  let bmi;

  if (unit === "metric") {
    const heightM = height / 100;
    bmi = weight / (heightM * heightM);
  } else {
    const kg = weight * 0.453592;
    const m = height * 0.0254;
    bmi = kg / (m * m);
  }

  bmi = parseFloat(bmi.toFixed(2));

  // Determine category and image
  let category = "";
  let tip = "";
  let imageFile = "";

  if (bmi < 18.5) {
    category = "Underweight";
    tip = "Eat more healthy calories and consult a nutritionist.";
    imageFile = "body_underweight.png";
  } else if (bmi < 25) {
    category = "Normal weight";
    tip = "Great job! Keep a balanced diet and stay active.";
    imageFile = "body_normal.png";
  } else if (bmi < 30) {
    category = "Overweight";
    tip = "Try to add more physical activity and watch portion sizes.";
    imageFile = "body_overweight.png";
  } else {
    category = "Obesity";
    tip = "Consider working with a doctor or dietitian.";
    imageFile = "body_obesity.png";
  }

  // Show result
  resultText.innerHTML = `
    <h3>Your BMI: ${bmi}</h3>
    <p><strong>Category:</strong> ${category}</p>
    <p><strong>Tip:</strong> ${tip}</p>
  `;

  bodyImage.src = imageFile;
  bodyImage.alt = category;
  bodyImage.classList.remove("hidden");
  resultSection.classList.remove("hidden");
});
