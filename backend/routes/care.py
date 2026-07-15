from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.care_record import CareRecord
from models.pet import Pet
from utils.decorators import validate_json, validate_numeric_fields
from datetime import datetime

care_bp = Blueprint('care', __name__)

CARE_ADVICE = {
    'dog': {
        'puppy': {
            'feeding': '每天喂食3-4次，选择高蛋白幼犬粮',
            'exercise': '每天散步2次，每次15-30分钟',
            'health': '按时接种疫苗，定期驱虫',
            'grooming': '每周梳理毛发1-2次'
        },
        'adult': {
            'feeding': '每天喂食2次，控制食量防止肥胖',
            'exercise': '每天散步2次，每次30-60分钟',
            'health': '每年体检一次，定期驱虫',
            'grooming': '每周梳理毛发2-3次'
        },
        'senior': {
            'feeding': '每天喂食2次，选择易消化老年犬粮',
            'exercise': '每天散步2次，每次15-30分钟，避免剧烈运动',
            'health': '每半年体检一次，关注关节健康',
            'grooming': '每周梳理毛发2-3次'
        }
    },
    'cat': {
        'kitten': {
            'feeding': '每天喂食4-5次，选择高蛋白幼猫粮',
            'exercise': '每天玩耍2-3次，每次10-15分钟',
            'health': '按时接种疫苗，定期驱虫',
            'grooming': '每周梳理毛发1-2次'
        },
        'adult': {
            'feeding': '每天喂食2次，控制食量防止肥胖',
            'exercise': '每天玩耍1-2次，每次10-15分钟',
            'health': '每年体检一次，定期驱虫',
            'grooming': '短毛猫每周1次，长毛猫每天1次'
        },
        'senior': {
            'feeding': '每天喂食2次，选择易消化老年猫粮',
            'exercise': '每天玩耍1-2次，每次5-10分钟，避免剧烈运动',
            'health': '每半年体检一次，关注肾脏和牙齿健康',
            'grooming': '每周梳理毛发2-3次'
        }
    }
}

def get_age_stage(species, age):
    if age < 1:
        return 'puppy' if species == 'dog' else 'kitten'
    elif age < 7:
        return 'adult'
    else:
        return 'senior'

def get_weight_advice(species, weight):
    if species.lower() == 'dog':
        if weight < 5:
            return '小型犬，注意保暖，避免过度运动'
        elif weight < 25:
            return '中型犬，保持适量运动'
        else:
            return '大型犬，注意关节保护，控制体重'
    elif species.lower() == 'cat':
        if weight < 3:
            return '偏瘦，建议增加营养摄入'
        elif weight < 5:
            return '标准体重，继续保持'
        else:
            return '偏胖，建议控制饮食，增加运动'
    return ''

@care_bp.route('/records', methods=['GET'])
@jwt_required()
def get_care_records():
    user_id = get_jwt_identity()
    pet_id = request.args.get('pet_id')
    
    if pet_id:
        pet = Pet.query.filter_by(id=pet_id, user_id=user_id).first()
        if not pet:
            return jsonify({'error': '宠物不存在'}), 404
        records = CareRecord.query.filter_by(pet_id=pet_id).all()
    else:
        pets = Pet.query.filter_by(user_id=user_id).all()
        pet_ids = [pet.id for pet in pets]
        records = CareRecord.query.filter(CareRecord.pet_id.in_(pet_ids)).all()
    
    return jsonify([record.to_dict() for record in records]), 200

@care_bp.route('/records/<int:record_id>', methods=['GET'])
@jwt_required()
def get_care_record(record_id):
    user_id = get_jwt_identity()
    record = CareRecord.query.get(record_id)
    
    if not record:
        return jsonify({'error': '记录不存在'}), 404
    
    pet = Pet.query.filter_by(id=record.pet_id, user_id=user_id).first()
    if not pet:
        return jsonify({'error': '无权访问'}), 403
    
    return jsonify(record.to_dict()), 200

