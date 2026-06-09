import { UploadWidget } from "@/components/shared/upload-widget";
import { PageHeader } from "@/components/shared/page-header";
import { documents } from "@/lib/mock-data";

export default function DocumentsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Knowledge Intake"
        title="Document Upload"
        description="Upload PDF, DOCX, and TXT cancer reports. Documents are automatically processed, extracted, and indexed for AI-powered analysis."
      />
      <UploadWidget documents={documents} />
    </>
  );
}
