def enroll_user():
    return


'''
import openai

# Set the API key
openai.api_key = "YOUR_API_KEY"

# Set the prompt and model
prompt = "Write a short story about a young girl who discovers a magical world hidden in the forest."
model = "text-davinci-002"

# Make the API call
completion = openai.Completion.create(engine=model, prompt=prompt, max_tokens=1024, n=1,stop=None,temperature=0.5)

# Print the generated text
print(completion.choices[0].text)

'''


def ultra_search_query(data):
    # API call
    # Process the response to delete unnecessary fields and send response as frontend expect
    # return the response
    print(data, flush=True)
    response = {
        "id": "d3e61b1c-9f4c-4773-aa73-70e1d8e093b3",
        "model": "chatbot",
        "prompt": "What is your name?",
        "response": "My name is ChatGPT. What's yours?",
        "status": "SUCCESS"
    }
    return {"prompt": response.get("prompt", ""), "response": response.get("response", "")}
