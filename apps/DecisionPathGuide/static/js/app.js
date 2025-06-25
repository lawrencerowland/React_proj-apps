// Add this helper function at the beginning of the file
function truncateLabel(label, maxLength = 30) {
    if (label.length <= maxLength) return label;
    return label.substr(0, maxLength - 3) + '...';
}

let currentClass = "";
let decisions = {};
let nodes = [];
let edges = [];

async function getNextQuestion() {
    const response = await fetch("/get_next_question", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ current_class: currentClass, user_input: decisions[currentClass] }),
    });
    return await response.json();
}

async function updateQuestion() {
    const questionData = await getNextQuestion();
    if (!questionData) {
        showSummary();
        return;
    }

    const questionElement = document.getElementById("question");
    const optionsElement = document.getElementById("options");
    
    questionElement.textContent = questionData.question;
    optionsElement.innerHTML = "";
    
    if (questionData.footnote) {
        const footnote = document.createElement("p");
        footnote.textContent = questionData.footnote;
        footnote.classList.add("text-sm", "text-gray-500", "mt-2");
        questionElement.appendChild(footnote);
    }
    
    if (questionData.options) {
        if (questionData.multiple_select) {
            questionData.options.forEach(option => {
                const label = document.createElement("label");
                label.classList.add("block", "mb-2");
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.value = option;
                checkbox.classList.add("mr-2");
                label.appendChild(checkbox);
                label.appendChild(document.createTextNode(option));
                optionsElement.appendChild(label);
            });

            const submitButton = document.createElement("button");
            submitButton.textContent = "Submit";
            submitButton.classList.add("bg-green-500", "hover:bg-green-700", "text-white", "font-bold", "py-2", "px-4", "rounded", "mt-2");
            submitButton.onclick = () => {
                const selectedOptions = Array.from(optionsElement.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
                selectOption(selectedOptions);
            };
            optionsElement.appendChild(submitButton);
        } else {
            questionData.options.forEach(option => {
                const button = document.createElement("button");
                button.textContent = option;
                button.classList.add("bg-blue-500", "hover:bg-blue-700", "text-white", "font-bold", "py-2", "px-4", "rounded", "mr-2", "mb-2");
                button.onclick = () => selectOption(option);
                optionsElement.appendChild(button);
            });
        }
    } else if (questionData.input_type === "text") {
        const input = document.createElement("input");
        input.type = "text";
        input.classList.add("border", "rounded", "py-2", "px-3", "text-gray-700", "leading-tight", "focus:outline-none", "focus:shadow-outline", "w-full");
        optionsElement.appendChild(input);
        
        const submitButton = document.createElement("button");
        submitButton.textContent = "Submit";
        submitButton.classList.add("bg-green-500", "hover:bg-green-700", "text-white", "font-bold", "py-2", "px-4", "rounded", "mt-2");
        submitButton.onclick = () => selectOption(input.value);
        optionsElement.appendChild(submitButton);
    } else if (questionData.input_type === "date") {
        const input = document.createElement("input");
        input.type = "date";
        input.classList.add("border", "rounded", "py-2", "px-3", "text-gray-700", "leading-tight", "focus:outline-none", "focus:shadow-outline", "w-full");
        optionsElement.appendChild(input);
        
        const submitButton = document.createElement("button");
        submitButton.textContent = "Submit";
        submitButton.classList.add("bg-green-500", "hover:bg-green-700", "text-white", "font-bold", "py-2", "px-4", "rounded", "mt-2");
        submitButton.onclick = () => selectOption(input.value);
        optionsElement.appendChild(submitButton);
    }

    currentClass = questionData.current_class;
    updateDecisionTree(questionData);
}

function selectOption(option) {
    decisions[currentClass] = option;
    updateQuestion();
}

async function showSummary() {
    const response = await fetch("/get_summary", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ decisions: decisions }),
    });
    const summary = await response.json();

    const summaryElement = document.getElementById("summary");
    summaryElement.textContent = summary;
    summaryElement.classList.remove("hidden");

    document.getElementById("question-container").classList.add("hidden");
}

function updateDecisionTree(questionData) {
    const nodeId = nodes.length;
    // Update node creation to use truncateLabel function
    nodes.push({ id: nodeId, label: truncateLabel(questionData.question.split('(')[0].trim()) });

    if (nodes.length > 1) {
        edges.push({ from: nodeId - 1, to: nodeId });
    }

    if (questionData.options) {
        questionData.options.forEach((option, index) => {
            const optionId = nodes.length;
            // Update option node creation to use truncateLabel function
            nodes.push({ id: optionId, label: truncateLabel(option) });
            edges.push({ from: nodeId, to: optionId });
        });
    }

    drawDecisionTree();
}

function drawDecisionTree() {
    const container = document.getElementById("decision-tree");
    const data = {
        nodes: new vis.DataSet(nodes),
        edges: new vis.DataSet(edges)
    };
    const options = {
        layout: {
            hierarchical: {
                direction: "UD",
                sortMethod: "directed"
            }
        },
        edges: {
            smooth: {
                type: "cubicBezier",
                forceDirection: "vertical",
                roundness: 0.4
            }
        }
    };
    new vis.Network(container, data, options);
}

function startOver() {
    currentClass = "";
    decisions = {};
    nodes = [];
    edges = [];
    document.getElementById("summary").classList.add("hidden");
    document.getElementById("question-container").classList.remove("hidden");
    updateQuestion();
    drawDecisionTree();
}

document.addEventListener("DOMContentLoaded", () => {
    updateQuestion();
    document.getElementById("start-over").addEventListener("click", startOver);
});
