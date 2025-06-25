from flask import Flask, render_template, request, jsonify
from ontology_processor import OntologyProcessor

app = Flask(__name__)
ontology = OntologyProcessor("Decisions_Turtle.txt")
decisions = {}

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/get_next_question", methods=["POST"])
def get_next_question():
    current_class = request.json.get("current_class")
    user_input = request.json.get("user_input")
    global decisions
    
    if current_class:
        decisions[current_class] = user_input
    
    next_question = ontology.get_next_question(current_class, user_input, decisions)
    return jsonify(next_question)

@app.route("/get_summary", methods=["POST"])
def get_summary():
    global decisions
    summary = ontology.generate_summary(decisions)
    return jsonify(summary)

@app.route("/get_decision_tree", methods=["GET"])
def get_decision_tree():
    tree_data = ontology.get_decision_tree()
    return jsonify(tree_data)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
