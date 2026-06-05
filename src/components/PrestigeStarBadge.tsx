import { PRESTIGE_STARS } from '../contexts/UserContext';

interface PrestigeStarBadgeProps {
  starId: number;
  size: 'small' | 'medium' | 'large';
  color: string;
}

const PrestigeStarBadge = ({ starId, size, color }: PrestigeStarBadgeProps) => {
  const sizeMap = {
    small: '16px',
    medium: '24px',
    large: '32px'
  };

  // Find the star from PRESTIGE_STARS array
  const star = PRESTIGE_STARS.find(s => s.id === starId);
  const currentStarName = star ? star.displayName : PRESTIGE_STARS[0].displayName;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '2px 6px',
        background: `linear-gradient(135deg, ${color}20, ${color}10)`,
        borderRadius: '12px',
        border: `1px solid ${color}40`,
        fontSize: '0.65rem',
        color: color,
        fontWeight: 600
      }}
    >
      <svg
        width={sizeMap[size]}
        height={sizeMap[size]}
        viewBox="0 0 24 24"
        fill={color}
        style={{ filter: 'drop-shadow(0 0 4px ' + color + '40)' }}
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
      <span>{currentStarName}</span>
    </div>
  );
};

export default PrestigeStarBadge;
