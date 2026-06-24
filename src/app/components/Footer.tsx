import { Container } from "@/components/ui/container";
import { GithubIcon, LinkedInIcon, TwitterIcon } from "@/components/ui/icons";

const Footer = () => {
  return (
    <footer className="bg-[#070A11] text-white">
      <Container className="flex flex-col items-center justify-between gap-8 border-t border-white/10 py-10 text-center md:flex-row md:text-left">
        <div>
          <p className="text-lg font-semibold text-white">Built with care by Vijay Prakash.</p>
          <p className="mt-2 text-sm text-slate-400">© 2024 Vijay Prakash. All rights reserved.</p>
        </div>

        <div className="flex items-center gap-4">
          <a href="https://x.com/VijayPr4788148" target="_blank" rel="noopener noreferrer" className="text-slate-400 transition hover:text-[#7C61FF]">
            <TwitterIcon className="h-5 w-5" />
          </a>
          <a href="https://github.com/VijayPrakash152" target="_blank" rel="noopener noreferrer" className="text-slate-400 transition hover:text-[#7C61FF]">
            <GithubIcon className="h-5 w-5" />
          </a>
          <a href="https://www.linkedin.com/in/me-vijay-prakash" target="_blank" rel="noopener noreferrer" className="text-slate-400 transition hover:text-[#7C61FF]">
            <LinkedInIcon className="h-5 w-5" />
          </a>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
