import openai

openai.api_key = "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"

def ultra_search_query(data):
    try:
        prompt = data.get("prompt", "").strip()

        completion = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "user", "content": prompt}]
        )

        if (
            completion == None
            or completion.get("choices", []) == []
            or completion.get("choices")[0].get("message", {}).get("content", "") == ""
        ):
            return None

        response = completion.get("choices")[0].get(
            "message", {}).get("content", "").strip()
        return {"response": response, "prompt": prompt}
    except:
        return None