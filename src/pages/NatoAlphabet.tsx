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
    Select,
    SelectTrigger,
    SelectValue,
    SelectIcon,
    SelectContent,
    SelectListbox,
    SelectOption,
    SelectOptionText,
    SelectOptionIndicator,
    notificationService,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    Icon,
    Popover,
    PopoverTrigger,
    PopoverAnchor,
    PopoverContent,
    PopoverArrow,
    PopoverCloseButton,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    IconButton,
} from "@hope-ui/solid";
import Nav from "../components/Nav";
import longWordsRaw from "../data/long-words.txt?raw";
import medWordsRaw from "../data/med-words.txt?raw";
import shortWordsRaw from "../data/short-words.txt?raw";
import FuzzySet from "fuzzyset";

import DangerousIcon from "@suid/icons-material/Dangerous";
import HelpIcon from "@suid/icons-material/Help";
import SettingsIcon from "@suid/icons-material/Settings";

const wordListsArray: Record<string, string[]> = {
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
            <div class="rounded-lg shadow-lg mt-4 text-center mx-6 uppercase">
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
                height="$14"
                colorScheme="accent"
                mx="auto"
                mt="$8"
                display="flex"
                fontSize="$lg"
            >
                Next
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
                height="$14"
                fontSize="$lg"
                mr="$1"
                colorScheme="info"
                onClick={onOpen}
            >
                Reference
            </Button>
            <Modal centered size="xl" opened={isOpen()} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton />
                    <ModalHeader>NATO/FAA Phonetic Alphabet</ModalHeader>
                    <ModalBody>
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
        if (list.includes(undefined)) {
            console.log(list);
        }
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
                notificationService.show({
                    status: "warning",
                    title: "Cannot remove all word lists!",
                    description:
                        "Make sure you have at least one word list selected.",
                });
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
    const { isOpen, onOpen, onClose } = createDisclosure();
    return (
        <>
            <Nav title="NATO Alphabet Quiz" />
            <Button
                leftIcon={<SettingsIcon />}
                onClick={onOpen}
                variant={"outline"}
                colorScheme={"neutral"}
                iconSpacing="0"
                position={"fixed"}
                top="$4"
                right="$4"
            />
            <div class="flex m-10 flex-col">
                <div class="flex flex-col gap-4 mx-6">
                    <div class="self-center text-4xl bg-gray-200 text-zinc-700 rounded-lg p-4 font-typewriter mb-4">
                        {word()}
                    </div>
                    <InputGroup display="flex" flexDirection="row">
                        <ReferenceCard />
                        <Input
                            id="input"
                            height="$14"
                            fontSize="$2xl"
                            textTransform="uppercase"
                            disabled={submitted()}
                            size="lg"
                            oninput={(e) =>
                                setText(e.target.value) &&
                                localStorage.setItem("text", e.target.value)
                            }
                            onkeypress={(e) => {
                                if (e.key === "Enter") {
                                    setSubmitted(true);
                                }
                            }}
                        />
                        <InputRightAddon ps={0} pe={0}>
                            <Button
                                id="submit"
                                fontSize="$lg"
                                height="$full"
                                colorScheme="accent"
                                disabled={submitted() || text()?.length === 0}
                                onclick={() => {
                                    setSubmitted(true);
                                }}
                            >
                                Check
                            </Button>
                        </InputRightAddon>
                        <Button
                            id="reset"
                            height="$14"
                            fontSize="$lg"
                            ml="$1"
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
                                                icon={<HelpIcon />}
                                            ></PopoverTrigger>
                                            <PopoverContent>
                                                <PopoverArrow />
                                                <PopoverCloseButton />
                                                <PopoverBody>
                                                    <p class="text-sm">
                                                        With a higher "smart
                                                        selection" bias,
                                                        selected words will have
                                                        a more even distribution
                                                        of characters. Without,
                                                        words will be selected
                                                        at random, leaning
                                                        towards words with
                                                        common characters.
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
                            <Button
                                leftIcon={
                                    <Icon
                                        as={(<DangerousIcon />) as any}
                                        bgColor={"#e53e3e"}
                                    />
                                }
                                variant="dashed"
                                borderColor={"#e53e3e"}
                                color={"#e53e3e"}
                                _hover={{
                                    borderColor: "#e53e3e",
                                    background: "#e53e3e",
                                    color: "white",
                                }}
                                mr="$3"
                                onclick={() => {
                                    localStorage.clear();
                                    window.location.reload();
                                }}
                            >
                                Reset
                            </Button>
                            <Button
                                variant="solid"
                                mr="$3"
                                colorScheme="success"
                                onClick={onClose}
                            >
                                Save & Close
                            </Button>
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
            </div>
        </>
    );
};

export default NatoAlphabetQuiz;
