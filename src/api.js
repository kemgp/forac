const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'
const INVITE_CHOICES_PATH = `${API_BASE_URL}/invite-choices`

async function request(path, options = {}) {
  const response = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  })

  if (!response.ok) {
    const message = await response.text()

    throw new Error(message || `Request failed with status ${response.status}`)
  }

  if (response.status === 204) return null

  return response.json()
}

export function getInviteChoices() {
  return request(INVITE_CHOICES_PATH)
}

export function getInviteChoiceById(id) {
  return request(`${INVITE_CHOICES_PATH}/${id}`)
}

export function createInviteChoice(choice) {
  return request(INVITE_CHOICES_PATH, {
    method: 'POST',
    body: JSON.stringify(choice),
  })
}

export function updateInviteChoice(id, updates) {
  return request(`${INVITE_CHOICES_PATH}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  })
}

export function deleteInviteChoice(id) {
  return request(`${INVITE_CHOICES_PATH}/${id}`, {
    method: 'DELETE',
  })
}

export function clearInviteChoices() {
  return request(INVITE_CHOICES_PATH, {
    method: 'DELETE',
  })
}