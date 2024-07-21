from flask import Blueprint, request, jsonify
import os
import yaml

compose_blueprint = Blueprint('compose', __name__)

BASE_DIR = './composes'

def get_compose_file_path(image_name):
    return os.path.join(BASE_DIR, image_name, 'docker-compose.yml')

def read_compose_file(image_name):
    compose_file_path = get_compose_file_path(image_name)
    if os.path.exists(compose_file_path):
        with open(compose_file_path, 'r') as file:
            return yaml.safe_load(file)
    return None

@compose_blueprint.route('/composes', methods=['GET'])
def list_composes():
    compose_dirs = [d for d in os.listdir(BASE_DIR) if os.path.isdir(os.path.join(BASE_DIR, d))]
    compose_list = []
    for image_name in compose_dirs:
        compose_data = read_compose_file(image_name)
        if compose_data:
            compose_list.append({
                'image': image_name,
                'compose': compose_data
            })
    return jsonify(compose_list)

@compose_blueprint.route('/composes/<image_name>', methods=['GET'])
def get_compose(image_name):
    compose_data = read_compose_file(image_name)
    if compose_data:
        return jsonify({
            'image': image_name,
            'compose': compose_data
        })
    return 'Compose file not found', 404

@compose_blueprint.route('/composes/<image_name>', methods=['POST'])
def update_compose(image_name):
    data = request.json
    compose_file_path = get_compose_file_path(image_name)

    if not os.path.exists(compose_file_path):
        return 'Compose file not found', 404

    # Read the existing compose file
    with open(compose_file_path, 'r') as file:
        compose_data = yaml.safe_load(file)
    
    # Update compose data with new information
    services = compose_data.get('services', {})
    for service, details in data.items():
        if service in services:
            services[service].update(details)
        else:
            services[service] = details
    
    # Write the updated compose data back to the file
    with open(compose_file_path, 'w') as file:
        yaml.dump(compose_data, file)
    
    return jsonify({'message': 'Compose file updated successfully'})

@compose_blueprint.route('/composes/<image_name>', methods=['DELETE'])
def delete_compose(image_name):
    compose_dir = os.path.join(BASE_DIR, image_name)
    if os.path.exists(compose_dir):
        os.rmdir(compose_dir)
        return '', 204
    return 'Compose directory not found', 404

