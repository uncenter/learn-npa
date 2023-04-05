import type { Component } from "solid-js";
import { SimpleGrid, Box, Anchor } from "@hope-ui/solid";
import PageHeader from "../components/PageHeader";

const Home: Component = () => {
    return (
        <div class="m-10">
            <div class="flex justify-center">
                <PageHeader title="Apps" />
            </div>
            <SimpleGrid
                gap="40px"
                columns={{ "@initial": 2, "@md": 3 }}
                class="mt-8"
            >
                <a href="/nato-alphabet" class="w-full">
                    <Box class="bg-neutral-200 rounded-lg text-center p-6 justify-end flex flex-col">
                        <h2 class="text-2xl font-bold">NATO Alphabet Quiz</h2>
                        <img
                            class="rounded-2xl p-2"
                            src="src/assets/nato-alphabet.png"
                        />
                        <p class="text-lg">
                            A quiz to help you learn and practice the NATO
                            phonetic alphabet.
                        </p>
                    </Box>
                </a>
                <Box height="200px" class="bg-neutral-200 rounded-lg"></Box>
                <Box height="200px" class="bg-neutral-200 rounded-lg"></Box>
                <Box height="200px" class="bg-neutral-200 rounded-lg"></Box>
                <Box height="200px" class="bg-neutral-200 rounded-lg"></Box>
                <Box height="200px" class="bg-neutral-200 rounded-lg"></Box>
            </SimpleGrid>
        </div>
    );
};

export default Home;
