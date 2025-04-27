import React, { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { initSocket, getSocket, disconnectSocket } from "../socket.ts";

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [inputText, setInputText] = useState<string>("");

  useEffect(() => {
    initSocket();
    const socket = getSocket();

    socket.on('connect',()=>{
      console.log('Connected with socket id: ',socket.id);
    })

    socket.on('chat message',(msg: string)=>{
        setMessages((prev)=>[...prev,msg]);
    })

    return ()=>{
      disconnectSocket();
    }
  }, [])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputText.trim()) {
      // Emit socket event here
      const socket = getSocket();
      socket?.emit('chat message', inputText)

      setMessages((prev) => [...prev, inputText]);
      setInputText("");
    }
  };

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  return (
    <div style={styles.container}>
      <ul style={styles.messages}>
        {messages.map((msg, index) => (
          <li key={index} style={index % 2 ? styles.messageOdd : styles.message}>
            {msg}
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          value={inputText}
          onChange={handleTextChange}
          autoComplete="off"
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Send
        </button>
      </form>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    margin: 0,
    paddingBottom: "3rem",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
  form: {
    background: "rgba(0, 0, 0, 0.15)",
    padding: "0.25rem",
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    display: "flex",
    height: "3rem",
    boxSizing: "border-box",
    backdropFilter: "blur(10px)",
  },
  input: {
    border: "none",
    padding: "0 1rem",
    flexGrow: 1,
    borderRadius: "2rem",
    margin: "0.25rem",
    outline: "none",
  },
  button: {
    background: "#333",
    border: "none",
    padding: "0 1rem",
    margin: "0.25rem",
    borderRadius: "3px",
    outline: "none",
    color: "#fff",
  },
  messages: {
    listStyleType: "none",
    margin: 0,
    padding: 0,
  },
  message: {
    padding: "0.5rem 1rem",
  },
  messageOdd: {
    padding: "0.5rem 1rem",
    background: "#efefef",
  },
};

export default Chat;
