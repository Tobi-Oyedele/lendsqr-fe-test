import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.scss";
import logo from "/src/assets/logo.svg";
import illustration from "/src/assets/login-illustration.png";
import { setSession } from "../../utils/authStorage";

type FormState = {
  email: string;
  password: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isStrongPassword(password: string) {
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const longEnough = password.length >= 8;

  return hasLower && hasUpper && hasNumber && hasSpecial && longEnough;
}

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState<{ email: boolean; password: boolean }>(
    {
      email: false,
      password: false,
    }
  );

  const errors = useMemo(() => {
    const next: { email?: string; password?: string } = {};

    const email = form.email.trim();
    if (!email) next.email = "Email is required";
    else if (!isValidEmail(email)) next.email = "Enter a valid email address";

    if (!form.password) next.password = "Password is required";
    else if (!isStrongPassword(form.password)) {
      next.password =
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.";
    }

    return next;
  }, [form.email, form.password]);

  const canSubmit = Object.keys(errors).length === 0 && !submitting;

  function onChange<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    setTouched({ email: true, password: true });

    if (!canSubmit) return;

    setSubmitting(true);

    // Mock auth delay
    await new Promise((r) => setTimeout(r, 400));

    // Do NOT store passwords. Only store a minimal session flag.
    setSession({
      token: "mock-token",
      email: form.email.trim(),
      createdAt: Date.now(),
    });

    setSubmitting(false);
    navigate("/dashboard", { replace: true });
  }

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        {/* Left */}
        <div className={styles.left}>
          <header className={styles.brand}>
            <img src={logo} alt="Lendsqr logo" className={styles.logo} />
          </header>

          <div className={styles.illustrationWrap} aria-hidden="true">
            <img
              src={illustration}
              alt=""
              className={styles.illustration}
              loading="eager"
            />
          </div>
        </div>

        {/* Right */}
        <div className={styles.right}>
          <header className={styles.mobileBrand}>
            <img src={logo} alt="Lendsqr logo" className={styles.logo} />
          </header>

          <div className={styles.card}>
            <h1 className={styles.title}>Welcome!</h1>
            <p className={styles.subtitle}>Enter details to login.</p>

            <form onSubmit={onSubmit} className={styles.form} noValidate>
              <div className={styles.field}>
                <label className={styles.srOnly} htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Email"
                  className={styles.input}
                  value={form.email}
                  onChange={(e) => onChange("email", e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                  aria-invalid={Boolean(touched.email && errors.email)}
                  aria-describedby={
                    touched.email && errors.email ? "email-err" : undefined
                  }
                />
                {touched.email && errors.email && (
                  <p id="email-err" className={styles.error}>
                    {errors.email}
                  </p>
                )}
              </div>

              <div className={styles.field}>
                <label className={styles.srOnly} htmlFor="password">
                  Password
                </label>

                <div className={styles.passwordRow}>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Password"
                    className={styles.input}
                    value={form.password}
                    onChange={(e) => onChange("password", e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                    aria-invalid={Boolean(touched.password && errors.password)}
                    aria-describedby={
                      touched.password && errors.password
                        ? "password-err"
                        : undefined
                    }
                  />

                  <button
                    type="button"
                    className={styles.showBtn}
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? "HIDE" : "SHOW"}
                  </button>
                </div>

                {touched.password && errors.password && (
                  <p id="password-err" className={styles.error}>
                    {errors.password}
                  </p>
                )}
              </div>

              <button
                type="button"
                className={styles.forgot}
                onClick={() =>
                  alert("Forgot password flow not provided in assessment.")
                }
              >
                FORGOT PASSWORD?
              </button>

              <button
                type="submit"
                className={styles.submit}
                disabled={!canSubmit}
              >
                {submitting ? "LOGGING IN..." : "LOG IN"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
