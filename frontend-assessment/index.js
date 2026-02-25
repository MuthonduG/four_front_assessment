document.addEventListener("DOMContentLoaded", () => {
    loadUserCards();
    
    // Add event listener for chat modal shown
    const chatModal = document.getElementById('chatModal');
    if (chatModal) {
        chatModal.addEventListener('shown.bs.modal', function () {
            document.getElementById('chatInput').focus();
        });
    }
});

const cardBackgroundColors = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
];

const fetchMockData = () => {
    return fetch("mock-data.json")
        .then(response => response.json())
        .then(data => data.users)
        .catch(error => {
            console.error("Error loading JSON:", error);
            return [];
        });
};

const formatStats = (stats) => {
    if (typeof stats === 'number') {
        return stats;
    } else if (typeof stats === 'object' && stats !== null) {
        const values = Object.values(stats);
        return values.slice(0, 4).join(' • ');
    }
    return '0';
};

const getTextColor = (bgColor) => {
    if (bgColor.includes('gradient')) {
        return 'white';
    }
    return 'white';
};

const loadUserCards = async () => {
    const userCardsContainer = document.getElementById("userCardsContainer");
    const users = await fetchMockData();
    userCardsContainer.innerHTML = "";
    
    const row = document.createElement('div');
    row.className = 'row g-3';
    
    users.forEach((user, index) => {
        const statsDisplay = formatStats(user.stats);
        
        const bgColor = cardBackgroundColors[index % cardBackgroundColors.length];
        const textColor = getTextColor(bgColor);
        
        const col = document.createElement('div');
        col.className = 'col-sm-6 col-md-6 col-lg-4 col-xl-3 mb-3';
        
        col.innerHTML = `
            <div class="card user-card h-100 border-0" data-user-id="${user.id}" onclick="showUserInMainCard(${user.id})" style="background: ${bgColor};">
                <div class="card-body p-3">
                    <div class="d-flex align-items-center mb-3">
                        <div class="avatar me-3">
                            <img src="${user.avatar}" alt="${user.name}" class="rounded-circle border border-2 border-white" width="60" height="60">
                        </div>
                        <div class="user-info">
                            <h6 class="fw-bold mb-0" style="color: ${textColor};">${user.name}</h6>
                            <small style="color: ${textColor}; opacity: 0.9;">${user.username}</small>
                        </div>
                    </div>
                    <div class="user-stats">
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="badge w-100 p-2" style="background-color: rgba(255,255,255,0.2); color: ${textColor}; border: 1px solid rgba(255,255,255,0.1);">
                                <i class="bi bi-activity me-1"></i> Stats: ${statsDisplay}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        row.appendChild(col);
    });
    
    userCardsContainer.appendChild(row);
};

function showUserInMainCard(userId) {
    console.log(`User ${userId} clicked`);
    // Add your logic to update the main card here
}

// Mouse hover effects for user cards
document.addEventListener('mouseover', function(e) {
    const userCard = e.target.closest('.user-card');
    if (userCard) {
        userCard.style.transform = 'translateY(-5px) scale(1.02)';
        userCard.style.transition = 'all 0.3s ease';
        userCard.style.boxShadow = '0 15px 30px rgba(0,0,0,0.2)';
    }
});

document.addEventListener('mouseout', function(e) {
    const userCard = e.target.closest('.user-card');
    if (userCard) {
        userCard.style.transform = 'translateY(0) scale(1)';
        userCard.style.boxShadow = 'none';
    }
});

// Chat functionality
function sendMessage() {
    const input = document.getElementById('chatInput');
    const sendBtn = document.querySelector('.chat-send-btn');
    const message = input.value.trim();
    
    if (message) {
        // Add loading state to button
        sendBtn.classList.add('sending');
        sendBtn.innerHTML = '<i class="bi bi-arrow-repeat"></i>';
        
        const chatMessages = document.getElementById('chatMessages');
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const userMessage = `
            <div class="message sent mb-3 text-end">
                <div class="message-content bg-success text-white p-3 rounded-4 d-inline-block">
                    ${message}
                </div>
                <small class="text-muted d-block mt-1">${time}</small>
            </div>
        `;
        
        chatMessages.insertAdjacentHTML('beforeend', userMessage);
        
        input.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Remove loading state and restore send icon
        setTimeout(() => {
            sendBtn.classList.remove('sending');
            sendBtn.innerHTML = '<i class="bi bi-send-fill"></i>';
        }, 500);
        
        setTimeout(simulateReply, 1000);
    }
}

function simulateReply() {
    const replies = [
        "Thanks for your message! Our team will get back to you shortly.",
        "I understand your question. Let me help you with that.",
        "Great choice! Would you like to know more about our membership benefits?",
        "You can find more details in our membership section. Is there anything specific you'd like to know?",
        "I'd be happy to help you choose the right membership plan!"
    ];
    
    const randomReply = replies[Math.floor(Math.random() * replies.length)];
    const chatMessages = document.getElementById('chatMessages');
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const replyMessage = `
        <div class="message received mb-3">
            <div class="message-content bg-light p-3 rounded-4 d-inline-block">
                <small class="text-muted d-block mb-1">Support Team</small>
                ${randomReply}
            </div>
            <small class="text-muted d-block mt-1">${time}</small>
        </div>
    `;
    
    chatMessages.insertAdjacentHTML('beforeend', replyMessage);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addQuickReply(topic) {
    document.getElementById('chatInput').value = `I'd like to know more about ${topic}`;
    sendMessage();
}

// Enter key support for chat
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.target.id === 'chatInput') {
        e.preventDefault();
        sendMessage();
    }
});