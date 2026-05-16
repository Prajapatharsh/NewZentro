const getHost = () => {
  if (typeof window !== "undefined") {
    return window.location.hostname;
  }
  return "localhost";
};

export const API_BASE_URL = `http://${getHost()}:5000/api/v1`;
export const AUTH_API_BASE_URL = API_BASE_URL;
export const GRAPHQL_URL = `${API_BASE_URL}/graphql`;
