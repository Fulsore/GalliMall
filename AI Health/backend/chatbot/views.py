import os
import difflib
import torch
import pandas as pd
from rest_framework.views import APIView
from rest_framework.response import Response
from transformers import AutoModelForCausalLM, AutoTokenizer
import kagglehub

# Load the general chatbot model
tokenizer = AutoTokenizer.from_pretrained("microsoft/DialoGPT-small")
model = AutoModelForCausalLM.from_pretrained("microsoft/DialoGPT-small")
chat_history_ids = None

# Load Kaggle dataset once
try:
    kaggle_path = kagglehub.dataset_download("prasad22/healthcare-dataset")
    csv_file = os.path.join(kaggle_path, "healthcare-dataset-stroke-data.csv")
    kaggle_df = pd.read_csv(csv_file)
except Exception as e:
    kaggle_df = None
    print("Error loading Kaggle dataset:", e)


class ChatBotView(APIView):
    def post(self, request):
        global chat_history_ids

        user_input = request.data.get("message", "").strip()
        if not user_input:
            return Response({"error": "Message field is required."}, status=400)

        # ---------- AIHL Health Mode ----------
        if user_input.lower().startswith("aihl -"):
            query = user_input[6:].strip().lower()

            # Load health.txt file
            file_path = os.path.join(os.path.dirname(__file__), "health.txt")
            qa_pairs = []

            if os.path.exists(file_path):
                with open(file_path, "r", encoding="utf-8") as f:
                    lines = f.readlines()

                for i in range(len(lines)):
                    if lines[i].startswith("Q:") and i + 1 < len(lines) and lines[i + 1].startswith("A:"):
                        question = lines[i][2:].strip().lower()
                        answer = lines[i + 1][2:].strip()
                        qa_pairs.append((question, answer))

            # Add Kaggle questions (based on column headers and unique values)
            if kaggle_df is not None:
                for col in kaggle_df.columns:
                    qa_pairs.append((
                        f"what is {col.lower()}",
                        f"{col} - Example values: {kaggle_df[col].dropna().unique()[:5]}"
                    ))

            # Match best question
            questions = [q for q, a in qa_pairs]
            best_match = difflib.get_close_matches(query, questions, n=1, cutoff=0.4)

            if best_match:
                for q, a in qa_pairs:
                    if q == best_match[0]:
                        return Response({"reply": a})
            else:
                return Response({"reply": "Sorry, I couldn't find a relevant health answer."})

        # ---------- General ChatBot (DialoGPT) ----------
        new_input_ids = tokenizer.encode(user_input + tokenizer.eos_token, return_tensors="pt")
        bot_input_ids = torch.cat([chat_history_ids, new_input_ids], dim=-1) if chat_history_ids is not None else new_input_ids

        chat_history_ids = model.generate(
            bot_input_ids,
            max_length=1000,
            pad_token_id=tokenizer.eos_token_id,
            do_sample=True,
            top_p=0.92,
            top_k=50
        )

        bot_response = tokenizer.decode(
            chat_history_ids[:, bot_input_ids.shape[-1]:][0],
            skip_special_tokens=True
        )

        return Response({"reply": bot_response})
