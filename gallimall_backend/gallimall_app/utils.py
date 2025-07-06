# gallimall_app/utils.py
import random
import string
from .models import Cart

def generate_cart_code(length=11):
    while True:
        code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))
        if not Cart.objects.filter(cart_code=code).exists():
            return code
