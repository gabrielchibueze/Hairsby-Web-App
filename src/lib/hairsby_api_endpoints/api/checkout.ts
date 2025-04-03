import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3500/api'

export interface CheckoutData {
  paymentMethod: string
  useWalletBalance?: boolean
  cardDetails?: {
    number: string
    expMonth: string
    expYear: string
    cvc: string
  }
  shippingAddress?: {
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
}

export async function processCheckout(data: CheckoutData): Promise<{
  success: boolean
  orderId?: string
  redirectUrl?: string
}> {
  try {
    const response = await axios.post(`${API_URL}/checkout/process`, data)
    return response.data.data
  } catch (error) {
    console.error('Error processing checkout:', error)
    throw error
  }
}

export async function validateCardDetails(cardDetails: {
  number: string
  expMonth: string
  expYear: string
  cvc: string
}): Promise<boolean> {
  // Basic validation
  const cardNumber = cardDetails.number.replace(/\s/g, '')
  const isValidNumber = /^\d{16}$/.test(cardNumber)
  const isValidMonth = /^(0[1-9]|1[0-2])$/.test(cardDetails.expMonth)
  const isValidYear = /^\d{2}$/.test(cardDetails.expYear)
  const isValidCvc = /^\d{3,4}$/.test(cardDetails.cvc)

  // Check expiration
  if (isValidMonth && isValidYear) {
    const expDate = new Date(2000 + parseInt(cardDetails.expYear), parseInt(cardDetails.expMonth) - 1)
    const now = new Date()
    if (expDate < now) {
      return false
    }
  }

  return isValidNumber && isValidMonth && isValidYear && isValidCvc
}