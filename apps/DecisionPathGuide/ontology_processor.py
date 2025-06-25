from rdflib import Graph, Namespace, RDF, RDFS

class OntologyProcessor:
    def __init__(self, ontology_file):
        self.g = Graph()
        self.g.parse(ontology_file, format="turtle")
        self.ns = Namespace("http://pszwed.ia.agh.edu.pl/ontologies/2010/Decision.owl#")
        self.selected_aspects = []
        self.current_aspect_index = 0
        self.current_property_index = 0
        self.selected_properties = []
        self.rdfs_comments = self.get_rdfs_comments()

    def get_rdfs_comments(self):
        comments = {}
        for s, p, o in self.g.triples((None, RDFS.comment, None)):
            comments[s] = str(o)
        return comments

    def get_next_question(self, current_class, user_input, decisions):
        if not current_class:
            return {
                "question": "What type of decision are you making?",
                "options": ["Complex Decision (multiple aspects and considerations)", "Statement Decision (simple accept/reject/defer decision)"],
                "current_class": "Decision",
                "multiple_select": False
            }

        if current_class == "Decision":
            if user_input == "Complex Decision (multiple aspects and considerations)":
                return {
                    "question": "What are the main aspects of your complex decision? (Select all that apply)",
                    "options": ["DecisionContext", "DecisionConstraint", "DecisionProperties", "DecisionParticipants"],
                    "current_class": "ComplexDecisionAspects",
                    "multiple_select": True
                }
            elif user_input == "Statement Decision (simple accept/reject/defer decision)":
                return {
                    "question": "What is the context of your decision?",
                    "input_type": "text",
                    "current_class": "DecisionContext",
                    "footnote": self.rdfs_comments.get(self.ns.DecisionContext, '')
                }

        if current_class == "DecisionContext" and decisions.get("Decision") == "Statement Decision (simple accept/reject/defer decision)":
            return {
                "question": "What is your decision statement?",
                "options": ["Accept", "Reject", "Neutral", "Defer"],
                "current_class": "DecisionStatement",
                "multiple_select": False,
                "footnote": self.rdfs_comments.get(self.ns.DecisionStatement, '')
            }

        if current_class == "DecisionStatement":
            return {
                "question": "What is the object influenced by the decision?",
                "input_type": "text",
                "current_class": "DecisionObject",
                "footnote": self.rdfs_comments.get(self.ns.DecisionObject, '')
            }

        if current_class == "ComplexDecisionAspects":
            self.selected_aspects = user_input if isinstance(user_input, list) else [user_input]
            self.current_aspect_index = 0
            return self.get_next_aspect_question()

        if current_class in ["DecisionContext", "DecisionConstraint"]:
            self.current_aspect_index += 1
            return self.get_next_aspect_question()

        if current_class == "DecisionProperties":
            self.selected_properties = user_input if isinstance(user_input, list) else [user_input]
            self.current_property_index = 0
            return self.get_next_property_question()

        if current_class in ["DecisionArtifact", "DecisionObject", "Party"]:
            self.current_property_index += 1
            return self.get_next_property_question()

        if current_class == "DecisionParticipants":
            self.current_aspect_index += 1
            return self.get_next_aspect_question()

        if current_class == "DecisionObject":
            return {
                "question": "Does this decision cancel any previous decisions?",
                "options": ["Yes", "No"],
                "current_class": "CancelsDecision",
                "multiple_select": False,
                "footnote": self.rdfs_comments.get(self.ns.cancels, '')
            }

        if current_class == "CancelsDecision":
            if user_input == "Yes":
                return {
                    "question": "Which previous decision(s) does it cancel? (Enter comma-separated values)",
                    "input_type": "text",
                    "current_class": "CancelledDecision",
                    "footnote": self.rdfs_comments.get(self.ns.cancels, '')
                }
            else:
                return self.get_next_question("CancelledDecision", None, decisions)

        if current_class in ["CancelledDecision", "StatementDecision"]:
            return {
                "question": "Who supports this decision? (Select all that apply)",
                "options": ["DecisionMaker", "Consultant", "Expert", "Party"],
                "current_class": "SupportedBy",
                "multiple_select": True,
                "footnote": self.rdfs_comments.get(self.ns.isSupportedBy, '')
            }

        if current_class == "SupportedBy":
            return {
                "question": "What decision process resulted in this decision?",
                "input_type": "text",
                "current_class": "ResultsFrom",
                "footnote": self.rdfs_comments.get(self.ns.resultsFrom, '')
            }

        if current_class == "ResultsFrom":
            return {
                "question": "When will this decision be effective?",
                "input_type": "date",
                "current_class": "DecisionEvent",
                "footnote": self.rdfs_comments.get(self.ns.DecisionEvent, '')
            }

        return None

    def get_next_aspect_question(self):
        if self.current_aspect_index < len(self.selected_aspects):
            aspect = self.selected_aspects[self.current_aspect_index]
            if aspect == "DecisionContext":
                return {
                    "question": "What is the context of your decision?",
                    "input_type": "text",
                    "current_class": "DecisionContext",
                    "footnote": self.rdfs_comments.get(self.ns.DecisionContext, '')
                }
            elif aspect == "DecisionConstraint":
                return {
                    "question": "What are the constraints for your decision?",
                    "input_type": "text",
                    "current_class": "DecisionConstraint",
                    "footnote": self.rdfs_comments.get(self.ns.DecisionConstraint, '')
                }
            elif aspect == "DecisionProperties":
                return {
                    "question": "What are the properties of your decision? (Select all that apply)",
                    "options": ["DecisionArtifact", "DecisionObject", "Party"],
                    "current_class": "DecisionProperties",
                    "multiple_select": True
                }
            elif aspect == "DecisionParticipants":
                return {
                    "question": "Who are the participants in this decision? (Select all that apply)",
                    "options": ["DecisionMaker", "Consultant", "Expert", "Party"],
                    "current_class": "DecisionParticipants",
                    "multiple_select": True
                }
        else:
            return {
                "question": "Does this decision cancel any previous decisions?",
                "options": ["Yes", "No"],
                "current_class": "CancelsDecision",
                "multiple_select": False,
                "footnote": self.rdfs_comments.get(self.ns.cancels, '')
            }

    def get_next_property_question(self):
        if self.current_property_index < len(self.selected_properties):
            property_type = self.selected_properties[self.current_property_index]
            if property_type == "DecisionArtifact":
                return {
                    "question": "What type of document reflects or publishes the decision?",
                    "input_type": "text",
                    "current_class": "DecisionArtifact",
                    "footnote": self.rdfs_comments.get(self.ns.DecisionArtifact, '')
                }
            elif property_type == "DecisionObject":
                return {
                    "question": "What is the object influenced by the decision?",
                    "input_type": "text",
                    "current_class": "DecisionObject",
                    "footnote": self.rdfs_comments.get(self.ns.DecisionObject, '')
                }
            elif property_type == "Party":
                return {
                    "question": "Who is the recipient of the decision?",
                    "input_type": "text",
                    "current_class": "Party",
                    "footnote": self.rdfs_comments.get(self.ns.recipient, '')
                }
        else:
            self.current_aspect_index += 1
            return self.get_next_aspect_question()

    def generate_summary(self, decisions):
        summary = "Decision Summary:\n\n"
        for key, value in decisions.items():
            if isinstance(value, list):
                summary += f"{key}:\n"
                for item in value:
                    summary += f"  - {item}\n"
            else:
                summary += f"{key}: {value}\n"
        return summary

    def get_decision_tree(self):
        # This method remains unchanged
        pass
