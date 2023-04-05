import type { Component } from "solid-js";
import { createSignal, createEffect } from "solid-js";
import {
    Button,
    Input,
    InputGroup,
    InputRightAddon,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    createDisclosure,
    CheckboxGroup,
    Checkbox,
    HStack,
} from "@hope-ui/solid";
import Nav from "../components/Nav";
import longWordsRaw from "../data/long-words.txt?raw";
import medWordsRaw from "../data/med-words.txt?raw";
import shortWordsRaw from "../data/short-words.txt?raw";
import FuzzySet from "fuzzyset";

const wordLists: Record<string, string[]> = {
    long: longWordsRaw.split("\n"),
    medium: medWordsRaw.split("\n"),
    short: shortWordsRaw.split("\n").filter((word) => word.length > 3),
};

const natoAlphabet: Record<string, string> = {
    A: "Alpha",
    B: "Bravo",
    C: "Charlie",
    D: "Delta",
    E: "Echo",
    F: "Foxtrot",
    G: "Golf",
    H: "Hotel",
    I: "India",
    J: "Juliett",
    K: "Kilo",
    L: "Lima",
    M: "Mike",
    N: "November",
    O: "Oscar",
    P: "Papa",
    Q: "Quebec",
    R: "Romeo",
    S: "Sierra",
    T: "Tango",
    U: "Uniform",
    V: "Victor",
    W: "Whiskey",
    X: "X-ray",
    Y: "Yankee",
    Z: "Zulu",
};

const fuzzy = FuzzySet();
for (let word of Object.values(natoAlphabet)) {
    fuzzy.add(word);
}

function phoneticWords(word: string) {
    const phoneticWords = [];
    for (let i = 0; i < word.length; i++) {
        phoneticWords.push(natoAlphabet[word[i].toUpperCase()]);
    }
    return phoneticWords;
}

function isCorrect(inputWords: string[], correctWords: string[]) {
    if (
        inputWords.length !== correctWords.length ||
        inputWords.every((word) => word.length === 1)
    ) {
        return false;
    }
    for (let i = 0; i < inputWords.length; i++) {
        if (inputWords[i].length === 1) {
            return false;
        }
        const fuzzyMatch = fuzzy.get(inputWords[i])[0];
        if (fuzzyMatch[0] < 0.85 && fuzzyMatch[1] !== correctWords[i]) {
            return false;
        }
    }
    return true;
}

function mergeArrays(...arrays: any[]) {
    let merged: any[] = [];
    for (let array of arrays) {
        merged = merged.concat(array);
    }
    return merged;
}

const AnswerCard = (props: any) => {
    return (
        <div>
            <div class={`rounded-lg shadow-lg mt-4 text-center mx-6 uppercase`}>
                <h2
                    class={`flex font-bold ${
                        props.correct ? "bg-green-500" : "bg-[#b71c1c]"
                    } text-white justify-center py-2 rounded-t-lg`}
                >
                    {props.word}
                </h2>
                <div class="p-6 flex text-lg">
                    <div class=" block basis-0 grow shrink p-3">
                        <h3 class="mb-2">Your answer</h3>
                        <p class="font-bold text-2xl">{props.input || "N/A"}</p>
                    </div>
                    <div class="block basis-0 grow shrink p-3">
                        <h3 class="text-md mb-2">Correct answer</h3>
                        <p class="font-bold text-2xl">{props.answer}</p>
                    </div>
                </div>
            </div>
            <Button
                onClick={() => {
                    props.reset();
                }}
                colorScheme={"accent"}
                class="flex mt-8 h-14 text-xl m-auto"
            >
                Another?
            </Button>
        </div>
    );
};

