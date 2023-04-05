import { Component } from "solid-js";

const PageHeader: Component = (props: any) => {
    return (
        <div class="font-bold mb-4 self-center text-6xl">
            <h2>{props.title}</h2>
        </div>
    );
};

export default PageHeader;
