from flask_sqlalchemy import SQLAlchemy

database = SQLAlchemy()

class User(database.Model):
    id = database.Column(database.Integer, primary_key=True)
    email = database.Column(database.String(120), unique=True, nullable=False)
    password_hash = database.Column(database.String(128), nullable=False)

    def __repr__(self):
        return f"<User {self.email}>"
