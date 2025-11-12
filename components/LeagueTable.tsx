import React, { useState, useMemo } from 'react';
import { Team, TeamStats } from '../types';

const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
    </svg>
);

interface GroupTableProps {
  title: string;
  teams: Team[];
  stats: TeamStats[];
  isAdmin: boolean;
  onSelectTeam: (teamId: number) => void;
  onUpdateTeamName: (teamId: number, newName: string) => void;
  editingTeamId: number | null;
  setEditingTeamId: React.Dispatch<React.SetStateAction<number | null>>;
  newTeamName: string;
  setNewTeamName: React.Dispatch<React.SetStateAction<string>>;
}

const GroupTable: React.FC<GroupTableProps> = ({
  title, teams, stats, isAdmin, onSelectTeam, onUpdateTeamName,
  editingTeamId, setEditingTeamId, newTeamName, setNewTeamName
}) => {
  const sortedStats = useMemo(() => [...stats].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return a.teamId - b.teamId;
  }), [stats]);

  const getTeamById = (id: number) => teams.find(t => t.id === id);

  const handleEditClick = (team: Team) => {
    setEditingTeamId(team.id);
    setNewTeamName(team.name);
  };

  const handleCancelEdit = () => {
    setEditingTeamId(null);
    setNewTeamName('');
  };

  const handleSaveEdit = () => {
    if (editingTeamId && newTeamName.trim()) {
      onUpdateTeamName(editingTeamId, newTeamName.trim());
    }
    handleCancelEdit();
  };

  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return null;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-l-4 border-yellow-500';
      case 2:
        return 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-l-4 border-gray-400';
      case 3:
        return 'bg-gradient-to-r from-orange-700/20 to-orange-800/20 border-l-4 border-orange-600';
      default:
        return '';
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-800/80 via-gray-800/60 to-gray-900/80 rounded-2xl shadow-2xl p-4 sm:p-6 backdrop-blur-lg border border-gray-700/50">
      <h3 className="text-2xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">{title}</h3>
      <div className="overflow-x-auto rounded-xl">
        <table className="w-full min-w-[600px] text-sm text-left text-gray-300">
          <thead className="text-xs text-blue-300 uppercase bg-gradient-to-r from-gray-700/70 to-gray-800/70 backdrop-blur-sm">
            <tr>
              <th scope="col" className="px-4 py-3 text-center">رتبه</th>
              <th scope="col" className="px-6 py-3">تیم</th>
              <th scope="col" className="px-2 py-3 text-center" title="بازی">B</th>
              <th scope="col" className="px-2 py-3 text-center" title="برد">BR</th>
              <th scope="col" className="px-2 py-3 text-center" title="مساوی">M</th>
              <th scope="col" className="px-2 py-3 text-center" title="باخت">BA</th>
              <th scope="col" className="px-2 py-3 text-center" title="تفاضل گل">TF</th>
              <th scope="col" className="px-2 py-3 text-center" title="امتیاز">E</th>
            </tr>
          </thead>
          <tbody>
            {sortedStats.map((stat, index) => {
              const team = getTeamById(stat.teamId);
              if (!team) return null;
              
              const isEditing = editingTeamId === team.id;

              const medal = getMedalIcon(index + 1);
              const rankStyle = getRankStyle(index + 1);

              return (
                <tr key={stat.teamId} className={`border-b border-gray-700/50 hover:bg-gray-700/70 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg ${rankStyle}`}>
                  <td className="px-4 py-4 text-center font-bold text-lg">
                    <div className="flex items-center justify-center gap-1">
                      {medal && <span className="text-xl">{medal}</span>}
                      <span>{index + 1}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-white whitespace-nowrap">
                    {isEditing ? (
                        <div className="flex items-center gap-2">
                            <input 
                                type="text"
                                value={newTeamName}
                                onChange={(e) => setNewTeamName(e.target.value)}
                                className="bg-gray-900 border border-gray-600 rounded px-2 py-1 text-sm w-full"
                                autoFocus
                            />
                            <button onClick={handleSaveEdit} className="text-green-400 hover:text-green-300">ذخیره</button>
                            <button onClick={handleCancelEdit} className="text-red-400 hover:text-red-300">لغو</button>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <span
                                    className="cursor-pointer hover:text-blue-400 hover:underline transition-all duration-300 hover:translate-x-1"
                                    onClick={() => onSelectTeam(team.id)}
                                >
                                    {team.name}
                                </span>
                                {isAdmin && (
                                    <button onClick={() => handleEditClick(team)} className="text-gray-400 hover:text-white transition-all duration-300 hover:rotate-12">
                                        <EditIcon />
                                    </button>
                                )}
                            </div>
                            <span className="text-xs text-gray-500">{team.players.map(p => p.name).join('، ')}</span>
                        </div>
                    )}
                  </td>
                  <td className="px-2 py-4 text-center text-gray-300">{stat.played}</td>
                  <td className="px-2 py-4 text-center">
                    <span className="inline-block px-2 py-0.5 bg-green-500/20 text-green-400 rounded-md font-semibold">{stat.won}</span>
                  </td>
                  <td className="px-2 py-4 text-center">
                    <span className="inline-block px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-md font-semibold">{stat.drawn}</span>
                  </td>
                  <td className="px-2 py-4 text-center">
                    <span className="inline-block px-2 py-0.5 bg-red-500/20 text-red-400 rounded-md font-semibold">{stat.lost}</span>
                  </td>
                  <td className="px-2 py-4 text-center">
                    <span className={`font-semibold ${stat.goalDifference > 0 ? 'text-green-400' : stat.goalDifference < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                      {stat.goalDifference > 0 ? `+${stat.goalDifference}` : stat.goalDifference}
                    </span>
                  </td>
                  <td className="px-2 py-4 text-center">
                    <span className="inline-block px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold text-lg shadow-lg">
                      {stat.points}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};


interface LeagueTableProps {
  teams: Team[];
  stats: TeamStats[];
  isAdmin: boolean;
  onSelectTeam: (teamId: number) => void;
  onUpdateTeamName: (teamId: number, newName: string) => void;
}

const LeagueTable: React.FC<LeagueTableProps> = ({ teams, stats, ...props }) => {
  const [editingTeamId, setEditingTeamId] = useState<number | null>(null);
  const [newTeamName, setNewTeamName] = useState('');

  const groupA = useMemo(() => teams.filter(t => t.group_name === 'گروه A'), [teams]);
  const groupB = useMemo(() => teams.filter(t => t.group_name === 'گروه B'), [teams]);

  const getStatsForGroup = (groupTeams: Team[]): TeamStats[] => {
    const teamIds = new Set(groupTeams.map(t => t.id));
    return stats.filter(s => teamIds.has(s.teamId));
  };
  
  const commonProps = {
    ...props,
    editingTeamId, setEditingTeamId,
    newTeamName, setNewTeamName
  };

  return (
    <div className="space-y-8 animate-fadeIn" dir="rtl">
      <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
        🏆 جدول لیگ - مرحله گروهی
      </h2>
      <GroupTable title="گروه A" teams={groupA} stats={getStatsForGroup(groupA)} {...commonProps} />
      <GroupTable title="گروه B" teams={groupB} stats={getStatsForGroup(groupB)} {...commonProps} />
    </div>
  );
};

export default LeagueTable;