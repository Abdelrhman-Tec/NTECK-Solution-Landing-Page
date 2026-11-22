import { getLegalMetadata, LegalNotice, type LegalPageProps } from "@/components/legal-notice";

export function generateMetadata({ params }: LegalPageProps) {
  return getLegalMetadata(params, "terms");
}

export default function TermsPage(props: LegalPageProps) {
  return <LegalNotice {...props} kind="terms" />;
}
