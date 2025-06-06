import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3500/api";

export interface FavoriteService {
  id: string;
  serviceId: string;
  providerId: string;
  type: "service";
  service: {
    id: string;
    name: string;
    description: string;
    price: number;
    discountPrice?: number;
    images: Array<any>;
    provider: {
      id: string;
      firstName: string;
      lastName: string;
      businessName: string;
    };
  };
}

export interface FavoriteProduct {
  id: string;
  productId: string;
  providerId: string;
  type: "product";
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    discountPrice?: number;
    images: Array<any>;
    provider: {
      id: string;
      firstName: string;
      lastName: string;
      businessName: string;
    };
  };
}

export interface FavoriteProvider {
  id: string;
  providerId: string;
  type: "provider";
  provider: {
    id: string;
    firstName: string;
    lastName: string;
    businessName: string;
    rating: number;
    photo: string;
  };
}

export interface FavoritePagination {
  total: number;
  page: number;
  totalPages: number;
}

// ==================== Favorite Services ====================

/**
 * Fetch favorite services for the current user.
 * @param {number} page - The page number for pagination.
 * @param {number} limit - The number of items per page.
 * @returns {Promise<{ favorites: FavoriteService[]; pagination: FavoritePagination }>} - List of favorite services and pagination details.
 */
export async function getFavoriteServices(
  page: number = 1,
  limit: number = 10
): Promise<{ favorites: FavoriteService[]; pagination: FavoritePagination }> {
  try {
    const response = await axios.get(`${API_URL}/favorites/services`, {
      params: { page, limit },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching favorite services:", error);
    return { favorites: [], pagination: { total: 0, page: 1, totalPages: 1 } };
  }
}

/**
 * Add a service to favorites.
 * @param {string} serviceId - The ID of the service to add.
 * @returns {Promise<FavoriteService>} - The added favorite service.
 */
export async function addServiceToFavorites(
  serviceId: string
): Promise<FavoriteService> {
  try {
    const response = await axios.post(
      `${API_URL}/favorites/services/${serviceId}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error adding service to favorites:", error);
    throw error;
  }
}

/**
 * Remove a service from favorites.
 * @param {string} serviceId - The ID of the service to remove.
 * @returns {Promise<void>}
 */
export async function removeServiceFromFavorites(
  serviceId: string
): Promise<void> {
  try {
    await axios.delete(`${API_URL}/favorites/services/${serviceId}`);
  } catch (error) {
    console.error("Error removing service from favorites:", error);
    throw error;
  }
}

// ==================== Favorite Products ====================

/**
 * Fetch favorite products for the current user.
 * @param {number} page - The page number for pagination.
 * @param {number} limit - The number of items per page.
 * @returns {Promise<{ favorites: FavoriteProduct[]; pagination: FavoritePagination }>} - List of favorite products and pagination details.
 */
export async function getFavoriteProducts(
  page: number = 1,
  limit: number = 10
): Promise<{ favorites: FavoriteProduct[]; pagination: FavoritePagination }> {
  try {
    const response = await axios.get(`${API_URL}/favorites/products`, {
      params: { page, limit },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching favorite products:", error);
    return { favorites: [], pagination: { total: 0, page: 1, totalPages: 1 } };
  }
}

/**
 * Add a product to favorites.
 * @param {string} productId - The ID of the product to add.
 * @returns {Promise<FavoriteProduct>} - The added favorite product.
 */
export async function addProductToFavorites(
  productId: string
): Promise<FavoriteProduct> {
  try {
    const response = await axios.post(
      `${API_URL}/favorites/products/${productId}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error adding product to favorites:", error);
    throw error;
  }
}

/**
 * Remove a product from favorites.
 * @param {string} productId - The ID of the product to remove.
 * @returns {Promise<void>}
 */
export async function removeProductFromFavorites(
  productId: string
): Promise<void> {
  try {
    await axios.delete(`${API_URL}/favorites/products/${productId}`);
  } catch (error) {
    console.error("Error removing product from favorites:", error);
    throw error;
  }
}

// ==================== Favorite Providers ====================

/**
 * Fetch favorite providers for the current user.
 * @param {number} page - The page number for pagination.
 * @param {number} limit - The number of items per page.
 * @returns {Promise<{ favorites: FavoriteProvider[]; pagination: FavoritePagination }>} - List of favorite providers and pagination details.
 */
export async function getFavoriteProviders(
  page: number = 1,
  limit: number = 10
): Promise<{ favorites: FavoriteProvider[]; pagination: FavoritePagination }> {
  try {
    const response = await axios.get(`${API_URL}/favorites/providers`, {
      params: { page, limit },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching favorite providers:", error);
    return { favorites: [], pagination: { total: 0, page: 1, totalPages: 1 } };
  }
}

/**
 * Add a provider to favorites.
 * @param {string} providerId - The ID of the provider to add.
 * @returns {Promise<FavoriteProvider>} - The added favorite provider.
 */
export async function addProviderToFavorites(
  providerId: string
): Promise<FavoriteProvider> {
  try {
    const response = await axios.post(
      `${API_URL}/favorites/providers/${providerId}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error adding provider to favorites:", error);
    throw error;
  }
}

/**
 * Remove a provider from favorites.
 * @param {string} providerId - The ID of the provider to remove.
 * @returns {Promise<void>}
 */
export async function removeProviderFromFavorites(
  providerId: string
): Promise<void> {
  try {
    await axios.delete(`${API_URL}/favorites/providers/${providerId}`);
  } catch (error) {
    console.error("Error removing provider from favorites:", error);
    throw error;
  }
}
