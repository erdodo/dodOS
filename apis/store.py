from flask import Blueprint, request, jsonify
import os
import json
import shutil
import subprocess
import yaml
import docker

store_blueprint = Blueprint('store', __name__)
STORE_DIR = './store'
DODOS_DIR = '/DodOS'

def get_store_path(image_name):
    return os.path.join(STORE_DIR, image_name)

def convert_compose_to_json(compose_path):
    """Docker Compose dosyasını JSON formatına dönüştürür"""
    with open(compose_path, 'r') as file:
        try:
            compose_content = yaml.safe_load(file)
            return compose_content
        except yaml.YAMLError as exc:
            return {'error': str(exc)}


def is_compose_up(compose_file):
    """Belirtilen compose dosyası için konteynerlerin çalışıp çalışmadığını kontrol eder."""
    try:
        result = subprocess.run(['docker-compose', '-f', compose_file, 'ps'], capture_output=True, text=True)
        if result.returncode == 0:
            return 'Up' in result.stdout
        return False
    except Exception as e:
        return False

@store_blueprint.route('/store', methods=['GET'])
def list_stores():
    """Listeleme API'si"""
    stores = []
    for image_name in os.listdir(STORE_DIR):
        store_path = get_store_path(image_name)
        if os.path.isdir(store_path):
            config_path = os.path.join(store_path, 'config.json')
            compose_path = os.path.join(store_path, 'docker-compose.yml')
            is_up = is_compose_up(compose_path)

            with open(config_path, 'r') as file:
                config = json.load(file)
            
            with open(compose_path, 'r') as file:
                compose = yaml.safe_load(file)
            
            stores.append({
                'name': image_name,
                'config': config,
                'compose': compose,
                'is_up': is_up
            })
    return jsonify(stores)

@store_blueprint.route('/store/<image_name>', methods=['GET'])
def get_store(image_name):
    """Tek veri getirme API'si"""
    store_path = get_store_path(image_name)
    if not os.path.isdir(store_path):
        return jsonify({'error': 'Store not found'}), 404

    config_path = os.path.join(store_path, 'config.json')
    compose_path = os.path.join(store_path, 'docker-compose.yml')

    if not os.path.isfile(config_path) or not os.path.isfile(compose_path):
        return jsonify({'error': 'Required files not found'}), 404

    with open(config_path, 'r') as file:
        config = json.load(file)
    
    with open(compose_path, 'r') as file:
        compose = yaml.safe_load(file)
    
    is_up = is_compose_up(compose_path)

    return jsonify({
        'name': image_name,
        'config': config,
        'compose': compose,
        'is_up': is_up
    })

@store_blueprint.route('/store/<image_name>', methods=['POST'])
def add_store(image_name):
    """Ekleme API'si"""
    data = request.json
    if not image_name:
        return jsonify({'error': 'Image name is required'}), 400
    
    store_path = get_store_path(image_name)
    if os.path.isdir(store_path):
        return jsonify({'error': 'Store already exists'}), 400

    os.makedirs(store_path)
    config = {
        'name': image_name,
        'description': data.get('description', ''),
        'photos': data.get('photos', []),
        'version': data.get('version', 'latest')
    }
    
    with open(os.path.join(store_path, 'config.json'), 'w') as file:
        json.dump(config, file)

    with open(os.path.join(store_path, 'docker-compose.yml'), 'w') as file:
        file.write(data.get('docker_compose', ''))

    return jsonify({'message': 'Store created successfully'}), 201

@store_blueprint.route('/store/<image_name>', methods=['DELETE'])
def delete_store(image_name):
    """Silme API'si"""
    store_path = get_store_path(image_name)
    if not os.path.isdir(store_path):
        return jsonify({'error': 'Store not found'}), 404

    shutil.rmtree(store_path)
    return jsonify({'message': 'Store deleted successfully'})

@store_blueprint.route('/store/<image_name>', methods=['PUT'])
def update_store(image_name):
    """Düzenleme API'si"""
    store_path = get_store_path(image_name)
    if not os.path.isdir(store_path):
        return jsonify({'error': 'Store not found'}), 404

    config_path = os.path.join(store_path, 'config.json')
    if not os.path.isfile(config_path):
        return jsonify({'error': 'Config file not found'}), 404

    data = request.json
    config = {
        'name': image_name,
        'description': data.get('description', ''),
        'photos': data.get('photos', []),
        'version': data.get('version', 'latest')
    }

    with open(config_path, 'w') as file:
        json.dump(config, file)

    return jsonify({'message': 'Store updated successfully'})

@store_blueprint.route('/store/<image_name>/up', methods=['POST'])
def start_store(image_name):
    """Yükleme API'si"""
    print("Yükleme başladı")
    store_path = get_store_path(image_name)
    if not os.path.isdir(store_path):
        return jsonify({'error': 'Store not found'}), 404

    compose_file = os.path.join(store_path, 'docker-compose.yml')
    if not os.path.isfile(compose_file):
        return jsonify({'error': 'Compose file not found'}), 404

    config_file = os.path.join(store_path, 'config.json')
    if not os.path.isfile(config_file):
        return jsonify({'error': 'Config file not found'}), 404

    with open(config_file, 'r') as f:
        config_data = json.load(f)
        config_name = config_data.get('name')
        if not config_name:
            return jsonify({'error': 'Name not found in config.json'}), 400

    # /DodOS klasörünü oluştur
    if not os.path.exists(DODOS_DIR):
        os.makedirs(DODOS_DIR)

    # /DodOS/image_name klasörünü oluştur
    config_path = os.path.join(DODOS_DIR, image_name)
    if not os.path.exists(config_path):
        os.makedirs(config_path)

    # config dosyasını ve compose dosyasını yeni klasöre kopyala
    shutil.copy(compose_file, os.path.join(config_path, 'docker-compose.yml'))
    shutil.copy(config_file, os.path.join(config_path, 'config.json'))

    # Docker client
    client = docker.from_env()
    
    # Mevcut konteynerleri bul ve durdur
    containers = client.containers.list(filters={"ancestor": image_name})
    for container in containers:
        container.stop()
        container.remove()

    # Docker Compose ile konteyneri başlat
    result = subprocess.run(['docker', 'compose', '-f', os.path.join(config_path, 'docker-compose.yml'), 'up', '-d'], capture_output=True, text=True)
    if result.returncode != 0:
        return jsonify({'error': result.stderr}), 500

    # Docker client ile yeni konteyneri bul ve adlandır
    new_containers = client.containers.list(filters={"ancestor": image_name})
    if new_containers:
        container = new_containers[0]
        try:
            # Konteyneri yeniden adlandır
            container.rename(config_name)
        except docker.errors.APIError as e:
            return jsonify({'error': f'Failed to rename container: {str(e)}'}), 500

    return jsonify({'message': 'Store started and container renamed successfully'})

@store_blueprint.route('/store/<image_name>/down', methods=['POST'])
def stop_store(image_name):
    """Kaldır API'si"""
    store_path = get_store_path(image_name)
    if not os.path.isdir(store_path):
        return jsonify({'error': 'Store not found'}), 404

    compose_file = os.path.join(store_path, 'docker-compose.yml')
    if not os.path.isfile(compose_file):
        return jsonify({'error': 'Compose file not found'}), 404

    result = subprocess.run(['docker','compose', '-f', compose_file, 'down'], capture_output=True, text=True)
    if result.returncode != 0:
        return jsonify({'error': result.stderr}), 500

    return jsonify({'message': 'Store stopped successfully'})
