import re
import math
import hashlib
import requests

#Regex validation for policy compliance.
def validate_password_policy(password):
    if not 8 <= len(password) <= 128:
        return False
    
    return all([
        re.search(r'[a-z]',password),
        re.search(r'[A-Z]',password),
        re.search(r'\d',password),
        re.search(r'[!@#$%^&*(),.?":{}|<>]',password),
    ])
    

#Entropy calculation.
def calculate_entropy(password):
    index = 0
    
    if re.search(r'[a-z]',password):
        index += 26
    if re.search(r'[A-Z]',password):
        index += 26
    if re.search(r'[0-9]',password):
        index += 10
    if re.search(r'[!@#$%^&*(),.?":{}|<>]',password):
        index += 32
    
    if index == 0:
        return 0
    
    return round( len(password) * math.log2(index), 2 )


#Dictionary check for common passwords.
with open("common_passwds.txt","r") as list:
    common_passwords = set(line.strip() for line in list)
    
    
# k-Anonymity model using "Have I Been Pwned API"
def check_pwned(password):
    sha1 = hashlib.sha1(password.encode()).hexdigest().upper()
    
    prefix_five = sha1[:5]
    suffix = sha1[5:]
    
    url = f"https://api.pwnedpasswords.com/range/{prefix_five}"
    result = requests.get(url)
    
    if result.status_code != 200:
        return False
    return any(line.split(":")[0] == suffix for line in result.text.splitlines())
