import type { JSX } from "solid-js";
import { Title } from "@solidjs/meta";
import Nav from "./Nav";

interface AppProps {
    title: string;
    children?: JSX.Element;
}

const Page = (props: AppProps) => {
    return (
        <>
            <Nav title={props.title} />
            <Title>{props.title}</Title>
            <div class="flex flex-col m-10">{props.children}</div>
        </>
    );
};

export default Page;
