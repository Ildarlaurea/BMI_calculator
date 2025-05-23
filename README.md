# 🧮 BMI Calculator — FastAPI + Frontend

A clean, modern **Body Mass Index (BMI) Calculator** built with FastAPI and a black-and-white themed frontend. This app calculates your BMI, displays body type visuals, and stores your results for review.

---

## 🚀 Features

🧠 Accurate BMI Calculation (metric + imperial support)  
🖼️ Visual Body Type Images based on BMI category  
📜 BMI History Tracking (if backend used)  
🗑️ Delete Single or All Records  
🎨 Black-and-white UI Design (clean, responsive)  
🔥 GitHub Pages-compatible (frontend only)

---

## 📦 Installation (Backend + Frontend)

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Ildarlaurea/bmi-calculator.git
cd bmi-calculator
```

### 2️⃣ Install Dependencies

```bash
pip install fastapi uvicorn sqlalchemy
```

### 3️⃣ Run the App

```bash
uvicorn main:app --reload
```

Then open:  
👉 `http://127.0.0.1:8000/static`

---

## 📂 Project Structure

```
bmi-calculator/
├── main.py               # FastAPI app
├── models.py             # SQLAlchemy model
├── database.py           # DB setup
├── bmi_model.py          # BMI logic
├── static/
│   ├── index.html        # Frontend
│   ├── style.css
│   ├── script.js
│   ├── intro-image.jpg
│   ├── body_underweight.png
│   ├── body_normal.png
│   ├── body_overweight.png
│   └── body_obesity.png
```

---

## 🧪 Usage

1. Enter weight and height  
2. Click "Calculate"  
3. View BMI + category + tip + image  
4. View or clear your BMI history

✅ Fully responsive and mobile-friendly

---

## 📸 Screenshots

Overview            
![image](https://github.com/user-attachments/assets/1629f5d5-9b2c-4cd8-b34f-f52955b03342)

Calculator    
![image](https://github.com/user-attachments/assets/5d7cca9a-a0d9-44aa-86f1-80f2bacf77ed)

Results & History
![image](https://github.com/user-attachments/assets/f07a0413-7dd0-4433-b5e5-b27300fedcf8)


---

## 🔧 Future Enhancements

- 📊 Graphs to visualize BMI trends  
- 👥 Multi-user login support  
- 📈 Dashboard with analytics  
- 📱 PWA (installable mobile app)

---

## 🤝 Contributing

Pull requests are welcome!  
If you have ideas to improve this project, feel free to fork and submit a PR.

---

## 📜 License

MIT License © [Ildar Mamin](https://github.com/Ildarlaurea)
