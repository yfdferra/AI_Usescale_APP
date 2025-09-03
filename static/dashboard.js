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

function openTemplate() {
  dropdown = frame.querySelector("select");
  console.log(dropdown.value);
  fetch(HOST + "/get_usescale_rows?usescale_id=" + dropdown.value, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("success :" + data);
      usescale.innerHTML = "";
      data.forEach((element) => {
        var row = document.createElement("div");
        row.dataset.id = element.row_id;
        var type = document.createElement("textarea");
        type.value = element.category;
        var shortDescription = document.createElement("textarea");
        shortDescription.value = element.description;
        var declaration = document.createElement("textarea");
        declaration.value = element.comments;
        row.appendChild(type);
        row.appendChild(shortDescription);
        row.appendChild(declaration);
        usescale.appendChild(row);
      });
    });
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
  fetch(HOST + "/get_use_scales")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((element) => {
        var option = document.createElement("option");
        option.value = element.usescale_id;
        option.textContent = element.title;
        dropdown.appendChild(option);
        console.log(element.title);
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
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

function fetchUseScaleItems() {}