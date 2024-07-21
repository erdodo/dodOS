from flask import Blueprint, request, jsonify
import os
import tarfile
import json
import shutil
import subprocess
import yaml
import docker

backup_blueprint = Blueprint('backup', __name__)


STORE_DIR = './store'
BACKUP_DIR = './backups'
SYSTEM_NETWORKS = {'bridge', 'host', 'none'}
DODOS_DIR = '/DodOS'

def create_tarfile(source_dir, tarfile_name):
    """Klasörden tar.gz dosyası oluşturur."""
    with tarfile.open(tarfile_name, 'w:gz') as tar:
        tar.add(source_dir, arcname=os.path.basename(source_dir))

def extract_tarfile(tarfile_name, target_dir):
    """tar.gz dosyasını belirli bir klasöre açar."""
    with tarfile.open(tarfile_name, 'r:gz') as tar:
        tar.extractall(path=target_dir)

def get_store_path(image_name):
    return os.path.join(STORE_DIR, image_name)

def get_backup_path(container_name):
    return os.path.join(BACKUP_DIR, container_name)

def is_compose_up(compose_file):
    """Docker Compose servisini kontrol etme fonksiyonu"""
    try:
        result = subprocess.run(['docker', 'compose', '-f', compose_file, 'ps'], capture_output=True, text=True)
        return 'Up' in result.stdout
    except subprocess.CalledProcessError as e:
        print(f'Error checking compose status: {e}')
        return False

def get_container_info(container_name):
    """Bir konteyner için detaylı bilgileri alır."""
    client = docker.from_env()
    container = client.containers.get(container_name)

    container_info = {
        'image': container.attrs['Config']['Image'],
        'environment': {env.split('=', 1)[0]: env.split('=', 1)[1] for env in container.attrs['Config']['Env']},
        'volumes': {mount['Source']: mount['Destination']
                    for mount in container.attrs['Mounts'] if mount['Type'] == 'bind'},
        'ports': {port: host_port
                  for port, host_ports in container.attrs['NetworkSettings']['Ports'].items() if host_ports},
        'user': container.attrs['Config']['User'] or 'root',
        'networks': list(container.attrs['NetworkSettings']['Networks'].keys()),
        'command': container.attrs['Config']['Cmd'] if container.attrs['Config']['Cmd'] else [],
        'entrypoint': container.attrs['Config']['Entrypoint'] if container.attrs['Config']['Entrypoint'] else [],
        'restart_policy': container.attrs['HostConfig']['RestartPolicy']['Name'],
        'healthcheck': container.attrs['Config'].get('Healthcheck', {}),
        'network_mode': container.attrs['HostConfig'].get('NetworkMode', None),
        'init': container.attrs['HostConfig'].get('Init', False),
        'depends_on': container.attrs['Config'].get('DependsOn', []),
        'stop_grace_period': container.attrs['HostConfig'].get('StopGracePeriod', '10s'),
        'privileged': container.attrs['HostConfig'].get('Privileged', False)
    }

    return container_info

@backup_blueprint.route('/backup/list', methods=['GET'])
def list_backups():
    """Yedek listesi API'si"""
    backups = []
    for folder in os.listdir(BACKUP_DIR):
        folder_path = get_backup_path(folder)
        if os.path.isdir(folder_path):
            backups.append({
                'container': folder,
                'files': os.listdir(folder_path)
            })
    return jsonify(backups)

@backup_blueprint.route('/backup/delete/<container_name>', methods=['DELETE'])
def delete_backup(container_name):
    """Yedek silme API'si"""
    backup_folder = get_backup_path(container_name)
    if not os.path.isdir(backup_folder):
        return jsonify({'error': 'Backup not found'}), 404

    shutil.rmtree(backup_folder)
    return jsonify({'message': 'Backup deleted successfully'})

