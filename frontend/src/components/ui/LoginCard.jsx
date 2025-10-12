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
    <div className="flex flex-col px-4">
      <div className="flex flex-col m-auto w-full max-w-md rounded-xl bg-slate-900 p-6 items-center shadow-lg">
        <div className="p-6 w-full max-w-full">
          <h1 className="text-2xl font-bold mb-3 text-center">LOGIN</h1>

          <form onSubmit={onSubmit} className="flex flex-col gap-4 w-full">
            <InputField
              label="Username:"
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={errors.username}
            />
            <InputField
              label="Password:"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
            />

            <Button type="submit" error={loginError}>
              Login
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginCard;
