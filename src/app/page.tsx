import { connectDB } from "@/lib/db";
import { Profile } from "@/models/Profile";
import { Project } from "@/models/Project";
import { Skill } from "@/models/Skill";
import { Experience } from "@/models/Experience";
import { PushIntro } from "@/components/portfolio/PushIntro";
import { ProjectsSection } from "@/components/portfolio/ProjectsSection";
import { PullQuote } from "@/components/portfolio/PullQuote";
import { SkillsSection } from "@/components/portfolio/SkillsSection";
import { ExperienceSection } from "@/components/portfolio/ExperienceSection";
import { ContactSection } from "@/components/portfolio/ContactSection";
import { SkipLink } from "@/components/ui/SkipLink";
import { SiteNav } from "@/components/ui/SiteNav";
import { AccentHero } from "@/components/portfolio/AccentHero";
import { CurrentlyBuilding } from "@/components/portfolio/CurrentlyBuilding";
import { AchievementsSection } from "@/components/portfolio/AchievementsSection";
import Link from "next/link";

export const revalidate = 3600; // ISR: re-fetch at most every hour

async function getData() {
  try {
    await connectDB();
    const [profile, projects, skills, experience] = await Promise.all([
      Profile.findOne().lean(),
      Project.find({ published: true }).sort({ order: 1 }).lean(),
      Skill.find().sort({ order: 1 }).lean(),
      Experience.find().sort({ order: 1 }).lean(),
    ]);
    return { profile, projects, skills, experience };
  } catch {
    return { profile: null, projects: [], skills: [], experience: [] };
  }
}

export default async function HomePage() {
  const { profile, projects, skills, experience } = await getData();

  const heroName = profile?.name?.split(" ")[0] ?? "Ashwith";
  const heroTagline = profile?.heroTagline ?? "ai / mobile / full-stack";
  const pullQuote = profile?.pullQuote ?? "I build things that think.";
  const currentlyBuilding = [...(profile?.currentlyBuilding ?? [])];
  const contactEmail = profile?.email ?? "";
  const location = profile?.location ?? "";

  const skillList = skills.map((s) => ({ name: s.name, category: s.category }));
  const categories = Array.from(new Set(skillList.map((s) => s.category)));
  const heroNote = [
    location && `Based in ${location}.`,
    currentlyBuilding[0] && `Currently building ${currentlyBuilding[0]}.`,
  ]
    .filter(Boolean)
    .join(" ");

  const timeline = experience.filter((e) => e.type !== "achievement");
  const achievements = experience.filter((e) => e.type === "achievement");

  const featuredProjects = projects.slice(0, 6).map((p) => ({
    title: p.title,
    slug: p.slug,
    summary: p.summary,
    coverImage: p.coverImage,
    techStack: [...p.techStack],
  }));

  return (
    <main>
      <SkipLink />
      <SiteNav />

      {/* Push intro (scroll-scrubbed) */}
      <PushIntro name={heroName} heroTagline={heroTagline} />

      {/* Sticky accent title card, with the about statement sliding over it */}
      <AccentHero
        title={profile?.tagline ?? heroTagline}
        note={heroNote}
        nodes={categories}
        bio={profile?.bio ?? ""}
        location={location}
        resumeUrl={profile?.resumeUrl ?? ""}
      />

      {skillList.length > 0 && <SkillsSection skills={skillList} />}

      {timeline.length > 0 && <ExperienceSection items={timeline} />}

      {achievements.length > 0 && <AchievementsSection items={achievements} />}

      {currentlyBuilding.length > 0 && <CurrentlyBuilding items={currentlyBuilding} />}

      {/* Textured statement, pinned; its ink wipe hands over to the projects */}
      <PullQuote quote={pullQuote} author={profile?.name ?? "Ashwith Thatipally"} />

      {featuredProjects.length > 0 && <ProjectsSection projects={featuredProjects} />}

      <div style={{ background: "var(--ink)", padding: "0 clamp(1.25rem, 6vw, 6rem) 3rem" }}>
        <Link
          href="/projects"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--accent)",
            textDecoration: "none",
          }}
        >
          View all projects →
        </Link>
      </div>

      <ContactSection email={contactEmail} />

      <footer style={{
        background: "var(--ink)",
        padding: "1.5rem clamp(1.25rem, 6vw, 6rem)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.1em", color: "color-mix(in srgb, var(--paper) 62%, transparent)" }}>
          © {new Date().getFullYear()} {profile?.name ?? "Ashwith Thatipally"}
        </span>
        <Link
          href="/admin"
          style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.1em", color: "color-mix(in srgb, var(--paper) 62%, transparent)", textDecoration: "none" }}
        >
          admin
        </Link>
      </footer>
    </main>
  );
}
