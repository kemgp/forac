import { useMemo, useState } from 'react'
import { createInviteChoice } from './api'
import './App.css'

const timeSlots = [
  '9:00 AM',
  '10:30 AM',
  '12:00 PM',
  '2:00 PM',
  '4:00 PM',
  '6:00 PM',
  '7:30 PM',
  '9:00 PM',
  'Actually maski ano oras okay sakon :D',
]

const activityOptions = [
  'Ramen',
  'Samgyup',
  'Mexican food',
  'Pop up',
  'Movie night',
  'Bookstore browse',
  'Museum trip',
  'Open packs'
]

const pandaGifSrc = 'https://media0.giphy.com/media/N6funLtVsHW0g/giphy.gif'

function App() {
  const [step, setStep] = useState('invite')
  const [form, setForm] = useState({ date: '', timeSlot: '6:00 PM' })
  const [selectedActivities, setSelectedActivities] = useState([])
  const [savedChoice, setSavedChoice] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  const formattedSummary = useMemo(() => {
    if (!form.date) return 'your chosen day'

    const readableDate = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    }).format(new Date(`${form.date}T12:00:00`))

    return `${readableDate} at ${form.timeSlot}`
  }, [form.date, form.timeSlot])

  const savedChoiceDay = useMemo(() => {
    if (!savedChoice?.date) return ''

    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
    }).format(new Date(`${savedChoice.date}T12:00:00`))
  }, [savedChoice])

  function updateField(event) {
    const { name, value } = event.target

    setForm((current) => ({ ...current, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    setStep('activities')
  }

  function toggleActivity(activity) {
    setSelectedActivities((current) =>
      current.includes(activity)
        ? current.filter((item) => item !== activity)
        : [...current, activity],
    )
  }

  function handleActivitySubmit(event) {
    event.preventDefault()

    if (!selectedActivities.length) {
      setSaveError('Pili isaa')
      return
    }

    return saveChoice()
  }

  async function saveChoice() {
    setIsSaving(true)
    setSaveError('')

    try {
      const choice = await createInviteChoice({
        date: form.date,
        timeSlot: form.timeSlot,
        activities: selectedActivities,
      })

      setSavedChoice(choice)
      setStep('sent')
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Failed to save choice.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <main className="app-shell">
      <section className="hero-card">

        <h1>Arat gwa ta</h1>

        {step === 'invite' ? (
          <figure className="panda-spotlight">
            <img src={pandaGifSrc} alt="Cute panda gif" className="panda-gif" />
            <figcaption>Lantawa oh cute ang panda daw ikaw</figcaption>
          </figure>
        ) : null}

        {step === 'invite' ? (
          <div className="actions">
            <button type="button" className="primary-button" onClick={() => setStep('schedule')}>
              Arat g
            </button>
            <button
              type="button"
              className="primary-button runaway-button"
              onMouseEnter={(e) => {
                const button = e.currentTarget

                const x = Math.random() * 600 - 300
                const y = Math.random() * 300 - 150

                button.style.transform = `translate(${x}px, ${y}px)`
              }}
              onClick={() => setStep('schedule')}
            >
              Naur
            </button>
          </div>
        ) : null}

        {step === 'schedule' ? (
          <form className="scheduler" onSubmit={handleSubmit}>
            <div className="calendar-card">
              <label className="field">
                <span>Choose a day</span>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={updateField}
                  required
                />
              </label>

              <label className="field">
                <span>Best time</span>
                <select name="timeSlot" value={form.timeSlot} onChange={updateField}>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </label>

              <button type="submit" className="primary-button">
                Send availability
              </button>
            </div>
          </form>
        ) : null}

        {step === 'activities' ? (
          <form className="activities-layout" onSubmit={handleActivitySubmit}>
            <section className="calendar-card activities-panel">
              <h2>Ano gusto mooo</h2>
              <p>
                Pick lang diri, ako bahala dayon!
              </p>

              <div className="activity-grid" role="group" aria-label="Choose activities">
                {activityOptions.map((activity) => {
                  const isSelected = selectedActivities.includes(activity)

                  return (
                    <button
                      key={activity}
                      type="button"
                      className={`activity-chip ${isSelected ? 'selected' : ''}`}
                      aria-pressed={isSelected}
                      onClick={() => toggleActivity(activity)}
                    >
                      {activity}
                    </button>
                  )
                })}
              </div>

              <button type="submit" className="primary-button" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save choices'}
              </button>
              {saveError ? <p className="save-error">{saveError}</p> : null}
            </section>
          </form>
        ) : null}

        {step === 'sent' ? (
          <div className="result-card" aria-live="polite">
            <h2>Perfect. I&apos;ll use {formattedSummary}.</h2>
            <p>
              Oki, maplano na ko hahahaha
            </p>
            {savedChoice ? (
              <p className="save-meta">
                Date saved! We going {savedChoice.activities.join(', ')} sa {savedChoiceDay}
              </p>
            ) : null}
            <button type="button" className="secondary-button" onClick={() => setStep('activities')}>
              Edit activities
            </button>
          </div>
        ) : null}

        {step === 'declined' ? (
          <div className="result-card declined" aria-live="polite">
            <h2>No worries at all.</h2>
            <p>Thanks for being honest. I still appreciate you.</p>
          </div>
        ) : null}
      </section>
    </main>
  )
}

export default App
