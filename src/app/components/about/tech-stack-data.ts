export interface TechCategory {
  category: string;
  items: string[];
}

export const TECH_STACK_BY_CATEGORY: TechCategory[] = [
  {
    category: "Frontend",
    items: [
      "React.js",
      "React Native",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "HTML5",
      "CSS3",
      "Tailwind CSS",
      "Redux Toolkit",
      "Context API",
      "TanStack Query",
      "React Router",
      "Storybook",
      "shadcn/ui",
      "Framer Motion",
    ],
  },
  {
    category: "Backend",
    items: ["Node.js", "NestJS", "Express.js", "BFF", "REST APIs", "Serverless APIs", "Firebase Functions"],
  },
  {
    category: "Mobile",
    items: ["React Native", "Expo", "Native Module Integration"],
  },
  {
    category: "Databases",
    items: ["PostgreSQL", "MySQL", "MongoDB", "Firebase Firestore", "Redis"],
  },
  {
    category: "Cloud & DevOps",
    items: ["AWS Lambda", "API Gateway", "Amazon S3", "CloudFront", "Firebase", "Azure Cloud", "Docker", "Kubernetes", "Nginx"],
  },
  {
    category: "CMS",
    items: ["Strapi CMS", "Headless CMS Architecture"],
  },
  {
    category: "AI & ML",
    items: [
      "Azure Speech-to-Text",
      "Azure Text-to-Speech",
      "ElevenLabs",
      "Sarvam AI",
      "AI Voice Applications",
      "Speech Processing",
      "Conversational AI",
    ],
  },
  {
    category: "Testing",
    items: ["Jest", "React Testing Library", "Postman", "ESLint", "Prettier", "Husky", "lint-staged", "Pre-commit Hooks"],
  },
  {
    category: "Developer Tools",
    items: ["Git", "GitHub", "Bitbucket", "VS Code", "npm", "pnpm", "Yarn", "Verdaccio"],
  },
  {
    category: "Architecture",
    items: [
      "Monorepo Architecture",
      "Micro Frontends",
      "BFF",
      "Component-Driven Development",
      "Design Systems",
      "Responsive Design",
      "Accessibility",
      "System Design",
      "Monorepos",
      "Turborepo",
    ],
  },
  {
    category: "Messaging",
    items: ["Redis", "Kafka", "RabbitMQ"],
  },
  {
    category: "Build & Tooling",
    items: ["Vite", "Webpack", "Babel", "Turbo", "SWC"],
  },
  {
    category: "API Development",
    items: ["REST APIs", "OpenAPI", "Swagger", "JSON", "Axios", "Fetch API"],
  },
  {
    category: "Performance",
    items: ["Code Splitting", "Lazy Loading", "SSR", "SSG", "ISR", "Caching Strategies", "Bundle Optimization", "Lighthouse Optimization"],
  },
];
