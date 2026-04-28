import Link from 'next/link';
import { getIndustryColor, getStatusInfo } from '@/lib/constants';

interface Company {
  id: string;
  name: string;
  industry: string;
  difficulty: number | null;
  status: string;
}

export default function CompanyCard({ company }: { company: Company }) {
  const statusInfo = getStatusInfo(company.status);
  const stars = Array(company.difficulty || 1).fill('⭐').join('');

  return (
    <Link href={`/companies/${company.id}`} className="company-card" style={{ '--card-accent': getIndustryColor(company.industry) } as any}>
      <div className="company-card-header">
        <div>
          <h3 className="company-card-name">{company.name}</h3>
          <div className="company-card-industry">{company.industry}</div>
        </div>
        <div style={{ fontSize: '0.8rem' }}>{stars}</div>
      </div>
      
      <div className="company-card-footer">
        <span className="badge" style={{ background: `${statusInfo.color}20`, color: statusInfo.color }}>
          {statusInfo.icon} {statusInfo.label}
        </span>
      </div>
    </Link>
  );
}
