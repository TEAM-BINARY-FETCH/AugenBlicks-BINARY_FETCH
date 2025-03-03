import os;
from langchain_groq import ChatGroq;
from langchain_core.prompts import PromptTemplate;
from langchain_core.output_parsers import JsonOutputParser;
from langchain_core.exceptions import OutputParserException;
from dotenv import load_dotenv;

load_dotenv();

class GenerateScript : 
  def __init__(self) : 
    self.llm = ChatGroq(
      model="mixtral-8x7b-32768",
      temperature=0,
      groq_api_key=os.getenv("GROQ_API_KEY")
    )

  def generate_script(self, title, summary, instructions) : 
    prompt_script = PromptTemplate.from_template(
    """
    ### PODCAST SCRIPT CREATION
    ### PODCAST SCRIPT CREATION
    Title of the episode : {title}
    ### BRIEF
    The podcast must revolve around : {summary}
    ### INSTRUCTIONS
    Instructions you must follow : {special_instructions}
    ### IMPORTANT GUIDELINES
    You are tasked with creating a podcast script based on the following instructions. 
    You are tasked with creating a podcast script based on the following instructions. 
    Use the provided summary to craft a script that can be read aloud for a podcast episode. 
    Make sure to create a compelling narrative with engaging storytelling and clear transitions.
    Keep the tone conversational and approachable. 
    Ensure the script includes real-world examples or scenarios to make it relatable and insightful.
    Format the script in a way that would be easy for a speaker to follow during the podcast.
    Make a proper long form podcast with multiple different sub conversations.
    Make a proper long form podcast with multiple different sub conversations.

    ### OUTPUT FORMAT (PODCAST SCRIPT):
    The output should be valid json having two fields : content - an array that will contain objects that
    will have 2 fields, the speaker and the content they say, and tags - an array of tags that will be used later 
    for the recommendation algorithm internally.
    The output should be valid json having two fields : content - an array that will contain objects that
    will have 2 fields, the speaker and the content they say, and tags - an array of tags that will be used later 
    for the recommendation algorithm internally.

    ### FINAL OUTPUT (VALID JSON FORMATTED PLAIN TEXT AND NOT JSON):
    {{
      "content": [
        {{ speaker : Speaker1(this exact name), text : dialogue by speaker 1 }},
        {{ speaker : Speaker2(this exact name), text : dialogue by speaker 2 }},
        and so on...
      ],
      "tags": "appropriate tags"
    }}
  """
  )

    chain_script = prompt_script | self.llm;

    input_data = {
        'title': title,
        'summary': summary,
        'special_instructions': instructions
    }

    res = chain_script.invoke(input=input_data)

    print(res.content, type(res.content))
    
    try:
        json_parser = JsonOutputParser()
        res = json_parser.parse(res.content)
    except OutputParserException:
        raise OutputParserException("Context too big. Unable to parse.")
    return res 

if __name__ == "__main__" : 
  gen = GenerateScript();
  gen.generate_script("Game of War", "A long story about indian wars that shaped india\'s history", "make the last sentence as : do tune in next week ");
