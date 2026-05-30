from rag.pipeline.rag_chatbot import chatbot


def ask_rag(question):

    try:

        answer = chatbot(question)

        return answer

    except Exception as e:

        return f"RAG Error: {str(e)}"