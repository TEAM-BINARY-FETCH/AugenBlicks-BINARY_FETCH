from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from dotenv import load_dotenv

load_dotenv()

# Initialize the model
model = ChatGoogleGenerativeAI(
    model='gemini-1.5-pro',
    temperature=1.0,
    max_tokens=300,  # Increase max_tokens for longer HTML templates
    timeout=None,
    max_retries=2
)

# Define the new PromptTemplate for HTML template generation
AI_template_generation_template = PromptTemplate(
    template="""
    Generate a professional HTML template for the following purpose: {user_input}.

    The template should follow this format:

    <html>
    <head>
        <title>{{Template Title}}</title>
    </head>
    <body>
        <h1>{{Heading}}</h1>
        <p>{{Introduction}}</p>
        <p>{{Main Content}}</p>
        <p>{{Call to Action}}</p>
        <p>Best regards,</p>
        <p>{{Your Name}}</p>
    </body>
    </html>

    Example:

    Input: "Marketing Email for a New Product"
    Output:
    <html>
    <head>
        <title>New Product Launch</title>
    </head>
    <body>
        <h1>Exciting News! Introducing Our New Product</h1>
        <p>Dear {{Recipient Name}},</p>
        <p>We are thrilled to announce the launch of our latest product, {{Product Name}}. This innovative solution is designed to {{Key Benefit}}.</p>
        <p>Don't miss out on this opportunity to {{Call to Action}}. Visit our website at <a href="{{Website URL}}">{{Website URL}}</a> to learn more.</p>
        <p>Best regards,</p>
        <p>{{Your Name}}</p>
    </body>
    </html>

    please remove ```html and ``` from the start and end of the code block
    """,
    input_variables=['user_input']  
)

def get_ai_generated_template(user_input):
    try:
        # Invoke the prompt template with user input
        prompt = AI_template_generation_template.invoke({'user_input': user_input})

        # Get the AI-generated response
        result = model.invoke(prompt)

        # Return the generated HTML template
        return result.content

    except Exception as e:
        raise e