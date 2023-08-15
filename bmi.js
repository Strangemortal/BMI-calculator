document.getElementById("calculate-btn").addEventListener("click", function () {
  const weight = parseFloat(document.getElementById("weight").value);
  const height = parseFloat(document.getElementById("height").value) / 100; // Convert to meters

  if (weight && height) {
    const bmi = weight / (height * height);
    let bmiClassification = "";
    let cellId = "";

    if (bmi < 18.5) {
      bmiClassification = "Underweight";
      cellId = "underweight";
    } else if (bmi < 25) {
      bmiClassification = "Normal";
      cellId = "normal";
    } else if (bmi < 30) {
      bmiClassification = "Overweight";
      cellId = "overweight";
    } else {
      bmiClassification = "Obese";
      cellId = "obese";
    }

    document.getElementById("result").innerHTML = `Your BMI: ${bmi.toFixed(
      2
    )} - ${bmiClassification}`;

    // Highlight the corresponding table cell
    document.getElementById(cellId).classList.add("highlight");
  } else {
    document.getElementById("result").innerHTML =
      "Please enter valid weight and height.";
  }
});
