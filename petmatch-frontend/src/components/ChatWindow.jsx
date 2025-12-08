import React, { useState, useEffect, useRef } from 'react';
import { getMessagesForMatch, sendMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './ChatWindow.css';

const ChatWindow = ({ match }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
        toast.error('No se pudieron cargar los mensajes.');
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

    const tempId = Date.now(); // ID temporal para la key
    const sentMessage = {
      id: tempId,
      matchId: match.id,
      senderUserId: user.id,
      text: newMessage,
      createdAt: new Date().toISOString(),
    };

    // Añadir el mensaje a la UI inmediatamente para una experiencia fluida
    setMessages(prevMessages => [...prevMessages, sentMessage]);
    setNewMessage('');

    try {
      // Enviar el mensaje al backend en segundo plano
      await sendMessage(match.id, user.id, newMessage);
    } catch (err) {
      toast.error('No se pudo enviar el mensaje.');
      console.error('Error al enviar mensaje:', err);
      // Opcional: Marcar el mensaje como no enviado en la UI
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
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

  const otherPet = match.petA.ownerId === user.id ? match.petB : match.petA;

  return (
    <div className="chat-window">
      <header className="chat-header">
        <img src={otherPet.photoUrls && otherPet.photoUrls.length > 0 ? otherPet.photoUrls[0] : '/placeholder.jpg'} alt={otherPet.name} />
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
