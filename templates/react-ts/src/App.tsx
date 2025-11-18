import { Github, Package } from "lucide-react";

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Geometric dotted background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_2px_at_center,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_-100px,rgba(56,189,248,0.08),transparent)]"></div>

      <div className="relative z-10 text-center space-y-8 px-8 max-w-4xl">
        {/* Main heading */}
        <div className="space-y-4 animate-fade-in">
          <h1 className="text-7xl md:text-8xl font-bold text-foreground tracking-tight font-mono">
            ¡Happy coding!
          </h1>
          <p className="text-2xl md:text-3xl text-muted-foreground font-medium animate-slide-up" style={{ animationDelay: "0.2s" }}>
            Generated with{" "}
            <span className="text-primary font-bold">ffontana-cli</span>
          </p>
        </div>

        {/* Description */}
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.4s" }}>
          A minimal, modern React template with TailwindCSS. Get started building your next amazing project in seconds.
        </p>

        {/* Links */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{ animationDelay: "0.6s" }}>
          <a
            href="https://www.npmjs.com/package/ffontana-cli"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 px-8 py-4 bg-foreground text-background rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 hover:opacity-90"
          >
            <Package className="w-5 h-5 transition-transform group-hover:rotate-12" />
            View on NPM
          </a>

          <a
            href="https://github.com/ffontanadev/ffontana-cli"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 px-8 py-4 bg-muted text-foreground rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 hover:bg-muted/80"
          >
            <Github className="w-5 h-5 transition-transform group-hover:rotate-12" />
            View on GitHub
          </a>
        </div>

        {/* Install command */}
        <div className="animate-scale-in" style={{ animationDelay: "0.8s" }}>
          <div className="inline-block bg-muted/50 backdrop-blur-sm px-6 py-3 rounded-lg border border-primary/20">
            <code className="text-primary font-mono text-sm md:text-base">
              npx ffontana-cli create my-app
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
