from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from dotenv import load_dotenv

load_dotenv()

model = ChatGoogleGenerativeAI(
    model='gemini-1.5-pro',
    temperature=1.0,
    max_tokens=15,
    timeout=None,
    max_retries=2
)

# System message for the AI
system_message = SystemMessage(content="""
    You are an Auto-Completion Expert AI.
    Your job is to predict and suggest the next few words or sentences based on partial input.
    Keep responses short, relevant, and context-aware.
    Do not provide unrelated details—only continue from where the user left off.
""")

def get_auto_suggestion(user_input):
    try:
        messages = [
            system_message,
            HumanMessage(content=user_input)
        ]

        result = model.invoke(messages)

        messages.append(AIMessage(content=result.content))

        return result.content

    except Exception as e:
        raise e
    