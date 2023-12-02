import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import imagePath from "../../helpers/imagePath";
import { UserContext } from "../UserContext";
import '../../styles/disclosure-profile-item.scss';

interface ChatItemProps {
  title: string,
}

export default function ProfileItem({ title }: ChatItemProps) {
  
  const navigate = useNavigate();
  const user = useContext(UserContext);

  function handleButton() {
    navigate('/login');
    user.logOut();
  }

  return (
    <div className="profile-line">
      <Link className="profile-item"
        to={"/profile/"+'@me'}
      >
        <img src={imagePath(user?.user?.avatar, 'profile')} alt="avatar"/>
        <span>
          {title}
        </span>
      </Link>
      <span>
        <button onClick={() => handleButton()}>
          {">"}
        </button>
      </span>
    </div>
  );
}