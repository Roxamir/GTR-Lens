import Button from "./Button";
import InputField from "./InputField";

const LoginCard = ({
  username,
  setUsername,
  password,
  setPassword,
  errors,
  loginError,
  onSubmit,
}) => {
  return (
    <div className="flex flex-col px-4 h-screen items-center justify-start md:pt-0 pt-8 md:justify-center">
      <div className="flex flex-col md:w-sm w-xs rounded-xl bg-slate-900 p-6">
        <h1 className="text-2xl font-bold mb-3 text-center">LOGIN</h1>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <InputField
            label="Username:"
            name="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={errors?.username}
          />
          <InputField
            label="Password:"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors?.password}
          />

          <Button type="submit" error={loginError}>
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginCard;
