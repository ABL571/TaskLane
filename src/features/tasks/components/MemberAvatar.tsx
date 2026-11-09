import { Avatar, Tooltip } from 'antd';
import { TEAM } from '../config/board';
import { initials } from '../../../shared/utils/initials';

export function MemberAvatar({ name, size = 28 }: { name?: string; size?: number }) {
  if (!name) {
    return <Tooltip title="Unassigned"><Avatar size={size} className="member-avatar empty-avatar">?</Avatar></Tooltip>;
  }
  const member = TEAM.find(person => person.name === name);
  return (
    <Tooltip title={name}>
      <Avatar size={size} className="member-avatar" style={{ background: member?.color ?? '#5470BD' }}>
        {initials(name)}
      </Avatar>
    </Tooltip>
  );
}
