# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status

# from .models import ChatBot
# from .serializers import ChatBotSerializer

# # IMPORT RAG CHATBOT
# from rag.pipeline.rag_chatbot import chatbot as ask_rag


# class ChatBotAPIView(APIView):

#     def post(self, request):

#         user = request.user if request.user.is_authenticated else None

#         user_text = request.data.get("user_text", "").strip()

#         if not user_text:
#             return Response(
#                 {
#                     "error": "user_text is required."
#                 },
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         try:

#             # RAG RESPONSE
#             bot_reply = ask_rag(user_text)

#         except Exception as e:

#             print("RAG ERROR:", str(e))

#             bot_reply = "AI service is temporarily unavailable."

#         # SAVE CHAT
#         chatbot_entry = ChatBot.objects.create(
#             user=user,
#             user_text=user_text,
#             bot_reply=bot_reply
#         )

#         serializer = ChatBotSerializer(chatbot_entry)

#         return Response(serializer.data)