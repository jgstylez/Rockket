export interface BuilderComponent {
  id: string;
  type: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  props: Record<string, any>;
  children?: BuilderComponent[];
  styles?: Record<string, any>;
  events?: Record<string, string>;
}

export interface BuilderPage {
  id: string;
  name: string;
  path: string;
  components: BuilderComponent[];
  styles?: Record<string, any>;
  meta?: Record<string, any>;
}

export interface BuilderProject {
  id: string;
  name: string;
  description: string;
  pages: BuilderPage[];
  globalStyles?: Record<string, any>;
  settings?: Record<string, any>;
}

// Predefined component library
export const COMPONENT_LIBRARY: BuilderComponent[] = [
  // Layout Components
  {
    id: "container",
    type: "Container",
    name: "Container",
    category: "Layout",
    description: "A flexible container component",
    icon: "📦",
    props: {
      className: "container mx-auto px-4",
      children: [],
    },
    styles: {
      padding: "1rem",
      backgroundColor: "transparent",
    },
  },
  {
    id: "row",
    type: "Row",
    name: "Row",
    category: "Layout",
    description: "A horizontal row container",
    icon: "➡️",
    props: {
      className: "flex flex-row",
      children: [],
    },
    styles: {
      display: "flex",
      flexDirection: "row",
      gap: "1rem",
    },
  },
  {
    id: "column",
    type: "Column",
    name: "Column",
    category: "Layout",
    description: "A vertical column container",
    icon: "⬇️",
    props: {
      className: "flex flex-col",
      children: [],
    },
    styles: {
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
    },
  },
  {
    id: "grid",
    type: "Grid",
    name: "Grid",
    category: "Layout",
    description: "A CSS Grid container",
    icon: "⊞",
    props: {
      className: "grid",
      children: [],
    },
    styles: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "1rem",
    },
  },

  // Text Components
  {
    id: "heading",
    type: "Heading",
    name: "Heading",
    category: "Text",
    description: "A heading component",
    icon: "📝",
    props: {
      level: 1,
      text: "Heading Text",
      className: "text-2xl font-bold",
    },
    styles: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      color: "#000000",
    },
  },
  {
    id: "paragraph",
    type: "Paragraph",
    name: "Paragraph",
    category: "Text",
    description: "A paragraph component",
    icon: "📄",
    props: {
      text: "This is a paragraph of text.",
      className: "text-base",
    },
    styles: {
      fontSize: "1rem",
      lineHeight: "1.5",
      color: "#333333",
    },
  },
  {
    id: "link",
    type: "Link",
    name: "Link",
    category: "Text",
    description: "A link component",
    icon: "🔗",
    props: {
      href: "#",
      text: "Link Text",
      className: "text-blue-600 underline",
    },
    styles: {
      color: "#2563eb",
      textDecoration: "underline",
    },
  },

  // Form Components
  {
    id: "input",
    type: "Input",
    name: "Input",
    category: "Form",
    description: "A text input field",
    icon: "📝",
    props: {
      type: "text",
      placeholder: "Enter text...",
      className: "input-field",
    },
    styles: {
      padding: "0.5rem",
      border: "1px solid #d1d5db",
      borderRadius: "0.375rem",
    },
  },
  {
    id: "button",
    type: "Button",
    name: "Button",
    category: "Form",
    description: "A clickable button",
    icon: "🔘",
    props: {
      text: "Click Me",
      className: "btn-primary",
    },
    styles: {
      padding: "0.5rem 1rem",
      backgroundColor: "#3b82f6",
      color: "#ffffff",
      border: "none",
      borderRadius: "0.375rem",
      cursor: "pointer",
    },
  },
  {
    id: "textarea",
    type: "Textarea",
    name: "Textarea",
    category: "Form",
    description: "A multi-line text input",
    icon: "📄",
    props: {
      placeholder: "Enter your message...",
      rows: 4,
      className: "textarea-field",
    },
    styles: {
      padding: "0.5rem",
      border: "1px solid #d1d5db",
      borderRadius: "0.375rem",
      resize: "vertical",
    },
  },
  {
    id: "select",
    type: "Select",
    name: "Select",
    category: "Form",
    description: "A dropdown select",
    icon: "📋",
    props: {
      options: ["Option 1", "Option 2", "Option 3"],
      className: "select-field",
    },
    styles: {
      padding: "0.5rem",
      border: "1px solid #d1d5db",
      borderRadius: "0.375rem",
    },
  },

  // Media Components
  {
    id: "image",
    type: "Image",
    name: "Image",
    category: "Media",
    description: "An image component",
    icon: "🖼️",
    props: {
      src: "https://via.placeholder.com/300x200",
      alt: "Placeholder image",
      className: "w-full h-auto",
    },
    styles: {
      maxWidth: "100%",
      height: "auto",
    },
  },
  {
    id: "video",
    type: "Video",
    name: "Video",
    category: "Media",
    description: "A video component",
    icon: "🎥",
    props: {
      src: "",
      controls: true,
      className: "w-full",
    },
    styles: {
      maxWidth: "100%",
      height: "auto",
    },
  },

  // Navigation Components
  {
    id: "navbar",
    type: "Navbar",
    name: "Navigation Bar",
    category: "Navigation",
    description: "A navigation bar",
    icon: "🧭",
    props: {
      brand: "Brand",
      links: ["Home", "About", "Contact"],
      className: "navbar",
    },
    styles: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "1rem",
      backgroundColor: "#ffffff",
      borderBottom: "1px solid #e5e7eb",
    },
  },
  {
    id: "sidebar",
    type: "Sidebar",
    name: "Sidebar",
    category: "Navigation",
    description: "A sidebar navigation",
    icon: "📋",
    props: {
      links: ["Dashboard", "Settings", "Profile"],
      className: "sidebar",
    },
    styles: {
      width: "250px",
      height: "100vh",
      backgroundColor: "#f9fafb",
      borderRight: "1px solid #e5e7eb",
    },
  },

  // Data Components
  {
    id: "table",
    type: "Table",
    name: "Table",
    category: "Data",
    description: "A data table",
    icon: "📊",
    props: {
      headers: ["Name", "Email", "Role"],
      rows: [
        ["John Doe", "john@example.com", "Admin"],
        ["Jane Smith", "jane@example.com", "User"],
      ],
      className: "table",
    },
    styles: {
      width: "100%",
      borderCollapse: "collapse",
    },
  },
  {
    id: "card",
    type: "Card",
    name: "Card",
    category: "Data",
    description: "A card component",
    icon: "🃏",
    props: {
      title: "Card Title",
      content: "Card content goes here",
      className: "card",
    },
    styles: {
      padding: "1rem",
      border: "1px solid #e5e7eb",
      borderRadius: "0.5rem",
      backgroundColor: "#ffffff",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    },
  },
];

export function getComponentsByCategory(category: string): BuilderComponent[] {
  return COMPONENT_LIBRARY.filter(
    (component) => component.category === category
  );
}

export function getComponentById(id: string): BuilderComponent | undefined {
  return COMPONENT_LIBRARY.find((component) => component.id === id);
}

export function getCategories(): string[] {
  return [...new Set(COMPONENT_LIBRARY.map((component) => component.category))];
}

export function createComponent(
  type: string,
  props: Record<string, any> = {},
  styles: Record<string, any> = {}
): BuilderComponent {
  const template = COMPONENT_LIBRARY.find((comp) => comp.type === type);
  if (!template) {
    throw new Error(`Component type ${type} not found`);
  }

  return {
    id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    name: template.name,
    category: template.category,
    description: template.description,
    icon: template.icon,
    props: { ...template.props, ...props },
    styles: { ...template.styles, ...styles },
    children: [],
  };
}
