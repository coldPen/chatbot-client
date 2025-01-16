import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Fake Chatbot" },
    { name: "description", content: "Welcome to Fake Chatbot!" },
  ];
}

export default function Home() {
  return <div>Hello World</div>;
}
