from flask import request, jsonify
from functools import wraps

def validate_json(*required_fields):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if not request.is_json:
                return jsonify({'error': '请求格式错误', 'message': '请使用JSON格式'}), 400
            data = request.get_json()
            missing_fields = [field for field in required_fields if field not in data or data[field] is None]
            if missing_fields:
                return jsonify({'error': '缺少必填字段', 'message': f'缺少字段: {", ".join(missing_fields)}'}), 400
            return f(*args, **kwargs)
        return decorated_function
    return decorator

def validate_numeric_fields(*numeric_fields):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            data = request.get_json()
            for field in numeric_fields:
                if field in data and data[field] is not None:
                    try:
                        float(data[field])
                    except ValueError:
                        return jsonify({'error': '参数类型错误', 'message': f'{field}必须是数字'}), 400
            return f(*args, **kwargs)
        return decorated_function
    return decorator
