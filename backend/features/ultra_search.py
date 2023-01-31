import openai

openai.api_key = "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"


def ultra_search_query(data):
    try:
        prompt = data.get("prompt", "").strip()
        model = "text-davinci-002"

        completion_instance = openai.Completion()
        completion = completion_instance.create(
            model=model, prompt=prompt, max_tokens=1024, n=1, stop=None, temperature=0.5
        )

        if (
            completion == None
            or completion.get("choices", []) == []
            or completion.get("choices")[0].get("text", "") == ""
        ):
            return None

        response = completion.get("choices")[0].get("text", "").strip()
        return {"response": response, "prompt": prompt}
    except:
        return None
