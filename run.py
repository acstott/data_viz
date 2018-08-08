# run.py

from app import app

if __name__ == "__main__":
    app.run(debug=True)
    app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

