import { useEffect, useRef, useState } from 'react';
import '../styles/drag-and-drop.scss';
import Loader from './loader';

export enum UPLOAD_STATUS {
  'IDLE' = 0,
  'UPLOADING' = 1,
  'FAILURE' = 2,
}

enum BACKGROUND {
  'EMPTY' = 0,
  'LOADER' = 1,
  'CROSS' = 2,
}

interface DragAndDropProps {
  id: string,
  src?: string,
  alt: string,
  inputAsSrc?: boolean,
  status?: UPLOAD_STATUS,
  className?: string,
  onChanged?: (file: File) => void,
}

export default function DragAndDrop({ id, src = null, alt, inputAsSrc = false, status = UPLOAD_STATUS.IDLE, onChanged, className = '' }: DragAndDropProps) {
  
  const [isHovered, setIsHovered] = useState(false);
  const [inputFile, setInputFile] = useState<File>(null);
  const [showBackground, setShowBackground] = useState<BACKGROUND>(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const timerBG = useRef<NodeJS.Timeout | null>(null);


  useEffect(() => {
    if (inputRef.current && !inputAsSrc) {
      inputRef.current.value = '';
    }
    if (inputFile && status === UPLOAD_STATUS.IDLE) {
      if (onChanged) onChanged(inputFile);
      if (inputAsSrc && imageRef.current) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const fileURL = e.target.result as string;
          imageRef.current.src = fileURL; 
          //InputRef.current.value = fileURL;
        };
        reader.readAsDataURL(inputFile);
      }
    }
  }, [inputFile]);

  useEffect(() => {
    if (timerBG.current) clearTimeout(timerBG.current);
    switch (status) {
    case UPLOAD_STATUS.FAILURE:
      setShowBackground(BACKGROUND.CROSS);
      break;
    case UPLOAD_STATUS.UPLOADING:
      timerBG.current = setTimeout(() => {
        setShowBackground(BACKGROUND.LOADER);
      }, 2000);
      break;
    case UPLOAD_STATUS.IDLE:
      setShowBackground(BACKGROUND.EMPTY);
      break;
    }
  }, [status]);

  let backgroundElement = <>@</>;
  if (showBackground === BACKGROUND.CROSS) {
    backgroundElement = <>X</>;
  }
  else if (showBackground === BACKGROUND.LOADER) {
    backgroundElement = <Loader></Loader>;
  }

  function dropHandler(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    if (e.dataTransfer.items && inputRef.current) {
      const item = e.dataTransfer.items[0];
      if (item.kind === 'file') {
        const file = item.getAsFile();
        setInputFile(file);
      }
    }
  }

  function dragOverHandler(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  function changeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files[0];
    if (file) {
      setInputFile(file);
    }
  }

  return (
    <div className={"drag-and-drop " + className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}  
      onDrop={(e) => dropHandler(e)}
      onDragOver={(e) => dragOverHandler(e)}
    >
      <input ref={inputRef}
        id={id}
        type='file'
        onChange={(e) => changeHandler(e)}
        disabled={status !== UPLOAD_STATUS.IDLE}
      />
      <label
        htmlFor={id}
      >
        {!isHovered && !showBackground ? <></> : (
          <div className="drag-and-drop-hover">
            {backgroundElement}
          </div>
        )}
        <img src={!inputAsSrc ? src : ''} alt={alt} ref={imageRef}/>
      </label>
    </div>
  );
}