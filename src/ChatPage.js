// src/ChatPage.js

import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Container,
  Paper,
  InputBase,
  Divider,
  Avatar,
  Fab,
} from '@mui/material';
import { Brightness4, Brightness7, Send } from '@mui/icons-material';
import { styled, useTheme } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  height: '70vh',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 16,
  overflow: 'hidden',
}));

const MessageList = styled('div')(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(2),
  overflowY: 'auto',
  backgroundColor: theme.palette.background.default,
}));

const MessageItem = styled('div')(({ theme, sender }) => ({
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: sender === 'user' ? 'flex-end' : 'flex-start',
  marginBottom: theme.spacing(1),
}));

const MessageBubble = styled('div')(({ theme, sender }) => ({
  maxWidth: '75%',
  padding: theme.spacing(1.5),
  borderRadius:
    sender === 'user' ? '12px 12px 0px 12px' : '12px 12px 12px 0px',
  backgroundColor:
    sender === 'user' ? theme.palette.primary.main : theme.palette.grey[300],
  color: sender === 'user' ? '#fff' : '#000',
  boxShadow: theme.shadows[1],
  transition: theme.transitions.create(['background-color'], {
    duration: theme.transitions.duration.short,
  }),
}));

function ChatPage({ darkMode, toggleDarkMode }) {
  const [messages, setMessages] = React.useState([]);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const messageListRef = React.useRef(null);
  const theme = useTheme();

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('https://hook.integromat.com/tu-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      const botMessage = { sender: 'bot', text: data.response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        sender: 'bot',
        text: 'Lo siento, ha ocurrido un error.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  React.useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div>
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar>
          <img src="/logo.png" alt="Logo" style={{ height: 40 }} />
          <div style={{ flexGrow: 1 }} />
          <IconButton color="inherit" onClick={toggleDarkMode}>
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <StyledPaper elevation={3}>
          <MessageList ref={messageListRef}>
            {messages.map((message, index) => (
              <MessageItem key={index} sender={message.sender}>
                {message.sender === 'bot' && (
                  <Avatar
                    alt="Bot"
                    src="/bot-avatar.png"
                    sx={{ marginRight: 1 }}
                  />
                )}
                <MessageBubble sender={message.sender}>
                  {message.text}
                </MessageBubble>
                {message.sender === 'user' && (
                  <Avatar
                    alt="Usuario"
                    src="/user-avatar.png"
                    sx={{ marginLeft: 1 }}
                  />
                )}
              </MessageItem>
            ))}
            {loading && (
              <MessageItem sender="bot">
                <Avatar
                  alt="Bot"
                  src="/bot-avatar.png"
                  sx={{ marginRight: 1 }}
                />
                <MessageBubble sender="bot">Escribiendo...</MessageBubble>
              </MessageItem>
            )}
          </MessageList>
          <Divider />
          <Paper
            component="form"
            sx={{ p: '2px 4px', display: 'flex' }}
            elevation={0}
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Escribe tu mensaje aquí..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleInputKeyPress}
            />
            <Fab
              color="primary"
              size="small"
              onClick={handleSendMessage}
              sx={{
                '&:hover': {
                  backgroundColor: theme.palette.secondary.main,
                },
                m: '4px',
              }}
            >
              <Send />
            </Fab>
          </Paper>
        </StyledPaper>
      </Container>
    </div>
  );
}

export default ChatPage;