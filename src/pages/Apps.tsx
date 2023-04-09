import type { Component } from "solid-js";
import {
    SimpleGrid,
    Box,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    ModalHeader,
    ModalBody,
    ModalFooter,
    createDisclosure,
    IconButton,
} from "@hope-ui/solid";
import PageHeader from "../components/PageHeader";
import Nav from "../components/Nav";
import OpenInNew from "@suid/icons-material/OpenInNew";

import { meta as NatoAlphabetQuizMeta } from "./NatoAlphabet/meta";
import { meta as NatoTranslatorMeta } from "./NatoTranslator/meta";

interface AppProps {
    title: string;
    description: string;
    image: string;
    alt: string;
    github: string;
    url: string;
    tools: string[];
    date: string;
}

const Item = (props: AppProps) => {
    return (
        <Box class="bg-neutral-200 rounded-lg text-center p-6 justify-end flex flex-col dark:bg-neutral-800 cursor-pointer">
            <h2 class="text-2xl font-bold">{props.title}</h2>
            <p class="text-lg">{props.description}</p>
            <img
                class="rounded-2xl p-2"
                src={props.image}
                width="100%"
                height="100%"
                alt={props.alt}
            />
        </Box>
    );
};

const Card = (props: AppProps) => {
    const { isOpen, onOpen, onClose } = createDisclosure();

    return (
        <>
            <div onClick={onOpen}>
                <Item {...props} />
            </div>
            <Modal size="xl" centered opened={isOpen()} onClose={onClose}>
                <ModalOverlay />
                <ModalContent class="bg-neutral-200 dark:bg-neutral-800" p="$6">
                    <ModalCloseButton />
                    <ModalHeader class="flex flex-col">
                        <div class="flex flex-row justify-between">
                            <h2 class="text-2xl font-bold">{props.title}</h2>
                            <div class="flex flex-row mr-6">
                                <a href={props.github}>
                                    <IconButton
                                        icon={
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                            </svg>
                                        }
                                        aria-label="Github"
                                        variant="ghost"
                                        colorScheme="neutral"
                                    />
                                </a>
                            </div>
                        </div>
                        <p class="font-bold text-gray-500 text-sm">
                            {props.date}
                        </p>
                        <div class="flex flex-row"></div>
                    </ModalHeader>
                    <ModalBody>
                        <p class="text-lg">{props.description}</p>
                        <img
                            class="rounded-lg self-center mt-4"
                            src={props.image}
                            alt={props.alt}
                            width="100%"
                            height="100%"
                        />
                    </ModalBody>
                    <ModalFooter
                        class="flex flex-row"
                        justifyContent="space-between"
                    >
                        <a href={props.url}>
                            <Button
                                leftIcon={<OpenInNew />}
                                aria-label="Open live demo"
                                variant="solid"
                                colorScheme="success"
                            >
                                Launch
                            </Button>
                        </a>
                        <Button onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

const Home: Component = () => {
    return (
        <>
            <Nav />
            <div class="m-10">
                <div class="flex justify-center">
                    <PageHeader title="Apps" />
                </div>
                <SimpleGrid
                    gap="40px"
                    columns={{ "@initial": 1, "@md": 2, "@lg": 3 }}
                    class="mt-8"
                >
                    <Card {...NatoAlphabetQuizMeta} />
                    <Card {...NatoTranslatorMeta} />
                </SimpleGrid>
            </div>
        </>
    );
};

export default Home;
