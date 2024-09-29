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
      .replace(/\s*(prime minister)\s*/gi, "\n\n$1\n\n") // Add newlines around "thank you"
      .replace(/\s*(deputy prime minister)\s*/gi, "\n\n$1\n\n") // Add newlines around "thank you"
      .replace(/\s*(government member)\s*/gi, "\n\n$1\n\n") // Add newlines around "thank you"
      .replace(/\s*(government whip)\s*/gi, "\n\n$1\n\n") // Add newlines around "thank you"
      .replace(/\s*(leader of opposition)\s*/gi, "\n\n$1\n\n") // Add newlines around "thank you"
      .replace(/\s*(deputy leader of opposition)\s*/gi, "\n\n$1\n\n") // Add newlines around "thank you"
      .replace(/\s*(opposition whip)\s*/gi, "\n\n$1\n\n") // Add newlines around "thank you"
      .replace(/\s*(opposition member)\s*/gi, "\n\n$1\n\n") // Add newlines around "thank you"
      .replace(/\s*(call upon)\s*/gi, "\n\n$1\n\n") // Add newlines around "thank you"
      .replace(/\s*(invite)\s*/gi, "\n\n$1\n\n") // Add newlines around "thank you"
      .replace(/\s*(three two one)\s*/gi, "\n\n$1\n\n") // Add newlines around "thank you"
      .trim(); // Remove leading/trailing whitespace

    // Count "thank you" occurrences
    const thankYouCount = (processedText.match(/thank you/gi) || []).length;

    // Update output
    // Use textContent to set the content, preserving newlines
    outputElement.textContent = processedText;

    // Provide user feedback
    showNotification(`Transcript processed.`);

    // Optional: Scroll to the output
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
    ".button-container button:nth-child(2)"
  );

  if (!outputElement || !outputElement.innerHTML.trim()) {
    showNotification(
      "No text to copy. Please process a transcript first.",
      "warning"
    );
    return;
  }

  // Get the text with newlines
  const textToCopy = outputElement.innerHTML.replace(/<br>/g, "\n");

  navigator.clipboard
    .writeText(textToCopy)
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
const showNotification = (message, type) => {
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

  // Use textContent to get the processed text with preserved newlines
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

// Helper function to get formatted date for filename (unchanged)
const getFormattedDate = () => {
  const now = new Date();
  return now.toISOString().slice(0, 19).replace(/[-:]/g, "").replace("T", "_");
};
const showInfoPopup = () => {
  document.getElementById("info-popup").style.display = "block";
};

const closeInfoPopup = () => {
  document.getElementById("info-popup").style.display = "none";
};

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  // Show popup on page load
  showInfoPopup();

  // Info button click event
  document
    .getElementById("info-button")
    .addEventListener("click", showInfoPopup);

  // Close button click event
  document
    .getElementById("close-popup")
    .addEventListener("click", closeInfoPopup);

  // Close popup when clicking outside
  window.addEventListener("click", (event) => {
    if (event.target === document.getElementById("info-popup")) {
      closeInfoPopup();
    }
  });
});
