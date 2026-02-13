"""
Modelos para The Center - e-commerce de prendas.
SQLite + Flask-SQLAlchemy.
"""
from extensions import db


class Product(db.Model):
    """Producto (prenda)."""
    __tablename__ = "products"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(60))
    image_url = db.Column(db.String(255))
    stock = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "price": self.price,
            "category": self.category,
            "image_url": self.image_url,
            "stock": self.stock,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
