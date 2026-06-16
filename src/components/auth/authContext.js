import { createContext, useContext } from "react";

export const AuthContext = createContext({
  session: null,
  user: null,
  displayName: "Giáo viên",
  email: "",
  signOutUser: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function getUserDisplayName(user) {
  if (!user) return "Giáo viên";

  return (
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")?.[0] ||
    "Giáo viên"
  );
}
