import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Activity } from 'lucide-react';

export function Login() {
  const { user, login, loading, error } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-transparent">Loading...</div>;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen bg-transparent">
      <div className="flex flex-col justify-center flex-1 px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="w-full max-w-sm mx-auto lg:w-96">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 text-white">
              <Activity className="w-7 h-7" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">SUGU Health</h2>
          </div>

          <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-slate-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Your personal digital health companion
          </p>

          {error === 'unauthorized-domain' && (
            <div className="mt-6 p-4 bg-rose-50 border border-rose-200 rounded-xl">
              <h3 className="text-sm font-semibold text-rose-800 mb-2">Configuration Required</h3>
              <p className="text-sm text-rose-700 mb-3">
                Your Firebase project is blocking sign-ins from this preview URL. To fix this:
              </p>
              <ol className="list-decimal list-inside text-xs text-rose-700 space-y-2">
                <li>Go to the <a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer" className="underline font-medium">Firebase Console</a></li>
                <li>Open your project (<b>sugu-health</b>)</li>
                <li>Go to <b>Authentication</b> &gt; <b>Settings</b> &gt; <b>Authorized domains</b></li>
                <li>Click <b>Add domain</b> and add these two exact domains:</li>
              </ol>
              <div className="mt-3 space-y-2">
                <code className="block p-2 bg-white rounded border border-rose-100 text-[10px] break-all select-all">
                  ais-dev-qbt6ivfhmgd6ji6dcm5som-731544752465.asia-southeast1.run.app
                </code>
                <code className="block p-2 bg-white rounded border border-rose-100 text-[10px] break-all select-all">
                  ais-pre-qbt6ivfhmgd6ji6dcm5som-731544752465.asia-southeast1.run.app
                </code>
              </div>
            </div>
          )}

          {error === 'operation-not-allowed' && (
            <div className="mt-6 p-4 bg-rose-50 border border-rose-200 rounded-xl">
              <h3 className="text-sm font-semibold text-rose-800 mb-2">Google Sign-In Disabled</h3>
              <p className="text-sm text-rose-700 mb-3">
                Google Sign-In is not enabled for your Firebase project. To fix this:
              </p>
              <ol className="list-decimal list-inside text-xs text-rose-700 space-y-2">
                <li>Go to the <a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer" className="underline font-medium">Firebase Console</a></li>
                <li>Open your project (<b>sugu-health</b>)</li>
                <li>Go to <b>Authentication</b> &gt; <b>Sign-in method</b></li>
                <li>Click <b>Add new provider</b> and select <b>Google</b></li>
                <li>Enable it, choose a support email, and click <b>Save</b></li>
              </ol>
            </div>
          )}

          {error === 'cancelled-popup-request' && (
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-sm text-amber-800">
                Sign-in was cancelled. Please try again.
              </p>
            </div>
          )}

          {error === 'popup-blocked' && (
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <h3 className="text-sm font-semibold text-amber-800 mb-2">Popup Blocked</h3>
              <p className="text-sm text-amber-700">
                Your browser blocked the sign-in popup. Please allow popups for this site in your browser settings and try again.
              </p>
            </div>
          )}

          {error && !['unauthorized-domain', 'operation-not-allowed', 'cancelled-popup-request', 'popup-blocked'].includes(error) && (
            <div className="mt-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700">
              {error}
            </div>
          )}

          <div className="mt-10">
            <div>
              <button
                onClick={login}
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-white px-4 py-3.5 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus-visible:ring-transparent transition-all"
              >
                <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                  <path
                    d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                    fill="#EA4335"
                  />
                  <path
                    d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26538 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                    fill="#34A853"
                  />
                </svg>
                <span className="text-sm font-semibold leading-6">Continue with Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          alt="Medical background"
        />
        <div className="absolute inset-0 bg-indigo-600/40 mix-blend-multiply" />
      </div>
    </div>
  );
}
