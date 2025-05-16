import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3500/api";

export interface CartServiceItem {
  id: string;
  type: "service";
  serviceId: string;
  quantity: number;
  name?: string;
  price?: number;
  duration?: number;
  images?: string[];
  provider?: {
    id: string;
    name: string; // businessName or firstName + lastName
  };
}

export interface CartProductItem {
  id: string;
  type: "product";
  productId: string;
  quantity: number;
  name?: string;
  price?: number;
  brand?: string;
  images?: string[];
  provider?: {
    id: string;
    name: string; // businessName or firstName + lastName
  };
}

export type CartItem = CartServiceItem | CartProductItem;

export interface Cart {
  items: CartItem[];
  total: number;
  groupedByProvider: {
    providerId: string;
    providerName: string;
    services: CartServiceItem[];
    products: CartProductItem[];
    subtotal: number;
  }[];
}

/**
 * Fetch the user's cart.
 * @returns {Promise<Cart>} - The user's cart with items and total.
 */
export async function getCart(): Promise<Cart | void> {
  try {
    const response = await axios.get(`${API_URL}/cart`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching cart:", error);
  }
}

/**
 * Add an item to the cart.
 * @param {string} type - The type of item ('service' or 'product').
 * @param {string} itemId - The ID of the item to add.
 * @param {number} quantity - The quantity of the item to add.
 * @returns {Promise<Cart>} - The updated cart.
 */
export async function addToCart(
  type: "service" | "product",
  itemId: string,
  quantity: number = 1
): Promise<Cart> {
  try {
    const response = await axios.post(`${API_URL}/cart`, {
      type,
      itemId,
      quantity,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
}

/**
 * Update the quantity of a cart item.
 * @param {string} itemId - The ID of the cart item to update.
 * @param {number} quantity - The new quantity.
 * @returns {Promise<Cart>} - The updated cart.
 */
export async function updateCartItem(
  itemId: string,
  quantity: number
): Promise<Cart> {
  try {
    const response = await axios.put(`${API_URL}/cart/${itemId}`, {
      quantity,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error updating cart item:", error);
    throw error;
  }
}

/**
 * Remove an item from the cart.
 * @param {string} itemId - The ID of the cart item to remove.
 * @returns {Promise<Cart>} - The updated cart.
 */
export async function removeFromCart(itemId: string): Promise<Cart> {
  try {
    const response = await axios.delete(`${API_URL}/cart/${itemId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error removing from cart:", error);
    throw error;
  }
}

/**
 * Clear the user's cart.
 * @returns {Promise<void>}
 */
export async function clearCart(): Promise<void> {
  try {
    await axios.delete(`${API_URL}/cart`);
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw error;
  }
}
