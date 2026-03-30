import Link from "next/link";
import { Eye } from "lucide-react";

export function AppFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-3">
              <Eye className="h-5 w-5 text-primary" />
              OpenFloor
            </Link>
            <p className="text-sm text-muted-foreground max-w-md">
              Open the floor for civic discussion. Making civic and political content accessible,
              understandable, and discussable for everyone.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/explore" className="hover:text-foreground transition-colors">Explore</Link></li>
              <li><Link href="/topics" className="hover:text-foreground transition-colors">Topics</Link></li>
              <li><Link href="/sources" className="hover:text-foreground transition-colors">Sources</Link></li>
              <li><Link href="/submit" className="hover:text-foreground transition-colors">Submit Video</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">About</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground transition-colors">About OpenFloor</Link></li>
              <li><Link href="/about#methodology" className="hover:text-foreground transition-colors">AI Methodology</Link></li>
              <li><Link href="/about#guidelines" className="hover:text-foreground transition-colors">Community Guidelines</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t text-center text-xs text-muted-foreground">
          Built for the Governance & Collaboration Track. Nonpartisan. Transparent. Civic-minded.
        </div>
      </div>
    </footer>
  );
}
