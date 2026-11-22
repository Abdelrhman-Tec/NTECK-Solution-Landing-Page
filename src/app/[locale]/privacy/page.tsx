import { getLegalMetadata, LegalNotice, type LegalPageProps } from "@/components/legal-notice";

export function generateMetadata({ params }: LegalPageProps) {
  return getLegalMetadata(params, "privacy");
}

export default function PrivacyPage(props: LegalPageProps) {
  return <LegalNotice {...props} kind="privacy" />;
}
