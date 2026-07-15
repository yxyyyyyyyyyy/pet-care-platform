from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from extensions import db
from models.user import User
from utils.decorators import validate_json

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
@validate_json('username', 'password')
def register():
    data = request.get_json()
    username = data['username'].strip()
    password = data['password'].strip()
    
    if len(username) < 3:
        return jsonify({'error': '注册失败', 'message': '用户名长度至少3位'}), 400
    
    if len(password) < 6:
        return jsonify({'error': '注册失败', 'message': '密码长度至少6位'}), 400
    
    if User.query.filter_by(username=username).first():
        return jsonify({'error': '注册失败', 'message': '用户名已存在'}), 400
    
    user = User(username=username)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    
    return jsonify({'message': '注册成功', 'user': user.to_dict()}), 201

@auth_bp.route('/login', methods=['POST'])
@validate_json('username', 'password')
def login():
    data = request.get_json()
    username = data['username'].strip()
    password = data['password'].strip()
    
    if not username or not password:
        return jsonify({'error': '登录失败', 'message': '用户名或密码不能为空'}), 400
    
    user = User.query.filter_by(username=username).first()
    
    if not user or not user.check_password(password):
        return jsonify({'error': '登录失败', 'message': '用户名或密码错误'}), 401
    
    access_token = create_access_token(identity=user.id)
    return jsonify({'access_token': access_token, 'user': user.to_dict()}), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': '用户不存在'}), 404
    
    return jsonify(user.to_dict()), 200
