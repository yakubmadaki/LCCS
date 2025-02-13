// Get references to elements
const gmButton = document.querySelector('.gm button');
const generalMessageModal = document.querySelector('.modal-container');
const closeModalBtn = generalMessageModal.querySelector('.close-me button');
const sendGeneralMessageBtn = generalMessageModal.querySelector('.message-send-btn');
const generalMessageInput = generalMessageModal.querySelector('textarea');

// Function to show the modal
function showModal() {
  generalMessageModal.style.display = 'flex';
}

// Function to hide the modal
function hideModal() {
  generalMessageModal.style.display = 'none';
}

// Function to send the general message
function sendGeneralMessage() {
  // Here, you would implement the logic to send the message to all users in the list
  // For example, you could make an AJAX request to a server-side endpoint.
  console.log('Sending general message:', generalMessageInput.value);

  // Clear the input field and hide the modal
  generalMessageInput.value = '';
  hideModal();
}

// Event listeners
gmButton.addEventListener('click', showModal);
closeModalBtn.addEventListener('click', hideModal);
sendGeneralMessageBtn.addEventListener('click', sendGeneralMessage);