import LegalModal from './LegalModal';
import TermsContent from './legal/TermsContent';

export default function TermsModal() {
  return (
    <LegalModal trigger="이용약관" title="이용약관">
      <TermsContent />
    </LegalModal>
  );
}
