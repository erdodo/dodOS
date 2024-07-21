from flask import Blueprint, request, jsonify
import docker

containers_blueprint = Blueprint('container', __name__)
client = docker.DockerClient(base_url='unix://var/run/docker.sock')

# Endpoint to list all Docker containers with detailed information
@containers_blueprint.route('/containers', methods=['GET'])
def list_containers():
    containers = client.containers.list(all=True)
    container_list = []
    for container in containers:
        container_info = {
            'id': container.id,
            'name': container.name,
            'status': container.status,
            'image': container.image.tags,
            'labels': container.labels,
            'network_settings': container.attrs['NetworkSettings'],
            'mounts': container.attrs['Mounts'],
            'created': container.attrs['Created'],
            'state': container.attrs['State'],
            'command': container.attrs['Config']['Cmd']
        }
        container_list.append(container_info)
    return jsonify(container_list)

# Endpoint to create a Docker container
@containers_blueprint.route('/containers/create', methods=['POST'])
def create_container():
    data = request.json
    name = data.get('name')
    image = data.get('image')
    volumes = data.get('volumes')
    user = data.get('user')
    network = data.get('network')
    env = data.get('env')
    ports = data.get('ports')
    command = data.get('command')
    
    container = client.containers.create(
        image,
        name=name,
        volumes=volumes,
        user=user,
        network=network,
        environment=env,
        ports=ports,
        command=command
    )
    return jsonify({'id': container.id, 'name': container.name})

# Endpoint to remove a Docker container
@containers_blueprint.route('/containers/remove/<string:container_id>', methods=['DELETE'])
def remove_container(container_id):
    container = client.containers.get(container_id)
    container.remove(force=True)
    return '', 204

# Endpoint to start a Docker container
@containers_blueprint.route('/containers/start/<string:container_id>', methods=['POST'])
def start_container(container_id):
    container = client.containers.get(container_id)
    container.start()
    return '', 204

# Endpoint to stop a Docker container
@containers_blueprint.route('/containers/stop/<string:container_id>', methods=['POST'])
def stop_container(container_id):
    container = client.containers.get(container_id)
    container.stop()
    return '', 204

# Endpoint to pause a Docker container
@containers_blueprint.route('/containers/pause/<string:container_id>', methods=['POST'])
def pause_container(container_id):
    container = client.containers.get(container_id)
    container.pause()
    return '', 204

# Endpoint to rename a Docker container
@containers_blueprint.route('/containers/rename/<string:container_id>', methods=['POST'])
def rename_container(container_id):
    data = request.json
    new_name = data.get('new_name')
    container = client.containers.get(container_id)
    container.rename(new_name)
    return '', 204

# Endpoint to change user of a Docker container
@containers_blueprint.route('/containers/change-user/<string:container_id>', methods=['POST'])
def change_user(container_id):
    data = request.json
    new_user = data.get('new_user')
    container = client.containers.get(container_id)
    container.update(user=new_user)
    return '', 204

# Endpoint to add a port to a Docker container
@containers_blueprint.route('/containers/add-port/<string:container_id>', methods=['POST'])
def add_port(container_id):
    data = request.json
    port = data.get('port')
    container = client.containers.get(container_id)
    container.update(ports={port: port})
    return '', 204

# Endpoint to remove a port from a Docker container
@containers_blueprint.route('/containers/remove-port/<string:container_id>', methods=['POST'])
def remove_port(container_id):
    data = request.json
    port = data.get('port')
    container = client.containers.get(container_id)
    container.update(ports={port: None})
    return '', 204

# Endpoint to update a port in a Docker container
@containers_blueprint.route('/containers/update-port/<string:container_id>', methods=['POST'])
def update_port(container_id):
    data = request.json
    old_port = data.get('old_port')
    new_port = data.get('new_port')
    container = client.containers.get(container_id)
    container.update(ports={old_port: None, new_port: new_port})
    return '', 204

# Endpoint to add a volume to a Docker container
@containers_blueprint.route('/containers/add-volume/<string:container_id>', methods=['POST'])
def add_volume(container_id):
    data = request.json
    volume = data.get('volume')
    container = client.containers.get(container_id)
    container.update(volumes={volume: volume})
    return '', 204

# Endpoint to remove a volume from a Docker container
@containers_blueprint.route('/containers/remove-volume/<string:container_id>', methods=['POST'])
def remove_volume(container_id):
    data = request.json
    volume = data.get('volume')
    container = client.containers.get(container_id)
    container.update(volumes={volume: None})
    return '', 204

# Endpoint to get logs of a Docker container
@containers_blueprint.route('/containers/logs/<container_name>', methods=['GET'])
def get_logs(container_name):
    """Retrieve logs from a container and return them as a list."""
    client = docker.from_env()
    try:
        # Get container
        container = client.containers.get(container_name)
        
        # Retrieve logs
        logs = container.logs(tail=1000).decode('utf-8')  # Tail 1000 lines or adjust as needed

        # Split logs into lines and return as a list
        log_lines = logs.splitlines()

        return jsonify(log_lines), 200

    except docker.errors.NotFound:
        return jsonify({'error': 'Container not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Endpoint to update restart policy of a Docker container
@containers_blueprint.route('/containers/update-restart/<string:container_id>', methods=['POST'])
def update_restart(container_id):
    data = request.json
    restart_policy = data.get('restart_policy')
    container = client.containers.get(container_id)
    container.update(restart_policy=restart_policy)
    return '', 204

# Endpoint to add a command to a Docker container
@containers_blueprint.route('/containers/add-command/<string:container_id>', methods=['POST'])
def add_command(container_id):
    data = request.json
    command = data.get('command')
    container = client.containers.get(container_id)
    container.update(command=command)
    return '', 204

# Endpoint to remove a command from a Docker container
@containers_blueprint.route('/containers/remove-command/<string:container_id>', methods=['POST'])
def remove_command(container_id):
    container = client.containers.get(container_id)
    container.update(command=None)
    return '', 204

# Endpoint to update a command in a Docker container
@containers_blueprint.route('/containers/update-command/<string:container_id>', methods=['POST'])
def update_command(container_id):
    data = request.json
    new_command = data.get('new_command')
    container = client.containers.get(container_id)
    container.update(command=new_command)
    return '', 204

# Endpoint to add an environment variable to a Docker container
@containers_blueprint.route('/containers/add-environment/<string:container_id>', methods=['POST'])
def add_environment(container_id):
    data = request.json
    env = data.get('env')
    container = client.containers.get(container_id)
    container.update(environment={**container.attrs['Config']['Env'], **env})
    return '', 204

# Endpoint to remove an environment variable from a Docker container
@containers_blueprint.route('/containers/remove-environment/<string:container_id>', methods=['POST'])
def remove_environment(container_id):
    data = request.json
    env = data.get('env')
    container = client.containers.get(container_id)
    env_vars = container.attrs['Config']['Env']
    env_vars = [var for var in env_vars if var not in env]
    container.update(environment=env_vars)
    return '', 204

# Endpoint to update an environment variable in a Docker container
@containers_blueprint.route('/containers/update-environment/<string:container_id>', methods=['POST'])
def update_environment(container_id):
    data = request.json
    old_env = data.get('old_env')
    new_env = data.get('new_env')
    container = client.containers.get(container_id)
    env_vars = container.attrs['Config']['Env']
    env_vars = [new_env if var == old_env else var for var in env_vars]
    container.update(environment=env_vars)
    return '', 204
