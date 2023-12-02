import { useContext } from "react";
import { useParams } from "react-router-dom";
import MainLeftBar from "../components/mainLeftBar/mainLeftBar";
import ProfileMain from "../components/profileMain/profileMain";
import { UserContext } from "../components/UserContext";
import '../styles/main-profile.scss';

export default function ProfilePage() {

  const user = useContext(UserContext);
  const param = useParams<{userId: string}>();

  const editable = !user || Number.isNaN(+param.userId) || +param.userId === user.user.userId; 

  return (
    <div className="main-window">
      <MainLeftBar />
      <ProfileMain
        editable={editable}
        userId={param.userId}
      />
    </div>
  );
}