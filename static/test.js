console.log("hello world");
document.getElementById("myButton").addEventListener("click", activateScript);

function activateScript() {
  console.log("Button clicked! Script activated.");
  fetch("http://localhost:5000/data")
    .then((response) => response.json())
    .then((data) => {
      console.log("Received data:", data);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}
