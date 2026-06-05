import type { ServiceItem } from "@/context/CartContext";

export const services: ServiceItem[] = [
  {
    id: "brand-identity",
    name: "Brand Identity",
    description: "Complete visual identity system including logo, colors, typography, and brand guidelines.",
    price: 2500,
    category: "Branding",
    features: ["Logo Design", "Color Palette", "Typography System", "Brand Guidelines PDF"],
  },
  {
    id: "web-design",
    name: "Website Design",
    description: "Custom responsive website design with modern aesthetics and user-centered approach.",
    price: 4500,
    category: "Web",
    features: ["UI/UX Design", "Responsive Layouts", "Interaction Design", "Design System"],
  },
  {
    id: "web-development",
    name: "Web Development",
    description: "Full-stack development bringing your design to life with clean, scalable code.",
    price: 6000,
    category: "Development",
    features: ["Frontend Development", "Backend Integration", "CMS Setup", "Performance Optimization"],
  },
  {
    id: "social-media",
    name: "Social Media Kit",
    description: "Cohesive social media presence with templates, posts, and content strategy.",
    price: 1500,
    category: "Marketing",
    features: ["Post Templates", "Story Templates", "Content Calendar", "Brand Assets"],
  },
  {
    id: "ecommerce",
    name: "E-commerce Solution",
    description: "Complete online store setup with product management and payment integration.",
    price: 8500,
    category: "E-commerce",
    features: ["Store Design", "Payment Gateway", "Inventory System", "Analytics Dashboard"],
  },
  {
    id: "seo-package",
    name: "SEO Package",
    description: "Comprehensive SEO strategy to improve visibility and organic traffic.",
    price: 2000,
    category: "Marketing",
    features: ["Keyword Research", "On-page SEO", "Technical Audit", "Monthly Reports"],
  },
];

export const whyChooseUs = [
  { icon: "unique", title: "You're Not Just Another Client", description: "Unique and valuable. We recognize your essence and transform it into an identity that resonates." },
  { icon: "tech", title: "Creativity Powered by Technology", description: "We fuse design, art, and development to create innovative digital experiences with precision." },
  { icon: "efficiency", title: "Efficiency That Saves Time", description: "We optimize processes without compromising quality, accelerating deliveries and maximizing value." },
  { icon: "flexibility", title: "Flexibility That Drives Growth", description: "We adapt to each need with scalable solutions, ensuring continuous evolution and results." },
];
