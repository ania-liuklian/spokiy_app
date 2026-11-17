import { FormEvent, ReactNode, useEffect, useState } from "react";

type IconName =
  | "activity"
  | "battery"
  | "bluetooth"
  | "chevron"
  | "close"
  | "dashboard"
  | "device"
  | "logout"
  | "profile"
  | "steps";

function Icon({ name, className = "h-5 w-5" }: { name: IconName; className?: string }) {
  const paths: Record<IconName, ReactNode> = {
    activity: <path d="M3 12h4l2.5-7 5 14 2.5-7h4" />,
    battery: (
      <>
        <rect x="3" y="7" width="16" height="10" rx="2" />
        <path d="M21 10v4M6 10h7" />
      </>
    ),
    bluetooth: <path d="m7 7 10 10-5 4V3l5 4L7 17" />,
    chevron: <path d="m9 18 6-6-6-6" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    dashboard: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="2" />
        <rect x="14" y="3" width="7" height="7" rx="2" />
        <rect x="3" y="14" width="7" height="7" rx="2" />
        <rect x="14" y="14" width="7" height="7" rx="2" />
      </>
    ),
    device: (
      <>
        <rect x="7" y="2.5" width="10" height="19" rx="3" />
        <path d="M10 6h4M11 18h2" />
      </>
    ),
    logout: (
      <>
        <path d="M10 17l5-5-5-5M15 12H3" />
        <path d="M14 4h5a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-5" />
      </>
    ),
    profile: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),
    steps: (
      <>
        <path d="M8 13c-2 0-4 2-4 4s2 3 4 2 3-4 2-5c-.4-.7-1.2-1-2-1ZM15 4c-2 0-3 2-3 4s1 3 3 3 4-1 4-3-2-4-4-4Z" />
      </>
    ),
  };
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

