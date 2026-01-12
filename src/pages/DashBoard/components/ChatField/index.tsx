import { useState } from "react";
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
    id: "msg-100",
    sender: "user",
    message: "Xin chào shop",
    timestamp: "09:00",
    status: "read",
  },
  {
    id: "msg-101",
    sender: "bot",
    message: "Xin chào! Chúng tôi có thể giúp gì cho bạn?",
    timestamp: "09:01",
    status: "read",
  },
  {
    id: "msg-102",
    sender: "user",
    message: "Em muốn xem thông tin đơn hàng #12345",
    timestamp: "09:02",
    status: "read",
  },
  {
    id: "msg-103",
    sender: "admin",
    message:
      "Đơn hàng #12345 của bạn đang trong quá trình vận chuyển. Dự kiến giao hàng vào ngày mai.",
    timestamp: "09:05",
    status: "read",
  },
  {
    id: "msg-104",
    sender: "user",
    message: "Vậy em có thể thay đổi địa chỉ giao hàng được không ạ?",
    timestamp: "09:07",
    status: "read",
  },
  {
    id: "msg-105",
    sender: "admin",
    message:
      "Để thay đổi địa chỉ, bạn vui lòng cung cấp địa chỉ mới và số điện thoại liên hệ nhé",
    timestamp: "09:10",
    status: "read",
  },
  {
    id: "msg-106",
    sender: "user",
    message: "Địa chỉ mới: 123 Đường ABC, Quận 1, TP.HCM\nSĐT: 0909123456",
    timestamp: "09:12",
    status: "read",
  },
  {
    id: "msg-107",
    sender: "user",
    message: "Đây là ảnh chụp hóa đơn",
    timestamp: "09:13",
    images: [
      "https://picsum.photos/400/300?random=10",
      "https://picsum.photos/400/300?random=11",
    ],
    status: "read",
  },
  {
    id: "msg-108",
    sender: "admin",
    message:
      "Cảm ơn bạn. Chúng tôi đã cập nhật địa chỉ giao hàng mới. Đơn hàng sẽ được giao đến địa chỉ mới.",
    timestamp: "09:20",
    status: "read",
  },
  {
    id: "msg-109",
    sender: "user",
    message: "Cảm ơn shop rất nhiều! 😊",
    timestamp: "09:22",
    status: "delivered",
  },
];

interface ChatProps {
  onClose: () => void;
}
export const ChatField = (props: ChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>(mockConversation);

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

    setTimeout(() => {
      const botMessage = createNewMessage(
        "bot",
        "Cảm ơn bạn đã nhắn tin. Chúng tôi sẽ phản hồi sớm nhất!"
      );
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);

    return true;
  };

  return (
    <div className="chat-field">
      <div className="header">
        <h1>Admin</h1>
        <img
          crossOrigin="anonymous"
          src={close}
          alt=""
          onClick={() => props.onClose()}
          className="chat-preview-modal-close"
        />
      </div>

      <div className="body">
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
