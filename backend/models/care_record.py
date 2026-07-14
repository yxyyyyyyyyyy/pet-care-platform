from extensions import db
from datetime import datetime

class CareRecord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    pet_id = db.Column(db.Integer, db.ForeignKey('pet.id'), nullable=False)
    record_type = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=True)
    date = db.Column(db.Date, nullable=False)
    veterinarian = db.Column(db.String(100), nullable=True)
    cost = db.Column(db.Float, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

    pet = db.relationship('Pet', backref=db.backref('care_records', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'pet_id': self.pet_id,
            'record_type': self.record_type,
            'description': self.description,
            'date': self.date.isoformat() if self.date else None,
            'veterinarian': self.veterinarian,
            'cost': self.cost,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
