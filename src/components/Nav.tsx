import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
} from "@hope-ui/solid";
import { A } from "@solidjs/router";
import ChevronRightIcon from "@suid/icons-material/ChevronRight";
interface NavProps {
    title?: string;
}

const Nav = (props: NavProps) => {
    const titleExists = props.title !== undefined && props.title !== "";
    return (
        <div class="flex flex-start mx-10 my-6 mb-4 gap-4">
            <Breadcrumb separator={<ChevronRightIcon />}>
                <BreadcrumbItem>
                    <BreadcrumbLink as={A} href="/">
                        Apps
                    </BreadcrumbLink>
                    {titleExists && <BreadcrumbSeparator />}
                </BreadcrumbItem>
                {titleExists && (
                    <BreadcrumbItem>
                        <BreadcrumbLink currentPage>
                            {props.title}
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                )}
            </Breadcrumb>
        </div>
    );
};

export default Nav;
