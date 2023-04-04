import { Component, createSignal } from "solid-js";
import { Button } from "@hope-ui/solid";
import { A } from "@solidjs/router";

const Nav: Component = () => {
    const [active, setActive] = createSignal(false);
    return (
        <div class="flex flex-start mx-10 my-6 mb-4 gap-4">
            <A href="/">
                <Button onClick={() => setActive(!active)}>Home</Button>
            </A>
            <A href="/phonetic-alphabet">
                <Button onClick={() => setActive(!active)}>
                    Phonetic Alphabet
                </Button>
            </A>
        </div>
    );
};

export default Nav;
