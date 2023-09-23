document.addEventListener('DOMContentLoaded', () => {
  const socket = io(); // Connect to the server

  const chatMessages = document.getElementById('chat-messages');
  const messageInput = document.getElementById('message-input');
  const sendButton = document.getElementById('send-button');
  const emojiButton = document.getElementById('emoji-button');
  const emojiList = document.getElementById('emoji-list');

  // Function to add a message to the chat window
  function addMessage(message, isSent) {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add(isSent ? 'sent-message' : 'received-message');
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll to the bottom
  }

  let lastSentMessage = ''; // Inicialize a variável global

  // Listen for messages from the server
  socket.on('message', (data) => {
    const { message, sender } = data;

    // Verifique se a mensagem recebida não é da mesma pessoa que você
    if (sender !== 'Você' && message !== lastSentMessage) {
      addMessage(sender + ': ' + message, false);
    }
  });

  // Send a message when the send button is clicked
  sendButton.addEventListener('click', () => {
    const message = messageInput.value;
    if (message.trim() !== '') {
      socket.emit('message', { message, sender: 'Você' });
      messageInput.value = '';
      lastSentMessage = message; // Atualize a última mensagem enviada
      addMessage('Você: ' + message, true);
    }
  });

  // Send a message when the Enter key is pressed
  messageInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
      sendButton.click();
    }
  });

  // Toggle emoji list when emoji button is clicked
  emojiButton.addEventListener('click', () => {
    emojiList.style.display = emojiList.style.display === 'block' ? 'none' : 'block';
  });

  // Function to select an emoji
  function selectEmoji(emoji) {
    messageInput.value += emoji;
  }

  // Close the emoji list if you click anywhere outside of it
  document.addEventListener('click', (event) => {
    if (!emojiList.contains(event.target) && event.target !== emojiButton) {
      emojiList.style.display = 'none';
    }
  });

  // Add a click event listener to each emoji in the list
  const emojis = emojiList.querySelectorAll('.emoji');
  emojis.forEach((emoji) => {
    emoji.addEventListener('click', () => {
      const selectedEmoji = emoji.getAttribute('data-emoji');
      selectEmoji(selectedEmoji);
    });
  });
});
