import { createSignal, createEffect } from "solid-js";
import { twMerge } from "tailwind-merge";

import { Button, Dialog, TextField, Toast, toaster } from "@kobalte/core";

import longWordsRaw from "../../data/long-words.txt?raw";
import medWordsRaw from "../../data/med-words.txt?raw";
import shortWordsRaw from "../../data/short-words.txt?raw";

import { Dangerous, Help, Settings, Close } from "@suid/icons-material";

import { natoAlphabet, phoneticWords, isCorrect, mergeArrays } from "../utils";
import { Portal } from "solid-js/web";

const styles = {
    button: {
        outline: {
            red: "text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900",
        },
        blue: "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800",
        purple: "focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900",
        green: "focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800",
        gray: "text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700",
    },
    input: {
        field: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
        label: "block mb-2 text-sm font-medium text-gray-900 dark:text-white",
    },
};

const wordListsArray: Record<string, string[]> = {
    long: longWordsRaw.split("\n"),
    medium: medWordsRaw.split("\n"),
    short: shortWordsRaw.split("\n").filter((word: string) => word.length > 3),
};

const AnswerCard = (props: any) => {
    let nextButton: any;
    setTimeout(() => nextButton.focus());

    const [isWindowSmall, setIsWindowSmall] = createSignal(
        window.innerWidth < 768
    );
    setInterval(() => {
        setIsWindowSmall(window.innerWidth < 768);
    }, 500);

    return (
        <div>
            <div class="rounded-lg shadow-lg mt-8 text-center mx-6 uppercase">
                <h2
                    class={`flex font-bold ${
                        props.correct ? "bg-green-500" : "bg-[#b71c1c]"
                    } text-white justify-center py-2 rounded-t-lg`}
                >
                    {props.word}
                </h2>
                <div
                    class={`p-6 flex text-lg ${
                        isWindowSmall() ? "flex-col" : ""
                    }`}
                >
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
            <Button.Root
                onClick={() => {
                    props.reset();
                }}
                class={twMerge("mx-auto mt-8 flex", styles.button.purple)}
                ref={nextButton}
            >
                Next
            </Button.Root>
        </div>
    );
};

