import { Component, createSignal } from "solid-js";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
} from "@hope-ui/solid";
import { A } from "@solidjs/router";
import ChevronRightIcon from "@suid/icons-material/ChevronRight";

const Nav: Component = (props: any) => {
    return (
        <div class="flex flex-start mx-10 my-6 mb-4 gap-4">
            <Breadcrumb separator={<ChevronRightIcon />}>
                <BreadcrumbItem>
                    <BreadcrumbLink as={A} href="/">
                        Apps
                    </BreadcrumbLink>
                    <BreadcrumbSeparator />
                </BreadcrumbItem>
                <BreadcrumbItem>
                    <BreadcrumbLink currentPage>{props.title}</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
        </div>
    );
};

export default Nav;
