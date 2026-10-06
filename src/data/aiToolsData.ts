export type ToolCategory =
  | 'Writing'
  | 'Coding'
  | 'Images'
  | 'Video'
  | 'Research'
  | 'Education'
  | 'Productivity'
  | 'Audio';

export type PricingTier = 'Free' | 'Freemium' | 'Paid';

export interface AITool {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: ToolCategory;
  pricing: PricingTier;
  freePlanAvailable: string;
  pricingTransparencyNote: string;
  featured: boolean;
  url: string;
  primaryUseCase: string;
  supportedPlatforms: string;
  contextOrSpec: string;
  apiAvailable: boolean;
  documentationNote: string;
  strengths: string[];
  limitations: string[];
  integrations: string[];
  relatedToolIds: string[];
  relatedGuideIds: string[];
}

export interface CategoryMeta {
  id: ToolCategory;
  name: ToolCategory;
  shortDesc: string;
  visualConcept: string;
  toolCount: number;
  featuredWorkflow: string;
  relatedGuideId: string;
}

export type FreeUtilityId =
  | 'word-counter'
  | 'password-generator'
  | 'json-formatter'
  | 'percentage-calculator'
  | 'color-converter'
  | 'prompt-generator';

export interface FreeUtilityMeta {
  id: FreeUtilityId;
  name: string;
  iconConcept: string;
  summary: string;
  metricLabel: string;
}

export interface GuideArticle {
  id: string;
  number: string;
  title: string;
  category: ToolCategory;
  readTime: string;
  publishedDate: string;
  lastReviewedDate: string;
  excerpt: string;
  keyTakeaways: string[];
  relatedToolIds: string[];
  sections: {
    heading: string;
    body: string;
  }[];
}

export interface BlogPost {
  id: string;
  title: string;
  topic: string;
  publishedDate: string;
  readTime: string;
  summary: string;
  relatedToolIds: string[];
  relatedCategory: ToolCategory;
  sections: {
    heading: string;
    body: string;
  }[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  relatedLinkText: string;
  relatedLinkPath: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'Writing',
    name: 'Writing',
    shortDesc: 'Long-form drafting, technical documentation, editorial refinement, and brand style tools.',
    visualConcept: '3D document + sparkle',
    toolCount: 3,
    featuredWorkflow: 'Editorial & Copy Workflows',
    relatedGuideId: 'guide-structured-prompting',
  },
  {
    id: 'Coding',
    name: 'Coding',
    shortDesc: 'Repository indexing, multi-file refactoring, inline code completion, and UI generation.',
    visualConcept: '3D brackets',
    toolCount: 3,
    featuredWorkflow: 'IDE & Software Engineering',
    relatedGuideId: 'guide-evaluating-ai-stack',
  },
  {
    id: 'Images',
    name: 'Images',
    shortDesc: 'Concept illustration, vector SVG asset design, and interactive studio image editing.',
    visualConcept: '3D picture frame',
    toolCount: 3,
    featuredWorkflow: 'Visual & Vector Asset Design',
    relatedGuideId: 'guide-structured-prompting',
  },
  {
    id: 'Video',
    name: 'Video',
    shortDesc: 'Video scene generation, transcript-based timeline editing, and multilingual video localization.',
    visualConcept: '3D play button',
    toolCount: 3,
    featuredWorkflow: 'Video Generation & Editing',
    relatedGuideId: 'guide-evaluating-ai-stack',
  },
  {
    id: 'Research',
    name: 'Research',
    shortDesc: 'Citation-backed web search, academic paper discovery, and literature matrix extraction.',
    visualConcept: '3D magnifying glass',
    toolCount: 3,
    featuredWorkflow: 'Cited Research & Discovery',
    relatedGuideId: 'guide-rag-vs-long-context',
  },
  {
    id: 'Education',
    name: 'Education',
    shortDesc: 'Source-grounded study notebooks, Socratic STEM tutoring, and interactive learning tools.',
    visualConcept: '3D graduation cap',
    toolCount: 3,
    featuredWorkflow: 'Study & Socratic Learning',
    relatedGuideId: 'guide-rag-vs-long-context',
  },
  {
    id: 'Productivity',
    name: 'Productivity',
    shortDesc: 'Connected workspace knowledge search, issue triage, and meeting note organization.',
    visualConcept: '3D dashboard',
    toolCount: 3,
    featuredWorkflow: 'Workspace & Project Operations',
    relatedGuideId: 'guide-evaluating-ai-stack',
  },
  {
    id: 'Audio',
    name: 'Audio',
    shortDesc: 'Text-to-speech synthesis, spoken dialogue cleanup, and musical arrangement generation.',
    visualConcept: '3D waveform',
    toolCount: 3,
    featuredWorkflow: 'Voice & Audio Production',
    relatedGuideId: 'guide-structured-prompting',
  },
];

