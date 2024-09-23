// Function to edit the raw transcript
const processTranscript = () => {
  console.log("function start");
  const outputText = document.getElementById("transcript-output");
  let inputText = document.getElementById("transcript-input").value;

  console.log(typeof inputText);

  // Replace newlines with spaces
  let data = inputText.replace(/\n/g, " ");

  // Regular expression to match "thank you" (case insensitive, global)
  const thankYouRegex = /thank you/gi;

  // Count how many times "thank you" appears
  const thankYouCount = (data.match(thankYouRegex) || []).length;

  // If "thank you" exists, insert two empty lines before each occurrence
  if (thankYouCount > 0) {
    data = data.replace(thankYouRegex, "\n\nthank you");
  }

  console.log(`"thank you" appears ${thankYouCount} time(s).`);
  console.log("text processed");

  // Display result and render newlines in HTML as <br>
  outputText.innerHTML = data.replace(/\n/g, "<br>");
  console.log("function end");
};
// Function to copy the transcript
const copyTranscript = () => {
  const outputText = document.getElementById("transcript-output").textContent;
  console.log("Copying transcript...");
  navigator.clipboard
    .writeText(outputText)
    .then(() => {
      alert("Transcript copied to clipboard!");
    })
    .catch((err) => {
      console.error("Failed to copy:", err);
      alert("Failed to copy transcript to clipboard!");
    });
};

// Function to save the transcript
const saveTranscript = () => {
  const outputText = document.getElementById("transcript-output").textContent;
  console.log("Saving transcript...");
  const fileName = "transcript.txt";
  const textToSave = outputText.textContent;
  const blob = new Blob([textToSave], {
    type: "text/plain;charset=utf-8",
  });
  const downloadLink = document.createElement("a");
  downloadLink.setAttribute("href", URL.createObjectURL(blob));
  downloadLink.setAttribute("download", fileName);
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  alert("Transcript saved as " + fileName);
};
