import React, { useState } from "react";
import close from "../../../../assets/svg/icn-clear_cancel.svg";

interface ChatImageProps {
  imageUrl: string;
  allImages?: string[];
  currentIndex?: number;
  overlay?: string;
}

export const ChatImage = (props: ChatImageProps) => {
  const ref = React.useRef<HTMLDialogElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(
    props.currentIndex || 0
  );

  const allImages = props.allImages || [props.imageUrl];

  const openModal = () => {
    setCurrentImageIndex(props.currentIndex || 0);
    ref.current?.showModal();
  };

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const goToPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex(
      (prev) => (prev - 1 + allImages.length) % allImages.length
    );
  };

  return (
    <>
      <div className="chat-preview" onClick={openModal}>
        <img
          src={props.imageUrl}
          className="chat-preview__image"
          alt="preview"
        />
        {props.overlay && (
          <div className="chat-preview__overlay">
            <span>{props.overlay}</span>
          </div>
        )}
      </div>

      <dialog ref={ref} onClick={() => ref.current?.close()}>
        <div
          className="chat-preview-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="chat-preview_wrap">
            {allImages.length > 1 && (
              <>
                <button
                  className="chat-preview-modal-nav prev"
                  onClick={goToPrev}
                >
                  ‹
                </button>
                <button
                  className="chat-preview-modal-nav next"
                  onClick={goToNext}
                >
                  ›
                </button>
              </>
            )}
            <img
              src={allImages[currentImageIndex]}
              className="chat-preview-modal-img"
              alt="full size"
            />
            {allImages.length > 1 && (
              <div className="chat-preview-modal-counter">
                {currentImageIndex + 1} / {allImages.length}
              </div>
            )}

            <img
              crossOrigin="anonymous"
              src={close}
              alt=""
              onClick={() => ref.current?.close()}
              className="chat-preview-modal-close"
            />
          </div>
        </div>
      </dialog>
    </>
  );
};
