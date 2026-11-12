"use client";

import { useEffect, useRef, useState } from "react";

const PROMPT = "Add a project tracker for each client.";
const STEPS = ["Plan approved", "Building app", "Live in your portal"];
const ROWS: { name: string; stage: "plan" | "active" | "review" | "done"; label: string }[] = [
  { name: "Brand Refresh", stage: "plan", label: "Planning" },
  { name: "Catalog Launch", stage: "active", label: "Active" },
  { name: "Client Intake", stage: "review", label: "In review" },
  { name: "Website Launch", stage: "done", label: "Done" },
];

type Scene = "prompt" | "build" | "portal";
type StepState = "idle" | "busy" | "done";

/**
 * A short loop above the guide posts' sidebar card, showing how Assembly works
 * in three scenes: a prompt is typed and sent, the plan is approved and the app
 * builds, and the finished tracker sits inside a client portal.
 *
 * Plain markup and CSS (`.guide-demo*` in globals.css), driven by one timer so
 * pausing freezes exactly the step that was waiting. It starts once the card is
 * on screen; with reduced motion the stylesheet shows the finished portal and
 * no button, and the loop never starts.
 */
export function PostCtaDemo() {
  const root = useRef<HTMLDivElement>(null);
  const [scene, setScene] = useState<Scene>("prompt");
  const [typed, setTyped] = useState(0);
  const [send, setSend] = useState<"idle" | "ready" | "pressed">("idle");
  const [steps, setSteps] = useState<StepState[]>(STEPS.map(() => "idle"));
  const [paused, setPaused] = useState(false);
  const timer = useRef<{ fn: () => void; left: number; at: number; id?: number } | null>(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    // With reduced motion the stylesheet shows the finished portal and hides
    // the button, so the loop never needs to run.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const wait = (ms: number, fn: () => void) => {
      const t = { fn, left: ms, at: Date.now(), id: undefined as number | undefined };
      timer.current = t;
      if (!pausedRef.current) t.id = window.setTimeout(fire, ms);
    };
    const fire = () => {
      const t = timer.current;
      timer.current = null;
      t?.fn();
    };

    const start = () => {
      setSteps(STEPS.map(() => "idle"));
      setTyped(0);
      setSend("idle");
      setScene("prompt");
      wait(700, () => type(1));
    };
    const type = (i: number) => {
      setTyped(i);
      setSend("ready");
      if (i < PROMPT.length) return wait(60, () => type(i + 1));
      wait(700, () => {
        setSend("pressed");
        wait(300, () => {
          setScene("build");
          wait(400, () => step(0));
        });
      });
    };
    const step = (n: number) => {
      if (n === STEPS.length) return wait(800, portal);
      setSteps((s) => s.map((v, i) => (i === n ? "busy" : v)));
      wait(n === 1 ? 1400 : 850, () => {
        setSteps((s) => s.map((v, i) => (i === n ? "done" : v)));
        wait(300, () => step(n + 1));
      });
    };
    const portal = () => {
      setScene("portal");
      wait(3800, start);
    };

    // Start once the card is on screen, not while it sits below the fold.
    let started = false;
    const go = () => {
      if (started) return;
      started = true;
      start();
    };
    const el = root.current;
    if (!el || !("IntersectionObserver" in window)) {
      go();
    } else {
      const io = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          go();
        }
      });
      io.observe(el);
      return () => {
        io.disconnect();
        if (timer.current?.id) window.clearTimeout(timer.current.id);
      };
    }
    return () => {
      if (timer.current?.id) window.clearTimeout(timer.current.id);
    };
  }, []);

  const togglePaused = () => {
    const next = !pausedRef.current;
    pausedRef.current = next;
    setPaused(next);
    const t = timer.current;
    if (!t) return;
    if (next) {
      window.clearTimeout(t.id);
      t.left -= Date.now() - t.at;
    } else {
      t.at = Date.now();
      t.id = window.setTimeout(() => {
        timer.current = null;
        t.fn();
      }, Math.max(0, t.left));
    }
  };

  return (
    <div
      ref={root}
      className="guide-demo"
      data-paused={paused ? "true" : undefined}
    >
      <div className="guide-demo-inner">
        <button
            type="button"
            className="guide-demo-toggle"
            onClick={togglePaused}
            aria-label={paused ? "Play animation" : "Pause animation"}
          >
            {paused ? (
              <svg viewBox="0 0 10 10" className="size-2.5" fill="currentColor" aria-hidden>
                <path d="M2.5 1.5v7l6-3.5z" />
              </svg>
            ) : (
              <svg viewBox="0 0 10 10" className="size-2.5" fill="currentColor" aria-hidden>
                <path d="M2 1.5h2v7H2zM6 1.5h2v7H6z" />
              </svg>
            )}
          </button>

        <div className="guide-demo-scene" data-active={scene === "prompt"} data-scene="prompt" aria-hidden>
          <div className="guide-demo-card">
            <p className="guide-demo-prompt">
              {PROMPT.slice(0, typed)}
              <span className="guide-demo-caret" />
            </p>
            <div className="guide-demo-bar">
              <span
                className="guide-demo-send"
                data-ready={send !== "idle"}
                data-pressed={send === "pressed"}
              >
                <svg viewBox="0 0 14 14" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 11.5v-9M3 6.5l4-4 4 4" />
                </svg>
              </span>
            </div>
          </div>
        </div>

        <div className="guide-demo-scene" data-active={scene === "build"} data-scene="build" aria-hidden>
          <ul className="guide-demo-steps">
            {STEPS.map((label, i) => (
              <li key={label} data-state={steps[i]}>
                <span className="guide-demo-tick" />
                <span className="guide-demo-label">{label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="guide-demo-scene" data-active={scene === "portal"} data-scene="portal" aria-hidden>
          <div className="guide-demo-side">
            <p className="guide-demo-brand">
              <span className="guide-demo-logo" />
              Halden
            </p>
            <ul>
              <li>Home</li>
              <li>Messages</li>
              <li>Files</li>
              <li data-on="true">Projects</li>
            </ul>
          </div>
          <div className="guide-demo-main">
            <p className="guide-demo-title">Project tracker</p>
            <ul className="guide-demo-rows">
              {ROWS.map((row) => (
                <li key={row.name}>
                  <span>{row.name}</span>
                  <span className="guide-demo-pill" data-stage={row.stage}>
                    {row.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
