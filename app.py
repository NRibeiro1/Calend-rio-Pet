from flask import Flask, render_template, request, jsonify
from models import db, Plantao


app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)


with app.app_context():
    db.create_all()


@app.route("/")
def home():
    return render_template("index.html")


# LISTAR
@app.route("/plantoes", methods=["GET"])
def listar_plantoes():

    plantoes = Plantao.query.all()

    return jsonify([
        p.to_dict() for p in plantoes
    ])


# CRIAR
@app.route("/plantoes", methods=["POST"])
def criar_plantao():

    dados = request.json

    novo = Plantao(
        data=dados["data"],
        veterinario=dados["veterinario"],
        turno=dados.get("turno"),
        observacao=dados.get("observacao")
    )

    db.session.add(novo)

    db.session.commit()

    return jsonify(novo.to_dict())


# EDITAR
@app.route("/plantoes/<int:id>", methods=["PUT"])
def editar_plantao(id):

    plantao = Plantao.query.get_or_404(id)

    dados = request.json

    plantao.veterinario = dados["veterinario"]
    plantao.turno = dados.get("turno")
    plantao.observacao = dados.get("observacao")

    db.session.commit()

    return jsonify(plantao.to_dict())


# EXCLUIR
@app.route("/plantoes/<int:id>", methods=["DELETE"])
def excluir_plantao(id):

    plantao = Plantao.query.get_or_404(id)

    db.session.delete(plantao)

    db.session.commit()

    return jsonify({
        "ok": True
    })


if __name__ == "__main__":
    app.run(debug=True)