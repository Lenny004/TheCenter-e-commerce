"""Objeto db compartido para evitar import circular entre app y models."""
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
