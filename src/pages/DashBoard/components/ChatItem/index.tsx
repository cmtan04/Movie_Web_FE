import { ChatImage } from "../ChatImage";
import tick from "../../../../assets/svg/icn-tick-double-blue.svg";

interface ChatItemContent {
  text?: string;
}

interface ChatItemProps {
  content: ChatItemContent;
  timeLine: string;
  isYour: boolean;
  isRead: boolean;
  metadata: any;
}

export const ChatItem = (props: ChatItemProps) => {
  const files = props?.metadata?.upload || [];
  const hasMultipleImages = files.length > 1;

  return (
    <div className={`chat-item ${props?.isYour && "is-your"}`}>
      <div className={`chat-item_section-1`}>
        {files.length > 0 && (
          <div
            className={`chat-images-grid ${
              hasMultipleImages ? "multiple" : "single"
            }`}
          >
            {files.slice(0, 3).map((file: any, index: number) => {
              const isLastDisplayed = index === 2 && files.length > 3;
              const remainingCount = files.length - 3;

              return (
                <ChatImage
                  key={index}
                  imageUrl={file?.url}
                  allImages={files.map((f: any) => f?.url)}
                  currentIndex={index}
                  overlay={isLastDisplayed ? `+${remainingCount}` : undefined}
                />
              );
            })}
          </div>
        )}
        {props?.content?.text && (
          <p
            className="chat-content"
            dangerouslySetInnerHTML={{ __html: props.content.text }}
          />
        )}
      </div>
      <div className={`chat-item_section-2`}>
        <span className="time-line">{props?.timeLine}</span>
        {props?.isYour && props?.isRead && (
          <img crossOrigin="anonymous" src={tick} alt="Đã đọc" />
        )}
      </div>
    </div>
  );
};
