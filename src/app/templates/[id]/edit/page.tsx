import { prisma } from '@/lib/prisma';
import TemplateForm from '@/components/templates/TemplateForm';
import { notFound } from 'next/navigation';

export default async function EditTemplatePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const template = await prisma.esTemplate.findUnique({
    where: { id },
  });

  if (!template) {
    notFound();
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">テンプレートを編集</h1>
      </div>
      <TemplateForm initialData={template} />
    </div>
  );
}
