import re
from flask_bcrypt import Bcrypt
from models import database, User
from extensions import csrf, limiter
from flask import Blueprint, request, jsonify, session
from captcha_utils import generate_captcha, verify_captcha
from utils import validate_password_policy, check_pwned, common_passwords, calculate_entropy


auth_database = Blueprint('auth', __name__)
bcrypt = Bcrypt()

EMAIL_REGEX = re.compile(r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$")

def clean_email(value: str) -> str:
    return (value or "").strip().lower()

def validate_email(value: str) -> bool:
    return bool(EMAIL_REGEX.match(value)) and (5 <= len(value) <= 254)


# Password Strength Helper
@auth_database.route("/check_password_strength", methods=["POST"])
@csrf.exempt
@limiter.limit("30 per minute", error_message="Too many requests to check password strength. Please wait a minute.")
def check_strength():
    data = request.get_json(silent=True) or {}
    password = (data.get("password") or "")[:128]

    entropy = calculate_entropy(password)
    is_common = password.lower() in common_passwords
    is_pwned = check_pwned(password)
    policy_valid = validate_password_policy(password)

    return jsonify({
        "entropy": entropy,
        "is_common": is_common,
        "is_pwned": is_pwned,
        "policy_valid": policy_valid
    }), 200


# CAPTCHA
@auth_database.route("/captcha/new", methods=["GET"])
@limiter.limit("7 per minute", error_message="Too many CAPTCHA reloads. Please wait a minute before trying again.")
def captcha_new():
    try:         
        cid,data_url = generate_captcha()
        return jsonify({
            "captcha_id": cid,
            "image": data_url,
        }), 200
        
    except Exception as e:
        print("CAPTCHA generation failed:", e)
        return jsonify({"error": "CAPTCHA generation failed"}), 500


# Register
@auth_database.route("/register", methods=["POST"])
@csrf.exempt
@limiter.limit("3 per minute", error_message="Too many registration attempts. Please wait a minute before trying again.")
def register():
    data = request.get_json(silent=True) or {}
    email = clean_email(data.get("email"))
    password = (data.get("password") or "").strip()

    captcha_id = (data.get("captcha_id") or "").strip()
    captcha_answer = (data.get("captcha_answer") or "").strip()

    if not email or not password:
        return jsonify({"error": "Email and password required!"}), 400

    if not validate_email(email):
        return jsonify({"error": "Invalid email format"}), 400

    if not verify_captcha(captcha_id, captcha_answer):
        return jsonify({"error": "CAPTCHA invalid or expired", "captcha_invalid": True}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists! Try logging in."}), 409

    if not validate_password_policy(password):
        return jsonify({"error": "Password does not meet policy requirements"}), 400

    if password.lower() in common_passwords:
        return jsonify({"error": "Password is too common"}), 400

    if check_pwned(password):
        return jsonify({"error": "Password has appeared in a data breach"}), 400

    password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    new_user = User(email=email, password_hash=password_hash)
    database.session.add(new_user)
    database.session.commit()

    return jsonify({"message": "User registered successfully!"}), 201


# Login
@auth_database.route("/login", methods=["POST"])
@csrf.exempt
@limiter.limit("3 per minute", error_message="Too many login attempts. Please wait a minute before trying again.")
def login():
    try:
        data = request.get_json(silent=True) or {}
        email = data.get("email", "").strip().lower()
        password = (data.get("password") or "")

        captcha_id = (data.get("captcha_id") or "").strip()
        captcha_answer = (data.get("captcha_answer") or "").strip()

        if not email or not password:
            return jsonify({"error": "Email and password are required."}), 400

        if not validate_email(email):
            return jsonify({"error": "Invalid email format"}), 400

        if not verify_captcha(captcha_id, captcha_answer):
            return jsonify({"error": "CAPTCHA invalid or expired", "captcha_invalid": True}), 400

        user = User.query.filter_by(email=email).first()
        if not user or not bcrypt.check_password_hash(user.password_hash, password):
            return jsonify({"error": "Incorrect email or password"}), 401

        # Reset captcha reloads on successful login
        session['captcha_reloads'] = 0

        session.clear()
        session["user_id"] = user.id
        session.permanent = True
        print(f"Successful login for {email}, user_id: {user.id}")

        return jsonify({"redirect": "/success"}), 200

    except Exception as e:
        print(f"Error in login function: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


# Protected route
@auth_database.route("/protected", methods=["GET"])
def protected():
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401
    return jsonify({"message": "You are logged in and authorized!"}), 200