export const AI_TOOLS: AITool[] = [
  // WRITING
  {
    id: 'claude-workspace',
    name: 'Claude',
    tagline: 'Conversational AI assistant for drafting, document analysis, and interactive artifacts.',
    description:
      'Developed by Anthropic, Claude supports long-context document reading, structured writing assistance, and side-by-side Artifact previews for code, text, and diagrams.',
    category: 'Writing',
    pricing: 'Freemium',
    freePlanAvailable: 'Yes (Free tier with usage limits)',
    pricingTransparencyNote: 'Publicly listed Free, Pro, Team, and Enterprise tiers on vendor site.',
    featured: true,
    url: 'https://claude.ai',
    primaryUseCase: 'Technical Writing & Document Synthesis',
    supportedPlatforms: 'Web, iOS, Android, macOS, Windows, API',
    contextOrSpec: 'Long-Context Document & Artifact Workspace',
    apiAvailable: true,
    documentationNote: 'Comprehensive public prompt library, model cards, and API docs.',
    strengths: [
      'Supports uploading and analyzing lengthy PDF and text documents',
      'Side-by-side Artifacts window for iterating on drafts and diagrams',
      'Clear project-level custom instructions and knowledge attachments',
    ],
    limitations: [
      'Usage limits vary based on current demand and subscription tier',
      'Does not natively generate raster photographic images',
    ],
    integrations: ['REST API', 'Slack', 'Google Workspace (Team/Enterprise)'],
    relatedToolIds: ['lex-page', 'writer-enterprise', 'notebooklm-study'],
    relatedGuideIds: ['guide-structured-prompting', 'guide-evaluating-ai-stack'],
  },
  {
    id: 'lex-page',
    name: 'Lex',
    tagline: 'Minimalist web word processor with integrated writing feedback and editing tools.',
    description:
      'A distraction-free document editor built for writers and essayists who want optional inline feedback, title brainstorming, and grammar checks without leaving a clean page.',
    category: 'Writing',
    pricing: 'Freemium',
    freePlanAvailable: 'Yes (Basic document editor available)',
    pricingTransparencyNote: 'Free and Pro subscription tiers published on vendor website.',
    featured: false,
    url: 'https://lex.page',
    primaryUseCase: 'Long-Form Essays & Articles',
    supportedPlatforms: 'Web Browser',
    contextOrSpec: 'Document-First Word Processor',
    apiAvailable: false,
    documentationNote: 'In-app onboarding guides and keyboard shortcut documentation.',
    strengths: [
      'Clean typography-first editor focused on human writing flow',
      'Inline Q&A sidebar that does not overwrite your draft automatically',
      'Version history tracking for comparing earlier draft revisions',
    ],
    limitations: [
      'Focused on text documents rather than spreadsheets or slide decks',
      'No public developer API for third-party automation',
    ],
    integrations: ['Markdown Export', 'Docx Export', 'Copy to HTML'],
    relatedToolIds: ['claude-workspace', 'writer-enterprise', 'notion-ai'],
    relatedGuideIds: ['guide-structured-prompting'],
  },
  {
    id: 'writer-enterprise',
    name: 'Writer',
    tagline: 'Enterprise writing and content governance platform for organizational teams.',
    description:
      'Designed for business teams that need shared style guides, approved terminology enforcement, and content generation grounded in company knowledge bases.',
    category: 'Writing',
    pricing: 'Paid',
    freePlanAvailable: 'Trial available (Paid team subscriptions)',
    pricingTransparencyNote: 'Team and Enterprise custom pricing published on official website.',
    featured: false,
    url: 'https://writer.com',
    primaryUseCase: 'Brand Governance & Team Content Workflows',
    supportedPlatforms: 'Web, Chrome Extension, Figma, Word, API',
    contextOrSpec: 'Style Guide & Terminology Enforcement',
    apiAvailable: true,
    documentationNote: 'Developer hub, SDK documentation, and admin setup guides.',
    strengths: [
      'Enforces organizational style rules and prohibited claim lists',
      'Browser and design tool extensions keep tone consistent across apps',
      'Dedicated administrative controls for multi-seat teams',
    ],
    limitations: [
      'Requires initial configuration of style rules and brand terms',
      'Primarily tailored for teams rather than individual hobbyists',
    ],
    integrations: ['Chrome', 'Figma', 'Microsoft Word', 'Google Docs', 'API'],
    relatedToolIds: ['claude-workspace', 'lex-page', 'notion-ai'],
    relatedGuideIds: ['guide-evaluating-ai-stack'],
  },

  // CODING
  {
    id: 'cursor-ide',
    name: 'Cursor',
    tagline: 'Code editor built on VS Code with repository-aware assistance and multi-file editing.',
    description:
      'An integrated development environment that indexes local project files to provide context-aware inline edits, predictive autocompletion, and multi-file refactoring diffs.',
    category: 'Coding',
    pricing: 'Freemium',
    freePlanAvailable: 'Yes (Hobby tier with limited requests)',
    pricingTransparencyNote: 'Hobby, Pro, and Business pricing tiers listed on official website.',
    featured: true,
    url: 'https://cursor.com',
    primaryUseCase: 'Software Development & Codebase Refactoring',
    supportedPlatforms: 'macOS, Windows, Linux Desktop App',
    contextOrSpec: 'Local Codebase Indexing & Diff Review',
    apiAvailable: false,
    documentationNote: 'Public documentation covering rules files, shortcuts, and privacy settings.',
    strengths: [
      'Supports existing VS Code extensions, themes, and keybindings',
      'Allows reviewing proposed changes across multiple files as diffs',
      'Configurable Privacy Mode controls how code snippets are handled',
    ],
    limitations: [
      'Requires downloading and running a standalone desktop editor',
      'High-volume usage requires a paid subscription plan',
    ],
    integrations: ['VS Code Extensions', 'Git', 'Terminal CLI', 'MCP Servers'],
    relatedToolIds: ['github-copilot', 'v0-vercel', 'claude-workspace'],
    relatedGuideIds: ['guide-evaluating-ai-stack', 'guide-structured-prompting'],
  },
  {
    id: 'github-copilot',
    name: 'GitHub Copilot',
    tagline: 'IDE coding assistant and pull-request workflow integration from GitHub.',
    description:
      'Provides inline code completions, chat assistance, and pull-request summaries directly inside supported code editors and on GitHub.com.',
    category: 'Coding',
    pricing: 'Freemium',
    freePlanAvailable: 'Yes (Free tier with monthly completion/chat caps)',
    pricingTransparencyNote: 'Free, Pro, Business, and Enterprise plans published on GitHub.',
    featured: false,
    url: 'https://github.com/features/copilot',
    primaryUseCase: 'Inline Code Completion & Pull Request Workflows',
    supportedPlatforms: 'VS Code, Visual Studio, JetBrains IDEs, Neovim, Xcode, Web',
    contextOrSpec: 'Multi-IDE Extension Ecosystem',
    apiAvailable: true,
    documentationNote: 'Extensive GitHub Docs covering IDE setup, security, and organization policies.',
    strengths: [
      'Works as a plugin inside JetBrains, Visual Studio, and VS Code',
      'Integrates directly with GitHub repositories, issues, and pull requests',
      'Centralized billing and seat management for GitHub organizations',
    ],
    limitations: [
      'Feature availability can vary slightly across different host IDEs',
      'Requires a GitHub account to authenticate',
    ],
    integrations: ['VS Code', 'JetBrains', 'Visual Studio', 'GitHub Actions'],
    relatedToolIds: ['cursor-ide', 'v0-vercel', 'linear-intelligence'],
    relatedGuideIds: ['guide-evaluating-ai-stack'],
  },
  {
    id: 'v0-vercel',
    name: 'v0 by Vercel',
    tagline: 'Web-based UI generation tool for React and Tailwind CSS components.',
    description:
      'Helps frontend developers and designers prototype user interfaces from text prompts or wireframe screenshots with an interactive browser preview.',
    category: 'Coding',
    pricing: 'Freemium',
    freePlanAvailable: 'Yes (Free tier with monthly credit allowance)',
    pricingTransparencyNote: 'Free, Premium, Team, and Enterprise tiers published on v0.dev.',
    featured: false,
    url: 'https://v0.dev',
    primaryUseCase: 'Frontend UI Prototyping & Component Code',
    supportedPlatforms: 'Web Browser',
    contextOrSpec: 'Interactive React & Tailwind Preview Sandbox',
    apiAvailable: false,
    documentationNote: 'Documentation for CLI component installation and project deployment.',
    strengths: [
      'Renders live interactive previews of generated UI components',
      'Provides CLI commands to add components into existing React projects',
      'Supports iterative visual refinement of individual layout elements',
    ],
    limitations: [
      'Focused primarily on frontend web interfaces rather than backend services',
      'Complex custom backend logic must be wired up in your own editor',
    ],
    integrations: ['Next.js', 'Tailwind CSS', 'shadcn/ui', 'Vercel'],
    relatedToolIds: ['cursor-ide', 'github-copilot', 'recraft-v3'],
    relatedGuideIds: ['guide-structured-prompting'],
  },

  // IMAGES
  {
    id: 'midjourney-v6',
    name: 'Midjourney',
    tagline: 'Text-to-image generation service for concept art, illustration, and visual design.',
    description:
      'Produces artistic illustrations, architectural concepts, and photographic compositions from text prompts and style reference images via its web interface and Discord.',
    category: 'Images',
    pricing: 'Paid',
    freePlanAvailable: 'No (Paid subscription required; occasional promotional trials)',
    pricingTransparencyNote: 'Basic, Standard, Pro, and Mega subscription plans listed in docs.',
    featured: true,
    url: 'https://midjourney.com',
    primaryUseCase: 'Concept Illustration & Creative Direction',
    supportedPlatforms: 'Web Browser, Discord',
    contextOrSpec: 'Style References, Pan, Zoom & Regional Inpainting',
    apiAvailable: false,
    documentationNote: 'Detailed parameter reference guide covering aspect ratios, stylize, and seeds.',
    strengths: [
      'Granular prompt parameters for aspect ratio, style weight, and character consistency',
      'Web editor includes regional repainting, canvas expansion, and upscaling',
      'Active community gallery for exploring visual styles',
    ],
    limitations: [
      'No official public API for third-party programmatic integration',
      'Images are visible in the public gallery unless using higher-tier Stealth Mode',
    ],
    integrations: ['Web Studio', 'Discord', 'Direct Image Download'],
    relatedToolIds: ['krea-studio', 'recraft-v3', 'runway-gen3'],
    relatedGuideIds: ['guide-structured-prompting'],
  },
  {
    id: 'krea-studio',
    name: 'Krea AI',
    tagline: 'Interactive canvas for real-time image generation, upscaling, and visual composition.',
    description:
      'Provides a split-screen interactive canvas where moving basic shapes, webcam feeds, or 3D primitives updates a generated image preview dynamically.',
    category: 'Images',
    pricing: 'Freemium',
    freePlanAvailable: 'Yes (Free tier with daily compute limits)',
    pricingTransparencyNote: 'Free, Basic, Pro, and Max plans published on official website.',
    featured: false,
    url: 'https://krea.ai',
    primaryUseCase: 'Interactive Visual Composition & Upscaling',
    supportedPlatforms: 'Web Browser',
    contextOrSpec: 'Real-Time Canvas & Image Enhancer',
    apiAvailable: false,
    documentationNote: 'Tutorials and workflow guides available on the platform.',
    strengths: [
      'Direct spatial control over object placement using simple canvas shapes',
      'Includes dedicated upscaling and detail-enhancement tools',
      'Supports training custom style patterns from reference uploads',
    ],
    limitations: [
      'High-resolution enhancement consumes compute credits rapidly',
      'Best experienced on desktop browsers with hardware acceleration',
    ],
    integrations: ['Web Canvas', 'PNG / JPG Export'],
    relatedToolIds: ['midjourney-v6', 'recraft-v3', 'runway-gen3'],
    relatedGuideIds: ['guide-structured-prompting'],
  },
  {
    id: 'recraft-v3',
    name: 'Recraft',
    tagline: 'Design-focused image and editable SVG vector generator for brand assets.',
    description:
      'Built for graphic designers who need scalable vector graphics (SVG), cohesive icon sets, custom color palette controls, and layout mockups on an infinite board.',
    category: 'Images',
    pricing: 'Freemium',
    freePlanAvailable: 'Yes (Free tier with daily credits)',
    pricingTransparencyNote: 'Free and paid subscription plans listed on recraft.ai.',
    featured: false,
    url: 'https://recraft.ai',
    primaryUseCase: 'Editable SVG Vectors & Cohesive Icon Sets',
    supportedPlatforms: 'Web Browser, iOS, Android, API',
    contextOrSpec: 'Vector SVG & Raster Design Board',
    apiAvailable: true,
    documentationNote: 'Public documentation for both the design workspace and REST API.',
    strengths: [
      'Exports editable SVG vector paths suitable for Figma or Illustrator',
      'Allows locking a specific brand color palette before generating assets',
      'Can generate matching sets of icons that share a unified visual style',
    ],
    limitations: [
      'Free tier creations are public by default under free plan terms',
      'Complex multi-page print layouts still require desktop publishing software',
    ],
    integrations: ['SVG Export', 'PNG Export', 'REST API'],
    relatedToolIds: ['midjourney-v6', 'krea-studio', 'v0-vercel'],
    relatedGuideIds: ['guide-structured-prompting'],
  },

  // VIDEO
  {
    id: 'runway-gen3',
    name: 'Runway',
    tagline: 'Creative video generation and visual effects suite for filmmakers and editors.',
    description:
      'Offers text-to-video and image-to-video synthesis alongside browser-based video editing tools such as background removal, motion tracking, and camera path controls.',
    category: 'Video',
    pricing: 'Freemium',
    freePlanAvailable: 'Yes (Free trial credits upon registration)',
    pricingTransparencyNote: 'Free, Standard, Pro, Unlimited, and Enterprise plans listed on website.',
    featured: true,
    url: 'https://runwayml.com',
    primaryUseCase: 'Generative Video Clips & Visual Effects',
    supportedPlatforms: 'Web Browser, iOS, API',
    contextOrSpec: 'Text/Image-to-Video & Camera Controls',
    apiAvailable: true,
    documentationNote: 'Runway Academy tutorials, prompting guides, and API documentation.',
    strengths: [
      'Camera direction controls for pan, tilt, zoom, and motion brushes',
      'Supports starting from a reference keyframe image for visual continuity',
      'Includes practical editing utilities like rotoscoping and object removal',
    ],
    limitations: [
      'Generated clips are short segments that require editing into longer timelines',
      'Video rendering consumes credit allocations quickly on entry plans',
    ],
    integrations: ['MP4 / ProRes Export', 'REST API'],
    relatedToolIds: ['descript-studio', 'synthesia-studio', 'midjourney-v6'],
    relatedGuideIds: ['guide-evaluating-ai-stack'],
  },
  {
    id: 'descript-studio',
    name: 'Descript',
    tagline: 'Transcript-based video and podcast editor for spoken-word media.',
    description:
      'Transcribes recorded video and audio so creators can edit timelines by deleting or rearranging text in a document, remove filler words, and clean up background noise.',
    category: 'Video',
    pricing: 'Freemium',
    freePlanAvailable: 'Yes (Free plan with monthly transcription hour limits)',
    pricingTransparencyNote: 'Free, Hobbyist, Creator, Business, and Enterprise plans published online.',
    featured: false,
    url: 'https://descript.com',
    primaryUseCase: 'Video Podcasts, Screen Recordings & Interviews',
    supportedPlatforms: 'macOS, Windows, Web Browser',
    contextOrSpec: 'Text-Driven Multitrack Timeline & Audio Cleanup',
    apiAvailable: false,
    documentationNote: 'Help center articles and video walkthroughs for editing workflows.',
    strengths: [
      'Speeds up rough-cut editing of interviews and tutorials via text selection',
      'Studio Sound feature reduces room echo and background hum',
      'Exports non-destructive timelines to Premiere Pro and Final Cut Pro',
    ],
    limitations: [
      'Designed around spoken dialogue rather than cinematic visual effects',
      'Requires clear speech audio for accurate automated transcription',
    ],
    integrations: ['Premiere Pro XML', 'Final Cut Pro', 'YouTube Export'],
    relatedToolIds: ['runway-gen3', 'synthesia-studio', 'adobe-podcast-enhance'],
    relatedGuideIds: ['guide-evaluating-ai-stack'],
  },
  {
    id: 'synthesia-studio',
    name: 'Synthesia',
    tagline: 'Presenter-style video platform for instructional training and localization.',
    description:
      'Allows instructional designers and corporate teams to turn written scripts or slide decks into presenter-led training videos with multilingual voiceovers.',
    category: 'Video',
    pricing: 'Freemium',
    freePlanAvailable: 'Yes (Free starter plan with limited minutes)',
    pricingTransparencyNote: 'Free, Starter, Creator, and Enterprise tiers published on website.',
    featured: false,
    url: 'https://synthesia.io',
    primaryUseCase: 'Internal Training, Onboarding & Localization',
    supportedPlatforms: 'Web Browser, API',
    contextOrSpec: 'Script-to-Presenter Video & SCORM Export',
    apiAvailable: true,
    documentationNote: 'Knowledge base, localization guides, and API documentation.',
    strengths: [
      'Updating a training video only requires editing the text script',
      'Supports translating and dubbing presentations into multiple languages',
      'Exports SCORM packages compatible with learning management systems',
    ],
    limitations: [
      'Tailored for structured presentations rather than creative filmmaking',
      'Advanced custom avatars require enterprise add-on verification',
    ],
    integrations: ['SCORM / LMS', 'PowerPoint Import', 'Notion Embed', 'API'],
    relatedToolIds: ['descript-studio', 'runway-gen3', 'elevenlabs-studio'],
    relatedGuideIds: ['guide-evaluating-ai-stack'],
  },

  // RESEARCH
  {
    id: 'perplexity-pro',
    name: 'Perplexity',
    tagline: 'Conversational search and research tool with numbered source citations.',
    description:
      'Combines live web retrieval with language model synthesis so users receive direct answers accompanied by clickable links to the underlying source pages.',
    category: 'Research',
    pricing: 'Freemium',
    freePlanAvailable: 'Yes (Free web search and standard synthesis)',
    pricingTransparencyNote: 'Free, Pro, and Enterprise Pro plans published on perplexity.ai.',
    featured: true,
    url: 'https://perplexity.ai',
    primaryUseCase: 'Cited Web Research & Topic Briefings',
    supportedPlatforms: 'Web, iOS, Android, macOS, Chrome Extension, API',
    contextOrSpec: 'Live Web Index + Inline Source Footnotes',
    apiAvailable: true,
    documentationNote: 'Public API documentation for Sonar search models and user guides.',
    strengths: [
      'Displays numbered source links alongside synthesized paragraphs',
      'Allows scoping searches to academic papers, web pages, or uploaded files',
      'Organizes multi-query research projects into shared Spaces',
    ],
    limitations: [
      'Users should still click through to primary sources to verify critical facts',
      'Cannot access full text behind closed third-party publisher paywalls',
    ],
    integrations: ['Browser Extension', 'Sonar REST API', 'Mobile Apps'],
    relatedToolIds: ['elicit-research', 'consensus-academic', 'notebooklm-study'],
    relatedGuideIds: ['guide-rag-vs-long-context', 'guide-evaluating-ai-stack'],
  },
  {
    id: 'elicit-research',
    name: 'Elicit',
    tagline: 'Academic research assistant for literature discovery and data extraction tables.',
    description:
      'Searches academic paper databases and extracts structured columns—such as study design, sample size, and methodology—across multiple papers or uploaded PDFs.',
    category: 'Research',
    pricing: 'Freemium',
    freePlanAvailable: 'Yes (Starter credits included for new accounts)',
    pricingTransparencyNote: 'Free trial credits, Plus, and Pro plans listed on elicit.com.',
    featured: false,
    url: 'https://elicit.com',
    primaryUseCase: 'Academic Literature Review & PDF Data Extraction',
    supportedPlatforms: 'Web Browser',
    contextOrSpec: 'Structured Literature Comparison Matrix',
    apiAvailable: false,
    documentationNote: 'Help center articles explaining literature search and systematic reviews.',
    strengths: [
      'Builds structured comparison tables across dozens of research papers',
      'Shows the exact passage in the source PDF that supports an extracted cell',
      'Imports paper libraries directly from Zotero',
    ],
    limitations: [
      'Designed specifically for academic papers rather than general web news',
      'Exporting tables to CSV requires a paid subscription tier',
    ],
    integrations: ['Zotero', 'BibTeX', 'CSV Export (Paid)'],
    relatedToolIds: ['consensus-academic', 'perplexity-pro', 'notebooklm-study'],
    relatedGuideIds: ['guide-rag-vs-long-context'],
  },
  {
    id: 'consensus-academic',
    name: 'Consensus',
    tagline: 'Academic search engine focused on peer-reviewed scientific studies.',
    description:
      'Queries scholarly literature to surface findings from peer-reviewed papers, displaying journal details, citation counts, and study methodology labels.',
    category: 'Research',
    pricing: 'Freemium',
    freePlanAvailable: 'Yes (Free search with monthly synthesis limits)',
    pricingTransparencyNote: 'Free, Premium, and Team/University plans listed on consensus.app.',
    featured: false,
    url: 'https://consensus.app',
    primaryUseCase: 'Searching Peer-Reviewed Scientific Literature',
    supportedPlatforms: 'Web Browser',
    contextOrSpec: 'Peer-Reviewed Corpus & Study Type Filters',
    apiAvailable: false,
    documentationNote: 'Search guides and academic methodology documentation on website.',
    strengths: [
      'Restricts search results to indexed academic and scientific papers',
      'Labels results with study methodology tags (e.g., meta-analysis, RCT)',
      'Provides formatted citation exports for academic writing',
    ],
    limitations: [
      'Not intended for non-academic product reviews or breaking news',
      'Full paper access depends on open-access status or institutional login',
    ],
    integrations: ['APA / MLA / BibTeX Citation Copy', 'Zotero'],
    relatedToolIds: ['elicit-research', 'perplexity-pro', 'notebooklm-study'],
    relatedGuideIds: ['guide-rag-vs-long-context'],
  },

  // EDUCATION
  {
    id: 'notebooklm-study',
    name: 'NotebookLM',
    tagline: 'Source-grounded notebook that answers questions using only your uploaded documents.',
    description:
      'Allows students, educators, and researchers to upload PDFs, Google Docs, slides, and web links into a dedicated notebook to generate study guides, summaries, and audio overviews.',
    category: 'Education',
    pricing: 'Freemium',
    freePlanAvailable: 'Yes (Generous free tier with Google account)',
    pricingTransparencyNote: 'Free consumer tier and NotebookLM Plus for workspace/cloud users.',
    featured: true,
    url: 'https://notebooklm.google',
    primaryUseCase: 'Source-Grounded Study Guides & Document Q&A',
    supportedPlatforms: 'Web Browser',
    contextOrSpec: 'Multi-Source Grounding + Inline Passage Citations',
    apiAvailable: false,
    documentationNote: 'Google support documentation and onboarding notebook examples.',
    strengths: [
      'Restricts answers to the specific documents you upload into the notebook',
      'Every citation links directly to the exact highlighted passage in your source',
      'Generates study guides, timelines, briefing docs, and audio discussions',
    ],
    limitations: [
      'Does not perform open-ended web searches outside your uploaded sources',
      'Requires a Google account to sign in',
    ],
    integrations: ['Google Docs', 'Google Slides', 'PDF Upload', 'Web URLs'],
    relatedToolIds: ['khanmigo-tutor', 'perplexity-pro', 'elicit-research'],
    relatedGuideIds: ['guide-rag-vs-long-context'],
  },
  {
    id: 'khanmigo-tutor',
    name: 'Khanmigo',
    tagline: 'Socratic tutoring and teacher lesson-planning assistant from Khan Academy.',
    description:
      'Guides learners through math, science, and humanities problems by asking step-by-step questions rather than providing immediate homework answers, alongside free planning tools for teachers.',
    category: 'Education',
    pricing: 'Freemium',
    freePlanAvailable: 'Yes (Free for teachers in supported regions; paid learner plans)',
    pricingTransparencyNote: 'Free educator access and low-cost learner plans listed on khanmigo.ai.',
    featured: false,
    url: 'https://khanmigo.ai',
    primaryUseCase: 'Socratic Tutoring & Classroom Lesson Planning',
    supportedPlatforms: 'Web Browser',
    contextOrSpec: 'Pedagogical Guardrails + Khan Academy Curriculum',
    apiAvailable: false,
    documentationNote: 'Educator guides, parent FAQs, and classroom implementation docs.',
    strengths: [
      'Designed to prompt critical thinking instead of giving away direct answers',
      'Includes rubric builders, lesson hooks, and exit-ticket tools for teachers',
      'Integrated with Khan Academy subject exercises',
    ],
    limitations: [
      'Intentionally declines requests to write complete essays for students',
      'Regional availability varies for certain school district integrations',
    ],
    integrations: ['Khan Academy', 'Canvas LMS', 'Google Classroom'],
    relatedToolIds: ['notebooklm-study', 'synthesis-tutor', 'claude-workspace'],
    relatedGuideIds: ['guide-rag-vs-long-context'],
  },
  {
    id: 'synthesis-tutor',
    name: 'Synthesis Tutor',
    tagline: 'Interactive visual mathematics tutor designed for foundational numeracy.',
    description:
      'Combines voice-guided instruction with interactive visual manipulatives—such as number grids and geometric arrays—to help students build intuition for arithmetic and problem-solving.',
    category: 'Education',
    pricing: 'Paid',
    freePlanAvailable: 'Short trial available (Paid subscription required)',
    pricingTransparencyNote: 'Monthly and annual family subscriptions listed on synthesis.com.',
    featured: false,
    url: 'https://synthesis.com',
    primaryUseCase: 'Interactive Visual Math & Problem-Solving',
    supportedPlatforms: 'Web Browser, iPadOS',
    contextOrSpec: 'Visual Math Manipulatives + Guided Lessons',
    apiAvailable: false,
    documentationNote: 'Curriculum overview and parent support guides on official site.',
    strengths: [
      'Uses interactive visual boards rather than a plain text chat window',
      'Structured curriculum covering foundational arithmetic and logic',
      'Adapts lesson pacing based on student responses',
    ],
    limitations: [
      'Focused on elementary and middle-school mathematics topics',
      'Requires an active paid subscription after the trial period',
    ],
    integrations: ['Web Browser', 'iPad App'],
    relatedToolIds: ['khanmigo-tutor', 'notebooklm-study', 'claude-workspace'],
    relatedGuideIds: ['guide-evaluating-ai-stack'],
  },

  // PRODUCTIVITY
  {
    id: 'linear-intelligence',
    name: 'Linear',
    tagline: 'Issue tracking and product roadmap platform with triage and search assistance.',
    description:
      'Helps software and product teams manage bugs, cycles, and roadmaps with keyboard-first navigation, semantic issue search, and automated duplicate detection.',
    category: 'Productivity',
    pricing: 'Freemium',
    freePlanAvailable: 'Yes (Free plan for small teams with issue limits)',
    pricingTransparencyNote: 'Free, Basic, Business, and Enterprise plans published on linear.app.',
    featured: true,
    url: 'https://linear.app',
    primaryUseCase: 'Product Issue Tracking & Engineering Roadmaps',
    supportedPlatforms: 'Web, macOS, Windows, iOS, Android, API',
    contextOrSpec: 'Issue Triage, Semantic Search & Project Updates',
    apiAvailable: true,
    documentationNote: 'Public GraphQL API documentation, changelog, and Linear Method guide.',
    strengths: [
      'Fast keyboard-driven interface for creating and triaging engineering issues',
      'Flags potential duplicate bug reports and suggests relevant labels',
      'Two-way synchronization with GitHub and GitLab pull requests',
    ],
    limitations: [
      'Opinionated workflow designed primarily for software product teams',
      'Advanced triage automation requires higher-tier team plans',
    ],
    integrations: ['GitHub', 'GitLab', 'Slack', 'Figma', 'Sentry', 'GraphQL API'],
    relatedToolIds: ['notion-ai', 'granola-notes', 'cursor-ide'],
    relatedGuideIds: ['guide-evaluating-ai-stack'],
  },
  {
    id: 'notion-ai',
    name: 'Notion AI',
    tagline: 'Workspace knowledge search, document drafting, and database autofill inside Notion.',
    description:
      'An integrated add-on for Notion workspaces that searches across team pages and connected apps, summarizes meeting notes, and populates database properties.',
    category: 'Productivity',
    pricing: 'Freemium',
    freePlanAvailable: 'Yes (Core Notion workspace is free; AI add-on has limited trial responses)',
    pricingTransparencyNote: 'Per-member AI add-on pricing published on notion.so/pricing.',
    featured: false,
    url: 'https://notion.so',
    primaryUseCase: 'Team Wiki Q&A & Database Documentation',
    supportedPlatforms: 'Web, macOS, Windows, iOS, Android',
    contextOrSpec: 'Workspace Q&A + Database Property Autofill',
    apiAvailable: true,
    documentationNote: 'Extensive help center, template gallery, and Notion REST API docs.',
    strengths: [
      'Answers questions by citing pages inside your existing Notion wiki',
      'Database autofill summarizes status or action items across table rows',
      'Combines notes, tasks, and wikis in a single workspace',
    ],
    limitations: [
      'AI capabilities require a separate add-on fee on top of workspace plans',
      'Search quality depends on keeping workspace pages organized and current',
    ],
    integrations: ['Slack', 'Google Drive', 'GitHub', 'Jira', 'Notion API'],
    relatedToolIds: ['linear-intelligence', 'granola-notes', 'claude-workspace'],
    relatedGuideIds: ['guide-evaluating-ai-stack', 'guide-rag-vs-long-context'],
  },
  {
    id: 'granola-notes',
    name: 'Granola',
    tagline: 'Meeting notepad that enhances your typed notes using device audio context.',
    description:
      'Works alongside your own meeting bullets—capturing system audio on your computer without joining video calls as a visible bot, then organizing structured post-meeting notes.',
    category: 'Productivity',
    pricing: 'Freemium',
    freePlanAvailable: 'Yes (Free trial meetings included for new users)',
    pricingTransparencyNote: 'Free trial and paid individual/team plans listed on granola.so.',
    featured: false,
    url: 'https://granola.so',
    primaryUseCase: 'Meeting Notes & Post-Call Summaries',
    supportedPlatforms: 'macOS, iOS, Windows (Beta)',
    contextOrSpec: 'Bot-Free Local Audio Capture + Note Enhancement',
    apiAvailable: false,
    documentationNote: 'User guide and privacy documentation on official website.',
    strengths: [
      'Does not join Zoom, Meet, or Teams calls as a separate bot participant',
      'Combines the specific points you type with full transcript context',
      'Supports customizable templates for interviews, sales calls, and standups',
    ],
    limitations: [
      'Requires installing the desktop or mobile application',
      'Users remain responsible for complying with local call-consent laws',
    ],
    integrations: ['Google Calendar', 'Slack', 'Notion', 'HubSpot'],
    relatedToolIds: ['notion-ai', 'linear-intelligence', 'descript-studio'],
    relatedGuideIds: ['guide-evaluating-ai-stack'],
  },

  // AUDIO
  {
    id: 'elevenlabs-studio',
    name: 'ElevenLabs',
    tagline: 'Text-to-speech synthesis, voice design, and multilingual audio dubbing platform.',
    description:
      'Generates spoken audio from text scripts for narration, accessibility readers, audiobooks, and conversational voice interfaces, with developer API support.',
    category: 'Audio',
    pricing: 'Freemium',
    freePlanAvailable: 'Yes (Free tier with monthly character quota)',
    pricingTransparencyNote: 'Free, Starter, Creator, Pro, Scale, and Business plans listed online.',
    featured: true,
    url: 'https://elevenlabs.io',
    primaryUseCase: 'Voiceover Narration & Conversational Audio API',
    supportedPlatforms: 'Web Browser, iOS, Android, REST & WebSocket API',
    contextOrSpec: 'Multilingual Text-to-Speech & Studio Timeline',
    apiAvailable: true,
    documentationNote: 'Detailed API reference, SDKs, and voice cloning safety guidelines.',
    strengths: [
      'Natural pacing and intonation across multiple supported languages',
      'Multi-track Studio editor for long-form audiobook and narration scripts',
      'Low-latency streaming API for voice applications',
    ],
    limitations: [
      'Character credits are consumed on each generation and regeneration',
      'Voice cloning features require verification to prevent misuse',
    ],
    integrations: ['REST API', 'WebSockets', 'Python / TypeScript SDKs'],
    relatedToolIds: ['adobe-podcast-enhance', 'suno-studio', 'descript-studio'],
    relatedGuideIds: ['guide-structured-prompting'],
  },
  {
    id: 'suno-studio',
    name: 'Suno',
    tagline: 'Browser-based music and backing-track generation from lyrics or audio prompts.',
    description:
      'Creates musical arrangements—including vocals or purely instrumental tracks—from text style descriptions, custom lyrics, or uploaded audio clips.',
    category: 'Audio',
    pricing: 'Freemium',
    freePlanAvailable: 'Yes (Free tier with daily song credits for non-commercial use)',
    pricingTransparencyNote: 'Free, Pro, and Premier subscription plans listed on suno.com.',
    featured: false,
    url: 'https://suno.com',
    primaryUseCase: 'Musical Ideation & Instrumental Backing Tracks',
    supportedPlatforms: 'Web Browser, iOS, Android',
    contextOrSpec: 'Custom Lyrics, Audio Input & Stem Separation',
    apiAvailable: false,
    documentationNote: 'Help center covering licensing terms, commercial rights, and prompting.',
    strengths: [
      'Supports writing your own custom lyrics or generating instrumental-only tracks',
      'Allows extending sections or exporting separated vocal/instrumental stems on paid plans',
      'Fast browser workflow for brainstorming musical demos',
    ],
    limitations: [
      'Free tier outputs are restricted to non-commercial personal use',
      'Does not replace granular note-by-note MIDI editing in a digital audio workstation',
    ],
    integrations: ['MP3 / WAV Export'],
    relatedToolIds: ['elevenlabs-studio', 'adobe-podcast-enhance', 'runway-gen3'],
    relatedGuideIds: ['guide-structured-prompting'],
  },
  {
    id: 'adobe-podcast-enhance',
    name: 'Adobe Podcast',
    tagline: 'Web audio tool for cleaning up spoken dialogue and checking microphone setup.',
    description:
      'Provides browser-based speech enhancement that reduces background noise and room echo in voice recordings, alongside a pre-recording microphone diagnostic check.',
    category: 'Audio',
    pricing: 'Freemium',
    freePlanAvailable: 'Yes (Free tier for enhancing spoken audio with duration/size limits)',
    pricingTransparencyNote: 'Free and Adobe Express Premium plans detailed on podcast.adobe.com.',
    featured: false,
    url: 'https://podcast.adobe.com',
    primaryUseCase: 'Spoken Voice Cleanup & Echo Reduction',
    supportedPlatforms: 'Web Browser',
    contextOrSpec: 'Enhance Speech + Adjustable Blend Strength',
    apiAvailable: false,
    documentationNote: 'Product documentation and recording guides on Adobe website.',
    strengths: [
      'Simple drag-and-drop interface for cleaning up noisy voice recordings',
      'Adjustable strength slider on paid tier helps preserve natural room tone',
      'Free Mic Check utility diagnoses gain and distance issues before you record',
    ],
    limitations: [
      'Designed strictly for spoken voice rather than singing or musical instruments',
      'Free tier restricts maximum file duration and daily upload totals',
    ],
    integrations: ['WAV / MP3 / MP4 Upload & Download'],
    relatedToolIds: ['descript-studio', 'elevenlabs-studio', 'granola-notes'],
    relatedGuideIds: ['guide-evaluating-ai-stack'],
  },
];

