from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Plantao(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    data = db.Column(db.String(20), nullable=False)

    veterinario = db.Column(db.String(100), nullable=False)

    turno = db.Column(db.String(30))

    observacao = db.Column(db.String(200))

    def to_dict(self):
        return {
            "id": self.id,
            "data": self.data,
            "veterinario": self.veterinario,
            "turno": self.turno,
            "observacao": self.observacao
        }