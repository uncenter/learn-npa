import { natoAlphabet } from "../NatoAlphabet/utils";
import { Component } from "solid-js";
import Page from "../../components/Page";

import { Button, TextField } from "@kobalte/core";

const encode = (text: string) => {
    return text
        .split("")
        .map((char) => {
            return natoAlphabet[char.toUpperCase()];
        })
        .join(" ");
};

const decode = (text: string) => {
    return text
        .split(" ")
        .map((word) => {
            return Object.keys(natoAlphabet).find(
                (key) => natoAlphabet[key] === word
            );
        })
        .filter((word) => word)
        .map((word) => word!.toLowerCase())
        .join("");
};

// Input field
// Output field
// Encode/Decode button
// Encode/Decode on enter
// Encode/Decode on change?

const NatoTranslator: Component = () => {
    return (
        <>
            <Page title="NATO Translator" />
            <div class="flex flex-col items-center justify-center">
                <TextField.Root>
                    <TextField.TextArea autoResize />
                </TextField.Root>
                <Button.Root>Encode</Button.Root>
                <Button.Root>Decode</Button.Root>
            </div>
        </>
    );
};

export default NatoTranslator;
