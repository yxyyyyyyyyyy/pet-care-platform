from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
from extensions import db, jwt
from utils.error_handler import register_error_handlers

load_dotenv()

app = Flask(__name__)

# ==================== 新增密钥配置 ====================
app.config['SECRET_KEY'] = 'pet123secretkey789xyzabc'
app.config['JWT_SECRET_KEY'] = 'jwtpetlogin987654321zzz'
# ==================== 密钥配置结束 ====================

app.config['JWT_IDENTITY_CLAIM'] = 'sub'

basedir = os.path.abspath(os.path.dirname(__file__))
instance_dir = os.path.join(basedir, 'instance')
os.makedirs(instance_dir, exist_ok=True)
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{os.path.join(instance_dir, "pet_care.db")}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
jwt.init_app(app)

@jwt.unauthorized_loader
def unauthorized_response(callback):
    return jsonify({'code': 401, 'msg': '登录失效'}), 401

@jwt.invalid_token_loader
def invalid_token_response(error_string):
    return jsonify({'code': 401, 'msg': '登录失效'}), 401

@jwt.expired_token_loader
def expired_token_response(header, payload):
    return jsonify({'code': 401, 'msg': '登录失效'}), 401

@jwt.revoked_token_loader
def revoked_token_response(header, payload):
    return jsonify({'code': 401, 'msg': '登录失效'}), 401

allowed_origins = os.getenv('ALLOWED_ORIGINS', 'http://localhost:3000,http://localhost:3001,https://6a5a007f254dbe71bf3bb588--lively-pixie-b2837b.netlify.app').split(',')

CORS(app, 
     origins=allowed_origins,
     supports_credentials=True,
     allow_headers=['Content-Type', 'Authorization'],
     methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])

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

with app.app_context():
    db.create_all()

if __name__ == '__main__':
    debug_mode = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    app.run(host='0.0.0.0', port=int(os.getenv('PORT', 5000)), debug=debug_mode)
