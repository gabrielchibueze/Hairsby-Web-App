import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3500/api'

export interface Wallet {
  balance: number
  paymentMethods: Array<{
    id: string
    last4: string
    expMonth: string
    expYear: string
    isDefault: boolean
  }>
}

export interface Transaction {
  id: string
  type: 'credit' | 'debit'
  amount: number
  description: string
  date: string
}

export async function getWallet() {
  try {
    const response = await axios.get(`${API_URL}/wallet`)
    return response.data.data
  } catch (error) {
    console.error('Error fetching wallet:', error)
    // Return dummy data if API fails
    return {
      balance: 250.00,
      paymentMethods: [
        {
          id: '1',
          last4: '4242',
          expMonth: '12',
          expYear: '25',
          isDefault: true
        }
      ]
    }
  }
}

export async function getTransactions({ type }: { type?: string } = {}) {
  try {
    const response = await axios.get(`${API_URL}/wallet/transactions`, {
      params: { type }
    })
    return response.data.data
  } catch (error) {
    console.error('Error fetching transactions:', error)
    // Return dummy data if API fails
    return [
      {
        id: '1',
        type: 'credit',
        amount: 100.00,
        description: 'Added funds',
        date: '2025-02-25T10:00:00Z'
      },
      {
        id: '2',
        type: 'debit',
        amount: -75.00,
        description: 'Payment for appointment',
        date: '2025-02-24T15:30:00Z'
      }
    ]
  }
}

export async function addFunds({ amount, paymentMethodId }: { amount: number, paymentMethodId: string }) {
  try {
    const response = await axios.post(`${API_URL}/wallet/deposit`, {
      amount,
      paymentMethodId
    })
    return response.data.data
  } catch (error) {
    console.error('Error adding funds:', error)
    throw error
  }
}

export async function addPaymentMethod(paymentMethodId: string) {
  try {
    const response = await axios.post(`${API_URL}/wallet/payment-methods`, {
      paymentMethodId
    })
    return response.data.data
  } catch (error) {
    console.error('Error adding payment method:', error)
    throw error
  }
}

export async function removePaymentMethod(id: string) {
  try {
    const response = await axios.delete(`${API_URL}/wallet/payment-methods/${id}`)
    return response.data.data
  } catch (error) {
    console.error('Error removing payment method:', error)
    throw error
  }
}

export async function setDefaultPaymentMethod(id: string) {
  try {
    const response = await axios.put(`${API_URL}/wallet/payment-methods/${id}/default`)
    return response.data.data
  } catch (error) {
    console.error('Error setting default payment method:', error)
    throw error
  }
}