@backup_blueprint.route('/backup/create/<container_name>', methods=['POST'])
def create_backup(container_name):
    """Yeni yedek oluşturma API'si"""
    backup_folder = get_backup_path(container_name)
    if os.path.exists(backup_folder):
        # Önceki yedeği sil
        shutil.rmtree(backup_folder)

    os.makedirs(backup_folder)
    
    # Store klasöründen config.json ve compose.yml dosyalarını al
    store_path = get_store_path(container_name)
    if not os.path.isdir(store_path):
        return jsonify({'error': 'Store not found'}), 404

    config_file = os.path.join(store_path, 'config.json')
    compose_file = os.path.join(store_path, 'docker-compose.yml')

    if not os.path.isfile(config_file) or not os.path.isfile(compose_file):
        return jsonify({'error': 'Required files not found'}), 404

    # /DodOS/<container_name> klasörünü tar ve sıkıştır
    dod_path = os.path.join(DODOS_DIR, container_name)
    if os.path.exists(dod_path):
        volume_tar = os.path.join(backup_folder, f"{container_name}.tar.gz")
        create_tarfile(dod_path, volume_tar)
    else:
        return jsonify({'error': f'Directory {dod_path} does not exist'}), 404

    return jsonify({'message': f'Backup created for {container_name}'}), 201

def extract_tarfile(tar_path, extract_path):
    """Tar dosyasını çıkartma fonksiyonu"""
    with tarfile.open(tar_path, 'r:gz') as tar:
        tar.extractall(path=extract_path)


def debug_directory_contents(directory_path):
    """Dizin içeriğini yazdırma fonksiyonu"""
    print(f"Contents of {directory_path}:")
    for root, dirs, files in os.walk(directory_path):
        for name in dirs:
            print(f"Directory: {os.path.join(root, name)}")
        for name in files:
            print(f"File: {os.path.join(root, name)}")

            
@backup_blueprint.route('/restore/<container_name>', methods=['POST'])
def restore_backup(container_name):
    """Geri yükleme API'si"""
    backup_file = os.path.join(BACKUP_DIR, container_name, f"{container_name}.tar.gz")
    if not os.path.isfile(backup_file):
        return jsonify({'error': 'Backup file not found'}), 404

    # Geçici bir dizine tar dosyasını çıkart
    temp_dir = os.path.join(BACKUP_DIR, f"{container_name}_temp")
    if os.path.exists(temp_dir):
        shutil.rmtree(temp_dir)
    os.makedirs(temp_dir)

    extract_tarfile(backup_file, temp_dir)

    # /DodOS/<container_name> dizinini oluştur
    target_dir = os.path.join(DODOS_DIR, container_name)
    if os.path.exists(target_dir):
        shutil.rmtree(target_dir)
    os.makedirs(target_dir)

    # Geçici dizindeki esphome klasörünü /DodOS/<container_name> dizinine taşı
    source_dir = os.path.join(temp_dir, container_name)
    if os.path.exists(source_dir):
        for item in os.listdir(source_dir):
            s = os.path.join(source_dir, item)
            d = os.path.join(target_dir, item)
            if os.path.isdir(s):
                shutil.copytree(s, d, dirs_exist_ok=True)  # Yeni dosyaları ekleyerek taşı
            else:
                shutil.copy2(s, d)
    else:
        return jsonify({'error': 'Source directory not found in temporary directory'}), 404

    shutil.rmtree(temp_dir)  # Temp dizini temizle

    # Hedef dizin içeriğini kontrol et
    print("Target Directory Contents:")
    debug_directory_contents(target_dir)

    compose_file = os.path.join(target_dir, 'docker-compose.yml')
    if not os.path.isfile(compose_file):
        return jsonify({'error': 'Compose file not found in target directory'}), 404

    # Docker Compose servisini kontrol etme ve başlatma
    if not is_compose_up(compose_file):
        result = subprocess.run(['docker', 'compose', '-f', compose_file, 'up', '-d'], capture_output=True, text=True)
        if result.returncode != 0:
            return jsonify({'error': result.stderr}), 500

    return jsonify({'message': f'Restore completed for {container_name}'}), 200