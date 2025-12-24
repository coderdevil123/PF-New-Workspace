import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Mail, Phone, MapPin, Linkedin, Twitter, Github, ArrowRight } from 'lucide-react';

export default function Footer() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <footer className="relative border-t border-border bg-forest-gradient text-white">
      {/* Get Started CTA - Only show if not authenticated */}
      {!isAuthenticated && (
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
          <Button
            onClick={() => navigate('/login')}
            size="lg"
            className="h-14 rounded-full bg-mint-accent px-10 text-base font-semibold text-forest-dark shadow-2xl shadow-mint transition-all hover:scale-105 hover:bg-mint-accent/90"
          >
            Get Started Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      )}

      <div className="px-6 py-12 lg:px-12 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mint-accent shadow-md">
                  <span className="text-base font-bold text-forest-dark">PF</span>
                </div>
                <span className="font-display text-lg font-normal">Pristine Forests</span>
              </div>
              <p className="font-sans mb-6 text-sm leading-relaxed text-white/70">
                Empowering teams with integrated workspace tools and seamless collaboration.
              </p>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white/70 backdrop-blur-sm transition-all hover:bg-mint-accent hover:text-forest-dark hover:scale-110"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white/70 backdrop-blur-sm transition-all hover:bg-mint-accent hover:text-forest-dark hover:scale-110"
                >
                  <Twitter className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white/70 backdrop-blur-sm transition-all hover:bg-mint-accent hover:text-forest-dark hover:scale-110"
                >
                  <Github className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-ui mb-4 text-sm font-semibold uppercase tracking-wider text-white/90">Quick Links</h3>
              <ul className="space-y-2">
                {[
                  { label: 'Dashboard', path: '/workspace' },
                  { label: 'Team', path: '/team' },
                  { label: 'Announcements', path: '/announcements' },
                ].map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="font-sans text-sm text-white/60 transition-colors hover:text-mint-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/90">Services</h3>
              <ul className="space-y-2">
                {[
                  { label: 'Productivity', path: '/workspace/productivity' },
                  { label: 'Content Creation', path: '/workspace/content' },
                  { label: 'Design', path: '/workspace/design' },
                  { label: 'Marketing', path: '/workspace/marketing' },
                  { label: 'Operations', path: '/workspace/operations' },
                ].map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-sm text-white/60 transition-colors hover:text-mint-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Us */}
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/90">Contact Us</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-mint-accent" />
                  <a
                    href="mailto:hello@pristineforests.com"
                    className="text-sm text-white/60 transition-colors hover:text-mint-accent"
                  >
                    hello@pristineforests.com
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-mint-accent" />
                  <a
                    href="tel:+12345678900"
                    className="text-sm text-white/60 transition-colors hover:text-mint-accent"
                  >
                    +1 (234) 567-890
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-mint-accent" />
                  <span className="text-sm text-white/60">
                    San Francisco, CA
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 md:flex-row">
            <p className="text-sm text-white/50">
              © 2025 Pristine Forests. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="#" className="text-sm text-white/50 transition-colors hover:text-mint-accent">
                Privacy Policy
              </Link>
              <Link to="#" className="text-sm text-white/50 transition-colors hover:text-mint-accent">
                Terms of Service
              </Link>
              <Link to="#" className="text-sm text-white/50 transition-colors hover:text-mint-accent">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
