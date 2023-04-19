import type { Component } from "solid-js";
import { MetaProvider, Title } from "@solidjs/meta";
import {
    HopeThemeConfig,
    HopeProvider,
    NotificationsProvider,
} from "@hope-ui/solid";

import Quiz from "./pages/Quiz";

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
                <Title>Phonetic Alphabet Tools</Title>
                <HopeProvider config={config}>
                    <NotificationsProvider placement={"bottom-start"}>
                        <Routes>
                            <Route path="/" component={Quiz} />
                        </Routes>
                    </NotificationsProvider>
                </HopeProvider>
            </MetaProvider>
        </>
    );
};
export default App;
