import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { fetchProfile, fetchProfileAvatar } from "../../helpers/fetch/profile";
import imagePath from "../../helpers/imagePath";
import queryRetry, { queryFail } from "../../helpers/queryRetry";
import DragAndDrop, { UPLOAD_STATUS } from "../dragAndDrop";
import Loader from "../loader";
import { ProfileInputArea, ProfileInputInline, ProfileTextArea, ProfileTextInlnie } from "./inputs";

interface ProfileMainProps {
  editable: boolean,
  userId: string,
}

export default function ProfileMain({editable, userId}: ProfileMainProps) {
  
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const queryKey = userId === '@me' ? ['profile', '@me'] : ['profile', userId+'']; 

  const { isLoading, isError, data: profile, error } = useQuery({
    queryKey,
    queryFn: () => fetchProfile({userId}),
    retry: (count, error) => queryRetry(count, error),
  });
  useEffect(() => {queryFail(error, navigate);}, [error]);

  const avatarTimer = useRef<NodeJS.Timeout | null>(null);
  const [avatarStatus, setAvatarStatus] = useState<UPLOAD_STATUS>(0);
  
  async function onAvatarChanged(file: File) {
    clearTimeout(avatarTimer.current);
    setAvatarStatus(UPLOAD_STATUS.UPLOADING);
    try {
      await fetchProfileAvatar({file});
      setAvatarStatus(UPLOAD_STATUS.IDLE);
      queryClient.invalidateQueries(['profile', '@me']);
    } catch(err) {
      setAvatarStatus(UPLOAD_STATUS.FAILURE);
      avatarTimer.current = setTimeout(() => {
        setAvatarStatus(UPLOAD_STATUS.IDLE);
      }, 2000);
    }
  }

  if (isLoading) return (
    <main className="main-profile flex-center">
      <Loader />
    </main>
  );
  if (isError) return (
    <main className="main-profile flex-center">
      <span>Failed to load page</span>
      <span>Check your Internet connection and refresh page</span>
    </main>
  );

  return (
    <main className="main-profile">
      <div className="profile-info">
        {editable ? (
          <DragAndDrop
            id="avatar"
            alt="avatar"
            src={imagePath(profile.avatar, 'profile')}
            onChanged={(file) => onAvatarChanged(file)}
            status={avatarStatus}
          ></DragAndDrop>
        ) : (
          <img
            src={imagePath(profile.avatar, 'profile')}
            alt="avatar"
          />
        )}
        <div className="profile-info-main">
          {editable ? (
            <>
              <ProfileInputInline 
                initalValue={profile.nickname}
                userId={profile.userId}
              />
              <ProfileInputArea
                initalValue={profile.description}
                userId={profile.userId}
              />
            </>
          ) : (
            <>   
              <ProfileTextInlnie
                initalValue={profile.nickname}
              />
              <ProfileTextArea
                initalValue={profile.description}
              />
            </>
          )}
        </div>
      </div>
      <div className="profile-tables">
        {/* <div className="profile-friends">
          <h3>Friends:</h3>
          <ul>
            <li>
              <div className="friends-container">
                <img src="/placeholder.png" alt="avatar" />
                <span>Nickname</span>
              </div>
            </li>
          </ul>
        </div> */}
      </div>
    </main>
  );
}