const ReferenceCard = () => {
    const alphabet = Object.entries(natoAlphabet);
    const middleIndex = Math.ceil(alphabet.length / 2);
    const leftAlphabet = alphabet.slice(0, middleIndex);
    const rightAlphabet = alphabet.slice(middleIndex);
    const { isOpen, onOpen, onClose } = createDisclosure();

    return (
        <>
            <Button
                class="h-14 text-xl mr-1"
                colorScheme="info"
                onClick={onOpen}
            >
                Cheat/Reference Sheet
            </Button>
            <Modal centered size={"xl"} opened={isOpen()} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton />
                    <ModalHeader>NATO/FAA Phonetic Alphabet</ModalHeader>
                    <ModalBody>
                        <div class="inline-block py-2 w-2/5">
                            <table class="min-w-full text-left font-light ml-[40%]">
                                <tbody>
                                    {leftAlphabet.map((entry: any) => {
                                        const letter = entry[0];
                                        const phonetic = entry[1];
                                        return (
                                            <tr class={`border-none`}>
                                                <th class="text-right px-4 py-2">
                                                    {letter}
                                                </th>
                                                <td class="text-left px-4 py-2">
                                                    {phonetic}
                                                </td>
                                                <th class="text-right px-4 py-2">
                                                    {
                                                        rightAlphabet[
                                                            leftAlphabet.indexOf(
                                                                entry
                                                            )
                                                        ][0]
                                                    }
                                                </th>
                                                <td class="text-left px-4 py-2">
                                                    {
                                                        rightAlphabet[
                                                            leftAlphabet.indexOf(
                                                                entry
                                                            )
                                                        ][1]
                                                    }
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="danger" onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

const NatoAlphabetQuiz: Component = () => {
    const pastCharacters: any = {};
    const [words, setWords] = createSignal(mergeArrays(wordLists.short));
    const [word, setWord] = createSignal(
        words()[Math.floor(Math.random() * words().length)].toUpperCase()
    );

    const [submitted, setSubmitted] = createSignal(false);
    const [text, setText] = createSignal("");
    function countCommonChars(word: string, characters: any) {
        let count = 0;
        for (let character of word) {
            count += characters[character.toUpperCase()] || 0;
        }
        return count;
    }
    function newWord() {
        const wordCounts = words().map((word) => ({
            word,
            count: countCommonChars(word, pastCharacters),
        }));

        const sortedWords = wordCounts.sort((a, b) => a.count - b.count);

        const minCount = sortedWords[0].count;
        const minCountWords = sortedWords.filter((w) => w.count === minCount);
        const randomIndex = Math.floor(Math.random() * minCountWords.length);
        setWord(minCountWords[randomIndex].word.toUpperCase());
    }
    function addCharacters(word: string) {
        const characters = word.split("");
        for (let character of characters) {
            if (!pastCharacters[character]) {
                pastCharacters[character] = 1;
            } else {
                pastCharacters[character] += 1;
            }
        }
    }
    createEffect(() => {
        if (submitted()) {
            addCharacters(word());
        }
    });
    function reset() {
        setSubmitted(false);
        newWord();
        const input = ((
            document.getElementById("input") as HTMLInputElement
        ).value = "");
        setText("");
    }
    function updateWords(e: any, newWords: string) {
        if (e.target.checked) {
            setWords(words().concat(wordLists[newWords]));
        } else {
            setWords(
                words().filter(
                    (word: string) => !wordLists[newWords].includes(word)
                )
            );
        }
        reset();
    }
    return (
        <>
            <Nav title="NATO Alphabet Quiz" />
            <div class="flex m-10 flex-col">
                <div class="flex flex-col gap-4 mx-6">
                    <div class="self-center text-4xl bg-gray-200 text-zinc-700 rounded-lg p-4 font-typewriter mb-4">
                        {word()}
                    </div>
                    <InputGroup class="flex-row">
                        <ReferenceCard />
                        <Input
                            id="input"
                            class="h-14 uppercase text-2xl"
                            disabled={submitted()}
                            size="lg"
                            oninput={(e) => setText(e.target.value)}
                            onkeypress={(e) => {
                                if (e.key === "Enter") {
                                    setSubmitted(true);
                                }
                            }}
                        />
                        <InputRightAddon class="ps-0 pe-0">
                            <Button
                                id="submit"
                                class="h-full text-xl"
                                colorScheme="accent"
                                disabled={submitted() || text().length === 0}
                                onclick={() => {
                                    setSubmitted(true);
                                }}
                            >
                                Check
                            </Button>
                        </InputRightAddon>
                        <Button
                            id="reset"
                            class="h-14 text-xl ml-1"
                            colorScheme="neutral"
                            disabled={submitted()}
                            onclick={() => {
                                reset();
                            }}
                        >
                            Skip
                        </Button>
                    </InputGroup>
                </div>
                <h2 class="font-bold my-4 self-center text-2xl">
                    Word lengths
                </h2>
                <CheckboxGroup
                    colorScheme="info"
                    defaultValue={["short"]}
                    class="flex flex-row gap-4 m-auto mb-4"
                >
                    <HStack spacing="$5">
                        <Checkbox
                            value="short"
                            onchange={(e: any) => {
                                updateWords(e, "short");
                            }}
                        >
                            Short
                        </Checkbox>
                        <Checkbox
                            value="medium"
                            onchange={(e: any) => {
                                updateWords(e, "medium");
                            }}
                        >
                            Medium
                        </Checkbox>
                        <Checkbox
                            value="long"
                            onchange={(e: any) => {
                                updateWords(e, "long");
                            }}
                        >
                            Long
                        </Checkbox>
                    </HStack>
                </CheckboxGroup>
                {submitted() && (
                    <AnswerCard
                        word={word}
                        input={text()}
                        answer={phoneticWords(word()).join(" ")}
                        correct={isCorrect(
                            text().split(" "),
                            phoneticWords(word())
                        )}
                        reset={reset}
                    />
                )}
            </div>
        </>
    );
};

export default NatoAlphabetQuiz;
