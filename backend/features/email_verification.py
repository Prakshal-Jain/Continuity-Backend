import smtplib

def email_verification(user_id, id):
    sender_email = "continuitybrowser@gmail.com"
    password = "hbjciqrivetkuuno"
    message = f"""\
From: Continuity Browser Team <continuitybrowser@gmail.com>
To: You {user_id}
Subject: Continuity Email Verification

Dear User,

We are writing to confirm that you have recently signed up for ContinuityBrowser.

To ensure the security of your account and to complete the registration process, we kindly ask you to verify your email address by clicking on the following link:

https://continuitybrowser.com/verify-email/{id}


If you did not sign up for ContinuityBrowser, please ignore this email.

Best regards,
The Continuity Browser Team
"""

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