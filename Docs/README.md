# SecurePassCheck

![](https://img.shields.io/badge/Web-App-yellow)
![Python](https://img.shields.io/badge/Python-3.13.2-blue?logo=python&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![HTML](https://img.shields.io/badge/HTML-E34F26?logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-1572B6?logo=css3&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-07405E?logo=sqlite&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?logo=nginx&logoColor=white)



SecurePassCheck is a full-stack password strength checker and manager featuring real-time validation, encryption, and advanced security hardening.


---

## Table of Contents
- [SecurePassCheck](#securepasscheck)
   - [Table of Contents](#table-of-contents)
   - [Project Overview](#project-overview)
   - [Features](#features)
   - [Quick Start with Docker](#quick-start-with-docker)
   - [Installation Steps](#installation-steps)
   - [Linux Demo](#linux-demo)
   - [Windows Demo](#windows-demo)
   - [🎥 Screencasts (To be uploaded very soon.)](#-screencasts-to-be-uploaded-very-soon)
   - [Registration Page](#registration-page)
   - [Login Page](#login-page)
   - [Frontend](#frontend)
   - [Backend](#backend)
   - [Password Encryption \& Secure Storage](#password-encryption--secure-storage)
   - [Cybersecurity Features](#cybersecurity-features)
   - [Key Project Dependencies](#key-project-dependencies)
   - [Disclaimer](#disclaimer)


---

## Project Overview
SecurePassCheck is a full-stack password strength checker and manager. It provides real-time frontend feedback, robust backend validation, secure password storage with hashing, and advanced security features including CSRF protection, input sanitation, rate limiting, and a self-hosted CAPTCHA for portfolio-ready cybersecurity hygiene.



## Features
The web app includes seven main components:

- **Real-Time Password Feedback**: Dynamic frontend checker with strength meter and tips.
- **Backend Validation**: Entropy calculation, regex policy checks, dictionary and breach verification.
- **Secure Storage**: Password hashing with bcrypt and SQLite database integration.
- **Authentication**: Registration and login with generic error messages to enhance security.
- **Cybersecurity Hardening**: CSRF protection, input validation, SQL injection prevention, and secure session management.
- **Anti-Bruteforce Measures**: Login attempt limiting and self-hosted CAPTCHA for privacy-friendly verification.


## Quick Start with Docker

Make sure you have **Docker** and **Docker Compose** installed on your system.  
You can follow the official installation guides for your operating system:

- [Install Docker Desktop on Windows](https://docs.docker.com/desktop/setup/install/windows-install/)
- [Install Docker Desktop on macOS](https://docs.docker.com/desktop/setup/install/mac-install/)
- [Install Docker Engine on Linux](https://docs.docker.com/desktop/setup/install/linux/)


## Installation Steps

1. Clone the repository:

```bash
git clone https://github.com/zenzeniou/SecurePassCheck.git

cd SecurePassCheck
```

2. Build and start the containers:
```bash
#For Windows
docker-compose up --build

#For Linux & macOS
sudo docker compose up --build
```

3. Access the application:
   - Navigate to http://localhost:5500
   - Or http://localhost:5500/register.html

4. Stop the application:
```bash
docker-compose down
```

## Linux Demo
![Linux Demo](/Assets/images/Linux_Installation.gif)


## Windows Demo
![Linux Demo](/Assets/images/Windows_Installation.gif)


## 🎥 Screencasts (To be uploaded very soon.)

In addition to the codebase, this project also comes with a series of screencasts that document both the full-stack development process and the cybersecurity protocols I implemented.

👉 Important Note:
Instead of storing these videos inside a /docs folder here on GitHub, I will provide unlisted YouTube links very soon.

Why?
The screencasts are large files and some of them are quite long. GitHub isn’t designed to handle video hosting at this scale — it would slow down the repository and cause issues for viewers. YouTube, on the other hand, makes them easy to watch, stream, and share without bloating the repo.

**📌 Part 1: Building the App (Full Stack).**
- These videos walk through the creation of the app step by step.
  - Intro & Preparation
  - Building HTML
  - Building JS
  - Building Backend (Python Flask)
  - Password Hashing & Database
  - Strengthen Logic (Frontend & Backend)

💡 In these screencasts, we code along, but not in a slow step-by-step tutorial format. To respect your time, I speed up most parts and only pause to explain sections that are interesting or important to highlight. The goal is to show you my approach, reasoning, and skills, not just raw typing.

💡 If you have any questions about specific parts of the code — or if you’d like to suggest a better approach — I’d love to hear your feedback! You can always reach me via my website’s contact section: 
zenios-zeniou.online/contact

**Part 2: Cybersecurity Protocols (Exploits & Defense).**

This is the part I personally find most exciting: hacking my own app to show vulnerabilities and then defending against them.

- XSS Protection
- CSRF Protection
- Session & Cookies Protection
- SQL Injection Protection
- Brute Force Protection

🔐 My approach here is:
1. First, demonstrate the exploitation (ethical hacking).
2. Then, write the defense code to patch the vulnerability.
3. Finally, show that the attack no longer works.

💡 This way, you can see both the mindset of an attacker and the practical coding defenses that shut them down.


**⚠️ A Note on Debugging**:

‼️These screencasts focus on the coding phase only. They don’t show the debugging and research phase, which often took much longer than writing the code itself.

‼️ Because of this, the final codebase in this repository may differ from what you see in the videos. Consider the screencasts as a window into my approach and methodology, rather than an exact copy of the repository.

---


## Registration Page
The Register Page allows new users to create an account securely, combining user-friendly guidance with strong backend validation to ensure account safety and password strength.

![Login_Page](/Assets/images/Register.png "Login Page")

- **Email and Password Inputs**: Users provide their email and password to register.
- **Password Tooltip**: Offers tips for creating a strong password.
  1. Minimum 8 characters.
  2. Mix uppercase, lowercase, numbers, and symbols.
  3. Avoid common patterns (e.g., "password", "12345").
- **CAPTCHA Verification**: Self-hosted CAPTCHA to prevent automated registrations.
- **Email Uniqueness Check**: Verifies if the email is already in the SQLite database.
- **Login Suggestion**: Prompts users to login if they already have an account.
- **Rate Limiting**: Flask Limiter prevents abuse and bot signups.
- **Email Validation**: Regex ensures proper email formatting.
- **Password Checks**:
  1. Enforces password length (6–12 characters) and policy compliance.
  2. Checks against a list of the most common passwords (2024–25).
  3. Integrates Have I Been Pwned API to detect previously compromised passwords.

---

## Login Page
The Login Page provides a secure entry point for existing users, combining strong input validation with bot prevention and rate limiting to protect accounts.

![Login_Page](/Assets/images/Login.png "Login Page")

- **Email and Password Inputs**: Users enter their registered credentials.
- **CAPTCHA Verification**: Self-hosted CAPTCHA prevents automated login attempts.
- **Account Registration Prompt**: If users don’t have an account, a link navigates them to the Register Page.
- **Rate Limiting**: Limits to 3 failed login attempts; users must wait 1–2 minutes before retrying.
- **Input Validation**: Regex checks for email format and sanitizes all inputs to prevent attacks.
- **Successful Login**: Users are redirected to the Success Page upon correct credentials.

---


## Frontend
The frontend of SecurePassCheck is designed to provide a responsive, interactive, and security-aware user experience. It serves as the first line of defense by guiding users toward strong password practices, integrating with backend APIs for real-time validation, and handling security tokens and CAPTCHAs gracefully.

**Responsibilities**:
- Present secure login and registration pages with real-time password strength feedback.
- Handle CSRF tokens, CAPTCHAs, and rate-limit responses directly from the backend.
- Provide visual guidance (strength meters, tooltips, confirmation checks) without leaking backend validation logic.
- Enhance usability with show/hide password toggles, error messages, and smooth user interactions.

**Key Features**:
- **Login Page (index.html + login-handler.js)**:
  1. Submits credentials securely with CSRF token headers.
  2. Integrates server-generated CAPTCHA to block automated login attempts.
  3. Displays backend errors (invalid CAPTCHA, incorrect password, rate limits) directly in the UI.
  4. Enforces input sanitation and redirects users to a secure success page after authentication.

- **Register Page (register.html + register-handler.js)**:
  1. Real-time password strength meter with visual feedback (weak → strong).
  2. Inline password confirmation checks to reduce user errors.
  3. Advanced strength validation by calling the backend /check_password_strength endpoint for:
   - Common password detection.
   - Breach exposure via Have I Been Pwned API.
   - Password entropy and policy compliance.
  4. CAPTCHA protection to prevent bot-created accounts.
  5. CSRF-protected registration requests with rate-limiting (3 per minute).

- **Shared Security Utilities**:
   1. csrf.js -> Fetches and attaches CSRF tokens automatically to every request.
   2. rate-limit-handler.js -> Handles 429 responses gracefully, showing friendly messages instead of breaking the UX.
   

**Why this matters?**:
  - Secure client-side engineering -> Handling CSRF Tokens, CAPTCHAs, and backend driven validations.
  - User experience focus → Clear error handling, real-time feedback, and visual guidance.
  - Real-world practices → Separation of concerns (frontend guides, backend enforces), anti-bot measures, and rate-limiting awareness.    

---

## Backend

The backend, built with Flask, provides all the security-critical logic and enforces robust protections around authentication and password handling. It ensures data integrity, safe storage, and resilience against common web attacks.


**Responsibilities**:

- Authentication & Session Management: Secure login/registration with Flask-Login, bcrypt password hashing, and session hardening (HttpOnly, SameSite, limited lifetime).
- Password Security:
  1. Entropy calculation for strength scoring.
  2. Policy enforcement (length, uppercase/lowercase, digits, symbols).
  3. Common-password dictionary check.
  4. Breach detection using Have I Been Pwned (k-Anonymity model).
- Rate Limiting & Abuse Prevention: Flask-Limiter enforces strict limits (e.g., 3 login attempts/min, 7 CAPTCHA reloads/min).
- CSRF Protection: Flask-WTF CSRF tokens prevent cross-site request forgery.
- CAPTCHA System: In-memory math CAPTCHAs with expiration and noise-based image generation to stop automated bots.
- Database: SQLite + SQLAlchemy for structured, safe user storage.

**Interesting Highlights**:
- Custom CAPTCHA engine (math-based, not outsourced), demonstrating knowledge of security-by-design.
- Session hardening: cookies set with HttpOnly and SameSite policies, reducing XSS and CSRF risks.
- Modular code organization (auth.py, utils.py, captcha_utils.py, models.py) for clean separation of concerns.
- Integration of security rate-limits not only on login/register but also on password strength checks and CAPTCHA reloads—covering every possible abuse vector.
- Real-world breach API integration (HIBP) to discourage weak/reused passwords in practice.

---


## Password Encryption & Secure Storage

**Goal**: Securely store user credentials with proper cryptography, database management, and strong security practices.

- **Database Setup (SQLite + SQLAlchemy)**: A User model stores user credentials, enforcing unique email addresses. The database is managed through SQLAlchemy (ORM) and migrations with Flask-Migrate for version control.
  
- **Password Hashing (bcrypt)**: Raw passwords are never stored in plaintext. Instead, bcrypt generates a strong salted hash, making stored credentials resistant to brute-force and rainbow table attacks.
  
- **Registration Flow**: 
  1. Input validation -> emails are cleaned, normalized, and validated with regex.
  2. CAPTCHA check -> ensures the registration attempt is human.
  3. Password checks -> must follow policy rules, not be too common, and not appear in the Have I Been Pwned database.
  4. On success, the password is hashed and securely stored in the database.
   
- **Login Flow**:
  1. Email and password are validated against the stored bcrypt hash.
  2. CAPTCHA ensures protection from bots.
  3. Sessions are managed securely with HttpOnly, SameSite=Lax, and configurable lifetimes.
  4. oth login and registration endpoints are rate-limited (3 attempts per minute) to prevent brute-force attacks. 

- **CSRF Protection**: A /csrf-token endpoint issues CSRF tokens, and invalid/missing tokens are rejected with a clear error response.
  
- **Secure Session & Cookies**: 
  1. HttpOnly prevents JavaScript from accessing cookies.
  2. SameSite=Lax mitigates CSRF.
  3. Sessions expire after 24 hours by default.

- **API Hardening**: 
  1. Input sanitization is enforced at every stage.
  2. Custom error handling prevents leaking sensitive info (e.g., generic “Incorrect email or password”).
  3. Protected routes require an active session with a verified user ID.

- **Inspection & Management**: The database can be connected to DataGrip for clean inspection of stored (hashed) user credentials and schema management.


---

## Cybersecurity Features

Security is at the core of this project. Each feature was carefully designed to defend against common web application vulnerabilities and exploitation attempts.

**XSS Protection**:

1. What is XSS?
   Cross-Site Scripting (XSS) is an injection attack where malicious scripts are executed in a user’s browser, often used to steal cookies, hijack sessions, or inject phishing content.

2. Vulnerability on my website / Possible attacks.
   Forms like login, registration, or CAPTCHA inputs could be abused to inject <script> tags or malicious payloads if inputs were not sanitized. This could allow attackers to run arbitrary JavaScript in a victim’s session.

3. Defense / Security implementation I used.
   - All inputs are sanitized and validated on both frontend and backend.
   - Session cookies are set to HttpOnly, preventing client-side JavaScript from accessing them.
   - Strict separation of user input from rendered HTML templates.

---


**CSRF protection (Flask-WTF)**:

1. What is CSRF?
   Cross-Site Request Forgery (CSRF) tricks authenticated users into executing unwanted actions on a web app (e.g., unknowingly submitting a form to change a password).

2. Vulnerability on my website / Possible attacks.
   Without CSRF defense, a logged-in user could be tricked into visiting a malicious page that auto-submits login or registration requests on their behalf.

3. Defense / Security implementation I used.  
   - Implemented Flask-WTF CSRF protection.
   - Every state-changing request (login, register, CAPTCHA reload) includes a validated CSRF token.
   - Tokens are rotated and stored in same-site cookies, making CSRF exploitation much harder.

---


**Secure session management & Cookies**:

1. What is Session Management & Cookies?
   Sessions allow the server to identify logged-in users across requests. If session cookies are not secured, attackers can hijack accounts.

2. Vulnerability on my website / Possible attacks.
   Session fixation, session theft via XSS, or insecure cookie storage could compromise accounts.

3. Defense / Security implementation I used.
   - Cookies flagged as HttpOnly and SameSite=Lax to reduce XSS and CSRF vectors.
   - Sessions are short-lived (24 hours max).
   - Explicit session clearing on login prevents session fixation.
   - Passwords stored using bcrypt hashing — no plaintext ever touches the database.

---


**SQL Injection Protection**:

1. What is SQL?
   SQLi occurs when unsanitized input manipulates database queries, allowing attackers to bypass authentication or extract sensitive data.

2. Vulnerability on my website / Possible attacks.
   Login/registration fields could be injected with malicious SQL such as ' OR 1=1-- to bypass login.

3. Defense / Security implementation I used.
   - All database operations are done via SQLAlchemy ORM, which parameterizes queries and prevents injection.
   - No raw SQL concatenation is used.
   - User inputs (email, password) are validated and sanitized before database interaction.

---


**Brute Force Protection**:

1. What is Bruteforce?
   A brute-force attack repeatedly tries email/password combinations until it finds valid credentials.

2. Vulnerability on my website / Possible attacks.
   Attackers could script login attempts to guess weak passwords, overload CAPTCHA, or abuse password-strength checking endpoints.

3. Defense / Security implementation I used.
   - Rate limiting (Flask-Limiter):
    -> Max 3 login attempts/minute.
    -> Max 3 registration attempts/minute.
    -> Max 7 CAPTCHA reloads/minute.
    -> Max 30 password-strength checks/minute.  

  - Self-hosted CAPTCHA: Math-based image CAPTCHA prevents bot automation.
  - Progressive blocking: Too many failed logins trigger cooldown periods, slowing brute-force attempts.
  
---


## Key Project Dependencies

1. Flask & Extensions:
   - flask-bcrypt -> Secure password hashing.
   - flask-wtf -> CSRF protection and form handling.
   - flask-limiter -> Rate limiting to prevent brute force attacks.
   - flask-login -> Session and user authentication management.
   - flask-sqlalchemy -> ORM for database models.
   - flask-migrate -> Database migrations.

2. Security & Cryptography:
   - cryptography -> Core cryptographic functions.
   - bandit -> Security static analysis tool.
   - pyOpenSSL -> SSL/TLS utilities.

3. Database & Data Handling:
   - SQLAlchemy -> Database ORM.
   - python-dotenv -> Manage secrets and enviroment variables securely.

4. CAPTCHA and Image Processing:
   - Pillow -> Image manipulation and rendering.
   - opencv-python -> Image Processing.
   - pytesseract -> OCR based CAPTCHA verification.

---


## Disclaimer
This project is intended for educational and research purposes only.
All demonstrations, screencasts, and examples of vulnerabilities are shown strictly to highlight common security flaws and how to defend against them.

I do not encourage, promote, or endorse the use of these techniques for malicious or illegal activity.

Any exploitation techniques demonstrated are performed in a controlled environment for the sole purpose of learning and improving cybersecurity practices.

Viewers and users of this project are expected to follow ethical hacking principles and comply with all applicable laws.
