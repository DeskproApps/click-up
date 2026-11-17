import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { onAuthError } from "../services/clickUp/authErrorEvents";

/** Routes where an auth error is expected, so the agent stays put */
const NO_REDIRECT_PATHS = ["/login", "/admin/callback"];

const shouldRedirectToLogin = (pathname: string): boolean => {
  return !NO_REDIRECT_PATHS.includes(pathname);
};

/**
 * Send the agent to the login page whenever ClickUp rejects their access token, from any
 * request. Without this, a token revoked while the sidebar is open leaves pages showing
 * empty results or an error instead of asking the agent to log in again.
 */
const useAuthErrorRedirect = (): void => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const pathnameRef = useRef(pathname);

  pathnameRef.current = pathname;

  useEffect(() => onAuthError(() => {
    if (shouldRedirectToLogin(pathnameRef.current)) {
      navigate("/login");
    }
  }), [navigate]);
};

export { useAuthErrorRedirect, shouldRedirectToLogin };
