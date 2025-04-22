document.getElementById("bmi-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const weight = parseFloat(document.getElementById("weight").value);
  const height = parseFloat(document.getElementById("height").value);
  const result = document.getElementById("result");

  if (!weight || !height) {
    result.innerHTML = "<p>Please enter valid weight and height.</p>";
    return;
  }

  const heightMeters = height / 100;
  const bmi = (weight / (heightMeters * heightMeters)).toFixed(1);

  let category = "";
  let image = "";

  if (bmi < 18.5) {
    category = "Underweight";
    image = "underweight.png";
  } else if (bmi < 25) {
    category = "Normal weight";
    image = "normal.png";
  } else if (bmi < 30) {
    category = "Overweight";
    image = "overweight.png";
  } else {
    category = "Obese";
    image = "obese.png";
  }

  result.innerHTML = `
    <p>Your BMI is <strong>${bmi}</strong> — <strong>${category}</strong></p>
    <img src="${image}" alt="${category}" />
  `;
});
