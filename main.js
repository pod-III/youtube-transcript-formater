// Function to edit the raw transcript
const processTranscript = () => {
  const outputElement = document.getElementById("transcript-output");
  const inputElement = document.getElementById("transcript-input");

  if (!inputElement || !outputElement) {
    console.error("Required elements not found");
    return;
  }

  try {
    const inputText = inputElement.value.trim();
    if (!inputText) {
      showNotification("Please enter a transcript to process.", "warning");
      return;
    }

    // Process the text
    const processedText = inputText
      .replace(/\s+/g, " ") // Normalize spaces
      .trim(); // Remove leading/trailing whitespace

    // Update output
    outputElement.textContent = processedText;

    showNotification("Transcript processed successfully.");
    outputElement.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    console.error("Error processing transcript:", error);
    showNotification(
      "An error occurred while processing the transcript.",
      "error"
    );
  }
};

// Function to separate the raw transcript
const separateTranscript = () => {
  const outputElement = document.getElementById("transcript-output");
  const inputElement = document.getElementById("transcript-input");

  if (!inputElement || !outputElement) {
    console.error("Required elements not found");
    return;
  }

  try {
    const inputText = inputElement.value.trim();
    if (!inputText) {
      showNotification("Please enter a transcript to process.", "warning");
      return;
    }

    // Process the text
    const processedText = inputText
      .replace(/\s+/g, " ") // Normalize spaces
      .replace(
        /\s*(prime minister|deputy prime minister|government member|member of government|government whip|leader of(?:\s+the)?\s+opposition|deputy leader of opposition|opposition whip|opposition member|member of opposition|call upon|invite|three two one)\s*/gi,
        "\n\n$1\n\n"
      )
      .trim(); // Remove leading/trailing whitespace

    outputElement.textContent = processedText;

    showNotification("Transcript separation processed successfully.");
    outputElement.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    console.error("Error processing transcript:", error);
    showNotification(
      "An error occurred while processing the transcript.",
      "error"
    );
  }
};

// Function to copy the transcript
const copyTranscript = () => {
  const outputElement = document.getElementById("transcript-output");
  const copyButton = document.querySelector(
    ".button-container button:nth-child(3)"
  );

  if (!outputElement || !outputElement.textContent.trim()) {
    showNotification(
      "No text to copy. Please process a transcript first.",
      "warning"
    );
    return;
  }

  navigator.clipboard
    .writeText(outputElement.textContent)
    .then(() => {
      showNotification("Transcript copied to clipboard!", "success");
      copyButton.textContent = "Copied!";
      setTimeout(() => (copyButton.textContent = "Copy"), 2000);
    })
    .catch((err) => {
      console.error("Failed to copy:", err);
      showNotification(
        "Failed to copy transcript to clipboard. Please try again.",
        "error"
      );
    });
};

// Helper function to show notifications
const showNotification = (message, type = "success") => {
  const notification = document.createElement("div");
  notification.textContent = message;
  notification.className = `notification ${type}`;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add("fadeout");
    setTimeout(() => notification.remove(), 500);
  }, 3000);
};

// Function to save the transcript
const saveTranscript = () => {
  const outputElement = document.getElementById("transcript-output");

  if (!outputElement || !outputElement.textContent.trim()) {
    showNotification(
      "No text to save. Please process a transcript first.",
      "warning"
    );
    return;
  }

  const textToSave = outputElement.textContent;
  const fileName = `transcript_${getFormattedDate()}.txt`;
  const blob = new Blob([textToSave], { type: "text/plain;charset=utf-8" });

  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    // For IE
    window.navigator.msSaveOrOpenBlob(blob, fileName);
  } else {
    const downloadLink = document.createElement("a");
    const url = URL.createObjectURL(blob);

    downloadLink.href = url;
    downloadLink.download = fileName;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);

    downloadLink.click();

    setTimeout(() => {
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(url);
    }, 100);
  }

  showNotification(`Transcript saved as ${fileName}`, "success");
};

// Helper function to get formatted date for filename
const getFormattedDate = () => {
  return new Date().toISOString().slice(0, 19).replace(/[-:T]/g, "_");
};

// Pop Up functions
const showInfoPopup = () => {
  document.getElementById("info-popup").style.display = "block";
};

const closeInfoPopup = () => {
  document.getElementById("info-popup").style.display = "none";
};

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  showInfoPopup();

  document
    .getElementById("info-button")
    .addEventListener("click", showInfoPopup);
  document
    .getElementById("close-popup")
    .addEventListener("click", closeInfoPopup);

  // Close popup when clicking outside
  window.addEventListener("click", (event) => {
    if (event.target === document.getElementById("info-popup")) {
      closeInfoPopup();
    }
  });

  // Add event listeners for buttons
  document
    .querySelector(".button-container button:nth-child(1)")
    .addEventListener("click", processTranscript);
  document
    .querySelector(".button-container button:nth-child(2)")
    .addEventListener("click", separateTranscript);
  document
    .querySelector(".button-container button:nth-child(3)")
    .addEventListener("click", copyTranscript);
  document
    .querySelector(".button-container button:nth-child(4)")
    .addEventListener("click", saveTranscript);
});
