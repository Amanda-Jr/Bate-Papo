document.addEventListener('DOMContentLoaded', () => {
    const socket = io(); // Connect to the server
  
    const chatMessages = document.getElementById('chat-messages');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
  
    // Function to add a message to the chat window
    function addMessage(message) {
      const messageElement = document.createElement('div');
      messageElement.innerText = message;
      chatMessages.appendChild(messageElement);
      chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll to the bottom
    }
  
    // Listen for messages from the server
    socket.on('message', (message) => {
      addMessage(message);
    });
  
    // Send a message when the send button is clicked
    sendButton.addEventListener('click', () => {
      const message = messageInput.value;
      if (message.trim() !== '') {
        socket.emit('message', message);
        messageInput.value = '';
        addMessage('Você: ' + message);
      }
    });
  
    // Send a message when the Enter key is pressed
    messageInput.addEventListener('keyup', (event) => {
      if (event.key === 'Enter') {
        sendButton.click();
      }
    });
  });
  