import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { Inter, Geist_Mono } from "next/font/google";
import { useEffect, useRef, useState } from "react";

import { getAuthToken } from "@/app/api/api";
import { authService, type AuthUser } from "@/app/Service/AuthService";
import AuthModal from "@/app/Components/Auth/AuthModal";
import { Sidebar } from "@/app/Components/Layout/sidebar";
import {
  AUTH_TOKEN_EVENT,
  PUBLIC_ROUTES,
  USER_ALLOWED_ROUTES,
} from "@/app/Constants/Common";
import "@/app/globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGuardModalOpen, setIsGuardModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const pendingRouteRef = useRef<string | null>(null);
  const previousAuthRef = useRef(false);
  const isPublicRoute = PUBLIC_ROUTES.has(router.pathname);
  const isAllowedUserRoute = USER_ALLOWED_ROUTES.has(router.pathname);
  const shouldShowSidebarLayout =
    isPublicRoute || isAllowedUserRoute || isAuthenticated;

  useEffect(() => {
    const syncAuthState = () => {
      const hasToken = Boolean(getAuthToken());
      setIsAuthenticated(hasToken);
      if (!hasToken) {
        setCurrentUser(null);
      }
      setIsAuthReady(true);
    };

    syncAuthState();
    window.addEventListener(AUTH_TOKEN_EVENT, syncAuthState);
    window.addEventListener("storage", syncAuthState);

    return () => {
      window.removeEventListener(AUTH_TOKEN_EVENT, syncAuthState);
      window.removeEventListener("storage", syncAuthState);
    };
  }, []);

  useEffect(() => {
    if (!isAuthReady || !isAuthenticated) {
      return;
    }

    let isMounted = true;

    const loadCurrentUser = async () => {
      try {
        const response = await authService.me();

        if (isMounted) {
          setCurrentUser(response.user);
        }
      } catch {
        if (isMounted) {
          setCurrentUser(null);
        }
      }
    };

    void loadCurrentUser();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, isAuthReady]);

  useEffect(() => {
    if (!isAuthReady) {
      return;
    }

    if (isAuthenticated) {
      if (!previousAuthRef.current) {
        const nextRoute =
          pendingRouteRef.current || (router.pathname === "/" ? "/home" : null);
        pendingRouteRef.current = null;

        if (nextRoute && nextRoute !== router.pathname) {
          void router.replace(nextRoute);
        }
      }

      previousAuthRef.current = true;
      return;
    }

    previousAuthRef.current = false;

    if (isPublicRoute || isAllowedUserRoute) {
      return;
    }

    pendingRouteRef.current = router.asPath;

    if (router.pathname !== "/") {
      queueMicrotask(() => {
        setIsGuardModalOpen(true);
      });

      void router.replace({
        pathname: "/",
        query: {
          login: "1",
        },
      });
    }
  }, [isAllowedUserRoute, isAuthenticated, isAuthReady, isPublicRoute, router]);

  const showProtectedLayout = isAuthReady && shouldShowSidebarLayout;
  // const shouldShowGuardModal =
  //   !isAuthenticated && router.pathname === "/" && router.query.login === "1";
  const shouldRenderCurrentPage =
    (showProtectedLayout && (isPublicRoute || isAllowedUserRoute)) ||
    isPublicRoute;

  return (
    <>
      <Head>
        <title>Pro-Read</title>
        <meta
          name="description"
          content="A literary reading platform with curated stories and community."
        />
      </Head>

      <div
        className={`${inter.variable} ${inter.className} ${geistMono.variable} dark antialiased font-sans`}
      >
        {showProtectedLayout ? (
          <div className="flex h-screen overflow-hidden bg-[#070c18]">
            <Sidebar
              isAuthenticated={isAuthenticated}
              currentUser={currentUser}
              onProtectedRouteClick={() => {
                if (!isAuthenticated) {
                  setIsGuardModalOpen(true);
                }
              }}
            />

            <main className="min-w-0 h-screen flex-1 overflow-y-auto">
              <Component {...pageProps} />
            </main>
          </div>
        ) : (
          <>{shouldRenderCurrentPage ? <Component {...pageProps} /> : null}</>
        )}

        <AuthModal
          isOpen={isGuardModalOpen}
          mode="login"
          onClose={() => {
            setIsGuardModalOpen(false);
            pendingRouteRef.current = null;

            if (router.pathname !== "/") {
              void router.replace("/");
            }
          }}
        />
      </div>
    </>
  );
}
