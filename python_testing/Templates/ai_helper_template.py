from langchain_core.prompts import PromptTemplate

# template
template = PromptTemplate(
    template="""
You are given a research paper or text document. Perform the requested task based on the given input:

Task Type: {task_type}  # Options: "Summarize" or "Ask a Question"
Text/Document: "{text_input}"
User's Query: "{user_query}"

# If Summarization is selected:
- Explanation Style: {style_input}  
1. Mathematical Details:  
   - Include relevant mathematical equations if present in the text.  
   - Use intuitive code snippets to simplify mathematical concepts if applicable.  
2. Analogies:  
   - Use relatable analogies to explain complex ideas.  
- Ensure the summary is clear, accurate, and aligned with the provided style and length.

# If Asking a Question is selected:
- Use the given context to generate an answer.
- Do not guess; if the information is unavailable in the text, respond with:  
  "Insufficient information available."
- Maintain coherence and clarity in the response.

Ensure the response is accurate and adheres to the given task type.
""",
    input_variables=['task_type', 'text_input', 'style_input', 'user_query'],
    # validate_template=True
)

template.save('template_ai_helper.json')
