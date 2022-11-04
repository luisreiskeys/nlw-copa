import { useContext } from "react";

import { AuthContext, AuthContextDataProps } from "../contexts/AuthContext";

export function useAuth(): AuthContextDataProps {
  const contexts = useContext(AuthContext);

  return contexts;
}
