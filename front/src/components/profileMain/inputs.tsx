import { useRef, useState } from "react";
import { useQueryClient } from "react-query";
import { fetchProfileUpdate } from "../../helpers/fetch/profile";

interface ProfileText {
  initalValue?: string,
}

interface ProfileInput extends ProfileText {
  userId: number,
}

export function ProfileInputInline({ initalValue, userId }: ProfileInput) {
  
  const TEXT_LIMIT = 15;

  const queryClient = useQueryClient();

  const [value, setValue] = useState(initalValue);
  const [wasChanged, setWasChanged] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function changeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value;
    if (newValue.length <= TEXT_LIMIT) {
      setValue(e.target.value);
      setWasChanged(true);
    }
  }

  function blurHandler() {
    if (wasChanged) {
      const func = async () => {
        try {
          await fetchProfileUpdate({
            userId,
            update: {nickname: value}
          });
          queryClient.invalidateQueries(['profile', '@me']);
        } catch(err) { /* empty */ }
      };
      func();
      setWasChanged(false);
    }
  }

  function keyboardHandler(e: React.KeyboardEvent<HTMLInputElement>) {
    if (inputRef.current) {
      if (e.code === "Enter") {
        inputRef.current.blur();
      }
    }
  }

  return (
    <input className="profile-info-name profile-info-editable"
      placeholder="Write your nickname..."
      value={value}
      ref={inputRef}
      onChange={(e) => changeHandler(e)}
      onBlur={() => blurHandler()}
      onKeyDown={(e) => keyboardHandler(e)}
    />
  );
}

export function ProfileTextInlnie({ initalValue: value }: ProfileText) {
  return (
    <span className="profile-info-name profile-info-editable"
      placeholder="Write your nickname..."
      
    >{value}</span>
  );
}

export function ProfileInputArea({ initalValue, userId }: ProfileInput) {
  
  const TEXT_LIMIT = 300;

  const [value, setValue] = useState(initalValue);
  const [wasChanged, setWasChanged] = useState(false);
  const [focused, setFocused] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const animationTimer = useRef<NodeJS.Timeout | null>(null);

  type Animations = '' | 'animation-shake';
  const [animation, playAnimation] = useState<Animations>('');

  function changeHandler(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const newValue = e.target.value;
    if (newValue.length <= TEXT_LIMIT) {
      setValue(e.target.value);
      setWasChanged(true);
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

  function blurHandler() {
    setFocused(false);
    if (wasChanged) {
      fetchProfileUpdate({
        userId,
        update: {description: value}
      });
      setWasChanged(false);
    }
  }

  function keyboardHandler(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (inputRef.current) {
      if (e.code === "Enter") {
        inputRef.current.blur();
      }
    }
  }

  return (
    <div className="profile-info-desc">
      <textarea className="profile-info-desc-text profile-info-editable"
        placeholder="Write your description..."
        value={value}
        ref={inputRef}
        onChange={(e) => changeHandler(e)}
        onBlur={() => blurHandler()}
        onFocus={() => setFocused(true)}
        onKeyDown={(e) => keyboardHandler(e)}
      />
      {focused ? (<span className={animation}>{TEXT_LIMIT-value.length} symbols left</span>) : <></>}
    </div>
  );
}

export function ProfileTextArea({ initalValue: value }: ProfileText) {
  return (
    <span className="profile-info-desc-text profile-info-editable"
      placeholder="Write your description..."
    >{value}</span>
  );
}

