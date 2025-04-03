import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3500/api";

// Helper function to handle errors
const handleError = (error: any) => {
  console.error("API Error:", error);
  throw error;
};

// ==================== Business Analytics ====================

/**
 * Get business overview analytics.
 
 * @param startDate - Optional start date for filtering.
 * @param endDate - Optional end date for filtering.
 */
export const getBusinessOverview = async (
  startDate?: string,
  endDate?: string
) => {
  try {
    const response = await axios.get(`${API_URL}/analytics/business/overview`, {
      params: { startDate, endDate },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * Get revenue analytics for a business.
 * @param startDate - Optional start date for filtering.
 * @param endDate - Optional end date for filtering.
 */
export const getBusinessRevenueAnalytics = async (
  startDate?: string,
  endDate?: string
) => {
  try {
    const response = await axios.get(`${API_URL}/analytics/business/revenue`, {
      params: { startDate, endDate },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * Get service analytics for a business.
 * @param startDate - Optional start date for filtering.
 * @param endDate - Optional end date for filtering.
 */
export const getBusinessServiceAnalytics = async (
  startDate?: string,
  endDate?: string
) => {
  try {
    const response = await axios.get(`${API_URL}/analytics/business/services`, {
      params: { startDate, endDate },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * Get specialist performance analytics for a business.
 * @param startDate - Optional start date for filtering.
 * @param endDate - Optional end date for filtering.
 */
export const getSpecialistPerformanceForBusiness = async (
  startDate?: string,
  endDate?: string
) => {
  try {
    const response = await axios.get(
      `${API_URL}/analytics/business/specialists`,
      { params: { startDate, endDate } }
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * Get customer analytics for a business.
 
 * @param startDate - Optional start date for filtering.
 * @param endDate - Optional end date for filtering.
 */
export const getCustomerAnalytics = async (
  startDate?: string,
  endDate?: string
) => {
  try {
    const response = await axios.get(
      `${API_URL}/analytics/business/customers`,
      {
        params: { startDate, endDate },
      }
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// ==================== Specialist Analytics ====================

/**
 * Get specialist overview analytics.
 * @param startDate - Optional start date for filtering.
 * @param endDate - Optional end date for filtering.
 */
export const getSpecialistOverview = async (
  startDate?: string,
  endDate?: string
) => {
  try {
    const response = await axios.get(
      `${API_URL}/analytics/specialist/overview`,
      { params: { startDate, endDate } }
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * Get performance metrics for a specialist.
 * @param startDate - Optional start date for filtering.
 * @param endDate - Optional end date for filtering.
 */
export const getPerformanceMetrics = async (
  startDate?: string,
  endDate?: string
) => {
  try {
    const response = await axios.get(
      `${API_URL}/analytics/specialist/performance`,
      { params: { startDate, endDate } }
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * Get service performance analytics for a specialist.
 * @param startDate - Optional start date for filtering.
 * @param endDate - Optional end date for filtering.
 */
export const getServicePerformance = async (
  startDate?: string,
  endDate?: string
) => {
  try {
    const response = await axios.get(
      `${API_URL}/analytics/specialist/services`,
      { params: { startDate, endDate } }
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * Get customer insights for a specialist.
 * @param startDate - Optional start date for filtering.
 * @param endDate - Optional end date for filtering.
 */
export const getCustomerInsights = async (
  startDate?: string,
  endDate?: string
) => {
  try {
    const response = await axios.get(
      `${API_URL}/analytics/specialist/customers`,
      { params: { startDate, endDate } }
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
