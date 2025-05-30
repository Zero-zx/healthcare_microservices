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

function speak(text: string) {
  const utter = new window.SpeechSynthesisUtterance(text);
  utter.lang = 'vi-VN';
  window.speechSynthesis.speak(utter);
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [waiting, setWaiting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const lastBotMsgRef = useRef<string | null>(null);

  // Gửi hội thoại lên backend
  const sendMessage = async (msg?: Message, questionText?: string, answer?: string) => {
    let history = [...messages];
    if (msg) {
      history = [...messages, msg];
    }
    // Nếu là trả lời Có/Không, gửi thêm object có answer cho backend
    if (questionText && answer) {
      history = [...messages, { sender: 'user', text: questionText, answer }];
    }
    setWaiting(true);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history }),
      });
      const data = await res.json();
      setMessages([...history, { sender: 'bot', text: data.reply }]);
      setWaiting(false);
    } catch (e) {
      setMessages([...history, { sender: 'bot', text: 'Lỗi kết nối server.' }]);
      setWaiting(false);
    }
  };

  // Xử lý gửi triệu chứng đầu tiên
  const handleSend = () => {
    if (!input.trim()) return;
    if (
      messages.length === 0 ||
      (messages.length > 0 && messages[messages.length - 1].sender === 'bot' &&
        (messages[messages.length - 1].text === 'Triệu chứng bạn gặp phải là gì?' ||
         messages[messages.length - 1].text === NOT_FOUND_SYMPTOM))
    ) {
      sendMessage({ sender: 'user', text: input.trim() });
      setInput('');
      inputRef.current?.focus();
    }
  };

  // Xử lý trả lời Có/Không cho các câu hỏi bot
  const handleAnswer = (answer: string) => {
    const lastBotMsg = messages[messages.length - 1];
    if (!lastBotMsg || lastBotMsg.sender !== 'bot') return;
    // Không hiển thị lại tin nhắn user, chỉ gửi cho backend
    sendMessage(undefined, lastBotMsg.text, answer);
  };

  // Khi load lần đầu, tự động hỏi triệu chứng
  useEffect(() => {
    if (messages.length === 0) {
      sendMessage({ sender: 'user', text: '' });
    }
    // eslint-disable-next-line
  }, []);

  // Tự động scroll xuống cuối khi có tin nhắn mới
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  // Phát âm thanh chỉ khi có tin nhắn bot mới thực sự (không phát lại khi F5)
  useEffect(() => {
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.sender === 'bot' && lastMsg.text !== lastBotMsgRef.current) {
        speak(lastMsg.text);
        lastBotMsgRef.current = lastMsg.text;
      }
    }
  }, [messages]);

  // Kiểm tra có phải đang ở câu hỏi đầu tiên không
  const isFirstBotQuestion =
    messages.length > 0 &&
    messages[messages.length - 1].sender === 'bot' &&
    messages[messages.length - 1].text === 'Triệu chứng bạn gặp phải là gì?';

  // Nếu bot trả về "Tôi chưa từng nghe triệu chứng đó..." thì cho nhập lại
  const isNotFoundSymptom =
    messages.length > 0 &&
    messages[messages.length - 1].sender === 'bot' &&
    messages[messages.length - 1].text === NOT_FOUND_SYMPTOM;

  // Hàm reset hội thoại
  const handleReset = () => {
    setMessages([]);
    setInput('');
    setWaiting(false);
    inputRef.current?.focus();
  };

  // Khi messages rỗng (sau reset), tự động gửi lại câu hỏi đầu tiên
  useEffect(() => {
    if (messages.length === 0 && !waiting) {
      sendMessage({ sender: 'user', text: '' });
    }
    // eslint-disable-next-line
  }, [messages]);

  return (
    <Box maxWidth={480} mx="auto" mt={6}>
      <Paper elevation={6} sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: 8, p: 0 }}>
        <AppBar position="static" color="primary" elevation={0} sx={{ borderRadius: 0, background: 'linear-gradient(90deg, #1976d2 0%, #ff4081 100%)', boxShadow: 'none' }}>
          <Toolbar variant="dense" sx={{ minHeight: 48 }}>
            <SmartToyIcon sx={{ mr: 1 }} />
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600, fontSize: 18 }}>
              Healthcare Chatbot
            </Typography>
            <IconButton color="inherit" onClick={handleReset} size="small">
              <RestartAltIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box ref={chatBodyRef} sx={{
          minHeight: 320,
          maxHeight: 400,
          overflowY: 'auto',
          background: 'linear-gradient(135deg, #e3f2fd 0%, #fce4ec 100%)',
          px: 2, py: 2,
          display: 'flex', flexDirection: 'column', gap: 1.5
        }}>
          {messages.map((msg, idx) => (
            <Fade in key={idx} timeout={400}>
              <Box display="flex" justifyContent={msg.sender === 'user' ? 'flex-end' : 'flex-start'} alignItems="flex-end">
                {msg.sender === 'bot' && (
                  <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32, mr: 1 }}>
                    <SmartToyIcon fontSize="small" />
                  </Avatar>
                )}
                <Box
                  sx={{
                    bgcolor: msg.sender === 'user' ? 'primary.light' : 'grey.100',
                    color: 'text.primary',
                    px: 2,
                    py: 1,
                    borderRadius: 3,
                    maxWidth: 280,
                    boxShadow: 1,
                    fontSize: 16,
                    wordBreak: 'break-word',
                  }}
                >
                  {msg.text}
                </Box>
                {msg.sender === 'user' && (
                  <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32, ml: 1 }}>
                    <PersonIcon fontSize="small" />
                  </Avatar>
                )}
              </Box>
            </Fade>
          ))}
          {waiting && (
            <Box display="flex" justifyContent="center" alignItems="center" mt={1}>
              <CircularProgress size={24} color="primary" />
            </Box>
          )}
        </Box>
        {/* Nếu bot vừa hỏi "Bạn có bị ... không?" thì hiện nút Có/Không */}
        {messages.length > 0 && messages[messages.length - 1].sender === 'bot' && messages[messages.length - 1].text.startsWith('Bạn có bị') && (
          <Stack direction="row" spacing={2} justifyContent="center" sx={{ p: 2 }}>
            <Button variant="contained" color="success" size="large" onClick={() => handleAnswer('có')} disabled={waiting} sx={{ borderRadius: 3, minWidth: 100 }}>
              Có
            </Button>
            <Button variant="contained" color="error" size="large" onClick={() => handleAnswer('không')} disabled={waiting} sx={{ borderRadius: 3, minWidth: 100 }}>
              Không
            </Button>
          </Stack>
        )}
        {/* Chỉ hiển thị input nhập tự do ở câu hỏi đầu tiên hoặc khi không nhận diện được triệu chứng */}
        {(isFirstBotQuestion || isNotFoundSymptom) && (
          <Box sx={{ display: 'flex', gap: 1, p: 2, borderTop: '1px solid #eee', background: '#fff' }}>
            <TextField
              inputRef={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Nhập triệu chứng..."
              disabled={waiting}
              fullWidth
              size="small"
              sx={{ borderRadius: 3, bgcolor: 'grey.50' }}
            />
            <Button
              variant="contained"
              color="primary"
              endIcon={<SendIcon />}
              onClick={handleSend}
              disabled={waiting || !input.trim()}
              sx={{ borderRadius: 3, minWidth: 48 }}
            >
              Gửi
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Chatbot; 