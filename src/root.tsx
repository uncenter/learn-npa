// @refresh reload
import { Suspense } from "solid-js";
import {
    Body,
    ErrorBoundary,
    FileRoutes,
    Head,
    Html,
    Meta,
    Routes,
    Scripts,
    Title,
} from "solid-start";
import "./root.css";

export default function Root() {
    return (
        <Html lang="en">
            <Head>
                <Title>Phonetic Alphabet</Title>
                <Meta charset="utf-8" />
                <Meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <Meta name="theme-color" content="#000000" />
                <Meta
                    name="description"
                    content="Various tools for learning and using the NATO phonetic alphabet."
                />
                <link rel="shortcut icon" type="image/png" href="logo.png" />
                <script
                    async
                    defer
                    data-website-id="a93d333e-98cf-4c17-8cc3-7aea7de996c8"
                    data-domains="alphabet.uncenter.org"
                    src="https://stats.uncenter.org/beepboop.js"
                ></script>
            </Head>
            <Body>
                <Suspense>
                    <ErrorBoundary>
                        <Routes>
                            <FileRoutes />
                        </Routes>
                    </ErrorBoundary>
                </Suspense>
                <Scripts />
            </Body>
        </Html>
    );
}
