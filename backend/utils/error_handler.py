from flask import jsonify
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def register_error_handlers(app):
    @app.errorhandler(400)
    def bad_request(error):
        logger.error(f"Bad Request: {error}")
        return jsonify({'error': '请求参数错误', 'message': str(error)}), 400

    @app.errorhandler(401)
    def unauthorized(error):
        logger.error(f"Unauthorized: {error}")
        return jsonify({'error': '未授权访问', 'message': '请先登录'}), 401

    @app.errorhandler(403)
    def forbidden(error):
        logger.error(f"Forbidden: {error}")
        return jsonify({'error': '禁止访问', 'message': '无权执行此操作'}), 403

    @app.errorhandler(404)
    def not_found(error):
        logger.error(f"Not Found: {error}")
        return jsonify({'error': '资源不存在', 'message': str(error)}), 404

    @app.errorhandler(500)
    def internal_server_error(error):
        logger.error(f"Internal Server Error: {error}")
        return jsonify({'error': '服务器内部错误', 'message': '请稍后重试'}), 500

    @app.errorhandler(Exception)
    def handle_exception(error):
        logger.error(f"Exception: {error}")
        return jsonify({'error': '服务器错误', 'message': str(error)}), 500
