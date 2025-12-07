import React, { useState, useEffect, useRef } from 'react';
import { getMessagesForMatch, sendMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './ChatWindow.css';

const ChatWindow = ({ match }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Efecto para hacer scroll hacia el último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Efecto para cargar los mensajes cuando cambia el match seleccionado
  useEffect(() => {
    if (!match) return;

    const fetchMessages = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedMessages = await getMessagesForMatch(match.id);
        setMessages(fetchedMessages);
      } catch (err) {
        setError('No se pudieron cargar los mensajes.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [match]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const sentMessage = await sendMessage(match.id, user.id, newMessage);
      setMessages(prevMessages => [...prevMessages, sentMessage]);
      setNewMessage('');
    } catch (err) {
      console.error('Error al enviar mensaje:', err);
      // Podríamos mostrar un toast de error aquí
    }
  };

  if (!match) {
    return (
      <div className="chat-window placeholder">
        <h3>Selecciona un match para comenzar a chatear</h3>
      </div>
    );
  }

  if (loading) {
    return <div className="chat-window placeholder"><h3>Cargando mensajes...</h3></div>;
  }

  if (error) {
    return <div className="chat-window placeholder"><h3>{error}</h3></div>;
  }

  // Determinar con qué mascota estamos chateando
  const otherPet = match.petA.ownerId === user.id ? match.petB : match.petA;

  return (
    <div className="chat-window">
      <header className="chat-header">
        <img src={otherPet.photoUrl || '/placeholder.jpg'} alt={otherPet.name} />
        <h3>{otherPet.name}</h3>
      </header>
      <div className="messages-list">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message-bubble ${msg.senderUserId === user.id ? 'sent' : 'received'}`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form className="message-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default ChatWindow;
