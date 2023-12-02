import { Link } from "react-router-dom";
import imagePath from "../../helpers/imagePath";
import '../../styles/disclosure-member-item.scss';

interface MemberItemProps {
  nickname: string,
  userId: number,
  avatar: string | null,
}

export default function MemberItem({ nickname, userId, avatar }: MemberItemProps) {
  return (
    <Link className="member-item"
      to={"/profile/"+userId}
    >
      <img src={imagePath(avatar, 'profile')} alt="avatar"/>
      {nickname}
    </Link>
  );
}