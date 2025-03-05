import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3500/api'

export interface Provider {
  id: string
  businessName: string
  firstName: string
  lastName: string
  email: string
  phone: string
  photo: string
  rating: number
  address: string
  city: string
  country: string
  gallery: {
    id: string
    url: string
    caption: string
  }[]
  services: {
    id: string
    name: string
    price: number
  }[]
}

export async function getTopProviders(): Promise<Provider[]> {
  try {
    const response = await axios.get(`${API_URL}/providers/top`)
    return response.data.data
  } catch (error) {
    console.error('Error fetching top providers:', error)
    // Return dummy data if API fails
    return [
      {
        id: '1',
        businessName: 'Luxe Hair Studio',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah@luxehair.com',
        phone: '+44 20 1234 5678',
        photo: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1974&auto=format&fit=crop',
        rating: 4.8,
        address: '123 Beauty Lane',
        city: 'London',
        country: 'UK',
        gallery: [
          {
            id: '1',
            url: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=1974&auto=format&fit=crop',
            caption: 'Bridal Hair Styling'
          }
        ],
        services: [
          {
            id: '1',
            name: 'Hair Styling',
            price: 75.00
          }
        ]
      },
      {
        id: '2',
        businessName: 'Glam Squad',
        firstName: 'Emily',
        lastName: 'Wilson',
        email: 'emily@glamsquad.com',
        phone: '+44 20 2345 6789',
        photo: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=1974&auto=format&fit=crop',
        rating: 4.9,
        address: '456 Makeup Ave',
        city: 'Manchester',
        country: 'UK',
        gallery: [
          {
            id: '1',
            url: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=1974&auto=format&fit=crop',
            caption: 'Wedding Makeup'
          }
        ],
        services: [
          {
            id: '2',
            name: 'Professional Makeup',
            price: 85.00
          }
        ]
      }
    ]
  }
}