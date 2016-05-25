import os
import sys
from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy import create_engine

Base = declarative_base()

class User(Base):
    __tablename__ = 'person'
    # Here we define columns for the table person
    # Notice that each column is also a normal Python instance attribute.
    u_id = Column(Integer, primary_key=True)
    u_name = Column(String(20), nullable=False)
    passwd = Column(String(20), nullable=False)
    food_pref = Column(String(20), nullable=False)
