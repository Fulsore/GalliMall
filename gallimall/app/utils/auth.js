export const refreshAccessToken = async () => {
  const refresh_token = localStorage.getItem("refresh_token");

  if (!refresh_token) throw new Error("No refresh token found");

  const response = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh: refresh_token }),
  });

  if (!response.ok) throw new Error("Token refresh failed");

  const data = await response.json();
  localStorage.setItem("access_token", data.access);
  return data.access;
};
