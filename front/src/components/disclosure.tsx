import { ReactNode, useState } from "react";
import '../styles/disclosure.scss';

interface DisclosureProps {
  children?: ReactNode,
  showing?: boolean,
  title: string,
}

export default function Disclosure({ children, title, showing: initialshowing = true }: DisclosureProps) {

  const [showing, setShowing] = useState(initialshowing);
  const isEmpty = Array.isArray(children) && children.length === 0;

  const arrowSymbol = showing ? '^' : 'v';

  return (
    <div className="disclosure-section">
      <button
        onClick={() => setShowing(state => !state)}
      >
        <span className="arrow">{arrowSymbol}</span>
        <span>{title}</span>
      </button>
      <ul className={`${!showing || isEmpty ? 'hidden' : ''}`}>
        {/* Any item here */}
        {children}
      </ul>
    </div>
  );
}