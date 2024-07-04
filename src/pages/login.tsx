import { AuthPage } from "@refinedev/mui";

export const Login = () => {
  return (
    <AuthPage
      type="login"
      title={<h4>Product DB</h4>}
      registerLink={<div></div>}
      forgotPasswordLink={<div></div>}
    />
  );
};
