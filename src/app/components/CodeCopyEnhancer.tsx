"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const CODE_BLOCK_SELECTOR = ".article-body pre, .cheatsheet-content pre, .prose pre";

const CodeCopyEnhancer = () => {
  const pathname = usePathname();

  useEffect(() => {
    let rafId = 0;

    const enhanceCodeBlocks = () => {
      const blocks = document.querySelectorAll<HTMLElement>(CODE_BLOCK_SELECTOR);

      blocks.forEach((pre) => {
        const code = pre.querySelector("code");
        if (!code || pre.querySelector("button[data-copy-code='true']")) {
          return;
        }

        pre.classList.add("relative");

        const button = document.createElement("button");
        button.type = "button";
        button.dataset.copyCode = "true";
        button.className = "copy-code-button";
        button.textContent = "Copy";

        button.addEventListener("click", async () => {
          const codeText = code.textContent?.trim() || "";
          if (!codeText) {
            return;
          }

          try {
            await navigator.clipboard.writeText(codeText);
            button.textContent = "Copied";
            button.classList.add("copy-code-success");
            window.setTimeout(() => {
              button.textContent = "Copy";
              button.classList.remove("copy-code-success");
            }, 1600);
          } catch {
            button.textContent = "Retry";
            window.setTimeout(() => {
              button.textContent = "Copy";
            }, 1200);
          }
        });

        pre.appendChild(button);
      });
    };

    const queueEnhance = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      rafId = requestAnimationFrame(enhanceCodeBlocks);
    };

    queueEnhance();

    const observer = new MutationObserver(queueEnhance);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      observer.disconnect();
    };
  }, [pathname]);

  return null;
};

export default CodeCopyEnhancer;
