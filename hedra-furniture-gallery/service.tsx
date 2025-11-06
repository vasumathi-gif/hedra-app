import axios from 'axios';

// Base URL for API requests (adjust it as per your backend URL)
// ✅ Auto-detect environment (local vs production)
export const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:8000/api/"
    : "https://hedra-app-2.onrender.com/api/";


/**
 * Makes a POST request without a token (for login or other unauthenticated endpoints).
 * @param {string} endpoint - The endpoint to which the request will be made.
 * @param {object} payload - The data to be sent in the request body.
 * @param {string|null} token - The JWT token for authenticated requests, default is null.
 * @returns {object} The response data from the API.
 */

export const apiPostRequest = async (endpoint, payload, token = null) => {
  try {
    if (!token) {
      const user = JSON.parse(localStorage.getItem('adminUser') || '{}');
      token = user.token;
    }

    const headers = token
      ? { Authorization: `Bearer ${token}` }
      : {};

    const response = await axios.post(`${API_BASE_URL}${endpoint}`, payload, { headers });
    console.log(response)
    return response.data;
  } catch (error) {
    console.error(`❌ Error on POST ${endpoint}:`, error.response || error.message);
    throw error;
  }
};

/**
 * Makes a POST request to upload an Excel file.
 * @param {string} endpoint - The endpoint to which the request will be made.
 * @param {FormData} formData - The form data containing the Excel file.
 * @param {string} token - The JWT token for authenticated requests.
 * @returns {object} The response data from the API.
 */
export const apiUploadExcel = async (endpoint, formData, token) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}${endpoint}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`❌ Error on Excel upload (${endpoint}):`, error.response || error.message);
    throw error;
  }
};

/**
 * Makes a GET request to fetch data from the API.
 * @param {string} endpoint - The endpoint to which the GET request will be made.
 * @param {string} token - The JWT token for authenticated requests.
 * @returns {object} The response data from the API.
 */
export const apiGetRequest = async (endpoint, token) => {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.get(`${API_BASE_URL}${endpoint}`, { headers });
    return response.data;
  } catch (error) {
    console.error(`❌ Error on GET ${endpoint}:`, error.response || error.message);
    return { success: false, message: error.message }; // Return a consistent error object
  }
};

/**
 * Makes a PUT request to update data on the API.
 * @param {string} endpoint - The endpoint to which the PUT request will be made.
 * @param {object} payload - The data to be updated.
 * @param {string} token - The JWT token for authenticated requests.
 * @returns {object} The response data from the API.
 */
export const apiPutRequest = async (endpoint, payload, token) => {
  try {
    const headers = {
      Authorization: `Bearer ${token || localStorage.getItem('authToken')}`,
      // Axios will set this automatically if payload is FormData
      ...(payload instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    };

    const response = await axios.put(`${API_BASE_URL}${endpoint}`, payload, {
      headers,
    });

    return response.data;
  } catch (error) {
    console.error(`❌ Error on PUT ${endpoint}:`, error.response?.data || error.message);
    throw error;
  }
};

/**
 * Makes a DELETE request to remove data from the API.
 * @param {string} endpoint - The endpoint to which the DELETE request will be made.
 * @param {string} token - The JWT token for authenticated requests.
 * @returns {object} The response data from the API.
 */
export const apiDeleteRequest = async (endpoint, token) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(`❌ Error on DELETE ${endpoint}:`, error.response || error.message);
    throw error;
  }
};