const ReferenceCard = () => {
    const alphabet = Object.entries(natoAlphabet);
    const middleIndex = Math.ceil(alphabet.length / 2);
    const leftAlphabet = alphabet.slice(0, middleIndex);
    const rightAlphabet = alphabet.slice(middleIndex);
    const [open, setOpen] = createSignal(false);

    return (
        <>
            <Dialog.Root open={open()} onOpenChange={setOpen}>
                <Dialog.Trigger asChild>
                    <Button.Root
                        class={twMerge("mr-1", styles.button.blue)}
                        onClick={() => setOpen(true)}
                    >
                        Lookup
                    </Button.Root>
                </Dialog.Trigger>
                <Dialog.Portal>
                    <Dialog.Overlay />
                    <div>
                        <Dialog.Content>
                            <div>
                                <Dialog.Title>
                                    NATO/FAA Phonetic Alphabet
                                </Dialog.Title>
                                <Dialog.CloseButton>
                                    <Close />
                                </Dialog.CloseButton>
                            </div>
                            <Dialog.Description>
                                <div class="inline-block py-2 w-2/5 text-base">
                                    <table class="min-w-full text-left font-light ml-[50%]">
                                        <tbody>
                                            {leftAlphabet.map((entry: any) => {
                                                const letter = entry[0];
                                                const phonetic = entry[1];
                                                return (
                                                    <tr class="border-none">
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
                            </Dialog.Description>
                        </Dialog.Content>
                    </div>
                </Dialog.Portal>
            </Dialog.Root>
        </>
    );
};

export default function Quiz() {
    const data: any = {
        wordLists: ["short"],
        pastCharacters: {},
    };
    for (let key in data) {
        if (localStorage.getItem(key)) {
            data[key] = JSON.parse(localStorage.getItem(key) || "");
        } else {
            localStorage.setItem(key, JSON.stringify(data[key]));
        }
    }
    let words: string[] = [];
    for (let list of data.wordLists) {
        words = mergeArrays(words, wordListsArray[list]);
    }
    const [word, setWord] = createSignal(
        localStorage.getItem("word")
            ? localStorage.getItem("word")
            : words[Math.floor(Math.random() * words.length)].toUpperCase()
    );
    localStorage.setItem("word", word() as any);
    const [bias, setBias] = createSignal(
        localStorage.getItem("bias")
            ? parseInt(localStorage.getItem("bias") || "")
            : 2
    );
    localStorage.setItem("bias", bias().toString());
    const [submitted, setSubmitted] = createSignal(
        localStorage.getItem("submitted")
            ? Boolean(JSON.parse(localStorage.getItem("submitted") || ""))
            : false
    );
    localStorage.setItem("submitted", submitted().toString());
    const [text, setText] = createSignal(
        localStorage.getItem("text") ? localStorage.getItem("text") : ""
    );
    if (!submitted() && (text() as any).length > 0) {
        setText("");
    }

    function newWord() {
        function countCommonChars(word: string, characters: any) {
            let count = 0;
            for (let character of word) {
                count += characters[character.toUpperCase()] || 0;
            }
            return count;
        }
        if (words.length === 0) {
            console.log("No words left! How did you do that?");
            return;
        }
        if (bias() > 0) {
            const wordCounts = words.map((word: string) => ({
                word,
                count: countCommonChars(word, data.pastCharacters),
            }));

            const sortedWords = wordCounts.sort(
                (a: any, b: any) => a.count - b.count
            );

            const minCount = sortedWords[0].count;
            const minCountWords = sortedWords.filter(
                (w: any) => w.count === minCount
            );
            let randomIndex = Math.floor(Math.random() * minCountWords.length);
            const biasScore: any = {
                1: 3, // Once every 3 words
                2: 2, // Once every 2 words
                3: 1, // Every word
            };
            const randomOrBias = Math.floor(Math.random() * biasScore[bias()]);
            if (randomOrBias !== 0) {
                randomIndex = Math.floor(Math.random() * words.length);
                setWord(words[randomIndex].toUpperCase());
            } else {
                setWord(minCountWords[randomIndex].word.toUpperCase());
            }
        } else {
            const randomIndex = Math.floor(Math.random() * words.length);
            setWord(words[randomIndex].toUpperCase());
        }
        localStorage.setItem("word", word() || "");
    }
    function addCharacters(word: string) {
        const characters = word.split("");
        for (let character of characters) {
            if (!data.pastCharacters[character]) {
                data.pastCharacters[character] = 1;
            } else {
                data.pastCharacters[character] += 1;
            }
        }
        localStorage.setItem(
            "pastCharacters",
            JSON.stringify(data.pastCharacters)
        );
    }
    createEffect(() => {
        if (submitted()) {
            addCharacters(word() || "");
            const input = document.getElementById("input") as HTMLInputElement;
            if (input) {
                input.value = text() || "";
            }
            localStorage.setItem("submitted", "true");
        }
    });
    function reset() {
        setSubmitted(false);
        localStorage.setItem("submitted", "false");
        newWord();
        (document.getElementById("input") as HTMLInputElement).value = "";
        setText("");
    }
    function updateWords(e: any, wordList: string) {
        if (e.target.checked) {
            words = words.concat(wordListsArray[wordList]);
            if (!data.wordLists.includes(wordList)) {
                data.wordLists.push(wordList);
            }
        } else {
            if (data.wordLists.length === 1) {
                toaster.show((props) => (
                    <Toast.Root
                        toastId={props.toastId}
                        class="flex flex-col items-center justify-between gap-2 border border-zinc-300 shadow-lg p-3 rounded-md border-solid bg-zinc-50"
                    >
                        <div class="flex items-start w-full">
                            <div>
                                <Toast.Title class="text-base font-medium text-zinc-900">
                                    Cannot remove all word lists!
                                </Toast.Title>
                                <Toast.Description class="text-sm text-zinc-700">
                                    Make sure you have at least one word list
                                    selected.
                                </Toast.Description>
                            </div>
                            <Toast.CloseButton class="shrink-0 h-4 w-4 text-zinc-600 ml-auto">
                                <Close />
                            </Toast.CloseButton>
                        </div>
                        <Toast.ProgressTrack class="h-2 w-full bg-zinc-200 rounded-[3px]">
                            <Toast.ProgressFill class="bg-[hsl(200_98%_39%)] h-full w-[var(--kb-toast-progress-fill-width)] transition-[width] duration-[250ms] ease-linear rounded-[3px]" />
                        </Toast.ProgressTrack>
                    </Toast.Root>
                ));
                return;
            }
            words = words.filter(
                (word: string) => !wordListsArray[wordList].includes(word)
            );
            if (data.wordLists.includes(wordList)) {
                data.wordLists.splice(data.wordLists.indexOf(wordList), 1);
            }
        }
        localStorage.setItem("wordLists", JSON.stringify(data.wordLists));
        reset();
    }
    const [isWindowSmall, setIsWindowSmall] = createSignal(
        window.innerWidth < 768
    );
    const [isWindowSuperSmall, setIsWindowSuperSmall] = createSignal(
        window.innerWidth < 500
    );
    const [settingsOpen, setSettingsOpen] = createSignal(false);
    setInterval(() => {
        setIsWindowSmall(window.innerWidth < 768);
        setIsWindowSuperSmall(window.innerWidth < 500);
    }, 500);
    return (
        <>
            <Button.Root
                onClick={() => setSettingsOpen(!settingsOpen())}
                class={twMerge("fixed top-5 right-8", styles.button.gray)}
                aria-label="Settings"
            >
                <Settings />
            </Button.Root>
            <div class="flex flex-col gap-4 mx-6">
                <div class="self-center text-4xl bg-gray-200 text-zinc-700 rounded-lg p-4 mb-4">
                    <span>{word()}</span>
                </div>
                {!isWindowSmall() && (
                    <div class="flex flex-row">
                        <ReferenceCard />
                        <TextField.Root
                            id="input"
                            disabled={submitted()}
                            class={twMerge("uppercase", styles.input.field)}
                            oninput={(e: any) =>
                                setText(e.target.value) &&
                                localStorage.setItem("text", e.target.value)
                            }
                            onkeypress={(e) => {
                                if (e.key === "Enter") {
                                    setSubmitted(true);
                                }
                            }}
                        />
                        <Button.Root
                            id="submit"
                            class={styles.button.purple}
                            disabled={submitted() || text()?.length === 0}
                            onclick={() => {
                                setSubmitted(true);
                            }}
                        >
                            Check
                        </Button.Root>
                        <Button.Root
                            id="reset"
                            class={twMerge("ml-4", styles.button.gray)}
                            disabled={submitted()}
                            onclick={() => {
                                reset();
                            }}
                        >
                            Skip
                        </Button.Root>
                    </div>
                )}
                {isWindowSmall() && (
                    <>
                        <TextField.Root
                            id="input"
                            class={twMerge("uppercase", styles.input.field)}
                            disabled={submitted()}
                            oninput={(e: any) =>
                                setText(e.target.value) &&
                                localStorage.setItem("text", e.target.value)
                            }
                            onkeypress={(e) => {
                                if (e.key === "Enter") {
                                    setSubmitted(true);
                                }
                            }}
                            aria-label="Answer"
                        />
                        {!submitted() && (
                            <>
                                <div class="flex flex-row gap-4 m-auto">
                                    <ReferenceCard />
                                    {!isWindowSuperSmall() && (
                                        <Button.Root
                                            id="submit"
                                            class={styles.button.purple}
                                            disabled={
                                                submitted() ||
                                                text()?.length === 0
                                            }
                                            onclick={() => {
                                                setSubmitted(true);
                                            }}
                                        >
                                            Submit
                                        </Button.Root>
                                    )}
                                    <Button.Root
                                        id="reset"
                                        class={twMerge(
                                            "ml-4",
                                            styles.button.gray
                                        )}
                                        disabled={submitted()}
                                        onclick={() => {
                                            reset();
                                        }}
                                    >
                                        Skip
                                    </Button.Root>
                                </div>
                                {isWindowSuperSmall() && (
                                    <Button.Root
                                        id="submit"
                                        class={styles.button.purple}
                                        disabled={
                                            submitted() || text()?.length === 0
                                        }
                                        onclick={() => {
                                            setSubmitted(true);
                                        }}
                                    >
                                        Submit
                                    </Button.Root>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>
            <Drawer opened={isOpen()} placement="right" onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerBody>
                        <div class="flex flex-col mx-4 gap-6">
                            <div>
                                <h2 class="font-bold my-4 self-center text-2xl">
                                    Word length
                                </h2>
                                <CheckboxGroup
                                    colorScheme="info"
                                    defaultValue={JSON.parse(
                                        localStorage.getItem("wordLists") ||
                                            "[]"
                                    )}
                                    display="flex"
                                    gap="$4"
                                    m="auto"
                                >
                                    <HStack spacing="$5" mt="$4">
                                        <Checkbox
                                            id="short"
                                            value="short"
                                            onchange={(e: any) => {
                                                updateWords(e, "short");
                                            }}
                                        >
                                            Short
                                        </Checkbox>
                                        <Checkbox
                                            id="medium"
                                            value="medium"
                                            onchange={(e: any) => {
                                                updateWords(e, "medium");
                                            }}
                                        >
                                            Medium
                                        </Checkbox>
                                        <Checkbox
                                            id="long"
                                            value="long"
                                            onchange={(e: any) => {
                                                updateWords(e, "long");
                                            }}
                                        >
                                            Long
                                        </Checkbox>
                                    </HStack>
                                </CheckboxGroup>
                            </div>
                            <div>
                                <h2 class="font-bold my-4 self-center text-2xl">
                                    <span>Smart selection</span>
                                    <Popover triggerMode="click">
                                        <PopoverTrigger
                                            as={IconButton}
                                            variant="ghost"
                                            colorScheme="info"
                                            aria-label="Help"
                                            ml="$2"
                                            icon={<Help />}
                                        ></PopoverTrigger>
                                        <PopoverContent>
                                            <PopoverArrow />
                                            <PopoverCloseButton />
                                            <PopoverBody>
                                                <p class="text-sm">
                                                    With a higher "smart
                                                    selection" bias, selected
                                                    words will have a more even
                                                    distribution of characters.
                                                    Without, words will be
                                                    selected at random, leaning
                                                    towards words with common
                                                    characters.
                                                </p>
                                            </PopoverBody>
                                        </PopoverContent>
                                    </Popover>
                                </h2>
                                <Select
                                    defaultValue={bias()}
                                    onChange={(e) =>
                                        setBias(e) &&
                                        localStorage.setItem("bias", e)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                        <SelectIcon />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectListbox>
                                            <SelectOption value={0}>
                                                <SelectOptionText>
                                                    None
                                                </SelectOptionText>
                                                <SelectOptionIndicator />
                                            </SelectOption>
                                            <SelectOption value={1}>
                                                <SelectOptionText>
                                                    Low
                                                </SelectOptionText>
                                                <SelectOptionIndicator />
                                            </SelectOption>
                                            <SelectOption value={2}>
                                                <SelectOptionText>
                                                    Medium
                                                </SelectOptionText>
                                                <SelectOptionIndicator />
                                            </SelectOption>
                                            <SelectOption value={3}>
                                                <SelectOptionText>
                                                    High
                                                </SelectOptionText>
                                                <SelectOptionIndicator />
                                            </SelectOption>
                                        </SelectListbox>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </DrawerBody>
                    <DrawerFooter>
                        <Button.Root
                            class={twMerge(
                                "mr-3 bg-red-500",
                                styles.button.outline.red
                            )}
                            onclick={() => {
                                localStorage.clear();
                                window.location.reload();
                            }}
                        >
                            <Dangerous class="fill-current w-4 h-4 mr-2" />
                            Reset
                        </Button.Root>
                        <Button.Root
                            class={twMerge("mr-3", styles.button.green)}
                            onClick={onClose}
                        >
                            Save & Close
                        </Button.Root>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
            {submitted() && (
                <AnswerCard
                    word={word}
                    input={text()}
                    answer={phoneticWords(word() as any).join(" ")}
                    correct={isCorrect(
                        (text() || "").split(" "),
                        phoneticWords(word() as any)
                    )}
                    reset={reset}
                />
            )}
            <Portal>
                <Toast.Region>
                    <Toast.List
                        class="fixed flex flex-col gap-2 w-[400px] max-w-[100vw] z-[9999] m-0 p-4 right-0 bottom-0"
                        style={{ "list-style": "none", outline: "none" }}
                    />
                </Toast.Region>
            </Portal>
        </>
    );
}
