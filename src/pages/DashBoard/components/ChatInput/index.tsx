import { useRef, useState, useEffect } from "react";
import send from "../../../../assets/svg/icn-send.svg";
import remove from "../../../../assets/svg/icn-remove-image.svg";
import emoji from "../../../../assets/svg/icn-emoji.svg";
import EmojiPicker, { type EmojiClickData } from "emoji-picker-react";
import "../../dashboard.scss";

interface ChatInputData {
  message: string;
  images?: File[];
}

interface ChatInputProps {
  onSubmit: (value: ChatInputData) => Promise<boolean | void> | boolean | void;
}

export const ChatInput = (props: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);
  const cursorPositionRef = useRef<number>(0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmitSend = async () => {
    if (!message.trim() && files.length === 0) return;

    const payload: ChatInputData = {
      message: message.replace(/\n/g, "<br/>"),
      images: files,
    };
    const success = await props.onSubmit(payload);

    if (success !== false) {
      setMessage("");
      setFiles([]);
      setPreviews([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    const newFiles = Array.from(selectedFiles);
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setFiles((prev) => [...prev, ...newFiles]);
    setPreviews((prev) => [...prev, ...newPreviews]);

    e.target.value = "";
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = cursorPositionRef.current;
    const newMessage =
      message.slice(0, start) + emojiData.emoji + message.slice(start);

    setMessage(newMessage);
    setShowEmojiPicker(false);

    // Đặt con trỏ sau emoji vừa chèn
    setTimeout(() => {
      const newPosition = start + emojiData.emoji.length;
      textarea.setSelectionRange(newPosition, newPosition);
      textarea.focus();
    }, 0);
  };

  return (
    <div className="chat-input">
      <div
        className={`chat-input_section-2 ${previews.length > 0 && "has-image"}`}
      >
        <div className="chat-input_section-2-wrapper">
          {previews.length > 0 && (
            <figure className="image_container">
              {previews.map((preview, index) => (
                <div key={index} className="image_container-item">
                  <img
                    src={preview}
                    alt={`Hình ảnh ${index + 1}`}
                    className="image_container-item"
                  />
                  <button
                    className="image_container-action"
                    onClick={() => removeImage(index)}
                    title="Xóa hình ảnh"
                  >
                    <img src={remove} alt="Xóa" />
                  </button>
                </div>
              ))}
            </figure>
          )}

          <textarea
            ref={textareaRef}
            placeholder="Nhập tin nhắn của bạn tại đây..."
            className="chat-input-element chat-input-textarea"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onSelect={(e) => {
              cursorPositionRef.current = e.currentTarget.selectionStart;
            }}
            onClick={(e) => {
              cursorPositionRef.current = e.currentTarget.selectionStart;
            }}
            rows={1}
          />
        </div>

        <div style={{ position: "relative" }}>
          <button
            type="button"
            className="btn-send"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            title="Chọn emoji"
          >
            <img
              src={emoji}
              alt="Biểu tượng cảm xúc"
              crossOrigin="anonymous"
              className="chat-icon"
            />
          </button>

          {showEmojiPicker && (
            <div
              ref={emojiPickerRef}
              style={{
                position: "absolute",
                bottom: "100%",
                right: 0,
                marginBottom: "8px",
                zIndex: 1000,
              }}
            >
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                autoFocusSearch={false}
                width={320}
                height={400}
              />
            </div>
          )}
        </div>

        <button
          type="button"
          className="btn-send"
          onClick={handleSubmitSend}
          title="Gửi tin nhắn"
        >
          <img
            src={send}
            alt="Gửi tin nhắn"
            crossOrigin="anonymous"
            className="chat-icon"
          />
        </button>
      </div>
    </div>
  );
};
