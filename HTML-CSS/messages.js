document.addEventListener('DOMContentLoaded', () => {
    const chatHistory = document.querySelector('.message-history');
    const messageForm = document.querySelector('form');
    const messageInput = document.querySelector('.write-message');
    const recipientSelect = document.querySelector('.select-form-control');
    const inboxChat = document.querySelector('.inbox-chat');

    let currentUser = null;
    let users = [];

    // Fetch the list of users from the server
    function fetchUsers() {
        fetch('http://localhost:3000/users')
            .then(response => response.json())
            .then(data => {
                users = data;
                renderUserList();
                if (users.length > 0) {
                    currentUser = users[0];
                    fetchUserMessages(currentUser.id);
                }
            })
            .catch(error => console.error('Error fetching users:', error));
    }

    // Fetch messages for the selected user
    function fetchUserMessages(userId) {
        fetch(`http://localhost:3000/users/${userId}/messages`)
            .then(response => response.json())
            .then(messages => {
                if (currentUser) {
                    currentUser.chat = messages;
                    renderMessages();
                }
            })
            .catch(error => console.error('Error fetching messages:', error));
    }

    // Render the list of users
    function renderUserList() {
        inboxChat.innerHTML = '';
        users.forEach(user => {
            const userDiv = document.createElement('a');
            userDiv.classList.add('list-content');
            userDiv.href = '#';
            userDiv.dataset.userId = user.id;

            userDiv.innerHTML = `
                <div class="chat-people">
                    <h5>${user.matricNo}
                        <span class="chat-date"> ${timeSince(new Date(user.timestamp))}</span>
                    </h5>
                    <h6>${user.sender}</h6>
                    <p>${user.chat.length > 0 ? user.chat[user.chat.length - 1].content : ''}</p>
                </div>
            `;

            userDiv.addEventListener('click', (e) => {
                e.preventDefault();
                currentUser = users.find(user => user.id === parseInt(userDiv.dataset.userId));
                fetchUserMessages(currentUser.id);
            });

            inboxChat.appendChild(userDiv);
        });
    }

    // Render the chat messages
    function renderMessages() {
        chatHistory.innerHTML = '';
        if (currentUser && currentUser.chat) {
            currentUser.chat.forEach(message => {
                const messageDiv = document.createElement('div');
                messageDiv.classList.add(message.sender === 'me' ? 'outgoing-msg' : 'incoming-msg');

                if (message.sender !== 'me') {
                    const imgDiv = document.createElement('div');
                    imgDiv.classList.add('incoming-msg-img');
                    const img = document.createElement('img');
                    img.src = '../Icons/admin.png';
                    imgDiv.appendChild(img);
                    messageDiv.appendChild(imgDiv);
                }

                const textDiv = document.createElement('div');
                textDiv.classList.add(message.sender === 'me' ? 'sent-msg' : 'received-msg');

                const textContent = document.createElement('div');
                textContent.classList.add(message.sender === 'me' ? 'sent-width-msg' : 'received-width-message');
                textContent.innerHTML = `
                    <p>${message.content}</p>
                    <span class="time-date">${timeSince(new Date(message.timestamp))}</span>
                `;

                textDiv.appendChild(textContent);
                messageDiv.appendChild(textDiv);
                chatHistory.appendChild(messageDiv);
            });
        }
    }

    // Handle form submission
    messageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newMessage = {
            sender: 'me',
            content: messageInput.value,
            timestamp: new Date().toISOString(),
        };
        fetch(`http://localhost:3000/users/${currentUser.id}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newMessage)
        })
            .then(response => response.json())
            .then(message => {
                if (currentUser) {
                    currentUser.chat.push(message);
                    messageInput.value = '';
                    renderMessages();
                    renderUserList(); // Refresh the user list to show the latest message preview
                }
            })
            .catch(error => console.error('Error posting message:', error));
    });

    // Helper function to calculate time since a given date
    function timeSince(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) {
            return Math.floor(interval) + " years ago";
        }
        interval = seconds / 2592000;
        if (interval > 1) {
            return Math.floor(interval) + " months ago";
        }
        interval = seconds / 86400;
        if (interval > 1) {
            return Math.floor(interval) + " days ago";
        }
        interval = seconds / 3600;
        if (interval > 1) {
            return Math.floor(interval) + " hours ago";
        }
        interval = seconds / 60;
        if (interval > 1) {
            return Math.floor(interval) + " minutes ago";
        }
        return Math.floor(seconds) + " seconds ago";
    }

    // Initial fetch to load user list and default messages
    fetchUsers();
});

