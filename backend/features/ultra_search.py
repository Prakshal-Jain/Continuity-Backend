import openai

openai.api_key = 'API KEY'

def ultra_search_query(data):
    prompt = data.get('prompt', '')
    model = "text-davinci-002"
    
    completion = openai.Completion.create(model=model, prompt=prompt, max_tokens=1024, n=1, stop=None, temperature=0.5)

    if completion == None or completion.get('choices', []) == [] or completion.get('choices')[0].get('text', '') == '':
        return {}
    
    return {'response': completion.get('choices')[0].get('text', ''), 'prompt': prompt}