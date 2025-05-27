import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  AppBar,
  Toolbar,
  IconButton,
  Stack,
  Fade,
  CircularProgress
} from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';
import SmartToyIcon from '@mui/icons-material/SmartToy';

interface Message {
  sender: 'user' | 'bot';
  text: string;
  answer?: string; // chỉ dùng cho user trả lời Có/Không
}

const API_URL = 'http://localhost:8008/api/chat/';
const NOT_FOUND_SYMPTOM = 'Tôi chưa từng nghe triệu chứng đó, bạn còn gặp triệu chứng nào khác không?';

function speak(text: string): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }
}

function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async (messageText: string = userInput, answer?: string) => {
    if (!messageText.trim() && !answer) return;

    // Tạo message để hiển thị
    const userMessage: Message = {
      sender: 'user',
      text: answer ? (answer === 'có' ? 'Có' : 'Không') : messageText.trim(),
      answer,
    };

    // Tạo message để gửi đến backend
    const messageForBackend: Message = {
      sender: 'user',
      text: answer ? (messages.length > 0 ? messages[messages.length - 1].text : '') : messageText.trim(),
      answer,
    };

    const newMessages = [...messages, userMessage];
    const historyForBackend = [...messages, messageForBackend];
    
    setMessages(newMessages);
    setUserInput('');
    setIsLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          history: historyForBackend,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      const botMessage: Message = {
        sender: 'bot',
        text: data.reply || data.audio || 'Xin lỗi, tôi không hiểu.',
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Đọc tin nhắn của bot bằng giọng nói
      if (data.audio) {
        speak(data.audio);
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        sender: 'bot',
        text: 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại.',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  const handleYesNo = (answer: 'có' | 'không') => {
    if (messages.length === 0) return;
    
    const lastBotMessage = messages[messages.length - 1];
    if (lastBotMessage.sender === 'bot') {
      // Gửi chỉ answer, không gửi lại text của bot
      sendMessage('', answer);
    }
  };

  const resetChat = () => {
    setMessages([]);
    setUserInput('');
    window.speechSynthesis.cancel();
  };

  const shouldShowYesNoButtons = () => {
    if (messages.length === 0) return false;
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.sender !== 'bot') return false;
    
    const text = lastMessage.text;
    // Hiển thị nút Có/Không cho câu hỏi triệu chứng và câu hỏi đặt lịch
    return (text.includes('không?') && !text.includes('Vui lòng chọn số thứ tự')) ||
           text.includes('đặt lịch hẹn khám không?');
  };

  const getInputPlaceholder = () => {
    if (messages.length === 0) return 'Nhập triệu chứng của bạn...';
    
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.sender !== 'bot') return 'Nhập tin nhắn...';
    
    const text = lastMessage.text;
    
    // Đặt lịch hẹn - các bước khác nhau
    if (text.includes('Vui lòng chọn số thứ tự')) {
      return 'Nhập số thứ tự (ví dụ: 1, 2, 3...)';
    } else if (text.includes('Định dạng: YYYY-MM-DD')) {
      return 'Nhập ngày (ví dụ: 2024-06-01)';
    } else if (text.includes('Định dạng: HH:MM')) {
      return 'Nhập giờ (ví dụ: 14:30)';
    } else if (text.includes('không?')) {
      return 'Hoặc nhập tin nhắn khác...';
    }
    
    return 'Nhập tin nhắn...';
  };

  const formatMessage = (text: string) => {
    // Tách thông tin thành các dòng và format đẹp hơn
    const lines = text.split('\n');
    return lines.map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < lines.length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static" sx={{ bgcolor: '#2196f3' }}>
        <Toolbar>
          <SmartToyIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Trợ lý Y tế AI
          </Typography>
          <IconButton color="inherit" onClick={resetChat} title="Bắt đầu lại">
            <RestartAltIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ flex: 1, overflow: 'auto', p: 2, bgcolor: '#f5f5f5' }}>
          {messages.length === 0 && (
            <Paper sx={{ p: 3, mb: 2, textAlign: 'center', bgcolor: '#e3f2fd' }}>
              <SmartToyIcon sx={{ fontSize: 48, color: '#2196f3', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Chào bạn! Tôi là trợ lý y tế AI
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Hãy mô tả triệu chứng bạn đang gặp phải, tôi sẽ giúp bạn tham khảo về tình trạng sức khỏe và có thể hỗ trợ đặt lịch khám bệnh.
              </Typography>
            </Paper>
          )}

          {messages.map((message, index) => (
            <Fade in={true} key={index}>
              <Box sx={{ display: 'flex', mb: 2, justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', maxWidth: '80%' }}>
                  {message.sender === 'bot' && (
                    <Avatar sx={{ bgcolor: '#2196f3', mr: 1, mt: 1 }}>
                      <SmartToyIcon />
                    </Avatar>
                  )}
                  
                  <Paper
                    sx={{
                      p: 2,
                      bgcolor: message.sender === 'user' ? '#2196f3' : '#fff',
                      color: message.sender === 'user' ? 'white' : 'black',
                      borderRadius: 2,
                      maxWidth: '100%',
                      wordWrap: 'break-word',
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    <Typography variant="body1">
                      {formatMessage(message.text)}
                    </Typography>
                  </Paper>

                  {message.sender === 'user' && (
                    <Avatar sx={{ bgcolor: '#4caf50', ml: 1, mt: 1 }}>
                      <PersonIcon />
                    </Avatar>
                  )}
                </Box>
              </Box>
            </Fade>
          ))}

          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: '#2196f3', mr: 1 }}>
                  <SmartToyIcon />
                </Avatar>
                <Paper sx={{ p: 2, bgcolor: '#fff' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    <Typography variant="body1">Đang suy nghĩ...</Typography>
                  </Box>
                </Paper>
              </Box>
            </Box>
          )}

          <div ref={messagesEndRef} />
        </Box>

        <Paper sx={{ p: 2, borderRadius: 0 }} elevation={3}>
          {shouldShowYesNoButtons() && (
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Button
                variant="contained"
                color="success"
                onClick={() => handleYesNo('có')}
                disabled={isLoading}
                sx={{ flex: 1 }}
              >
                Có
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleYesNo('không')}
                disabled={isLoading}
                sx={{ flex: 1 }}
              >
                Không
              </Button>
            </Stack>
          )}

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={getInputPlaceholder()}
                disabled={isLoading}
                variant="outlined"
                size="small"
                multiline
                maxRows={3}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading || (!userInput.trim())}
                sx={{ minWidth: 'auto', px: 2 }}
              >
                <SendIcon />
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Box>
  );
}

export default Chatbot; 