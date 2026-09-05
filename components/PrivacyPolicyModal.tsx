import LegalModal from './LegalModal';
import PrivacyPolicyContent from './legal/PrivacyPolicyContent';
import { OPERATOR } from '@/lib/site';

export default function PrivacyPolicyModal() {
  return (
    <LegalModal trigger="개인정보처리방침" title={`${OPERATOR.company} 개인정보 처리방침`}>
      <PrivacyPolicyContent />
    </LegalModal>
  );
}
