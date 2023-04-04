import type { Component } from "solid-js";
import { HopeThemeConfig, HopeProvider } from "@hope-ui/solid";
import PhoneticAlphabetQuiz from "./pages/PhoneticAlphabet";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import { Route, Routes } from "@solidjs/router";

const config: HopeThemeConfig = {
    initialColorMode: "system",
    lightTheme: {
        colors: {
            primary1: "#fefcff",
            // ...
            primary12: "#340c3b",
        },
    },
    darkTheme: {
        colors: {
            primary1: "#1d131d",
            // ...
            primary12: "#fbecfc",
        },
    },
    components: {},
};

const App: Component = () => {
    return (
        <HopeProvider config={config}>
            <Nav />
            <Routes>
                <Route path="/" component={Home} />
                <Route
                    path="/phonetic-alphabet"
                    component={PhoneticAlphabetQuiz}
                />
            </Routes>
        </HopeProvider>
    );
};
export default App;
