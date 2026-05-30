import faiss
import numpy as np
import json
import os
from sentence_transformers import SentenceTransformer
from gallimall_app.models import Product

model = SentenceTransformer("all-MiniLM-L6-v2")


def build_index():
    products = Product.objects.all()

    texts = []
    meta = []
    
    for p in products:
        text = f"{p.name} {p.description or ''} {getattr(p, 'category', '')}"

        texts.append(text)

        meta.append({
            "id": p.id,
            "name": p.name,
            "price": str(p.price),
            "image": p.image.url if p.image else None
        })

    if len(texts) == 0:
        print("No products found")
        return

    embeddings = model.encode(texts, convert_to_numpy=True)

    embeddings = np.array(embeddings).astype("float32")

    # IMPORTANT: normalize improves semantic search quality
    faiss.normalize_L2(embeddings)

    dim = embeddings.shape[1]

    index = faiss.IndexFlatIP(dim)  # cosine similarity

    index.add(embeddings)

    os.makedirs("rag/vectorstore_products", exist_ok=True)

    faiss.write_index(index, "rag/vectorstore_products/index.faiss")

    with open("rag/vectorstore_products/meta.json", "w") as f:
        json.dump(meta, f)

    print("FAISS index built successfully")


if __name__ == "__main__":
    build_index()