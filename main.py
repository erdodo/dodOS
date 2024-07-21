from flask import Flask
from flask_cors import CORS
from apis.containers import containers_blueprint
from apis.volumes import volumes_blueprint
from apis.networks import networks_blueprint
from apis.compose import compose_blueprint
from apis.backup import backup_blueprint
from apis.store import store_blueprint


app = Flask(__name__)
CORS(app)

# Register Blueprints
app.register_blueprint(containers_blueprint, url_prefix='/api')
app.register_blueprint(volumes_blueprint, url_prefix='/api')
app.register_blueprint(networks_blueprint, url_prefix='/api')
app.register_blueprint(compose_blueprint, url_prefix='/api')
app.register_blueprint(backup_blueprint, url_prefix='/api')
app.register_blueprint(store_blueprint, url_prefix='/api')


if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0')
