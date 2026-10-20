"use client";

import { Fragment, useEffect, useRef, type CSSProperties, type ElementType } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface RevealLinesProps {
  text: string;
  as?: "p" | "h2" | "h3";
  id?: string;
  style?: CSSProperties;
}

/** Each line rises out of its own mask when the text enters the viewport. */
export function RevealLines({ text, as = "p", id, style }: RevealLinesProps) {
  const ref = useRef<HTMLElement>(null);
  const Tag = as as ElementType;
  const words = text.split(/\s+/).filter(Boolean);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    let ctx: gsap.Context | undefined;
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (cancelled) return;
      const inners = Array.from(el.querySelectorAll<HTMLElement>("[data-w] > span"));
      const tops = inners.map((i) => i.parentElement!.offsetTop);
      const lines = Array.from(new Set(tops)).sort((a, b) => a - b);
      ctx = gsap.context(() => {
        gsap.from(inners, {
          yPercent: 115,
          duration: 0.9,
          ease: "power3.out",
          delay: (i: number) => lines.indexOf(tops[i]) * 0.09,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      }, el);
    });

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [text]);

  return (
    <Tag ref={ref} id={id} style={style}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span
            data-w
            style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top", paddingBottom: "0.12em", marginBottom: "-0.12em" }}
          >
            <span style={{ display: "inline-block" }}>{w}</span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}
