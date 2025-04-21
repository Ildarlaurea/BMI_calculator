class BMICalculator:
    def __init__(self, weight, height, unit="metric"):
        if unit == "imperial":
            self.weight = weight * 0.453592
            self.height_m = height * 0.0254
        else:
            self.weight = weight
            self.height_m = height / 100

    def calculate_bmi(self):
        bmi = self.weight / (self.height_m ** 2)
        return round(bmi, 2)

    def get_category(self):
        bmi = self.calculate_bmi()
        if bmi < 18.5:
            return "Underweight"
        elif 18.5 <= bmi < 25:
            return "Normal weight"
        elif 25 <= bmi < 30:
            return "Overweight"
        else:
            return "Obesity"

    def get_health_tip(self):
        category = self.get_category()
        tips = {
            "Underweight": "Eat more healthy calories and consult a nutritionist.",
            "Normal weight": "Great job! Keep a balanced diet and stay active.",
            "Overweight": "Try to add more physical activity and watch portion sizes.",
            "Obesity": "Consider working with a doctor or dietitian to plan a healthy routine."
        }
        return tips.get(category, "")
