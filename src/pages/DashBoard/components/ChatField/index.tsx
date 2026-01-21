import { useState, useRef, useEffect } from "react";
import { ChatItem } from "../ChatItem";
import { ChatInput } from "../ChatInput";
import close from "../../../../assets/svg/icn-clear.svg";

interface ChatInputData {
  message: string;
  images?: File[];
}

export interface ChatMessage {
  id: string;
  sender: "user" | "bot" | "admin";
  message: string;
  timestamp: string;
  images?: string[];
  status?: "sent" | "delivered" | "read" | "failed";
}

export const mockConversation: ChatMessage[] = [
  {
    id: "msg-101",
    sender: "bot",
    message: "Chào bạn! Tôi là MovieBot, trợ lý ảo của bạn. Tôi có thể giúp gì cho bạn hôm nay?",
    timestamp: new Date().toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    status: "read"
  }

];

interface ChatProps {
  onClose: () => void;
}

export const ChatField = (props: ChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>(mockConversation);
  const bodyRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom khi có message mới
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (data: ChatInputData) => {
    const imageUrls: string[] = [];
    if (data.images && data.images.length > 0) {
      data.images.forEach((file) => {
        imageUrls.push(URL.createObjectURL(file));
      });
    }

    const createNewMessage = (
      sender: "user" | "bot" | "admin",
      message: string,
      images?: string[]
    ): ChatMessage => {
      return {
        id: `msg-${Date.now()}`,
        sender,
        message,
        timestamp: new Date().toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        images,
        status: "sent",
      };
    };

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      message: data.message,
      timestamp: new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      images: imageUrls.length > 0 ? imageUrls : undefined,
      status: "sent",
    };

    setMessages((prev) => [...prev, newMessage]);

    // Tạo EventSource cho streaming
    const eventSource = new EventSource(`${import.meta.env.VITE_BE_URL}/chat/stream?message=${encodeURIComponent(data.message)}`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'db_search') {
        // Thêm loading DB
        const loadingMessage = createNewMessage("bot", data.message);
        setMessages((prev) => [...prev, loadingMessage]);
      } else if (data.type === 'db_not_found') {
        // Cập nhật message DB
        setMessages((prev) => prev.map(msg =>
          msg.message.includes('⏳ Đang tìm trong kho dữ liệu')
            ? { ...msg, message: data.message }
            : msg
        ));
      } else if (data.type === 'tmdb_found') {
        // Thêm message TMDB
        const tmdbMessage = createNewMessage("bot", data.message);
        setMessages((prev) => [...prev, tmdbMessage]);
      } else if (data.type === 'google_search') {
        // Thêm message Google
        const googleMessage = createNewMessage("bot", data.message);
        setMessages((prev) => [...prev, googleMessage]);
      } else if (data.type === 'google_found') {
        // Cập nhật message Google
        setMessages((prev) => prev.map(msg =>
          msg.message.includes('⚠️ TMDB không tìm thấy')
            ? { ...msg, message: data.message }
            : msg
        ));
      } else if (data.type === 'final') {
        // Xóa loading messages, thêm kết quả cuối
        setMessages((prev) => {
          let filteredMessages = prev.filter(
            (msg) =>
              !msg.message.includes('Đang tìm') &&
              !msg.message.includes('Không tìm thấy') &&
              !msg.message.includes('Tìm thấy') &&
              !msg.message.includes('Internet không tìm thấy')
          );
          return [...filteredMessages, createNewMessage("bot", data.message)];
        });
        eventSource.close();
      } else if (data.type === 'error') {
        // Xử lý lỗi
        const errorMessage = createNewMessage("bot", data.message);
        setMessages((prev) => [...prev, errorMessage]);
        eventSource.close();
      }
    };

    eventSource.onerror = () => {
      console.error("EventSource error");
      eventSource.close();
    };

    return true;
  };

  const handleClearChat = async () => {
    if (!confirm("Bạn có chắc muốn xóa lịch sử chat không?")) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_BE_URL}/chat/clear`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setMessages(mockConversation);
      }
    } catch (error) {
      console.error("Error clearing chat:", error);
    }
  };

  return (
    <div className="chat-field">
      <div className="header">
        <div className="header-left">
          <h1>Movie Chatbot(Beta)</h1>
          <button onClick={handleClearChat} className="reset-btn">
            <span className="icon">🔄</span>
            <span className="label">Reset</span>
          </button>
        </div>
        <div className="header-right">
          <img
            crossOrigin="anonymous"
            src={close}
            alt=""
            onClick={() => props.onClose()}
            className="chat-preview-modal-close"
          />
        </div>
      </div>

      <div className="body" ref={bodyRef}>
        {messages.map((message) => (
          <ChatItem
            key={message.id}
            content={{ text: message.message }}
            timeLine={message.timestamp}
            isYour={message.sender === "user"}
            isRead={message.status === "read"}
            metadata={{
              upload: message.images?.map((img) => ({ url: img })) || [],
            }}
          />
        ))}
      </div>

      <div className="foot">
        <ChatInput onSubmit={handleSubmit} />
      </div>
    </div>
  );
};
