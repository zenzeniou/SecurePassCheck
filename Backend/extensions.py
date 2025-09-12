from flask_bcrypt import Bcrypt
from flask_limiter import Limiter
from flask_login import LoginManager
from flask_wtf.csrf import CSRFProtect
from flask_limiter.util import get_remote_address

csrf = CSRFProtect()
bcrypt = Bcrypt()
login_manager = LoginManager()
limiter = Limiter(key_func=get_remote_address)
