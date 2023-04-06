import type { Component } from "solid-js";
import { SimpleGrid, Box, Anchor } from "@hope-ui/solid";
import PageHeader from "../components/PageHeader";
import Nav from "../components/Nav";

import natoAlphabetImg from "../assets/nato-alphabet.png";

interface CardProps {
    title: string;
    url: string;
    image: string;
    description: string;
}

const Card = (props: CardProps) => {
    return (
        <a href={props.url} class="w-full">
            <Box class="bg-neutral-200 rounded-lg text-center p-6 justify-end flex flex-col">
                <h2 class="text-2xl font-bold">{props.title}</h2>
                <p class="text-lg">{props.description}</p>
                <img class="rounded-2xl p-2" src={props.image} />
            </Box>
        </a>
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
                    columns={{ "@initial": 2, "@md": 3 }}
                    class="mt-8"
                >
                    <Card
                        title="NATO Alphabet Quiz"
                        url="/nato-alphabet"
                        image={natoAlphabetImg}
                        description="A quiz to help you learn and practice the NATO phonetic alphabet."
                    />
                </SimpleGrid>
            </div>
        </>
    );
};

export default Home;
