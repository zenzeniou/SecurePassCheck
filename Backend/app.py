import os
from flask_cors import CORS
from dotenv import load_dotenv
from datetime import timedelta
from auth import auth_database
from flask_migrate import Migrate
from models import database, User
from flask_wtf.csrf import CSRFError, generate_csrf
from flask import Flask, jsonify, render_template, session
from extensions import csrf, bcrypt, login_manager, limiter

load_dotenv()

app = Flask(__name__)

secret = os.getenv("SECRET_KEY")
app.config["SECRET_KEY"] = secret

# Session and Cookies
app.config.update(
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax",
    SESSION_COOKIE_SECURE=False,
    SESSION_COOKIE_DOMAIN=None,
    REMEMBER_COOKIE_HTTPONLY=True,
    REMEMBER_COOKIE_SECURE=False,
    PERMANENT_SESSION_LIFETIME=timedelta(hours=24),
)

# Database and CORS
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get("SQLALCHEMY_DATABASE_URI", "sqlite:///users.db")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

CORS(app, 
     origins=["http://localhost:5500", "http://127.0.0.1:5500", "http://frontend:80"], 
     supports_credentials=True,
     allow_headers=["Content-Type", "X-CSRFToken", "Authorization", "X-Requested-With"], 
     methods=["GET", "POST", "OPTIONS", "PUT", "DELETE"],
     expose_headers=["Set-Cookie", "X-CSRFToken"])

database.init_app(app)
bcrypt.init_app(app)
migrate = Migrate(app, database)


def rate_limit_exceeded_handler(e):
    return jsonify({
        "error" : "CAPTCHA rate limit exceeded.",
        "message" : "Too many attempts. Please wait a few minutes before trying again."
    }),429

csrf.init_app(app)
login_manager.init_app(app)
limiter.init_app(app)
limiter._rate_limit_exceeded_callback = rate_limit_exceeded_handler


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

app.register_blueprint(auth_database)

@app.route("/csrf-token", methods=["GET"])
def get_csrf_token():
    token = generate_csrf()
    resp = jsonify({"csrf_token": token})
    resp.set_cookie("XSRF-TOKEN", token, samesite="Lax", secure=False, httponly=False)
    return resp

@app.errorhandler(CSRFError)
def handle_csrf_error(event):
    return jsonify({"error": "CSRF failed: " + (event.description or "Invalid or missing token")})

@app.route("/success")
def success():
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401
    return render_template("success.html")

if __name__ == "__main__":
    with app.app_context():
        database.create_all()
        pass

    app.run(host="0.0.0.0",debug=False, port=5050)
