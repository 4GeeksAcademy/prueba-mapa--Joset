from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from flask_bcrypt import generate_password_hash, check_password_hash         #se debe importar para el hash

db = SQLAlchemy()

class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(nullable=False) #se cambia password a password_hash
   
    def set_password(self, password): #para hashear password. 
        self.password_hash = generate_password_hash(password).decode('utf-8')
        #set_password: va a recibir un password - lo transforma (hash) y lo almacena 

    def check_password(self, password):  #cuando el usuario intente loguearse hay que comparar el password encriptado con lo que da el usuario
        return check_password_hash(self.password_hash, password)
    


    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # do not serialize the password, its a security breach
        }