import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/Messages.css';


export default function Messages() {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [recipient, setRecipient] = useState(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Fetch conversation and recipient info
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch recipient details
        const userRes = await fetch(
          `http://localhost/musicaalLife/api/users.php?userId=${userId}`
        );
        const userData = await userRes.json();
        setRecipient(userData.user);

        // Fetch messages
        const messagesRes = await fetch(
          `http://localhost/musicaalLife/api/messages.php?recipientId=${userId}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
          }
        );
        const messagesData = await messagesRes.json();
        setMessages(messagesData.messages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchData();
  }, [userId]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await fetch(
        'http://localhost/musicaalLife/api/messages.php',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          },
          body: JSON.stringify({
            recipientId: userId,
            content: newMessage
          })
        }
      );

      if (response.ok) {
        const result = await response.json();
        setMessages([...messages, result.message]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="messages-container">
      <div className="messages-header">
        <button onClick={() => navigate(-1)} className="back-button">
          &larr; Back
        </button>
        <h2>{recipient?.name || 'Loading...'}</h2>
      </div>

      <div className="messages-list">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div 
              key={index} 
              className={`message ${msg.senderId == userId ? 'received' : 'sent'}`}
            >
              <p>{msg.content}</p>
              <span className="message-time">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))
        ) : (
          <p className="no-messages">No messages yet</p>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="message-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}