const days = [
  { day: "Mon", value: 54 },
  { day: "Tue", value: 78 },
  { day: "Wed", value: 62 },
  { day: "Thu", value: 88 },
  { day: "Fri", value: 68 },
  { day: "Sat", value: 96 },
  { day: "Sun", value: 80 },
];

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [page, setPage] = useState<"dashboard" | "profile">("dashboard");
  const [showPassword, setShowPassword] = useState(false);
  const [connectOpen, setConnectOpen] = useState(false);
  const [connection, setConnection] = useState<"idle" | "scanning" | "found" | "connected">("idle");
  const [saved, setSaved] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    if (connection !== "scanning") return;
    const timer = window.setTimeout(() => setConnection("found"), 1800);
    return () => window.clearTimeout(timer);
  }, [connection]);

  function login(event: FormEvent) {
    event.preventDefault();
    setLoggedIn(true);
  }

  function logout() {
    setLoggedIn(false);
    setPage("dashboard");
    setConnection("idle");
  }

  if (!loggedIn) {
    return (
      <main className="min-h-screen bg-[#f4f7f4] text-[#15221c] lg:grid lg:grid-cols-[1.08fr_.92fr]">
        <section className="relative hidden min-h-screen overflow-hidden bg-[#10261d] p-14 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-36 -top-40 h-[520px] w-[520px] rounded-full border border-white/10" />
          <div className="absolute -right-16 -top-20 h-[350px] w-[350px] rounded-full border border-white/10" />
          <div className="absolute bottom-20 left-28 h-52 w-52 rounded-full bg-[#a8e063]/10 blur-3xl" />
          <div className="relative flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#a8e063] text-[#173023]">
              <Icon name="activity" />
            </div>
            <span className="text-xl font-bold tracking-tight">spokiy</span>
          </div>
          <div className="relative max-w-xl pb-10">
            <div className="mb-8 flex h-64 items-end gap-3 rounded-[28px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur">
              {[42, 61, 53, 78, 67, 91, 76, 100, 83].map((height, index) => (
                <div key={index} className="flex-1 rounded-full bg-white/10 p-1">
                  <div
                    className="w-full rounded-full bg-gradient-to-t from-[#70bd55] to-[#b4ea6c]"
                    style={{ height: `${height * 1.7}px` }}
                  />
                </div>
              ))}
            </div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[.2em] text-[#a8e063]">
              Powered by STM32
            </p>
            <h1 className="text-5xl font-semibold leading-[1.08] tracking-[-.04em]">
              Move better.
              <br />
              Know your body.
            </h1>
            <p className="mt-6 max-w-md text-lg leading-8 text-white/60">
              Your daily activity, health insights, and progress—captured precisely from your
              wearable.
            </p>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-12">
          <div className="w-full max-w-[430px]">
            <div className="mb-12 flex items-center gap-3 lg:hidden">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#214f39] text-white">
                <Icon name="activity" />
              </div>
              <span className="text-xl font-bold">spokiy</span>
            </div>
            <div className="mb-9">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[.18em] text-[#4d7c5d]">
                Welcome back
              </p>
              <h2 className="text-4xl font-semibold tracking-[-.04em]">Sign in to your account</h2>
              <p className="mt-3 text-[#68746e]">Continue tracking your movement and progress.</p>
            </div>
            <form onSubmit={login} className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold">Email address</span>
                <input
                  required
                  type="email"
                  defaultValue="alex.morgan@example.com"
                  className="w-full rounded-xl border border-[#d9e0dc] bg-white px-4 py-3.5 outline-none transition focus:border-[#346b4b] focus:ring-4 focus:ring-[#346b4b]/10"
                />
              </label>
              <label className="block">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-semibold">Password</span>
                  <button
                    type="button"
                    className="text-sm font-semibold text-[#346b4b] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    defaultValue="spokiy"
                    className="w-full rounded-xl border border-[#d9e0dc] bg-white px-4 py-3.5 pr-16 outline-none transition focus:border-[#346b4b] focus:ring-4 focus:ring-[#346b4b]/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-4 text-xs font-bold uppercase tracking-wider text-[#66736d]"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </label>
              <label className="flex items-center gap-3 text-sm text-[#54615b]">
                <input type="checkbox" defaultChecked className="h-4 w-4 accent-[#214f39]" />
                Keep me signed in
              </label>
              <button className="w-full rounded-xl bg-[#214f39] py-4 font-semibold text-white shadow-lg shadow-[#214f39]/15 transition hover:bg-[#183c2b]">
                Sign in
              </button>
            </form>
            <p className="mt-8 text-center text-sm text-[#6c7772]">
              New to spokiy?{" "}
              <button
                onClick={() => setLoggedIn(true)}
                className="font-bold text-[#285b40] hover:underline"
              >
                Create an account
              </button>
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7f5] text-[#18251f]">
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-[#11291f] p-5 text-white transition-transform lg:translate-x-0 ${mobileMenu ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="mb-12 flex items-center gap-3 px-2 pt-2">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#a8e063] text-[#173023]">
            <Icon name="activity" />
          </div>
          <span className="text-xl font-bold tracking-tight">spokiy</span>
          <button onClick={() => setMobileMenu(false)} className="ml-auto lg:hidden">
            <Icon name="close" />
          </button>
        </div>
        <nav className="space-y-2">
          {[
            { id: "dashboard" as const, label: "Overview", icon: "dashboard" as const },
            { id: "profile" as const, label: "My profile", icon: "profile" as const },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setPage(item.id);
                setMobileMenu(false);
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${page === item.id ? "bg-white/12 text-white" : "text-white/55 hover:bg-white/5 hover:text-white"}`}
            >
              <Icon name={item.icon} className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="mt-auto">
          <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-medium text-white/50">DEVICE STATUS</span>
              <span
                className={`h-2 w-2 rounded-full ${connection === "connected" ? "bg-[#a8e063]" : "bg-white/25"}`}
              />
            </div>
            <p className="text-sm font-semibold">
              {connection === "connected" ? "MoveBand S3" : "No device connected"}
            </p>
            <button
              onClick={() => setConnectOpen(true)}
              className="mt-1 text-xs font-semibold text-[#a8e063]"
            >
              {connection === "connected" ? "Manage device" : "Connect now"}
            </button>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 px-4 py-3 text-sm font-semibold text-white/50 hover:text-white"
          >
            <Icon name="logout" />
            Sign out
          </button>
        </div>
      </aside>

      <main className="min-h-screen lg:ml-64">
        <header className="flex h-20 items-center justify-between border-b border-[#e2e7e3] bg-white/80 px-5 backdrop-blur sm:px-8 lg:px-10">
          <button
            onClick={() => setMobileMenu(true)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-[#dfe5e1] lg:hidden"
          >
            <span className="text-xl">≡</span>
          </button>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold uppercase tracking-[.15em] text-[#7a857f]">
              {page === "dashboard" ? "Tuesday, June 17" : "Account"}
            </p>
            <h1 className="mt-1 text-xl font-bold">
              {page === "dashboard" ? "Good morning, Alex" : "Your profile"}
            </h1>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={() => setConnectOpen(true)}
              className={`hidden items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold sm:flex ${connection === "connected" ? "bg-[#e9f4e9] text-[#2e6343]" : "bg-[#214f39] text-white"}`}
            >
              <Icon name="bluetooth" className="h-4 w-4" />
              {connection === "connected" ? "MoveBand S3" : "Connect device"}
            </button>
            <button
              onClick={() => setPage("profile")}
              className="grid h-11 w-11 place-items-center rounded-full bg-[#dce9df] text-sm font-bold text-[#28573d]"
            >
              AM
            </button>
          </div>
        </header>

        {page === "dashboard" ? (
          <div className="mx-auto max-w-[1380px] p-5 sm:p-8 lg:p-10">
            <section className="mb-8 overflow-hidden rounded-[28px] bg-[#183d2c] text-white">
              <div className="grid items-center gap-8 p-7 sm:p-9 lg:grid-cols-[1fr_auto]">
                <div>
                  <div className="mb-5 flex items-center gap-2 text-sm text-white/60">
                    <span className="h-2 w-2 rounded-full bg-[#a8e063]" />
                    Today’s progress
                  </div>
                  <div className="flex flex-wrap items-end gap-x-12 gap-y-5">
                    <div>
                      <p className="text-5xl font-semibold tracking-[-.05em]">8,462</p>
                      <p className="mt-2 text-sm text-white/55">of 10,000 daily steps</p>
                    </div>
                    <div className="pb-1">
                      <p className="text-2xl font-semibold">84%</p>
                      <p className="mt-1 text-xs text-white/45">Goal completed</p>
                    </div>
                  </div>
                  <div className="mt-7 h-2 max-w-2xl overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-[84%] rounded-full bg-[#a8e063]" />
                  </div>
                </div>
                <div className="relative mx-auto grid h-36 w-36 place-items-center rounded-full border-[9px] border-white/10">
                  <div className="absolute inset-[-9px] rounded-full border-[9px] border-transparent border-r-[#a8e063] border-t-[#a8e063] rotate-45" />
                  <div className="text-center">
                    <Icon name="steps" className="mx-auto h-7 w-7 text-[#a8e063]" />
                    <span className="mt-1 block text-xs text-white/55">1,538 to go</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.55fr_1fr]">
              <article className="rounded-2xl border border-[#e3e8e4] bg-white p-6">
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <h2 className="font-bold">Weekly activity</h2>
                    <p className="mt-1 text-sm text-[#7a857f]">Steps across the last 7 days</p>
                  </div>
                  <button className="flex items-center gap-1 text-sm font-semibold text-[#526159]">
                    This week{" "}
                    <span className="rotate-90">
                      <Icon name="chevron" className="h-4 w-4" />
                    </span>
                  </button>
                </div>
                <div className="flex h-52 items-end gap-3 sm:gap-5">
                  {days.map((day, index) => (
                    <div key={day.day} className="flex h-full flex-1 flex-col justify-end gap-3">
                      <div className="relative flex-1 rounded-lg bg-[#f2f5f2]">
                        <div
                          className={`absolute inset-x-0 bottom-0 rounded-lg ${index === 5 ? "bg-[#214f39]" : "bg-[#a9d39d]"}`}
                          style={{ height: `${day.value}%` }}
                        />
                      </div>
                      <span className="text-center text-xs font-medium text-[#7b867f]">
                        {day.day}
                      </span>
                    </div>
                  ))}
                </div>
              </article>
              <article className="rounded-2xl border border-[#e3e8e4] bg-white p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="font-bold">Device health</h2>
                    <p className="mt-1 text-sm text-[#7a857f]">
                      {connection === "connected" ? "MoveBand S3" : "Connect to sync data"}
                    </p>
                  </div>
                  <Icon name="device" className="text-[#50725e]" />
                </div>
                {connection === "connected" ? (
                  <div className="space-y-5">
                    <div className="rounded-xl bg-[#f4f7f4] p-4">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-2 font-semibold">
                          <Icon name="battery" className="h-4 w-4" />
                          Battery
                        </span>
                        <span className="font-bold text-[#347049]">78%</span>
                      </div>
                      <div className="mt-3 h-1.5 rounded-full bg-[#dce4dd]">
                        <div className="h-full w-[78%] rounded-full bg-[#65a66f]" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-xl border border-[#e5e9e6] p-4">
                        <p className="text-[#7a857f]">Last sync</p>
                        <p className="mt-1 font-semibold">Just now</p>
                      </div>
                      <div className="rounded-xl border border-[#e5e9e6] p-4">
                        <p className="text-[#7a857f]">Firmware</p>
                        <p className="mt-1 font-semibold">v2.4.1</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setConnectOpen(true)}
                    className="flex min-h-40 w-full flex-col items-center justify-center rounded-xl border border-dashed border-[#cad5cd] bg-[#f8faf8] text-center"
                  >
                    <span className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-[#e4efe6] text-[#39694d]">
                      <Icon name="bluetooth" />
                    </span>
                    <span className="font-semibold">Pair your STM32 device</span>
                    <span className="mt-1 text-xs text-[#7b867f]">Tap to start discovering</span>
                  </button>
                )}
              </article>
            </section>
          </div>
        ) : (
          <div className="mx-auto max-w-5xl p-5 sm:p-8 lg:p-10">
            <div className="mb-8">
              <h2 className="text-3xl font-semibold tracking-[-.03em]">Personal information</h2>
              <p className="mt-2 text-[#748078]">Manage your details and health preferences.</p>
            </div>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                setSaved(true);
                window.setTimeout(() => setSaved(false), 2500);
              }}
              className="overflow-hidden rounded-2xl border border-[#e1e7e2] bg-white"
            >
              <div className="flex flex-col gap-5 border-b border-[#e7ebe8] p-6 sm:flex-row sm:items-center">
                <div className="grid h-20 w-20 place-items-center rounded-full bg-[#dbeadd] text-xl font-bold text-[#28573d]">
                  AM
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold">Alex Morgan</h3>
                  <p className="mt-1 text-sm text-[#76827b]">Member since January 2024</p>
                </div>
                <button
                  type="button"
                  className="rounded-xl border border-[#dce2de] px-4 py-2.5 text-sm font-semibold"
                >
                  Change photo
                </button>
              </div>
              <div className="grid gap-5 p-6 sm:grid-cols-2">
                {[
                  ["First name", "Alex", "text"],
                  ["Last name", "Morgan", "text"],
                  ["Email address", "alex.morgan@example.com", "email"],
                  ["Phone number", "+1 (415) 555-0142", "tel"],
                  ["Date of birth", "1992-08-14", "date"],
                  ["Location", "San Francisco, CA", "text"],
                ].map(([label, value, type]) => (
                  <label key={label} className="block">
                    <span className="mb-2 block text-sm font-semibold">{label}</span>
                    <input
                      type={type}
                      defaultValue={value}
                      className="w-full rounded-xl border border-[#dce2de] px-4 py-3 outline-none focus:border-[#346b4b] focus:ring-4 focus:ring-[#346b4b]/10"
                    />
                  </label>
                ))}
              </div>
              <div className="border-t border-[#e7ebe8] p-6">
                <h3 className="mb-5 font-bold">Health details</h3>
                <div className="grid gap-5 sm:grid-cols-3">
                  {[
                    ["Height", "178 cm"],
                    ["Weight", "74 kg"],
                    ["Daily step goal", "10,000 steps"],
                  ].map(([label, value]) => (
                    <label key={label}>
                      <span className="mb-2 block text-sm font-semibold">{label}</span>
                      <input
                        defaultValue={value}
                        className="w-full rounded-xl border border-[#dce2de] px-4 py-3 outline-none focus:border-[#346b4b]"
                      />
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-end gap-4 border-t border-[#e7ebe8] bg-[#fafbfa] p-5">
                {saved && (
                  <span className="text-sm font-semibold text-[#39704e]">Changes saved</span>
                )}
                <button className="rounded-xl bg-[#214f39] px-6 py-3 text-sm font-semibold text-white">
                  Save changes
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {connectOpen && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-[#0b1711]/55 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setConnectOpen(false);
          }}
        >
          <div className="w-full max-w-md rounded-[24px] bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold">Connect a device</h2>
                <p className="mt-1 text-sm text-[#738078]">Pair your STM32-powered wearable.</p>
              </div>
              <button
                onClick={() => setConnectOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full bg-[#f0f3f1] text-[#5f6d65]"
              >
                <Icon name="close" className="h-4 w-4" />
              </button>
            </div>
            {connection === "idle" && (
              <div className="py-5 text-center">
                <div className="mx-auto mb-6 grid h-24 w-24 place-items-center rounded-full bg-[#eaf3eb] text-[#346a49]">
                  <Icon name="bluetooth" className="h-10 w-10" />
                </div>
                <h3 className="font-bold">Ready to pair</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-[#748078]">
                  Keep your device nearby and make sure Bluetooth pairing mode is enabled.
                </p>
                <button
                  onClick={() => setConnection("scanning")}
                  className="mt-7 w-full rounded-xl bg-[#214f39] py-3.5 font-semibold text-white"
                >
                  Find devices
                </button>
              </div>
            )}
            {connection === "scanning" && (
              <div className="py-10 text-center">
                <div className="relative mx-auto mb-7 h-24 w-24">
                  <div className="absolute inset-0 animate-ping rounded-full bg-[#7eb98a]/20" />
                  <div className="absolute inset-3 grid place-items-center rounded-full bg-[#e6f1e8] text-[#346a49]">
                    <Icon name="bluetooth" className="h-8 w-8" />
                  </div>
                </div>
                <h3 className="font-bold">Searching nearby...</h3>
                <p className="mt-2 text-sm text-[#748078]">This may take a few seconds</p>
              </div>
            )}
            {connection === "found" && (
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#77837c]">
                  Available device
                </p>
                <button
                  onClick={() => setConnection("connected")}
                  className="flex w-full items-center gap-4 rounded-2xl border border-[#cfdad2] p-4 text-left transition hover:bg-[#f5f8f5]"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#dfeee1] text-[#346a49]">
                    <Icon name="device" />
                  </span>
                  <span className="flex-1">
                    <span className="block font-bold">MoveBand S3</span>
                    <span className="mt-1 block text-xs text-[#7b867f]">STM32 • Signal strong</span>
                  </span>
                  <Icon name="chevron" className="h-5 w-5 text-[#8a948e]" />
                </button>
                <button
                  onClick={() => setConnection("scanning")}
                  className="mt-5 w-full py-2 text-sm font-semibold text-[#346a49]"
                >
                  Search again
                </button>
              </div>
            )}
            {connection === "connected" && (
              <div className="py-5 text-center">
                <div className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-full bg-[#e6f2e7] text-[#347049]">
                  <Icon name="device" className="h-9 w-9" />
                </div>
                <h3 className="text-lg font-bold">MoveBand S3 connected</h3>
                <p className="mt-2 text-sm text-[#748078]">
                  Your activity data is now syncing securely.
                </p>
                <button
                  onClick={() => setConnectOpen(false)}
                  className="mt-7 w-full rounded-xl bg-[#214f39] py-3.5 font-semibold text-white"
                >
                  Done
                </button>
                <button
                  onClick={() => setConnection("idle")}
                  className="mt-3 w-full py-2 text-sm font-semibold text-[#a15050]"
                >
                  Disconnect device
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