export const FREE_UTILITIES: FreeUtilityMeta[] = [
  {
    id: 'word-counter',
    name: 'Word Counter',
    iconConcept: 'Floating document',
    summary: 'Real-time word, character, sentence, reading time, and keyword density analyzer with one-click case transforms.',
    metricLabel: 'Instant Lexical Metrics',
  },
  {
    id: 'password-generator',
    name: 'Password Generator',
    iconConcept: '3D lock',
    summary: 'Cryptographic Web Crypto entropy generator with customizable character sets, bit-strength gauge, and batch tokens.',
    metricLabel: 'Web Crypto CSPRNG',
  },
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    iconConcept: '3D code brackets',
    summary: 'Prettify, minify, alphabetically sort keys, and diagnose syntax errors with tree depth and byte-size telemetry.',
    metricLabel: 'AST Validator & Sorter',
  },
  {
    id: 'percentage-calculator',
    name: 'Percentage Calculator',
    iconConcept: '3D calculator',
    summary: 'Four-mode quantitative calculator for proportions, percentage delta, compound change, and margin/discount pricing.',
    metricLabel: '4-Mode Precision Math',
  },
  {
    id: 'color-converter',
    name: 'Color Converter',
    iconConcept: '3D color sphere',
    summary: 'Interactive 3D-lit sphere preview with instant HEX, RGB, HSL, CMYK conversion and WCAG 2.1 AA/AAA contrast verification.',
    metricLabel: 'Color Space & WCAG Check',
  },
  {
    id: 'prompt-generator',
    name: 'Prompt Generator',
    iconConcept: '3D magic wand / prompt card',
    summary: 'Structured prompt engineering compiler that builds system instructions, output schemas, and evaluation rubrics.',
    metricLabel: 'Structured Prompt Compiler',
  },
];

