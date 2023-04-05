interface PageHeaderProps {
    title: string;
}

const PageHeader = (props: PageHeaderProps) => {
    return (
        <div class="font-bold mb-4 self-center text-6xl">
            <h2>{props.title}</h2>
        </div>
    );
};

export default PageHeader;
