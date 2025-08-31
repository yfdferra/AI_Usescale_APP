// Host URL for API requests
HOST = "http://localhost:5000";

// Get references to the template frame and usescale elements
frame = document.getElementById("frame");
usescale = document.getElementById("usescale");

// Event listeners for creating templates
document
  .getElementById("create_template")
  .addEventListener("click", (event) => {
    createTemplate(event);
  });

// Event listeners for loading templates
document.getElementById("open_template").addEventListener("click", () => {
  openTemplate();
});

// Event listener for adding rows
document.getElementById("add_row").addEventListener("click", addRow);
document.getElementById("remove_row").addEventListener("click", removeRow);
document.getElementById("jsonify").addEventListener("click", saveTemplate);
activateScript();

// Event listener for getting JSON
document.getElementById("jsonify").addEventListener("click", () => {
  jsonify();
});

function jsonify() {
  let rows = usescale.querySelectorAll("div");
  let result = [];
  rows.forEach((row) => {
    let textareas = row.querySelectorAll("textarea");
    if (textareas.length === 3) {
      let obj = {
        category: textareas[0].value,
        description: textareas[1].value,
        comments: textareas[2].value,
      };
      result.push(obj);
    }
  });
  console.log(JSON.stringify(result, null, 1));
  return JSON.stringify(result, null, 1);
}

function removeRow() {
  const rows = usescale.querySelectorAll("div");
  if (rows.length > 0) {
    rows[rows.length - 1].remove(); // remove the last row
  }
}

function openTemplate() {
  const dropdown = frame.querySelector("select");
  const templateId = dropdown.value;
  console.log("Opening template:", templateId);

  fetch(HOST + `/get_template?template_id=${templateId}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        alert(data.error);
      } else {
        console.log("Template loaded:", data);

        const templateData = JSON.parse(data.templateJson);
        console.log("Parsed template JSON:", templateData);

        usescale.innerHTML = "";

        templateData.forEach((item) => {
          const row = document.createElement("div");

          const category = document.createElement("textarea");
          category.value = item.category || "";

          const description = document.createElement("textarea");
          description.value = item.description || "";

          const comments = document.createElement("textarea");
          comments.value = item.comments || "";

          row.appendChild(category);
          row.appendChild(description);
          row.appendChild(comments);

          usescale.appendChild(row);
        });
      }
    })
    .catch((error) => console.error("Error loading template:", error));
}

function createTemplate(event) {
  var title = document.getElementById("new_template_title").value;

  fetch(HOST + "/create_template", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title: title }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      activateScript();
    })
    .catch((error) => {
      console.error("Failed, error:", error);
    });
  activateScript();
}

// Function to populate the dropdown
function activateScript() {
  dropdown = frame.querySelector("select");
  if (dropdown) {
    dropdown.innerHTML = "";
  } else {
    var dropdown = document.createElement("select");
  }
  frame.appendChild(dropdown);
  fetch(HOST + "/get_templates")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((element) => {
        var option = document.createElement("option");
        option.value = element.templateID;
        option.textContent = element.templateName;
        dropdown.appendChild(option);
        console.log(element.templateName);
      });
    })
    .catch((error) => {
      console.error("Unable to get data", error);
    });
}

// Function to add a new row of textareas
function addRow() {
  var row = document.createElement("div");
  var type = document.createElement("textarea");
  var shortDescription = document.createElement("textarea");
  var declaration = document.createElement("textarea");
  row.appendChild(type);
  row.appendChild(shortDescription);
  row.appendChild(declaration);
  usescale.appendChild(row);
}

function saveTemplate() {
  const dropdown = frame.querySelector("select");
  const templateId = dropdown.value;
  const jsonData = jsonify();

  fetch(HOST + "/save_template", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      templateID: templateId,
      templateJson: jsonData,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Saved:", data);
      alert("Template saved");
    })
    .catch((error) => console.error("Error saving template:", error));
}
