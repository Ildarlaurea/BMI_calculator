from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from database import SessionLocal, engine
from models import Base, BMIRecord
from bmi_model import BMICalculator

# Initialize FastAPI
app = FastAPI()
Base.metadata.create_all(bind=engine)

# Mount frontend at /static
app.mount("/static", StaticFiles(directory="static", html=True), name="static")

# DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic models
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

# API routes
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

@app.get("/bmi/history", response_model=List[BMIHistoryResponse])
def get_bmi_history(
    db: Session = Depends(get_db),
    min_bmi: float = Query(None),
    max_bmi: float = Query(None),
    category: str = Query(None)
):
    query = db.query(BMIRecord)
    if min_bmi is not None:
        query = query.filter(BMIRecord.bmi >= min_bmi)
    if max_bmi is not None:
        query = query.filter(BMIRecord.bmi <= max_bmi)
    if category:
        query = query.filter(BMIRecord.category == category)

    return query.order_by(BMIRecord.timestamp.desc()).all()

@app.delete("/bmi/{record_id}")
def delete_bmi_record(record_id: int, db: Session = Depends(get_db)):
    record = db.query(BMIRecord).filter(BMIRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")

    db.delete(record)
    db.commit()
    return {"message": f"Record {record_id} deleted successfully"}
