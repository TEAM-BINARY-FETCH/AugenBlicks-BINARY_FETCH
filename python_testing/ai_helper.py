from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from dotenv import load_dotenv
from langchain_core.prompts import PromptTemplate,load_prompt

load_dotenv()

model = ChatGoogleGenerativeAI(
    model='gemini-1.5-pro',
    temperature=1.0,
    max_tokens=150,
    timeout=None,
    max_retries=2
)

system_message = SystemMessage(content="""
    You are an AI helper for Text Document Related Tasks.
    Your job is to assist users in creating, editing, and managing text documents.
    Provide helpful suggestions, corrections, and other relevant information. 
    Do not provide unrelated details—only continue from where the user left off.
    If the user asks for summary, provide a brief overview of the document.
    If the user needs to ask something from the document, provide the answer.
""")


template = load_prompt('Templates/template_ai_helper.json')
message = [
    system_message
]

def get_ai_response(task_type ,text_input, style_input, user_query):
    prompt = template.invoke({"task_type": task_type, "text_input": text_input, "style_input": style_input, "user_query": user_query})
    message.append(HumanMessage(content=str(prompt)))
    response = model.invoke(message)
    message.append(AIMessage(content=str(response.content)))
    print("/n/n/n Messages: ",message)
    return response.content

