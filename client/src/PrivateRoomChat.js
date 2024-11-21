import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import CryptoJS from 'crypto-js';

const socket = io.connect('http://localhost:5000'); // Backend URL

const SECRET_KEY = 'my_secret_key'; // Use an environment variable in production

function PrivateRoomChat() {
  const [room, setRoom] = useState('');
  const [joinedRoom, setJoinedRoom] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('room_created', (room) => setJoinedRoom(room));
    socket.on('room_joined', (room) => setJoinedRoom(room));
    socket.on('room_error', (error) => alert(error));

    socket.on('receive_message', ({ sender, encryptedMessage }) => {
      const bytes = CryptoJS.AES.decrypt(encryptedMessage, SECRET_KEY);
      const decryptedMessage = bytes.toString(CryptoJS.enc.Utf8);
      setMessages((prevMessages) => [...prevMessages, { sender, text: decryptedMessage }]);
    });
  }, []);

  const createRoom = () => {
    if (room) socket.emit('create_room', room);
  };

  const joinRoom = () => {
    if (room) socket.emit('join_room', room);
  };

  const sendMessage = () => {
    if (message && joinedRoom) {
      const encryptedMessage = CryptoJS.AES.encrypt(message, SECRET_KEY).toString();
      socket.emit('send_message', { room: joinedRoom, encryptedMessage });
      setMessage('');
    }
  };

  return (
    <div className="chat-container">
      {!joinedRoom ? (
        <div>
          <input
            type="text"
            placeholder="Room name"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <button onClick={createRoom}>Create Room</button>
          <button onClick={joinRoom}>Join Room</button>
        </div>
      ) : (
        <div>
          <h2>Room: {joinedRoom}</h2>
          <div className="messages">
            {messages.map((msg, index) => (
              <div key={index} className="message">
                <strong>{msg.sender === socket.id ? 'You' : 'User'}:</strong> {msg.text}
              </div>
            ))}
          </div>
          <input
            type="text"
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      )}
    </div>
  );
}

export default PrivateRoomChat;
