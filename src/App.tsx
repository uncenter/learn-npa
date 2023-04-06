import type { Component } from "solid-js";
import { MetaProvider, Title, Link, Meta } from "@solidjs/meta";
import {
    HopeThemeConfig,
    HopeProvider,
    NotificationsProvider,
} from "@hope-ui/solid";

import NatoAlphabetQuiz from "./pages/NatoAlphabet";
import Apps from "./pages/Apps";

import { Route, Routes } from "@solidjs/router";
import { createEffect, createSignal } from "solid-js";

const config: HopeThemeConfig = {
    initialColorMode: "system",
    lightTheme: {
        colors: {},
    },
    darkTheme: {
        colors: {},
    },
    components: {},
};

const DesktopOnly = () => (
    <div class="flex items-center justify-center h-screen mx-4">
        <div class="text-center">
            <h1 class="text-4xl font-bold mb-4">
                This app is meant for desktop only.
            </h1>
            <p class="text-lg">Please access it from your desktop computer.</p>
        </div>
    </div>
);

const App: Component = () => {
    const [isMobile, setIsMobile] = createSignal(false);

    createEffect(() => {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const isScreenSmall = window.innerWidth < 768;
        setIsMobile(isMobile || isScreenSmall);

        const interval = setInterval(() => {
            const isScreenSmall = window.innerWidth < 768;
            setIsMobile(isMobile || isScreenSmall);
        }, 500);

        return () => clearInterval(interval);
    });

    return (
        <>
            {/* {isMobile() ? (
                <DesktopOnly />
            ) : ( */}
            <MetaProvider>
                <Title>Apps</Title>
                <HopeProvider config={config}>
                    <NotificationsProvider placement={"bottom-start"}>
                        <Routes>
                            <Route path="/" component={Apps} />
                            <Route
                                path="/nato-alphabet"
                                component={NatoAlphabetQuiz}
                            />
                        </Routes>
                    </NotificationsProvider>
                </HopeProvider>
            </MetaProvider>
            {/* )} */}
        </>
    );
};
export default App;
