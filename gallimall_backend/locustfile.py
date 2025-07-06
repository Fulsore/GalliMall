# from locust import HttpUser, task, between
# import random

# EMAIL = "anil@gmail.com"
# PASSWORD = "anil"

# PRODUCT_IDS = [1, 2, 3, 5, 8]   # ✅ Real product IDs
# SHOP_ID = 1                    # ✅ Real shop ID

# class GalliMallUser(HttpUser):
#     wait_time = between(1, 3)

#     def on_start(self):
#         self.login()

#     def login(self):
#         try:
#             res = self.client.post("/api/login/", json={
#                 "email": EMAIL,
#                 "password": PASSWORD
#             })
#             if res.status_code == 200 and "token" in res.json():
#                 self.token = res.json()["token"]["access"]
#                 self.client.headers.update({
#                     "Authorization": f"Bearer {self.token}"
#                 })
#                 print("✅ Login successful")
#             else:
#                 print(f"❌ Login failed: {res.status_code} - {res.text}")
#         except Exception as e:
#             print(f"🔥 Login exception: {str(e)}")

#     @task(2)
#     def view_products(self):
#         self.client.get("/api/product/")

#     @task(1)
#     def view_product_detail(self):
#         product_id = random.choice(PRODUCT_IDS)
#         self.client.get(f"/api/product/{product_id}/")

#     @task(1)
#     def add_to_cart(self):
#         product_id = random.choice(PRODUCT_IDS)
#         quantity = random.randint(1, 3)
#         payload = {
#             "product": product_id,
#             "quantity": quantity,
#             "shop": SHOP_ID
#         }
#         response = self.client.post("/api/cart-items/", json=payload)
#         if response.status_code != 201:
#             print(f"🛑 Add to cart failed ({response.status_code}): {response.text}")
