import "./style.css";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter,
  Route,
  Routes,
  Link,
  useSearchParams,
} from "react-router-dom";
import { ICalendlyTokens } from "../server_src/calendly.js";
import { InlineWidget as CalendlyInlineWidget } from "react-calendly";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

import { type DocViewerProps } from "@cyntler/react-doc-viewer/dist/esm/DocViewer.js";
const DocumentViewerCyntler = DocViewer as unknown as React.FC<DocViewerProps>;

const docs = [
  {
    uri: "/public/Kitten_Homefinder_CPA.pdf",
  },
  {
    uri: "/public/Screenshot 2023-11-21 at 10.29.35.png",
  },
  {
    uri: "/public/Working Title CJ4 User Guide v0.12.13.docx",
  },
  {
    uri: "/public/Thustmaster T16000m Joystick spring replacement.xlsx",
  },
];

export const Home: React.FC = () => {
  return (
    <div>
      <p>
        <Link to={`/doc-viewer`}>Docs</Link>
      </p>
      <p>
        <Link to={`/loom`}>Loom</Link>
      </p>
      <p>
        <Link to={`/calendly`}>Calendly</Link>
      </p>
    </div>
  );
};

export const Loom: React.FC = () => {
  return (
    <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
      <iframe
        src="https://www.loom.com/embed/cd1eb1d7f15e4e9c8d9390d0d584e2a3?sid=44519997-7066-4b1c-8895-0aed4c555763"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      ></iframe>
    </div>
  );
};

export const Calendly: React.FC = () => {
  const [oauthLink, setOauthLink] = useState<string>("");
  useEffect(() => {
    async function getCalendlyTokens(): Promise<void> {
      const resp = await fetch("/api/calendlyTokens");
      const tokens = (await resp.json()) as ICalendlyTokens;
      setOauthLink(
        `${tokens.oauthLink}?client_id=${tokens.clientId}&response_type=code&redirect_uri=http://localhost:5001/calendlyAuth`
      );
    }

    getCalendlyTokens().catch(console.log);
  });

  return (
    <div>
      {oauthLink ? <a href={oauthLink}>Connect Calendly</a> : <p>loading</p>}
      <CalendlyInlineWidget url="https://calendly.com/alan_sr" />
    </div>
  );
};

export const Docs: React.FC = () => {
  return (
    <DocumentViewerCyntler
      documents={docs}
      pluginRenderers={DocViewerRenderers}
    />
  );
};

export const CalendlyAuth: React.FC = () => {
  const [searchParams] = useSearchParams();
  const authCode = searchParams.get("code");
  return (
    <div>
      <p>{authCode}</p>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="loom/" Component={Loom} />
        <Route path="calendly/*" Component={Calendly} />
        <Route path="calendlyAuth/*" Component={CalendlyAuth} />
        <Route path="doc-viewer/*" Component={Docs} />
      </Routes>
    </BrowserRouter>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
