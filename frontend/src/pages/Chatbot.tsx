import React from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import axios from 'axios';

export interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const API_URL = process.env.REACT_APP_CHATBOT_API_URL || 'http://localhost:8002/api/chatbot';

const Chatbot: React.FC = () => {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/chat/`, {
        message: input,
        user_id: 'anonymous'
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const botMessage: Message = {
        text: response.data.response,
        sender: 'bot',
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const botMessage: Message = {
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
      };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Healthcare Assistant
          </Typography>
          <Box
            sx={{
              height: '400px',
              overflowY: 'auto',
              mb: 2,
              border: '1px solid #ccc',
              borderRadius: 1,
              p: 2,
            }}
          >
            <List>
              {messages.map((message, index) => (
                <React.Fragment key={index}>
                  <ListItem
                    sx={{
                      justifyContent:
                        message.sender === 'user' ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <Paper
                      sx={{
                        p: 1,
                        backgroundColor:
                          message.sender === 'user' ? '#e3f2fd' : '#f5f5f5',
                        maxWidth: '70%',
                      }}
                    >
                      <ListItemText
                        primary={message.text}
                        secondary={message.sender === 'user' ? 'You' : 'Bot'}
                      />
                    </Paper>
                  </ListItem>
                  {index < messages.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              disabled={loading}
            />
            <Button
              variant="contained"
              onClick={handleSend}
              disabled={loading || !input.trim()}
            >
              Send
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Chatbot; 