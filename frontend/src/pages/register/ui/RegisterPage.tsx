import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Confetti } from '@neoconfetti/react'
import { PageLayout } from '@/shared/ui/PageLayout'
import {
  // RegisterAlreadyHaveAccountButton,
  RegisterSubmitButton,
  // RegisterTelegramToVkLinkPanel,
  // RegisterVkToTelegramLinkPanel,
} from '@/entities/auth/ui'
import { useBehavior } from '../model'
import './RegisterPage.css'

export function RegisterPage() {
  const [personalDataConsent, setPersonalDataConsent] = useState(false)
  const {
    // platform,
    activity,
    setActivity,
    feedback,
    setFeedback,
    // accountLink,
    // setAccountLink,
    // linkPanelsPage,
  } = useBehavior()

  return (
    <PageLayout title="Регистрация" subtitle="Присоединяйся к докладу">
      {activity.checking ? (
        <div className="register__loading">
          <span className="register__spinner" aria-hidden />
          <p className="page__loading">Проверка...</p>
        </div>
      ) : (
        <div className="register__form">
          {feedback.showConfetti && (
            <Confetti
              particleCount={150}
              force={0.5}
              colors={['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']}
            />
          )}
          <div className="register__illustration" aria-hidden>
            ✨
          </div>
          {feedback.error && <p className="page__error">{feedback.error}</p>}
          {/* {accountLink.showLinkHelp && platform === 'vk' && (
            <RegisterVkToTelegramLinkPanel page={linkPanelsPage} />
          )}
          {accountLink.showTgToVkLinkHelp && platform === 'telegram' && (
            <RegisterTelegramToVkLinkPanel page={linkPanelsPage} />
          )} */}
          <label className="register__consent">
            <input
              type="checkbox"
              checked={personalDataConsent}
              onChange={(e) => setPersonalDataConsent(e.target.checked)}
            />
            <span>
              Согласен(на) с{' '}
              <Link className="register__consent-link" to="/privacy">
                политикой обработки персональных данных
              </Link>
            </span>
          </label>
          <RegisterSubmitButton
            activity={activity}
            setActivity={setActivity}
            setFeedback={setFeedback}
            personalDataConsentAccepted={personalDataConsent}
          />
          {/* <RegisterAlreadyHaveAccountButton
            activity={activity}
            platform={platform}
            setActivity={setActivity}
            setFeedback={setFeedback}
            setAccountLink={setAccountLink}
          /> */}
        </div>
      )}
    </PageLayout>
  )
}
