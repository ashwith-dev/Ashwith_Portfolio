"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface PushIntroProps {
  name: string;
  heroTagline: string;
}

type Joint =
  | "torso" | "head"
  | "armB" | "foreB" | "armF" | "foreF"
  | "legB" | "shinB" | "legF" | "shinF";

type Pose = Record<Joint, number> & { y: number };

// Pivot points in the SVG's own coordinates (viewBox 0 0 120 160).
const PIVOTS: Record<Joint, [number, number]> = {
  torso: [50, 96],
  head: [50, 54],
  armB: [50, 60], foreB: [50, 80],
  armF: [50, 60], foreF: [50, 80],
  legB: [50, 96], shinB: [50, 126],
  legF: [50, 96], shinF: [50, 126],
};

const IDLE: Pose = { torso: 3, head: -2, armB: 8, foreB: -6, armF: -5, foreF: -12, legB: 7, shinB: 2, legF: -7, shinF: 5, y: 0.4 };
const READY: Pose = { torso: 20, head: -14, armB: -78, foreB: -16, armF: -84, foreF: -18, legB: 22, shinB: 4, legF: -18, shinF: 26, y: 3 };
const CONTACT: Pose = { torso: 40, head: -30, armB: -122, foreB: -8, armF: -128, foreF: -2, legB: 37, shinB: 2, legF: -30, shinF: 50, y: 8 };
const RELAXED: Pose = { torso: -2, head: 4, armB: 10, foreB: -8, armF: 2, foreF: -14, legB: 8, shinB: 2, legF: -9, shinF: 6, y: 0.5 };

const JOINTS = Object.keys(PIVOTS) as Joint[];

