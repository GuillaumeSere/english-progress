import { useEffect, useState } from "react";
import { Footer, Header } from "./layout";
import type { Page } from "./pageTypes";
import { LessonPage, NotFound } from "./pages-lesson";
import { CoursePage, HomePage, VocabularyPage } from "./pages-primary";
import {
  ProgressPage,
  PronunciationPage,
  WorkPage,
} from "./pages-professional";
import {
  ConversationsPage,
  GrammarPage,
  LevelTestPage,
  ListeningPage,
  QuizPage,
} from "./pages-study";
import "./styles.css";
const titles: Record<Page, string> = {
  home: "Apprendre l’anglais, un peu chaque jour.",
  cours: "Un parcours clair, à votre rythme.",
  vocabulaire: "Les mots qu’on utilise vraiment.",
  grammaire: "La grammaire en clair.",
  conversations: "L’anglais commence par une conversation.",
  listening: "Une minute d’écoute, un pas en avant.",
  prononciation: "Trouver le rythme de l’anglais.",
  quiz: "Voyez ce que vous avez retenu.",
  "test-niveau": "Faisons connaissance avec votre anglais.",
  "anglais-professionnel": "Un anglais professionnel plus naturel.",
  progression: "Chaque petit pas compte.",
  lesson: "Une leçon à votre rythme.",
  "not-found": "Cette page n’existe pas.",
};
const descriptions: Record<Page, string> = {
  home: "Apprenez l’anglais gratuitement à votre rythme : cours courts, vocabulaire, grammaire, dialogues audio et exercices interactifs.",
  cours:
    "Choisissez votre niveau et progressez avec des leçons d’anglais structurées, du niveau débutant aux niveaux avancés.",
  vocabulaire:
    "Enrichissez votre vocabulaire anglais par niveau avec des traductions, des exemples et une prononciation audio.",
  grammaire:
    "Comprenez les règles de grammaire anglaise avec des explications simples, des exemples et des exercices corrigés.",
  conversations:
    "Pratiquez l’anglais du quotidien avec des dialogues, des traductions et une lecture audio.",
  listening:
    "Entraînez votre compréhension orale en anglais avec des écoutes courtes et des exercices interactifs.",
  prononciation:
    "Améliorez votre prononciation anglaise grâce à des exemples audio et à des exercices d’écoute et de répétition.",
  quiz: "Révisez votre anglais avec des quiz interactifs et découvrez les notions à travailler.",
  "test-niveau":
    "Évaluez votre niveau d’anglais avec un test rapide et obtenez un parcours adapté.",
  "anglais-professionnel":
    "Apprenez l’anglais professionnel : vocabulaire, entretiens, réunions et expressions utiles au travail.",
  progression:
    "Consultez votre progression, vos leçons terminées et vos prochaines étapes en anglais.",
  lesson:
    "Suivez une leçon d’anglais avec vocabulaire, explications et exercices pratiques.",
  "not-found":
    "La page demandée est introuvable. Retrouvez les cours et ressources gratuites d’anglais.",
};
function current() {
  return window.location.pathname + window.location.search;
}
function view(url: string): Page {
  const pathname = url.split("?")[0];
  const p = pathname.split("/").filter(Boolean);
  if (!p.length) return "home";
  if (
    p[0] === "cours" &&
    p.length === 2 &&
    ["a1", "a2", "b1", "b2", "c1", "c2"].includes(p[1])
  )
    return "cours";
  if (p[0] === "cours" && p.length === 2) return "not-found";
  if (p[0] === "cours" && p.length >= 3) return "lesson";
  if (p[0] === "cours") return "cours";
  if (
    [
      "vocabulaire",
      "grammaire",
      "conversations",
      "listening",
      "prononciation",
      "quiz",
      "test-niveau",
      "anglais-professionnel",
      "progression",
    ].includes(p[0]) &&
    p.length === 1
  )
    return p[0] as Page;
  return "not-found";
}
function content(page: Page) {
  switch (page) {
    case "home":
      return <HomePage />;
    case "cours":
      return <CoursePage />;
    case "lesson":
      return <LessonPage />;
    case "vocabulaire":
      return <VocabularyPage />;
    case "grammaire":
      return <GrammarPage />;
    case "conversations":
      return <ConversationsPage />;
    case "listening":
      return <ListeningPage />;
    case "prononciation":
      return <PronunciationPage />;
    case "quiz":
      return <QuizPage />;
    case "test-niveau":
      return <LevelTestPage />;
    case "anglais-professionnel":
      return <WorkPage />;
    case "progression":
      return <ProgressPage />;
    default:
      return <NotFound />;
  }
}
export default function App() {
  const [url, setUrl] = useState(current);
  const page = view(url);
  useEffect(() => {
    const f = () => {
      setUrl(current());
      window.scrollTo(0, 0);
    };
    window.addEventListener("popstate", f);
    return () => window.removeEventListener("popstate", f);
  }, []);
  useEffect(() => {
    const title = `${titles[page]} | English Progress`;
    const description = descriptions[page];
    const canonicalUrl = `${window.location.origin}${window.location.pathname}`;
    document.title = title;

    const setMeta = (key: string, value: string, attribute = "name") => {
      let element = document.head.querySelector<HTMLMetaElement>(
        `meta[${attribute}="${key}"]`
      );
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }
      element.content = value;
    };

    setMeta("description", description);
    setMeta("og:title", title, "property");
    setMeta("og:description", description, "property");
    setMeta("og:url", canonicalUrl, "property");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    setMeta(
      "robots",
      page === "progression" || page === "not-found"
        ? "noindex, follow"
        : "index, follow, max-image-preview:large"
    );

    let canonical = document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]'
    );
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;
  }, [page, url]);
  return (
    <>
      <Header current={page} />
      <main className="site-main">{content(page)}</main>
      <Footer />
    </>
  );
}
