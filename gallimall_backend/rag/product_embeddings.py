from sentence_transformers import SentenceTransformer
from gallimall_app.models import Product
import os
import faiss
import numpy as np
import json

model = SentenceTransformer("all-MiniLM-L6-v2")


def build_product_index():
    products = Product.objects.all()

    texts = []
    meta = []

    for p in products:
        text = f"{p.name} {p.description or ''}"
        texts.append(text)

        meta.append({
            "id": p.id,
            "name": p.name,
            "price": str(p.price),
            "image": str(p.image) if p.image else None,
        })

    embeddings = model.encode(texts)

    dim = embeddings.shape[1]

    index = faiss.IndexFlatL2(dim)
    index.add(np.array(embeddings).astype("float32"))

    os.makedirs("rag/vectorstore_products", exist_ok=True)

    faiss.write_index(index, "rag/vectorstore_products/index.faiss")

    with open("rag/vectorstore_products/meta.json", "w") as f:
        json.dump(meta, f)

    print("Product index built successfully")