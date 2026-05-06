'use client';

import { TeamMember } from '@/lib/types';
import { getInitials } from '@/lib/utils';

interface Props {
  member: TeamMember;
  size?: 'sm' | 'md';
}

export default function Avatar({ member, size = 'md' }: Props) {
  const sz = size === 'sm' ? 'w-6 h-6 text-xs' : 'w-8 h-8 text-sm';
  return (
    <div
      className={`${sz} rounded-full flex items-center justify-center font-semibold text-white shrink-0`}
      style={{ backgroundColor: member.color }}
      title={member.name}
    >
      {getInitials(member.name)}
    </div>
  );
}
