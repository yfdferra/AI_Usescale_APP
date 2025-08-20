// document.getElementById("myButton").addEventListener("click", activateScript);
activateScript();
frame = document.getElementById("frame");

function activateScript() {
  var dropdown = document.createElement("select");
  frame.appendChild(dropdown);
  fetch("http://localhost:5000/get_use_scales")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((element) => {
        var option = document.createElement("option");
        option.textContent = element.title;
        dropdown.appendChild(option);
        console.log(element.title);
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}
