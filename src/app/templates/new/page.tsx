import TemplateForm from '@/components/templates/TemplateForm';

export default function NewTemplatePage() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">新しいテンプレートを登録</h1>
      </div>
      <TemplateForm />
    </div>
  );
}
