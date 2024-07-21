from flask import Blueprint, request, jsonify
import docker

networks_blueprint = Blueprint('network', __name__)
client = docker.from_env()

# Network Listeleme
@networks_blueprint.route('/networks', methods=['GET'])
def list_networks():
    networks = client.networks.list()
    network_list = [{
        'id': network.id,
        'name': network.name,
        'driver': network.attrs.get('Driver', 'unknown'),
        'scope': network.attrs.get('Scope', 'unknown'),
        'ipam': network.attrs.get('IPAM', {}),
        'containers': list(network.attrs.get('Containers', {}).keys())
    } for network in networks]
    return jsonify(network_list)

# Network Ekleme
@networks_blueprint.route('/networks/create', methods=['POST'])
def create_network():
    data = request.json
    name = data.get('name')
    driver = data.get('driver', 'bridge')
    ipam_config = data.get('ipam', {})

    try:
        network = client.networks.create(
            name=name,
            driver=driver,
            ipam=docker.types.IPAMConfig(
                pool_configs=[docker.types.IPAMPool(**pool) for pool in ipam_config.get('pool_configs', [])]
            )
        )
        return jsonify({'id': network.id, 'name': network.name, 'driver': network.driver}), 201
    except docker.errors.APIError as e:
        return jsonify({'error': str(e)}), 400

# Network Silme
@networks_blueprint.route('/networks/remove/<network_id>', methods=['DELETE'])
def remove_network(network_id):
    try:
        client.networks.get(network_id).remove()
        return '', 204
    except docker.errors.NotFound:
        return 'Network not found', 404
    except docker.errors.APIError as e:
        return jsonify({'error': str(e)}), 400

# Network Düzenleme
@networks_blueprint.route('/networks/update/<network_id>', methods=['POST'])
def update_network(network_id):
    data = request.json
    new_name = data.get('name')
    new_driver = data.get('driver')
    new_ipam_config = data.get('ipam', {})

    try:
        network = client.networks.get(network_id)
        network.remove()  # Docker API doesn't support direct network updates, so remove and recreate
        new_network = client.networks.create(
            name=new_name or network.name,
            driver=new_driver or network.driver,
            ipam=docker.types.IPAMConfig(
                pool_configs=[docker.types.IPAMPool(**pool) for pool in new_ipam_config.get('pool_configs', [])]
            ) if new_ipam_config else network.attrs.get('IPAM', {})
        )
        return jsonify({'id': new_network.id, 'name': new_network.name, 'driver': new_network.driver}), 200
    except docker.errors.NotFound:
        return 'Network not found', 404
    except docker.errors.APIError as e:
        return jsonify({'error': str(e)}), 400


