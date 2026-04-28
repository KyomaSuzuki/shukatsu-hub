import CompanyForm from '@/components/companies/CompanyForm';

export default function NewCompanyPage() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">新規企業登録</h1>
      </div>
      
      <CompanyForm />
    </div>
  );
}
