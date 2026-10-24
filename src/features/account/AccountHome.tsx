import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logoutUser } from '../../app/auth/authSlice';

export default function AccountHome() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  return (
    <main className="min-h-screen bg-white px-6 py-10 text-[#0f1111] font-[Arial,Helvetica,sans-serif]">
      <div className="mx-auto max-w-3xl">
        <header className="flex items-center justify-between border-b border-[#ddd] pb-4">
          <h1 className="m-0 text-2xl font-normal">
            Welcome{user?.firstName ? `, ${user.firstName}` : ''}
          </h1>
          <button
            type="button"
            onClick={() => dispatch(logoutUser())}
            className="rounded border border-[#adb1b8] bg-[linear-gradient(to_bottom,#f7f8fa,#e7e9ec)] px-4 py-1.5 text-[13px]"
          >
            Sign out
          </button>
        </header>
        <p className="mt-6 text-sm text-[#565959]">
          You are signed in{user?.email ? ` as ${user.email}` : ''}.
        </p>
      </div>
    </main>
  );
}
