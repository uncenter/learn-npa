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

const App: Component = () => {
    return (
        <>
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
        </>
    );
};
export default App;