export const COMPARISON_PRESETS: {
  id: string;
  label: string;
  description: string;
  toolIds: [string, string, string];
}[] = [
  {
    id: 'coding-stack',
    label: 'Coding Assistants',
    description: 'Compare repository indexing, inline completion, and UI generation workflows.',
    toolIds: ['cursor-ide', 'github-copilot', 'v0-vercel'],
  },
  {
    id: 'research-engines',
    label: 'Research & Citations',
    description: 'Compare live web synthesis against peer-reviewed academic search tools.',
    toolIds: ['perplexity-pro', 'elicit-research', 'consensus-academic'],
  },
  {
    id: 'flagship-leaders',
    label: 'Multi-Domain Workspaces',
    description: 'Compare tools across writing, software development, and source-grounded study.',
    toolIds: ['claude-workspace', 'cursor-ide', 'notebooklm-study'],
  },
  {
    id: 'creative-media',
    label: 'Visual & Video Tools',
    description: 'Compare concept illustration, video generation, and vector asset design.',
    toolIds: ['midjourney-v6', 'runway-gen3', 'recraft-v3'],
  },
];

export const GUIDE_ARTICLES: GuideArticle[] = [
  {
    id: 'guide-evaluating-ai-stack',
    number: '01',
    title: 'How to Evaluate and Select AI Software Without Subscription Sprawl',
    category: 'Productivity',
    readTime: '6 min read',
    publishedDate: '2026-09-18',
    lastReviewedDate: '2026-10-05',
    excerpt:
      'Many teams subscribe to overlapping tools while using only a fraction of their features. This guide outlines a practical checklist for evaluating pricing transparency, data handling, and workflow fit.',
    keyTakeaways: [
      'Audit whether a general long-context workspace already covers tasks before buying single-purpose wrappers.',
      'Review official vendor privacy documentation regarding training opt-outs before uploading sensitive business files.',
      'Test free tiers or trial plans on a real, repeatable daily task rather than synthetic demos.',
    ],
    relatedToolIds: ['claude-workspace', 'cursor-ide', 'linear-intelligence', 'notion-ai'],
    sections: [
      {
        heading: '1. Separating Core Workspaces from Specialized Utilities',
        body: 'Before adding another recurring software subscription, categorize your needs into three distinct buckets: a general writing and reasoning workspace (such as Claude), a domain-specific execution environment (such as Cursor for software repositories or Descript for spoken-word video), and a verification tool (such as Perplexity or Elicit for checking citations).',
      },
      {
        heading: '2. Checking Data Retention and Training Policies',
        body: 'Consumer free plans and paid enterprise plans often operate under different data-handling terms. Always verify on the vendor’s official privacy page whether prompts and uploaded files are used for model training by default, and whether zero-data-retention APIs or workspace opt-outs are available.',
      },
      {
        heading: '3. Evaluating Total Cost and Lock-In',
        body: 'Check whether a tool exports standard, portable file formats—such as Markdown, SVG, CSV, or standard Git commits—so your work remains accessible even if you change tools in the future.',
      },
    ],
  },
  {
    id: 'guide-structured-prompting',
    number: '02',
    title: 'Structured Prompt Design: Role, Context, Constraints, and Output Format',
    category: 'Writing',
    readTime: '5 min read',
    publishedDate: '2026-09-24',
    lastReviewedDate: '2026-10-05',
    excerpt:
      'Unstructured one-line prompts often produce generic or inconsistent results. Learn how to specify context, explicit negative constraints, and clear output schemas.',
    keyTakeaways: [
      'Separate background reference material from the specific instruction you want executed.',
      'Include explicit boundaries (what to avoid or exclude) alongside positive goals.',
      'Specify the exact structure of the response—such as a Markdown table, JSON object, or numbered checklist.',
    ],
    relatedToolIds: ['claude-workspace', 'v0-vercel', 'midjourney-v6', 'recraft-v3'],
    sections: [
      {
        heading: '1. The Four Components of a Clear Prompt',
        body: 'Reliable prompts generally include four elements: (1) Domain Context explaining the audience and subject matter, (2) Source Material providing the facts or code to work with, (3) Constraints defining tone, length, and prohibited assumptions, and (4) Output Format specifying headings, columns, or data types.',
      },
      {
        heading: '2. Using the Free Prompt Generator Utility',
        body: 'You can assemble structured prompts directly on AI Toolkit Hub using our free client-side Prompt Generator utility, which formats your domain, tone, task objective, and guardrails into a reusable template.',
      },
    ],
  },
  {
    id: 'guide-rag-vs-long-context',
    number: '03',
    title: 'Source-Grounded Notebooks vs. Academic Search Engines: Choosing the Right Research Tool',
    category: 'Research',
    readTime: '7 min read',
    publishedDate: '2026-10-01',
    lastReviewedDate: '2026-10-06',
    excerpt:
      'When should you upload your own PDFs into a grounded notebook versus querying an academic paper search engine? Here is how the two workflows complement each other.',
    keyTakeaways: [
      'Use source-grounded notebooks (like NotebookLM) when you already have the exact PDFs, lecture notes, or reports you need to analyze.',
      'Use academic discovery engines (like Elicit or Consensus) when you need to find relevant peer-reviewed studies across millions of published papers.',
      'Always click inline citations to read the original methodology and verify that a summarized claim matches the author’s actual conclusion.',
    ],
    relatedToolIds: ['notebooklm-study', 'perplexity-pro', 'elicit-research', 'consensus-academic'],
    sections: [
      {
        heading: '1. Analyzing Your Own Curated Documents',
        body: 'When working with a known set of trusted files—such as course readings, technical manuals, or internal policy documents—a source-grounded notebook restricts its answers to those specific files and provides passage-level citations so you can verify every statement.',
      },
      {
        heading: '2. Discovering External Literature',
        body: 'When starting a new literature review, you first need to discover what research exists. Academic search tools index scholarly databases to help you locate relevant papers, filter by study design, and export citations into reference managers like Zotero.',
      },
    ],
  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-client-side-utilities-privacy',
    title: 'Why Browser-Based Utilities Are Safer When Formatting Sensitive JSON and Passwords',
    topic: 'Privacy & Productivity',
    publishedDate: '2026-10-02',
    readTime: '4 min read',
    summary:
      'Pasting configuration files or generating passwords on unknown server-side websites can expose sensitive tokens. Learn how client-side browser execution keeps utility data on your device.',
    relatedCategory: 'Coding',
    relatedToolIds: ['cursor-ide', 'github-copilot'],
    sections: [
      {
        heading: 'The Risk of Server-Side Formatting Tools',
        body: 'Developers frequently paste JSON payloads, API responses, or configuration snippets into online formatters to debug syntax errors. If an online utility transmits that payload to a remote server for processing, any embedded API keys or customer identifiers may be logged remotely.',
      },
      {
        heading: 'How Client-Side Execution Works on AI Toolkit Hub',
        body: 'All six free utilities on AI Toolkit Hub—including the JSON Formatter, Password Generator, and Word Counter—run entirely in your browser using standard JavaScript and the Web Crypto API (`window.crypto.getRandomValues`). Your text inputs and generated passwords are processed in local device memory without being sent to a backend server.',
      },
    ],
  },
  {
    id: 'blog-comparing-pricing-models',
    title: 'Understanding AI Software Pricing: Free Tiers, Credit Quotas, and Per-Seat Plans',
    topic: 'Software Buying Guide',
    publishedDate: '2026-09-28',
    readTime: '5 min read',
    summary:
      'AI tools use different billing models—from monthly message caps and compute credits to per-seat workspace add-ons. Here is how to compare costs accurately before subscribing.',
    relatedCategory: 'Productivity',
    relatedToolIds: ['claude-workspace', 'runway-gen3', 'elevenlabs-studio'],
    sections: [
      {
        heading: 'Message Caps vs. Compute Credits',
        body: 'Text-based assistants typically offer a free tier with a rolling message allowance, whereas media generation tools (for video, audio, or high-resolution images) usually allocate monthly compute credits because rendering media requires significant GPU resources.',
      },
      {
        heading: 'Always Verify Current Vendor Pricing',
        body: 'Because software companies frequently adjust credit allowances, model tiers, and subscription prices, treat directory listings as an initial starting point and always confirm current pricing and terms on the official provider’s website before purchasing.',
      },
    ],
  },
  {
    id: 'blog-accessibility-in-modern-web-interfaces',
    title: 'Designing 3D Web Interfaces That Respect Reduced Motion and Keyboard Navigation',
    topic: 'Design & Accessibility',
    publishedDate: '2026-09-19',
    readTime: '5 min read',
    summary:
      'Spatial depth and 3D visuals can make interfaces engaging, but they should never interfere with readability, keyboard focus, or users who prefer reduced motion.',
    relatedCategory: 'Images',
    relatedToolIds: ['v0-vercel', 'recraft-v3'],
    sections: [
      {
        heading: 'Decorative Depth vs. Core Usability',
        body: 'When incorporating perspective cards or subtle 3D canvas elements into a software directory, all essential text, search inputs, and comparison tables must remain standard, selectable DOM elements with strong color contrast.',
      },
      {
        heading: 'Supporting prefers-reduced-motion',
        body: 'Users who enable reduced motion in their operating system settings—or who toggle Static Mode in our header—receive a calm, static interface with continuous 3D animations and parallax disabled.',
      },
    ],
  },
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'what-is-ai-toolkit-hub',
    question: 'What is AI Toolkit Hub?',
    answer:
      'AI Toolkit Hub is an informational directory, comparison resource, and free utility website. It helps visitors discover AI software across categories such as writing, coding, images, video, research, education, productivity, and audio, compare options side by side, and use free browser-based productivity utilities.',
    relatedLinkText: 'Read more on our About page',
    relatedLinkPath: '/about',
  },
  {
    id: 'how-to-find-ai-tool',
    question: 'How do I find an AI tool?',
    answer:
      'You can browse tools by capability on the Categories page, search by keyword or use case in the AI Tools Directory, filter by pricing model (Free, Freemium, or Paid), or read our Editorial Guides to see which type of tool fits your workflow.',
    relatedLinkText: 'Browse the AI Tools Directory',
    relatedLinkPath: '/ai-tools',
  },
  {
    id: 'are-tools-free',
    question: 'Are the AI tools listed on this website free?',
    answer:
      'The six built-in productivity utilities hosted directly on AI Toolkit Hub (Word Counter, Password Generator, JSON Formatter, Percentage Calculator, Color Converter, and Prompt Generator) are completely free to use in your browser. The third-party AI software platforms listed in our directory offer a mix of Free, Freemium, and Paid subscription plans set by their respective providers.',
    relatedLinkText: 'Try our Free Productivity Tools',
    relatedLinkPath: '/free-tools',
  },
  {
    id: 'how-to-compare-tools',
    question: 'How do I compare AI tools?',
    answer:
      'Click the "Compare" button on any tool card in the directory or visit the Compare page directly. You can select up to three AI tools at once—or choose a preset group—to view a side-by-side table comparing primary use cases, pricing models, free-plan availability, API support, strengths, and limitations.',
    relatedLinkText: 'Open the AI Tool Comparison Matrix',
    relatedLinkPath: '/compare',
  },
  {
    id: 'are-tools-reviewed',
    question: 'Are the tools reviewed by AI Toolkit Hub?',
    answer:
      'AI Toolkit Hub compiles structured summaries based on publicly available official documentation, vendor pricing pages, product specifications, and hands-on workflow checks where possible. We do not claim that every third-party feature or enterprise tier has been exhaustively audited in a laboratory environment, and we do not assign arbitrary numeric review scores.',
    relatedLinkText: 'Read our Review Methodology',
    relatedLinkPath: '/methodology',
  },
  {
    id: 'how-often-updated',
    question: 'How frequently is tool information updated?',
    answer:
      'We review and update directory listings, pricing model notes, and guides periodically or when users report changes. However, because third-party AI companies update features and pricing frequently, information on a vendor’s official website may change before our next update cycle.',
    relatedLinkText: 'Read our Editorial Policy',
    relatedLinkPath: '/editorial-policy',
  },
  {
    id: 'does-hub-create-tools',
    question: 'Does AI Toolkit Hub create the AI tools listed on the website?',
    answer:
      'No. AI Toolkit Hub does not own, develop, or operate the third-party AI software products (such as Claude, Cursor, Midjourney, Runway, or Perplexity) listed in our directory. We only develop and maintain this informational website and the six free browser utilities on our Free Tools page.',
    relatedLinkText: 'Read our full Disclaimer',
    relatedLinkPath: '/disclaimer',
  },
  {
    id: 'are-companies-affiliated',
    question: 'Are AI Toolkit Hub and the listed AI companies affiliated?',
    answer:
      'No. Unless explicitly disclosed on a specific listing, AI Toolkit Hub is an independent informational resource and is not affiliated with, endorsed by, or sponsored by the third-party AI software companies listed in the directory.',
    relatedLinkText: 'View Editorial Independence Policy',
    relatedLinkPath: '/editorial-policy',
  },
  {
    id: 'can-i-submit-tool',
    question: 'Can I submit an AI tool?',
    answer:
      'Yes. You can suggest an AI tool for editorial consideration using our Suggest a Tool page. Please note that submitting a tool does not guarantee inclusion in the directory.',
    relatedLinkText: 'Go to Suggest a Tool',
    relatedLinkPath: '/suggest-tool',
  },
  {
    id: 'how-to-report-incorrect-info',
    question: 'How can I report incorrect information?',
    answer:
      'If you notice outdated pricing, a broken external link, or an error in any guide or tool listing, please visit our Report an Error page to provide the page URL and description of the issue.',
    relatedLinkText: 'Report an Error',
    relatedLinkPath: '/report-error',
  },
  {
    id: 'how-to-contact',
    question: 'How can I contact AI Toolkit Hub?',
    answer:
      'You can reach us via our Contact page, which provides our contact details and message form.',
    relatedLinkText: 'Visit the Contact Page',
    relatedLinkPath: '/contact',
  },
  {
    id: 'does-website-use-cookies',
    question: 'Does the website use cookies?',
    answer:
      'AI Toolkit Hub uses essential browser storage (such as localStorage) to remember your cookie consent choice and accessibility settings like reduced motion. If optional analytics or advertising services (such as Google AdSense) are enabled in the future, they may use cookies or similar technologies in accordance with your consent settings.',
    relatedLinkText: 'Read our Cookie Policy',
    relatedLinkPath: '/cookie-policy',
  },
  {
    id: 'does-website-display-ads',
    question: 'Does the website display advertising?',
    answer:
      'AI Toolkit Hub is structured to support clearly labeled display advertising (such as Google AdSense) if enabled. Any advertisement slots are kept visually separate from navigation, tool buttons, and editorial content.',
    relatedLinkText: 'Read our Privacy Policy',
    relatedLinkPath: '/privacy-policy',
  },
  {
    id: 'how-does-hub-make-money',
    question: 'How does AI Toolkit Hub make money?',
    answer:
      'AI Toolkit Hub may be supported in the future through clearly labeled display advertising (such as Google AdSense) or disclosed referral links if configured. Monetization never alters our factual descriptions of pricing models or product limitations.',
    relatedLinkText: 'Learn more in our Editorial Policy',
    relatedLinkPath: '/editorial-policy',
  },
];
