import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { fetchChatMembers } from '../../helpers/fetch/chat';
import queryRetry, { queryFail } from '../../helpers/queryRetry';
import '../../styles/main-right-bar.scss';
import Disclosure from '../disclosure';
import MemberItem from "./userItem";

interface MainRightBarProps {
  chatId: number,
}

export default function MainRightBar({ chatId }: MainRightBarProps) {

  const navigate = useNavigate();

  const { isLoading, isError, data: members, error } = useQuery({
    queryKey: ['chat', chatId+'', 'members'],
    queryFn: () => fetchChatMembers({chatId}),
    retry: (count, error) => queryRetry(count, error),
  });
  useEffect(() => {queryFail(error, navigate);}, [error]);

  if (isLoading) return <>Loading</>;
  if (isError || !members) return <>Loading</>;

  const MemberElements = members.map((member) => {
    return (
      <MemberItem key={member.userId}
        nickname={member.nickname}
        userId={member.userId}
        avatar={member.avatar}
      />
    );
  });

  return (
    <aside className="main-right-bar">
      <input id="right-menu-toggle" type="checkbox" defaultValue="!!"></input>
      <label htmlFor="right-menu-toggle" className="menu-button-container">
        <div className="menu-button"></div>
      </label>
      <div>
        <Disclosure title="Members">
          {MemberElements}
        </Disclosure>
      </div>
    </aside>
  );
}

