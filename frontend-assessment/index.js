document.addEventListener("DOMContentLoaded", () => {
    loadUserCards();
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