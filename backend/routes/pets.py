from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from models.pet import Pet
from utils.decorators import validate_json, validate_numeric_fields

pets_bp = Blueprint('pets', __name__)

@pets_bp.route('/', methods=['GET'])
@jwt_required()
def get_pets():
    user_id = get_jwt_identity()
    pets = Pet.query.filter_by(user_id=user_id).all()
    return jsonify([pet.to_dict() for pet in pets]), 200

@pets_bp.route('/<int:pet_id>', methods=['GET'])
@jwt_required()
def get_pet(pet_id):
    user_id = get_jwt_identity()
    pet = Pet.query.filter_by(id=pet_id, user_id=user_id).first()
    
    if not pet:
        return jsonify({'error': '宠物不存在'}), 404
    
    return jsonify(pet.to_dict()), 200

@pets_bp.route('/', methods=['POST'])
@jwt_required()
@validate_json('name', 'species', 'age', 'weight', 'gender')
@validate_numeric_fields('age', 'weight')
def create_pet():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    name = data['name'].strip()
    species = data['species'].strip()
    age = float(data['age'])
    weight = float(data['weight'])
    gender = data['gender'].strip()
    
    if not name or not species or not gender:
        return jsonify({'error': '创建失败', 'message': '名称、种类、性别不能为空'}), 400
    
    if age < 0 or age > 50:
        return jsonify({'error': '创建失败', 'message': '年龄必须在0-50之间'}), 400
    
    if weight < 0 or weight > 200:
        return jsonify({'error': '创建失败', 'message': '体重必须在0-200kg之间'}), 400
    
    if gender not in ['male', 'female']:
        return jsonify({'error': '创建失败', 'message': '性别只能是male或female'}), 400
    
    pet = Pet(
        user_id=user_id,
        name=name,
        species=species,
        breed=data.get('breed'),
        age=age,
        weight=weight,
        gender=gender,
        color=data.get('color'),
        birthday=data.get('birthday'),
        avatar=data.get('avatar'),
        notes=data.get('notes')
    )
    
    db.session.add(pet)
    db.session.commit()
    
    return jsonify({'message': '创建成功', 'pet': pet.to_dict()}), 201

@pets_bp.route('/<int:pet_id>', methods=['PUT'])
@jwt_required()
@validate_numeric_fields('age', 'weight')
def update_pet(pet_id):
    user_id = get_jwt_identity()
    pet = Pet.query.filter_by(id=pet_id, user_id=user_id).first()
    
    if not pet:
        return jsonify({'error': '宠物不存在'}), 404
    
    data = request.get_json()
    
    if 'name' in data:
        name = data['name'].strip()
        if not name:
            return jsonify({'error': '更新失败', 'message': '名称不能为空'}), 400
        pet.name = name
    
    if 'species' in data:
        species = data['species'].strip()
        if not species:
            return jsonify({'error': '更新失败', 'message': '种类不能为空'}), 400
        pet.species = species
    
    if 'breed' in data:
        pet.breed = data['breed']
    
    if 'age' in data:
        age = float(data['age'])
        if age < 0 or age > 50:
            return jsonify({'error': '更新失败', 'message': '年龄必须在0-50之间'}), 400
        pet.age = age
    
    if 'weight' in data:
        weight = float(data['weight'])
        if weight < 0 or weight > 200:
            return jsonify({'error': '更新失败', 'message': '体重必须在0-200kg之间'}), 400
        pet.weight = weight
    
    if 'gender' in data:
        gender = data['gender'].strip()
        if gender not in ['male', 'female']:
            return jsonify({'error': '更新失败', 'message': '性别只能是male或female'}), 400
        pet.gender = gender
    
    if 'color' in data:
        pet.color = data['color']
    
    if 'birthday' in data:
        pet.birthday = data['birthday']
    
    if 'avatar' in data:
        pet.avatar = data['avatar']
    
    if 'notes' in data:
        pet.notes = data['notes']
    
    db.session.commit()
    
    return jsonify({'message': '更新成功', 'pet': pet.to_dict()}), 200

@pets_bp.route('/<int:pet_id>', methods=['DELETE'])
@jwt_required()
def delete_pet(pet_id):
    user_id = get_jwt_identity()
    pet = Pet.query.filter_by(id=pet_id, user_id=user_id).first()
    
    if not pet:
        return jsonify({'error': '宠物不存在'}), 404
    
    db.session.delete(pet)
    db.session.commit()
    
    return jsonify({'message': '删除成功'}), 200
