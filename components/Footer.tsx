// components/Footer.tsx

import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-primary"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/request/new"
                  className="text-muted-foreground hover:text-primary"
                >
                  Create Request
                </Link>
              </li>
              <li>
                <Link
                  href="/request/my-requests"
                  className="text-muted-foreground hover:text-primary"
                >
                  My Requests
                </Link>
              </li>
              <li>
                <Link
                  href="/my-missions"
                  className="text-muted-foreground hover:text-primary"
                >
                  My Missions
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <p className="text-muted-foreground">
              We provide a platform for efficient and reliable property
              inspections, connecting property owners with qualified inspectors.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-muted-foreground">
              Email: support@inspecteaseapp.com
            </p>
            <p className="text-muted-foreground">Phone: (123) 456-7890</p>
          </div>
        </div>
        <Separator className="my-8" />
        <div className="text-center text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} InspecEase App. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