@care_bp.route('/records', methods=['POST'])
@jwt_required()
@validate_json('pet_id', 'record_type', 'date')
@validate_numeric_fields('cost')
def create_care_record():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    pet_id = data['pet_id']
    pet = Pet.query.filter_by(id=pet_id, user_id=user_id).first()
    
    if not pet:
        return jsonify({'error': '宠物不存在'}), 404
    
    record_type = data['record_type'].strip()
    date_str = data['date']
    
    if not record_type:
        return jsonify({'error': '创建失败', 'message': '记录类型不能为空'}), 400
    
    try:
        date = datetime.strptime(date_str, '%Y-%m-%d').date()
    except ValueError:
        return jsonify({'error': '创建失败', 'message': '日期格式错误，应为YYYY-MM-DD'}), 400
    
    record = CareRecord(
        pet_id=pet_id,
        record_type=record_type,
        description=data.get('description'),
        date=date,
        veterinarian=data.get('veterinarian'),
        cost=float(data['cost']) if data.get('cost') else None
    )
    
    db.session.add(record)
    db.session.commit()
    
    return jsonify({'message': '创建成功', 'record': record.to_dict()}), 201

@care_bp.route('/records/<int:record_id>', methods=['PUT'])
@jwt_required()
@validate_numeric_fields('cost')
def update_care_record(record_id):
    user_id = get_jwt_identity()
    record = CareRecord.query.get(record_id)
    
    if not record:
        return jsonify({'error': '记录不存在'}), 404
    
    pet = Pet.query.filter_by(id=record.pet_id, user_id=user_id).first()
    if not pet:
        return jsonify({'error': '无权访问'}), 403
    
    data = request.get_json()
    
    if 'record_type' in data:
        record_type = data['record_type'].strip()
        if not record_type:
            return jsonify({'error': '更新失败', 'message': '记录类型不能为空'}), 400
        record.record_type = record_type
    
    if 'description' in data:
        record.description = data['description']
    
    if 'date' in data:
        try:
            record.date = datetime.strptime(data['date'], '%Y-%m-%d').date()
        except ValueError:
            return jsonify({'error': '更新失败', 'message': '日期格式错误，应为YYYY-MM-DD'}), 400
    
    if 'veterinarian' in data:
        record.veterinarian = data['veterinarian']
    
    if 'cost' in data:
        record.cost = float(data['cost'])
    
    db.session.commit()
    
    return jsonify({'message': '更新成功', 'record': record.to_dict()}), 200

@care_bp.route('/records/<int:record_id>', methods=['DELETE'])
@jwt_required()
def delete_care_record(record_id):
    user_id = get_jwt_identity()
    record = CareRecord.query.get(record_id)
    
    if not record:
        return jsonify({'error': '记录不存在'}), 404
    
    pet = Pet.query.filter_by(id=record.pet_id, user_id=user_id).first()
    if not pet:
        return jsonify({'error': '无权访问'}), 403
    
    db.session.delete(record)
    db.session.commit()
    
    return jsonify({'message': '删除成功'}), 200

@care_bp.route('/advice/<int:pet_id>', methods=['GET'])
@jwt_required()
def get_care_advice(pet_id):
    user_id = get_jwt_identity()
    pet = Pet.query.filter_by(id=pet_id, user_id=user_id).first()
    
    if not pet:
        return jsonify({'error': '宠物不存在'}), 404
    
    species = pet.species.lower()
    age_stage = get_age_stage(species, pet.age)
    
    base_advice = CARE_ADVICE.get(species, CARE_ADVICE.get('dog', {}))
    stage_advice = base_advice.get(age_stage, base_advice.get('adult', {}))
    
    advice = {
        'pet': pet.to_dict(),
        'age_stage': age_stage,
        'weight_advice': get_weight_advice(species, pet.weight),
        'feeding': stage_advice.get('feeding', '请咨询兽医获取专业建议'),
        'exercise': stage_advice.get('exercise', '请咨询兽医获取专业建议'),
        'health': stage_advice.get('health', '请咨询兽医获取专业建议'),
        'grooming': stage_advice.get('grooming', '请咨询兽医获取专业建议')
    }
    
    return jsonify(advice), 200
