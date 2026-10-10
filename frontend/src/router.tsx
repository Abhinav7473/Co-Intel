import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, createRoute, createRouter, lazyRouteComponent, notFound } from "@tanstack/react-router";
import { queries } from "@/api/queries";
import { SECTION_BY_SLUG, SECTIONS } from "@/content/brief";
import { AppShell, NotFound } from "@/shell/AppShell";

interface RouterContext {
  queryClient: QueryClient;
}

const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: AppShell,
  notFoundComponent: NotFound,
});

// Data is fetched by route loaders before render: the no-useEffect way.
// Each page is its own chunk (lazyRouteComponent), so the first visit loads only what it shows.
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  loader: ({ context: { queryClient: qc } }) =>
    Promise.all([
      qc.ensureQueryData(queries.entries()),
      qc.ensureQueryData(queries.setupAudits()),
      qc.ensureQueryData(queries.assessments()),
      qc.ensureQueryData(queries.experiments()),
    ]),
  component: lazyRouteComponent(() => import("@/features/home/HomePage"), "HomePage"),
});

const topicRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/topics/$slug",
  loader: ({ params, context: { queryClient: qc } }) => {
    if (!SECTION_BY_SLUG[params.slug]) throw notFound();
    return Promise.all([
      qc.ensureQueryData(queries.entries()),
      qc.ensureQueryData(queries.board()),
      qc.ensureQueryData(queries.checklist()),
      qc.ensureQueryData(queries.poll()),
    ]);
  },
  component: lazyRouteComponent(() => import("@/features/topic/TopicPage"), "TopicPage"),
});

const introRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/intro",
  component: lazyRouteComponent(() => import("@/features/intro/IntroPage"), "IntroPage"),
});

const mapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/map",
  component: lazyRouteComponent(() => import("@/features/map/MapPage"), "MapPage"),
});

const auditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/audit",
  loader: ({ context: { queryClient: qc } }) => qc.ensureQueryData(queries.setupAudits()),
  component: lazyRouteComponent(() => import("@/features/audit/AuditPage"), "AuditPage"),
});

const auditDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/audit/$id",
  loader: ({ params, context: { queryClient: qc } }) =>
    Promise.all([qc.ensureQueryData(queries.setupAudit(params.id)), qc.ensureQueryData(queries.setupAudits())]),
  component: lazyRouteComponent(() => import("@/features/audit/AuditDetailPage"), "AuditDetailPage"),
});

const assessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/assess",
  loader: ({ context: { queryClient: qc } }) => qc.ensureQueryData(queries.assessments()),
  component: lazyRouteComponent(() => import("@/features/assess/AssessPage"), "AssessPage"),
});

const experimentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/experiments",
  // ?template=<key> opens that template's form (links from topic widgets)
  validateSearch: (s: Record<string, unknown>): { template?: string } => (typeof s.template === "string" ? { template: s.template } : {}),
  loader: ({ context: { queryClient: qc } }) => qc.ensureQueryData(queries.experiments()),
  component: lazyRouteComponent(() => import("@/features/experiments/ExperimentsPage"), "ExperimentsPage"),
});

const experimentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/experiments/$id",
  loader: ({ params, context: { queryClient: qc } }) => qc.ensureQueryData(queries.experiment(params.id)),
  component: lazyRouteComponent(() => import("@/features/experiments/ExperimentPage"), "ExperimentPage"),
});

interface KbSearch {
  topic?: string;
}

const kbRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/kb",
  validateSearch: (s: Record<string, unknown>): KbSearch =>
    typeof s.topic === "string" && SECTION_BY_SLUG[s.topic] ? { topic: s.topic } : {},
  loader: ({ context: { queryClient: qc } }) => qc.ensureQueryData(queries.entries()),
  component: lazyRouteComponent(() => import("@/features/kb/KnowledgePage"), "KnowledgePage"),
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  topicRoute,
  mapRoute,
  introRoute,
  auditRoute,
  auditDetailRoute,
  assessRoute,
  experimentsRoute,
  experimentRoute,
  kbRoute,
]);

const topicIndex = (path: string) => {
  const m = /^\/topics\/([^/]+)/.exec(path);
  return m ? SECTIONS.findIndex((s) => s.slug === m[1]) : -1;
};

export function makeRouter(queryClient: QueryClient) {
  return createRouter({
    routeTree,
    context: { queryClient },
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0, // TanStack Query owns freshness
    scrollRestoration: true,
    // Route changes run through the View Transitions API. The type decides the motion:
    // topic → topic slides sideways (direction by order), hub → topic rises, anything else cross-fades.
    defaultViewTransition: {
      types: ({ fromLocation, toLocation }) => {
        const from = fromLocation ? topicIndex(fromLocation.pathname) : -1;
        const to = topicIndex(toLocation.pathname);
        if (from >= 0 && to >= 0 && from !== to) return [to > from ? "topic-next" : "topic-prev"];
        if (to >= 0) return ["enter-topic"];
        return ["page"];
      },
    },
  });
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof makeRouter>;
  }
}
