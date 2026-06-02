import { prisma } from '@/lib/prisma';
import CompanyForm from '@/components/companies/CompanyForm';
import { notFound } from 'next/navigation';

export default async function EditCompanyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const company = await prisma.company.findUnique({ where: { id } });

  if (!company) notFound();

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">企業情報を編集</h1>
      </div>
      <CompanyForm
        companyId={company.id}
        defaultValues={{
          name: company.name,
          industry: company.industry,
          category: company.category,
          website: company.website,
          status: company.status,
          difficulty: company.difficulty,
          notes: company.notes,
        }}
      />
    </div>
  );
}
