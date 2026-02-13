"""
The Center - Backend (Flask + PostgreSQL).
Servidor en http://localhost:5000
"""
import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

from extensions import db

load_dotenv()

app = Flask(__name__)
CORS(app)

# PostgreSQL (DATABASE_URI obligatorio en .env)
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URI")
if not app.config["SQLALCHEMY_DATABASE_URI"]:
    raise ValueError("Falta DATABASE_URI en .env (ej: postgresql://user:pass@localhost:5432/the_center)")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

# Importar modelos después de configurar db
from models import Product


@app.route("/")
def index():
    return jsonify({"message": "The Center API", "version": "0.1.0"})


@app.route("/api/health")
def health():
    """Endpoint de prueba para verificar comunicación frontend-backend."""
    return jsonify({
        "status": "ok",
        "service": "the-center-backend",
        "database": "connected"
    })


@app.route("/api/products")
def list_products():
    """Listar productos (preparado para PBI 1.2)."""
    products = Product.query.all()
    return jsonify([p.to_dict() for p in products])


with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
