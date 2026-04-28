import { prisma } from '@/lib/prisma';
import CompanyCard from '@/components/companies/CompanyCard';
import Link from 'next/link';

export default async function CompaniesPage() {
  const companies = await prisma.company.findMany({
    orderBy: { updatedAt: 'desc' },
  });

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">企業一覧</h1>
        <Link href="/companies/new" className="btn btn-primary">
          + 企業を登録
        </Link>
      </div>

      <div className="company-grid">
        {companies.map(company => (
          <CompanyCard key={company.id} company={company} />
        ))}
        
        {companies.length === 0 && (
          <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
            <div className="empty-icon">🏢</div>
            <p>まだ登録されている企業がありません</p>
          </div>
        )}
      </div>
    </div>
  );
}
