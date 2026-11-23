export const backendURL = "http://127.0.0.1:8000/";
// export const backendURL = "https://blg-fast.onrender.com/";

const APIConfig = {
  baseURL: backendURL + "api/",
  headers: {
    "Content-Type": "application/json",
  },
};

export default APIConfig;