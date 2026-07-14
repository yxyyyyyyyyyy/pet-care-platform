from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os
from extensions import db, jwt
from utils.error_handler import register_error_handlers

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
jwt.init_app(app)
CORS(app, origins=['http://localhost:3000'], supports_credentials=True)

register_error_handlers(app)

from routes.auth import auth_bp
from routes.pets import pets_bp
from routes.care import care_bp

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(pets_bp, url_prefix='/api/pets')
app.register_blueprint(care_bp, url_prefix='/api/care')

@app.route('/api/health')
def health_check():
    return {'status': 'ok'}

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000, debug=True)
