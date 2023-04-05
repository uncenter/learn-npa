import type { Component } from "solid-js";
import { HopeThemeConfig, HopeProvider } from "@hope-ui/solid";
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
        <HopeProvider config={config}>
            <Routes>
                <Route path="/" component={Apps} />
                <Route path="/nato-alphabet" component={NatoAlphabetQuiz} />
            </Routes>
        </HopeProvider>
    );
};
export default App;
