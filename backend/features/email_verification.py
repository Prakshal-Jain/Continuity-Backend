import smtplib

def email_verification(user_id, id):
    sender_email = "continuitybrowser@gmail.com"
    password = "hbjciqrivetkuuno"
    message = f"""\
    Subject: Verify your email

    Visit: https://continuitybrowser.com/verify-email/{id} to verify."""

    try:
        server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
        # server.ehlo()
        # server.starttls()
        server.login(sender_email, password)
        server.sendmail(sender_email, user_id, message)
        print('Email sent!')
    except Exception as e:
        print(f'Something went wrong: {e}', flush=True)
        return False
    finally:
        server.quit()
    
    return True