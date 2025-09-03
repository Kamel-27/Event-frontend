import { logout as logoutAPI } from "../api";

export const logout = async () => {
  try {
    const res = await logoutAPI();

    if (res.data.success) {
      localStorage.removeItem("user");
      window.location.href = "/login";
    } else {
      console.error("Logout failed:", res.data.message);
      // Still redirect even if API call fails
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  } catch (error) {
    console.error("Logout error:", error);
    // Still redirect even if API call fails
    localStorage.removeItem("user");
    window.location.href = "/login";
  }
};
