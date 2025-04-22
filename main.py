from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from database import SessionLocal, engine
from models import Base, BMIRecord
from bmi_model import BMICalculator

# App init
app = FastAPI()
Base.metadata.create_all(bind=engine)

# Serve static folder for frontend
app.mount("/", StaticFiles(directory="static", html=True), name="static")

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic schemas
class BMIInput(BaseModel):
    weight: float
    height: float
    unit: str = "metric"

class BMIResponse(BaseModel):
    bmi: float
    category: str
    tip: str

class BMIHistoryResponse(BaseModel):
    id: int
    weight: float
    height: float
    unit: str
    bmi: float
    category: str
    tip: str
    timestamp: datetime

    model_config = {
        "from_attributes": True
    }

# POST /bmi → calculate and store
@app.post("/bmi", response_model=BMIResponse)
def calculate_bmi(data: BMIInput, db: Session = Depends(get_db)):
    bmi_calc = BMICalculator(weight=data.weight, height=data.height, unit=data.unit)
    bmi = bmi_calc.calculate_bmi()
    category = bmi_calc.get_category()
    tip = bmi_calc.get_health_tip()

    record = BMIRecord(
        weight=data.weight,
        height=data.height,
        unit=data.unit,
        bmi=bmi,
        category=category,
        tip=tip
    )
    db.add(record)
    db.commit()

    return BMIResponse(bmi=bmi, category=category, tip=tip)

# GET /bmi/history → return all
@app.get("/bmi/history", response_model=List[BMIHistoryResponse])
def get_bmi_history(db: Session = Depends(get_db)):
    return db.query(BMIRecord).order_by(BMIRecord.timestamp.desc()).all()

# DELETE /bmi/{id} → remove one
@app.delete("/bmi/{record_id}")
def delete_bmi_record(record_id: int, db: Session = Depends(get_db)):
    record = db.query(BMIRecord).filter(BMIRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")

    db.delete(record)
    db.commit()
    return {"message": f"Record {record_id} deleted successfully"}

# DELETE /bmi/all → remove all
@app.delete("/bmi/all")
def delete_all_bmi_records(db: Session = Depends(get_db)):
    db.query(BMIRecord).delete()
    db.commit()
    return {"message": "All BMI records deleted"}
