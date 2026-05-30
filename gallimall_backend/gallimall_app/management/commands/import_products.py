import csv
import urllib.parse
from django.core.management.base import BaseCommand
from gallimall_app.models import Product, Category, SubCategory, Shop


def get_image(name):
    query = urllib.parse.quote(name)
    return f"https://placehold.co/400x400?text={query}"


class Command(BaseCommand):
    help = "FAST bulk import products with auto images"

    def add_arguments(self, parser):
        parser.add_argument('--file', type=str, required=True)

    def handle(self, *args, **kwargs):
        file_path = kwargs['file']

        # CACHE (IMPORTANT FIX)
        category_cache = {}
        subcategory_cache = {}
        shop_cache = {}

        products = []

        with open(file_path, newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)

            for row in reader:

                cat_name = row['category'].strip()
                sub_name = row['subcategory'].strip()
                shop_name = row['shop'].strip()

                # CATEGORY CACHE
                if cat_name in category_cache:
                    category = category_cache[cat_name]
                else:
                    category, _ = Category.objects.get_or_create(name=cat_name)
                    category_cache[cat_name] = category

                # SUBCATEGORY CACHE
                sub_key = (cat_name, sub_name)
                if sub_key in subcategory_cache:
                    subcategory = subcategory_cache[sub_key]
                else:
                    subcategory, _ = SubCategory.objects.get_or_create(
                        name=sub_name,
                        category=category
                    )
                    subcategory_cache[sub_key] = subcategory

                # SHOP CACHE
                if shop_name in shop_cache:
                    shop = shop_cache[shop_name]
                else:
                    shop, _ = Shop.objects.get_or_create(
                        shop_name=shop_name,
                        defaults={
                            "shop_category": category,
                            "shop_description": "Auto imported shop",
                            "shop_address": "N/A",
                            "shop_phone_number": "0000000000",
                        }
                    )
                    shop_cache[shop_name] = shop

                # PRODUCT
                products.append(
                    Product(
                        name=row['name'].strip(),
                        price=row['price'],
                        description=row['description'],
                        subcategory=subcategory,
                        shop=shop,
                        image=get_image(row['name']),  # FIXED
                        brand="",
                        available_quantity=0,
                        stockcount=0
                    )
                )

        Product.objects.bulk_create(products, batch_size=500)

        self.stdout.write(self.style.SUCCESS(
            f"Imported {len(products)} products FAST with images"
        ))