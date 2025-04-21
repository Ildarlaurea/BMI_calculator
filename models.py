from sqlalchemy import Column, Integer, Float, String, DateTime
from datetime import datetime, UTC
from database import Base

class BMIRecord(Base):
    __tablename__ = "bmi_records"

    id = Column(Integer, primary_key=True, index=True)
    weight = Column(Float, nullable=False)
    height = Column(Float, nullable=False)
    unit = Column(String, default="metric")
    bmi = Column(Float)
    category = Column(String)
    tip = Column(String)
    timestamp = Column(DateTime, default=lambda: datetime.now(UTC))  # ✅ fixed
