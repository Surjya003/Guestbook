class GuestbookApp {
    constructor() {
        this.form = document.getElementById('guestbook-form');
        this.messagesContainer = document.getElementById('messages-container');
        this.nameInput = document.getElementById('name');
        this.messageInput = document.getElementById('message');
        this.init();
    }

    init() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.loadMessages();
        this.setupCharacterCounters();
        
        // Auto-refresh messages every 30 seconds
        setInterval(() => {
            this.loadMessages();
        }, 30000);
    }

    setupCharacterCounters() {
        // Add character counters
        this.addCharacterCounter(this.nameInput, 50);
        this.addCharacterCounter(this.messageInput, 500);
    }

    addCharacterCounter(input, maxLength) {
        const counter = document.createElement('div');
        counter.className = 'character-count';
        input.parentNode.appendChild(counter);

        const updateCounter = () => {
            const remaining = maxLength - input.value.length;
            counter.textContent = `${input.value.length}/${maxLength} characters`;
            
            counter.classList.remove('warning', 'error');
            if (remaining < 50 && remaining > 10) {
                counter.classList.add('warning');
            } else if (remaining <= 10) {
                counter.classList.add('error');
            }
        };

        input.addEventListener('input', updateCounter);
        updateCounter(); // Initial count
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const messageData = {
            name: formData.get('name').trim(),
            message: formData.get('message').trim()
        };

        // Enhanced validation
        const errors = this.validateInput(messageData);
        if (errors.length > 0) {
            this.showError(errors.join(' '));
            return;
        }

        // Disable submit button to prevent double submission
        const submitButton = this.form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.innerHTML = '<span>Posting...</span>';

        try {
            const response = await fetch('/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(messageData)
            });

            if (response.ok) {
                this.form.reset();
                this.updateCharacterCounters();
                this.showSuccess('Message posted successfully! 🎉');
                await this.loadMessages();
                this.scrollToTop();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to post message');
            }
        } catch (error) {
            console.error('Error posting message:', error);
            this.showError(error.message || 'Failed to post message. Please try again.');
        } finally {
            // Re-enable submit button
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
        }
    }

    validateInput(data) {
        const errors = [];
        
        if (!data.name) {
            errors.push('Name is required.');
        } else if (data.name.length > 50) {
            errors.push('Name must be 50 characters or less.');
        }
        
        if (!data.message) {
            errors.push('Message is required.');
        } else if (data.message.length > 500) {
            errors.push('Message must be 500 characters or less.');
        }
        
        // Check for spam-like content
        if (data.message && this.isSpamLike(data.message)) {
            errors.push('Message appears to be spam. Please write a genuine message.');
        }
        
        return errors;
    }

    isSpamLike(message) {
        const spamPatterns = [
            /(.)\1{10,}/, // Repeated characters
            /https?:\/\/[^\s]+/gi, // URLs
            /\b(buy|sale|discount|offer|deal|free|win|prize)\b/gi // Spam keywords
        ];
        
        return spamPatterns.some(pattern => pattern.test(message));
    }

    updateCharacterCounters() {
        // Trigger character counter updates after form reset
        this.nameInput.dispatchEvent(new Event('input'));
        this.messageInput.dispatchEvent(new Event('input'));
    }

    async loadMessages() {
        try {
            const response = await fetch('/messages');
            
            if (!response.ok) {
                throw new Error('Failed to fetch messages');
            }
            
            const messages = await response.json();
            this.renderMessages(messages);
        } catch (error) {
            console.error('Error loading messages:', error);
            this.messagesContainer.innerHTML = '<div class="error">Failed to load messages. Please refresh the page.</div>';
        }
    }

    renderMessages(messages) {
        if (messages.length === 0) {
            this.messagesContainer.innerHTML = '<div class="empty-state">No messages yet. Be the first to leave a message!</div>';
            return;
        }

        const messagesHTML = messages.map((message, index) => `
            <div class="message-card" style="animation-delay: ${index * 0.1}s">
                <div class="message-header">
                    <span class="message-author">${this.escapeHtml(message.name)}</span>
                    <span class="message-date">${this.formatDate(message.timestamp)}</span>
                </div>
                <div class="message-content">${this.formatMessage(message.message)}</div>
            </div>
        `).join('');

        this.messagesContainer.innerHTML = messagesHTML;
        
        // Add stats bar
        this.addStatsBar(messages.length);
    }

    addStatsBar(messageCount) {
        const existingStats = document.querySelector('.stats-bar');
        if (existingStats) {
            existingStats.remove();
        }

        const statsBar = document.createElement('div');
        statsBar.className = 'stats-bar';
        statsBar.innerHTML = `
            <span>📊 Total Messages: <strong>${messageCount}</strong></span>
            <span>🕒 Last Updated: <strong>${new Date().toLocaleTimeString()}</strong></span>
        `;
        
        this.messagesContainer.parentNode.appendChild(statsBar);
    }

    formatMessage(message) {
        // Convert line breaks and add basic formatting
        return this.escapeHtml(message)
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
            .replace(/\*(.*?)\*/g, '<em>$1</em>'); // Italic text
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showNotification(message, type) {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.error, .success');
        existingNotifications.forEach(notification => {
            if (notification.parentNode === this.form.parentNode) {
                notification.remove();
            }
        });

        const notification = document.createElement('div');
        notification.className = type;
        notification.innerHTML = message;
        
        this.form.parentNode.insertBefore(notification, this.form);
        
        // Auto-remove notification after 6 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.opacity = '0';
                notification.style.transform = 'translateY(-10px)';
                setTimeout(() => notification.remove(), 300);
            }
        }, 6000);
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatDate(timestamp) {
        try {
            const date = new Date(timestamp);
            
            // Check if date is valid
            if (isNaN(date.getTime())) {
                return 'Unknown date';
            }
            
            const now = new Date();
            const diffInMinutes = Math.floor((now - date) / (1000 * 60));
            
            // Show relative time for recent messages
            if (diffInMinutes < 1) {
                return 'Just now';
            } else if (diffInMinutes < 60) {
                return `${diffInMinutes} min ago`;
            } else if (diffInMinutes < 1440) { // Less than 24 hours
                const hours = Math.floor(diffInMinutes / 60);
                return `${hours}h ago`;
            } else if (diffInMinutes < 10080) { // Less than 7 days
                const days = Math.floor(diffInMinutes / 1440);
                return `${days}d ago`;
            } else {
                // Show full date for older messages
                return date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            }
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Unknown date';
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GuestbookApp();
});

// Add smooth animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .message-card {
        animation: fadeInUp 0.5s ease forwards;
    }
    
    .error, .success {
        transition: all 0.3s ease;
    }
`;
document.head.appendChild(style);