export function PushIntro({ name, heroTagline }: PushIntroProps) {
  const stageRef = useRef<HTMLElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const laneRef = useRef<HTMLDivElement>(null);
  const charRef = useRef<SVGSVGElement>(null);
  const handRef = useRef<SVGCircleElement>(null);
  const hintRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const stage = stageRef.current!;
    const paper = paperRef.current!;
    const nameEl = nameRef.current!;
    const tagline = taglineRef.current!;
    const lane = laneRef.current!;
    const svg = charRef.current!;
    const hand = handRef.current!;
    const hint = hintRef.current!;
    const body = svg.querySelector<SVGGElement>("[data-part=body]")!;
    const parts = Object.fromEntries(
      JOINTS.map((j) => [j, svg.querySelector<SVGGElement>(`[data-part=${j}]`)!])
    ) as Record<Joint, SVGGElement>;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let tl: gsap.core.Timeline | null = null;
    let cancelled = false;

    // Everything visual derives from this one state object, written by one timeline.
    const s = { ...IDLE, b: 0, off: 0 };
    let handOffset = 0;

    const applyPose = () => {
      for (const j of JOINTS) {
        const [x, y] = PIVOTS[j];
        parts[j].setAttribute("transform", `rotate(${s[j].toFixed(2)} ${x} ${y})`);
      }
      body.setAttribute("transform", `translate(0 ${s.y.toFixed(2)})`);
    };

    const render = () => {
      applyPose();
      const w = stage.clientWidth;
      paper.style.clipPath = `inset(0 ${Math.max(0, w - s.b).toFixed(1)}px 0 0)`;
      svg.style.transform = `translate3d(${(s.b - handOffset + s.off).toFixed(1)}px, 0, 0)`;
    };

    const build = () => {
      tl?.scrollTrigger?.kill(true);
      tl?.kill();

      const stageRect = stage.getBoundingClientRect();
      const nameRect = nameEl.getBoundingClientRect();
      const laneRect = lane.getBoundingClientRect();
      const charH = laneRect.height;

      svg.style.top = `${laneRect.top - stageRect.top}px`;
      svg.style.height = `${charH}px`;
      svg.style.width = `${charH * 0.75}px`;

      // Measure where the hands land in the contact pose, so the wall edge sits exactly at them.
      Object.assign(s, CONTACT, { b: 0, off: 0 });
      handOffset = 0;
      svg.style.transform = "translate3d(0,0,0)";
      applyPose();
      handOffset = hand.getBoundingClientRect().right - svg.getBoundingClientRect().left;

      const nameLeft = nameRect.left - stageRect.left;
      const bStart = nameLeft - Math.max(10, charH * 0.08);
      const bEnd = stageRect.width;

      const css = getComputedStyle(stage);
      const accent = css.getPropertyValue("--accent").trim();
      const ink = css.getPropertyValue("--ink").trim();

      Object.assign(s, IDLE, { b: bStart, off: -charH * 0.16 });
      gsap.set(nameEl, { color: accent });
      gsap.set(tagline, { opacity: 0, y: 8 });

      // Scroll-driven: the pinned stage's scroll progress is the timeline's playhead, so it rewinds on scroll-up.
      tl = gsap.timeline({
        paused: reduced,
        onUpdate: render,
        scrollTrigger: reduced
          ? undefined
          : { trigger: stage, start: "top top", end: "+=180%", pin: true, scrub: 0.8, refreshPriority: 1 },
      });

      // 1. initial — still, name hidden behind the wall
      tl.addLabel("initial", 0);
      tl.to(hint, { opacity: 0, duration: 0.5, ease: "none" }, "initial");

      // 2. preparing — step in, lean, raise arms
      tl.addLabel("preparing", 0.5);
      tl.to(s, { ...READY, off: -charH * 0.05, duration: 0.5, ease: "power2.inOut" }, "preparing");

      // 3. contact — hands meet the wall, body compresses, brief hold
      tl.addLabel("contact", 1.0);
      tl.to(s, { ...CONTACT, off: 0, duration: 0.24, ease: "power2.out" }, "contact");

      // 4–6. pushing — wall edge and character move as one; the reveal is the wall's position
      tl.addLabel("pushing", 1.3);
      const pushDur = 2.5;
      tl.to(s, { b: bEnd, duration: pushDur, ease: "sine.inOut" }, "pushing");
      tl.to(s, { torso: 43, head: -32, duration: pushDur * 0.45, ease: "sine.inOut" }, "pushing");
      tl.to(s, { torso: CONTACT.torso, head: CONTACT.head, duration: pushDur * 0.55, ease: "sine.inOut" }, `pushing+=${pushDur * 0.45}`);

      // Leg cycle: back leg drives, front leg steps through; count scales with distance.
      const stride = charH * 0.42;
      const steps = Math.max(4, Math.min(14, Math.round((bEnd - bStart) / stride / 2) * 2));
      const stepDur = pushDur / steps;
      const A = { legB: CONTACT.legB, shinB: CONTACT.shinB, legF: CONTACT.legF, shinF: CONTACT.shinF };
      const B = { legB: CONTACT.legF, shinB: CONTACT.shinF, legF: CONTACT.legB, shinF: CONTACT.shinB };
      for (let i = 0; i < steps; i++) {
        const at = 1.3 + i * stepDur;
        tl.to(s, { ...(i % 2 === 0 ? B : A), duration: stepDur, ease: "sine.inOut" }, at);
        tl.to(s, { y: CONTACT.y - 2.4, duration: stepDur / 2, ease: "sine.out" }, at);
        tl.to(s, { y: CONTACT.y, duration: stepDur / 2, ease: "sine.in" }, at + stepDur / 2);
      }
      tl.addLabel("revealed", 1.3 + pushDur);

      // Name colour settles as the push completes
      tl.to(nameEl, { color: ink, duration: 1.2, ease: "power1.inOut" }, 3.0);

      // 7. releasing — let go, straighten, small follow-through
      tl.addLabel("releasing", 3.8);
      tl.to(s, { ...RELAXED, torso: -4, off: -charH * 0.07, duration: 0.42, ease: "power2.out" }, "releasing");
      tl.to(s, { torso: RELAXED.torso, duration: 0.3, ease: "sine.inOut" }, "releasing+=0.42");

      tl.to(tagline, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 4.2);

      // 8. complete — hold
      tl.addLabel("complete", 4.8);
      tl.set({}, {}, 5.5);

      svg.style.visibility = "visible";
      if (reduced) {
        tl.progress(1);
        hint.style.display = "none";
      }
      render();
      // This pin is created after fonts load, i.e. after later sections' triggers; re-sort so their starts include its spacer.
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    };

    let resizeTimer = 0;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(build, 150);
    };

    gsap.registerPlugin(ScrollTrigger);
    document.fonts.ready.then(() => {
      if (cancelled) return;
      build();
      window.addEventListener("resize", onResize);
    });

    return () => {
      cancelled = true;
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      tl?.scrollTrigger?.kill(true);
      tl?.kill();
    };
  }, []);

  const stroke = { stroke: "var(--ink)", strokeWidth: 2.4, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  const limb = { ...stroke, fill: "none", strokeWidth: 3 } as const;
  const cloth = { ...stroke, fill: "var(--paper)" } as const;

  return (
    <section
      ref={stageRef}
      aria-label="Introduction"
      style={{ background: "var(--ink)", position: "relative", height: "100svh", minHeight: "560px", overflow: "hidden" }}
    >
      <noscript>
        <style>{`[data-intro-paper]{clip-path:none!important}`}</style>
      </noscript>

      <div
        ref={paperRef}
        data-intro-paper
        style={{
          position: "absolute",
          inset: 0,
          background: "var(--paper)",
          clipPath: "inset(0 100% 0 0)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          paddingLeft: "var(--pad-l)",
          paddingRight: "var(--pad-r)",
          ["--char-h" as string]: "min(clamp(96px, 23svh, 230px), 28vw)",
          ["--pad-l" as string]: "max(clamp(1.25rem, 8vw, 8rem), calc(var(--char-h) * 0.95 + 1rem))",
          ["--pad-r" as string]: "clamp(1.25rem, 6vw, 6rem)",
          ["--name-len" as string]: String(Math.max(name.length, 1)),
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "clamp(0.6rem, 1.5vw, 0.75rem)",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "var(--muted)",
            marginBottom: "1rem",
            display: "block",
          }}
        >
          ashwith thatipally
        </span>

        <h1
          ref={nameRef}
          style={{
            fontFamily: "var(--font-doto)",
            // Doto is monospaced (~0.58em per glyph), so this keeps any name on one line beside the character.
            fontSize: "min(clamp(2.5rem, 14.5vw, 15rem), calc((100vw - var(--pad-l) - var(--pad-r)) / (var(--name-len) * 0.62)))",
            fontWeight: 800,
            lineHeight: 0.85,
            letterSpacing: "-0.02em",
            color: "var(--ink)",
            margin: 0,
            width: "fit-content",
            whiteSpace: "nowrap",
          }}
        >
          {name}
        </h1>

        <p
          ref={taglineRef}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "clamp(0.75rem, 2vw, 1rem)",
            letterSpacing: "0.15em",
            textTransform: "lowercase",
            color: "var(--muted)",
            margin: "1.5rem 0 0",
          }}
        >
          {heroTagline}
        </p>

        <div ref={laneRef} aria-hidden="true" style={{ position: "relative", height: "var(--char-h)", marginTop: "clamp(0.75rem, 3svh, 2rem)" }}>
          <div style={{ position: "absolute", left: "-100vw", right: "-100vw", bottom: 0, height: 1, background: "var(--border)" }} />
        </div>
      </div>

      <span
        ref={hintRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "1.75rem",
          right: "clamp(1.25rem, 6vw, 6rem)",
          fontFamily: "var(--font-mono)",
          fontSize: "0.65rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "var(--muted)",
        }}
      >
        scroll ↓
      </span>

      <svg
        ref={charRef}
        aria-hidden="true"
        viewBox="0 0 120 160"
        style={{ position: "absolute", left: 0, top: 0, overflow: "visible", visibility: "hidden", willChange: "transform" }}
      >
        <g data-part="body">
          {/* back leg */}
          <g data-part="legB">
            <path d="M42.5 94.5 L57.5 94.5 L58.5 111.5 Q50.5 114.2 43.2 111.8 Z" {...cloth} />
            <path d="M50.5 112 L50 126" {...limb} />
            <g data-part="shinB">
              <path d="M50 126 Q50.6 140 50 152" {...limb} />
              <path d="M45.5 151 Q46.5 157.5 50 157.8 L62.5 157.8 Q64 153.5 59 151.8 Q53.5 150.6 50 150.4 Z" {...stroke} fill="var(--ink)" />
            </g>
          </g>

          <g data-part="torso">
            {/* back arm */}
            <g data-part="armB">
              <path d="M50 66 Q50.4 73 50 80" {...limb} />
              <g data-part="foreB">
                <path d="M50 80 Q50.8 89 50.4 97" {...limb} />
                <circle cx="50.5" cy="99" r="2.6" {...cloth} />
              </g>
            </g>

            {/* shirt */}
            <path d="M40 57.5 Q50 51 60.5 57 Q62.6 70 61.8 84 Q61.4 92 60.4 98.6 Q50 101 40.2 98.6 Q38.6 88 38.8 75 Q39 64 40 57.5 Z" {...cloth} />
            <path d="M46.5 56.5 Q50 60 53.5 56.2" {...stroke} fill="none" strokeWidth={1.4} />
            <path d="M40 88 Q50 90 61 88" {...stroke} fill="none" strokeWidth={1.2} opacity={0.6} />

            {/* head */}
            <g data-part="head">
              <path d="M49 54 L50 49" {...limb} />
              <circle cx="51" cy="39" r="11.6" {...cloth} />
              <path d="M40.6 36.5 Q41.5 25.5 51.5 25 Q61.5 25.4 62 35 Q51 33.2 40.6 36.5 Z" {...stroke} fill="var(--accent)" />
              <path d="M60.5 34.6 Q67.5 33.4 71 36.2 Q66 37.6 61 37.2" {...stroke} fill="var(--accent)" />
              <circle cx="57.4" cy="41" r="1.1" fill="var(--ink)" />
              <path d="M46 40.5 Q44 42 46 44.5" {...stroke} fill="none" strokeWidth={1.3} />
            </g>

            {/* front arm */}
            <g data-part="armF">
              <path d="M43.6 58.6 Q50.5 54 57 58.8 L56.4 70 Q50 72.4 44.2 70 Z" {...cloth} />
              <path d="M50.2 70 Q50.5 75 50 80" {...limb} />
              <g data-part="foreF">
                <path d="M50 80 Q50.9 89 50.4 97" {...limb} />
                <circle ref={handRef} cx="50.5" cy="99" r="2.8" {...cloth} />
              </g>
            </g>
          </g>

          {/* front leg */}
          <g data-part="legF">
            <path d="M42 94.5 L58 94.5 L58.2 112 Q50.4 114.6 42.8 112.2 Z" {...cloth} />
            <path d="M50.2 112.5 L50 126" {...limb} />
            <g data-part="shinF">
              <path d="M50 126 Q49.4 140 50 152" {...limb} />
              <path d="M45.5 151 Q46.5 157.5 50 157.8 L62.5 157.8 Q64 153.5 59 151.8 Q53.5 150.6 50 150.4 Z" {...stroke} fill="var(--ink)" />
            </g>
          </g>
        </g>
      </svg>
    </section>
  );
}
