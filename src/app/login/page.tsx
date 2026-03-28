import { login, signup } from './actions'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#0A1628]">
      <div className="w-full max-w-md p-8 bg-gray-900 rounded-xl shadow-2xl border border-gray-800">
        <h1 className="text-3xl font-bold text-center text-white mb-8">
          Welcome to <span className="text-[#34D1BF]">GoKind</span>
        </h1>
        <form className="flex-1 flex flex-col w-full justify-center gap-4 text-white">
          <label className="text-sm font-medium" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            className="rounded-md px-4 py-3 bg-gray-800 border border-gray-700 mb-4 outline-none focus:border-[#34D1BF] transition-colors"
            name="email"
            placeholder="you@example.com"
            required
          />
          <label className="text-sm font-medium" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            className="rounded-md px-4 py-3 bg-gray-800 border border-gray-700 mb-6 outline-none focus:border-[#34D1BF] transition-colors"
            type="password"
            name="password"
            placeholder="••••••••"
            required
          />
          <div className="flex flex-col gap-3">
            <button
              formAction={login}
              className="bg-[#34D1BF] text-[#0A1628] rounded-md px-4 py-3 font-bold hover:bg-[#2bb4a4] transition-colors"
            >
              Sign In
            </button>
            <button
              formAction={signup}
              className="border border-gray-600 rounded-md px-4 py-3 text-gray-300 hover:bg-gray-800 transition-colors"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}