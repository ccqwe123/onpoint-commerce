// resources/js/api.ts
import axios, { AxiosError } from "axios";

interface LaravelValidationError {
  message?: string;
  errors?: Record<string, string[]>;
}

export const put = async (url: string, data?: any) => {
  try {
    const response = await axios.put(url, data);
    return response.data;
  } catch (error) {
    const err = error as AxiosError;

    if (err.response) {
      const responseData = err.response.data as LaravelValidationError;

      // Handle validation error
      if (err.response.status === 422) {
        throw {
          status: 422,
          errors: responseData.errors || {},
          message: responseData.message || "Validation error",
        };
      }

      // Other server errors
      throw {
        status: err.response.status,
        message: responseData.message || "Something went wrong",
      };
    }

    // Network error or no response
    throw {
      status: 500,
      message: "Network error",
    };
  }
};
