import io
import time
import hmac
import base64
import secrets
from typing import Tuple
from PIL import Image, ImageDraw, ImageFont, ImageFilter

#In memory store: {captcha_id: (expected_answer, expires_at)}
_CAPTCHA_STORE = {}

#3 (180s) minutes is enough for a login/registration form
TIME_TO_LIVE = 180

def _now() -> int:
    return int(time.time())

def _cleanup_expired():
    now = _now()
    expired = [k for k, (_, exp) in _CAPTCHA_STORE.items() if exp < now]
    for k in expired:
        _CAPTCHA_STORE.pop(k, None)

        
def _draw_noise(draw:ImageDraw.ImageDraw, w:int, h:int):
    #Light background noise
    for _ in range(12):
        x1 , y1 = secrets.randbelow(w) , secrets.randbelow(h)
        x2 , y2 = secrets.randbelow(w) , secrets.randbelow(h)
        draw.line((x1,y1,x2,y2), width=1)
        
def _get_font(size: int=32) -> ImageFont.ImageFont:
    try:
        return ImageFont.truetype("arial.ttf", size=size)
    except:
        return ImageFont.load_default()
    
def _generate_equation() -> Tuple[str,str]:
    #small arithmetic challenge
    a = secrets.randbelow(41) + 10 #10..50
    b = secrets.randbelow(41) + 10
    op = secrets.choice(["+","-","*"])
    if op == "+":
        answer = a + b
    elif op == "-":
        if b > a:
            a,b = b,a #Prevent non negative answer
        answer = a - b
    else:
        a = secrets.randbelow(11) + 2 #2..12
        b = secrets.randbelow(11) + 2
        answer = a * b
    return f"{a} {op} {b} =", str(answer)


def generate_captcha() -> Tuple[str,str]:
    #This function will return (captcha_id, data_url)
    
    _cleanup_expired()
    text , answer = _generate_equation()
    
    w,h = 180,60
    img = Image.new("RGB",(w,h),(240,242,245))
    draw = ImageDraw.Draw(img)
    _draw_noise(draw,w,h)
    
    font = _get_font(34)
    draw.text((12,10),text,font=font, fill=(20,20,20))
    img = img.filter(ImageFilter.SMOOTH_MORE)
    
    buf = io.BytesIO()
    img.save(buf,format="PNG")
    data_url = "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode()
    
    captcha_id = secrets.token_urlsafe(20)
    _CAPTCHA_STORE[captcha_id] = (answer,_now() + TIME_TO_LIVE)
    return captcha_id, data_url


def verify_captcha(captcha_id: str, user_answer: str) -> bool:    
    if not captcha_id or not user_answer:
        print("DEBUG: Missing captcha_id or user_answer")
        return False
    
    record = _CAPTCHA_STORE.get(captcha_id)
    if not record:
        return False

    expected, expires_at = record
    current_time = _now()
    
    if current_time > expires_at:
        _CAPTCHA_STORE.pop(captcha_id, None)
        return False

    normalized_user = user_answer.strip().lower()
    normalized_expected = expected.strip().lower()
    
    result = hmac.compare_digest(normalized_user, normalized_expected)
    
    if result:
        _CAPTCHA_STORE.pop(captcha_id, None)
        print("CAPTCHA verified successfully")
        return True
    
    print("CAPTCHA comparison failed")
    return False
