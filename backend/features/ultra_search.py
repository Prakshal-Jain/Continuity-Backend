def enroll_user():
    return


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
