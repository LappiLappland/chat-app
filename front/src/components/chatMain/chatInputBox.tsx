import { useEffect, useRef, useState } from "react";
import Loader from "../loader";
import '../../styles/main-chat-input.scss';

interface ChatInputBoxProps {
  onSend: (msg: string) => void,
  status: MessageStatus,
}

export enum MessageStatus {
  writing = 0,
  sending = 1,
  failed = 2,
}

export default function ChatInputBox({ onSend, status }: ChatInputBoxProps) {

  const [inputText, setInputText] = useState('');
  const [showExtraMessage, setShowExtraMessage] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  type Animations = '' | 'animation-shake';
  const animationTimer = useRef<NodeJS.Timeout | null>(null);
  const [animation, playAnimation] = useState<Animations>('');

  const TEXT_LIMIT = 150;

  const errorTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    clearTimeout(errorTimer.current);
    switch (status) {
    case MessageStatus.writing:
      setInputText('');
      setInputDisabled(false);
      setShowExtraMessage(false);
      break;
    case MessageStatus.sending:
      setInputDisabled(true);
      errorTimer.current = setTimeout(() => setShowExtraMessage(true), 2000);
      break;
    case MessageStatus.failed:
      setInputDisabled(true);
      setShowExtraMessage(true);
      break;
    }
  }, [status]);

  function keyboardHandler(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputText.length > 0) {
        onSend(inputText);
      }
    }
  }

  function changeHandler(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const newValue = e.target.value;
    if (newValue.length <= TEXT_LIMIT) {
      setInputText(e.target.value);
    } else {
      playAnimation('animation-shake');
      if (!animationTimer.current) {
        animationTimer.current = setTimeout(() => {
          playAnimation('');
          animationTimer.current = null;
        }, 1000);
      }
    }
  }

  return (
    <div className="chat-input-container">
      {!showExtraMessage ? <></> : (
        status !== MessageStatus.failed ? (
          <span className="extra-text">
            Trying to send message...
            <Loader />
          </span>
        ) : (
          <span className="extra-text">
            Failed to send message!
          </span>
        )
      )}
      {!isFocused || showExtraMessage ? <></> : (
        <span className={animation}>
          {TEXT_LIMIT - inputText.length} symbols left
        </span>
      )}
      <div className={isFocused ? 'focused-div' : ''}>
        <textarea
          value={inputText}
          disabled={inputDisabled}
          onChange={(e) => changeHandler(e)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={(e) => keyboardHandler(e)}
          placeholder="Write your message"
        ></textarea>
        <div className="chat-extra-buttons">
          <span>+</span>
          <span>@</span>
        </div>
      </div>
    </div>
  );
}