import { PageLayout } from '@/shared/ui/PageLayout'
import policyHtml from './privacy-policy.html?raw'
import './PrivacyPolicyPage.css'

export function PrivacyPolicyPage() {
  return (
    <PageLayout title="Политика в отношении обработки персональных данных" subtitle="152-ФЗ">
      <article
        className="privacy-policy"
        dangerouslySetInnerHTML={{ __html: policyHtml }}
      />
    </PageLayout>
  )
}
