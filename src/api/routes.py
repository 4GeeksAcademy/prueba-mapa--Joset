"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from sqlalchemy import select 
from flask_jwt_extended import create_access_token, get_jwt_identity

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route("/register", methods=["POST"])
def register():
    data = request.get_json() #porque la info de usuario viene de fronted
    email = data.get("email")
    password = data.get("password")
    if not email or not password:
        return jsonify({"error": "email and password are required"}), 400
                   #db.session.execute(select(Model).where(Model.id == id)).scalar_one()
    existing_user = db.session.execute(select(User).where(User.email == email )).scalar_one_or_none()
    if existing_user:
        return jsonify({"Error": "User with this email already exist"})
    new_user = User(email = email)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msj": "User created successfully"}), 201 

@api.route("/login", methods=["POST"])
def login():
    data = request.get_json() 
    email = data.get("email")
    password = data.get("password")
    if not email or not password:
        return jsonify({"error": "email and password are required"}), 400
    user = db.session.execute(select(User).where(User.email == email )).scalar_one_or_none()
    if user is None:
        return jsonify({"msg": "Invalid email or password"}), 400 #no especificar si email o password por si existitese caso de hack
    
    if user.check_password(password):
        # Si todo sale bien, true, creamos el token:
        access_token = create_access_token(identity=str(user.id))
        return jsonify({"msg": "Login successfull", "token": access_token}), 200
    else:
        return jsonify({"error": "email and password are required"}), 400
    
@api.route("/profile", methods=["GET"]) 
@jwt_required() #decorador nuevo porque esta ruta pedira siempre token
def get_profile():
    user_id = get_jwt_identity() #se encarga de obtener el id y validarlo
    user = db.session.get(User, int(user_id))
    if not user: 
        return jsonify({"msg": "User not found"}), 400
    return jsonify({user.serialize()}), 200

    #TOKEN-----DOCUMENTACION--- https://flask-jwt-extended.readthedocs.io/en/stable/installation.html
    #instalar:  pipenv install flask-jwt-extended
