export interface ContentBlock {
  id: string;
  type: string;
  content: Record<string, any>;
  order: number;
  styles?: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface ContentPage {
  id: string;
  title: string;
  slug: string;
  description?: string;
  content: ContentBlock[];
  status: "draft" | "published" | "archived";
  publishedAt?: Date;
  authorId: string;
  tenantId: string;
  tags: string[];
  category?: string;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
    image?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  content: ContentBlock[];
  isPublic: boolean;
  createdBy: string;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MediaAsset {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  alt?: string;
  caption?: string;
  tags: string[];
  tenantId: string;
  uploadedBy: string;
  createdAt: Date;
}

// Predefined content block types
export const CONTENT_BLOCK_TYPES = {
  TEXT: "text",
  HEADING: "heading",
  IMAGE: "image",
  VIDEO: "video",
  GALLERY: "gallery",
  QUOTE: "quote",
  CODE: "code",
  EMBED: "embed",
  FORM: "form",
  BUTTON: "button",
  SPACER: "spacer",
  DIVIDER: "divider",
} as const;

export type ContentBlockType =
  (typeof CONTENT_BLOCK_TYPES)[keyof typeof CONTENT_BLOCK_TYPES];

// Content block templates
export const CONTENT_BLOCK_TEMPLATES: Record<ContentBlockType, ContentBlock> = {
  [CONTENT_BLOCK_TYPES.TEXT]: {
    id: "",
    type: CONTENT_BLOCK_TYPES.TEXT,
    content: {
      text: "Enter your text here...",
      alignment: "left",
      fontSize: "16px",
      color: "#000000",
    },
    order: 0,
    styles: {
      fontSize: "16px",
      lineHeight: "1.6",
      color: "#000000",
    },
  },
  [CONTENT_BLOCK_TYPES.HEADING]: {
    id: "",
    type: CONTENT_BLOCK_TYPES.HEADING,
    content: {
      text: "Heading Text",
      level: 2,
      alignment: "left",
    },
    order: 0,
    styles: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#000000",
    },
  },
  [CONTENT_BLOCK_TYPES.IMAGE]: {
    id: "",
    type: CONTENT_BLOCK_TYPES.IMAGE,
    content: {
      src: "",
      alt: "Image description",
      caption: "",
      alignment: "center",
      width: "100%",
    },
    order: 0,
    styles: {
      maxWidth: "100%",
      height: "auto",
    },
  },
  [CONTENT_BLOCK_TYPES.VIDEO]: {
    id: "",
    type: CONTENT_BLOCK_TYPES.VIDEO,
    content: {
      src: "",
      poster: "",
      controls: true,
      autoplay: false,
      loop: false,
    },
    order: 0,
    styles: {
      maxWidth: "100%",
      height: "auto",
    },
  },
  [CONTENT_BLOCK_TYPES.GALLERY]: {
    id: "",
    type: CONTENT_BLOCK_TYPES.GALLERY,
    content: {
      images: [],
      columns: 3,
      spacing: "medium",
      showCaptions: true,
    },
    order: 0,
    styles: {
      display: "grid",
      gap: "1rem",
    },
  },
  [CONTENT_BLOCK_TYPES.QUOTE]: {
    id: "",
    type: CONTENT_BLOCK_TYPES.QUOTE,
    content: {
      text: "Enter your quote here...",
      author: "",
      alignment: "center",
    },
    order: 0,
    styles: {
      fontSize: "18px",
      fontStyle: "italic",
      borderLeft: "4px solid #ccc",
      paddingLeft: "1rem",
    },
  },
  [CONTENT_BLOCK_TYPES.CODE]: {
    id: "",
    type: CONTENT_BLOCK_TYPES.CODE,
    content: {
      code: "// Enter your code here...",
      language: "javascript",
      showLineNumbers: true,
    },
    order: 0,
    styles: {
      fontFamily: "monospace",
      backgroundColor: "#f5f5f5",
      padding: "1rem",
      borderRadius: "4px",
    },
  },
  [CONTENT_BLOCK_TYPES.EMBED]: {
    id: "",
    type: CONTENT_BLOCK_TYPES.EMBED,
    content: {
      url: "",
      type: "iframe",
      width: "100%",
      height: "400px",
    },
    order: 0,
    styles: {
      maxWidth: "100%",
    },
  },
  [CONTENT_BLOCK_TYPES.FORM]: {
    id: "",
    type: CONTENT_BLOCK_TYPES.FORM,
    content: {
      fields: [],
      submitText: "Submit",
      action: "",
      method: "POST",
    },
    order: 0,
    styles: {
      padding: "1rem",
      border: "1px solid #ccc",
      borderRadius: "4px",
    },
  },
  [CONTENT_BLOCK_TYPES.BUTTON]: {
    id: "",
    type: CONTENT_BLOCK_TYPES.BUTTON,
    content: {
      text: "Click Me",
      url: "#",
      style: "primary",
      size: "medium",
    },
    order: 0,
    styles: {
      padding: "0.5rem 1rem",
      backgroundColor: "#007bff",
      color: "#ffffff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    },
  },
  [CONTENT_BLOCK_TYPES.SPACER]: {
    id: "",
    type: CONTENT_BLOCK_TYPES.SPACER,
    content: {
      height: "20px",
    },
    order: 0,
    styles: {
      height: "20px",
    },
  },
  [CONTENT_BLOCK_TYPES.DIVIDER]: {
    id: "",
    type: CONTENT_BLOCK_TYPES.DIVIDER,
    content: {
      style: "solid",
      color: "#ccc",
      thickness: "1px",
    },
    order: 0,
    styles: {
      borderTop: "1px solid #ccc",
      margin: "1rem 0",
    },
  },
};

export class ContentService {
  async createContentBlock(
    type: ContentBlockType,
    content: Record<string, any> = {},
    styles: Record<string, any> = {}
  ): Promise<ContentBlock> {
    const template = CONTENT_BLOCK_TEMPLATES[type];

    return {
      id: `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      content: { ...template.content, ...content },
      order: 0,
      styles: { ...template.styles, ...styles },
      metadata: {},
    };
  }

  async createContentPage(
    title: string,
    slug: string,
    authorId: string,
    tenantId: string,
    content: ContentBlock[] = []
  ): Promise<ContentPage> {
    return {
      id: `page_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      slug,
      content,
      status: "draft",
      authorId,
      tenantId,
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async createContentTemplate(
    name: string,
    description: string,
    category: string,
    content: ContentBlock[],
    createdBy: string,
    tenantId: string,
    isPublic: boolean = false
  ): Promise<ContentTemplate> {
    return {
      id: `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      category,
      content,
      isPublic,
      createdBy,
      tenantId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async generateSlug(title: string): Promise<string> {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }

  async validateContent(content: ContentBlock[]): Promise<{
    valid: boolean;
    errors: string[];
  }> {
    const errors: string[] = [];

    for (const block of content) {
      if (!block.type) {
        errors.push(`Block ${block.id} is missing type`);
      }

      if (!block.content) {
        errors.push(`Block ${block.id} is missing content`);
      }

      // Validate specific block types
      switch (block.type) {
        case CONTENT_BLOCK_TYPES.IMAGE:
          if (!block.content.src) {
            errors.push(`Image block ${block.id} is missing src`);
          }
          break;
        case CONTENT_BLOCK_TYPES.VIDEO:
          if (!block.content.src) {
            errors.push(`Video block ${block.id} is missing src`);
          }
          break;
        case CONTENT_BLOCK_TYPES.EMBED:
          if (!block.content.url) {
            errors.push(`Embed block ${block.id} is missing url`);
          }
          break;
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  async exportToHTML(content: ContentBlock[]): Promise<string> {
    return content
      .sort((a, b) => a.order - b.order)
      .map((block) => this.renderBlockToHTML(block))
      .join("\n");
  }

  private renderBlockToHTML(block: ContentBlock): string {
    const styles = this.generateInlineStyles(block.styles || {});
    const content = block.content;

    switch (block.type) {
      case CONTENT_BLOCK_TYPES.TEXT:
        return `<p style="${styles}">${content.text}</p>`;

      case CONTENT_BLOCK_TYPES.HEADING:
        return `<h${content.level || 2} style="${styles}">${content.text}</h${content.level || 2}>`;

      case CONTENT_BLOCK_TYPES.IMAGE:
        return `<img src="${content.src}" alt="${content.alt || ""}" style="${styles}" />`;

      case CONTENT_BLOCK_TYPES.VIDEO:
        return `<video src="${content.src}" poster="${content.poster || ""}" controls="${content.controls || false}" style="${styles}"></video>`;

      case CONTENT_BLOCK_TYPES.QUOTE:
        return `<blockquote style="${styles}">${content.text}${content.author ? `<cite>${content.author}</cite>` : ""}</blockquote>`;

      case CONTENT_BLOCK_TYPES.CODE:
        return `<pre><code style="${styles}">${content.code}</code></pre>`;

      case CONTENT_BLOCK_TYPES.BUTTON:
        return `<a href="${content.url || "#"}" style="${styles}">${content.text}</a>`;

      case CONTENT_BLOCK_TYPES.SPACER:
        return `<div style="${styles}"></div>`;

      case CONTENT_BLOCK_TYPES.DIVIDER:
        return `<hr style="${styles}" />`;

      default:
        return `<div style="${styles}">${JSON.stringify(content)}</div>`;
    }
  }

  private generateInlineStyles(styles: Record<string, any>): string {
    return Object.entries(styles)
      .map(([key, value]) => `${key}: ${value}`)
      .join("; ");
  }
}
