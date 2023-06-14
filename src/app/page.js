export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold mb-2">DevDuetAI</h1>
      <h2 className="text-2xl mb-4">
        A code collaborator plugin for ChatGPT and for GitHub
      </h2>
      <h3 className="text-lg">
        Check out the code on the{" "}
        <a
          href="https://github.com/AustinMichaelColeman/dev-duet-ai/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-700 underline"
        >
          dev-duet-ai GitHub project
        </a>
        .
      </h3>
    </main>
  );
}
