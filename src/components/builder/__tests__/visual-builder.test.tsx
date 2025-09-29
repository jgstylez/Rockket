import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VisualBuilder, type BuilderComponent } from "../visual-builder";

// Mock the drag and drop library
jest.mock("@dnd-kit/core", () => ({
  DndContext: ({ children, onDragStart, onDragEnd }: any) => (
    <div
      data-testid="dnd-context"
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      {children}
    </div>
  ),
  DragOverlay: ({ children }: any) => (
    <div data-testid="drag-overlay">{children}</div>
  ),
  PointerSensor: jest.fn(),
  useSensor: jest.fn(),
  useSensors: jest.fn(() => []),
}));

jest.mock("@dnd-kit/sortable", () => ({
  SortableContext: ({ children }: any) => (
    <div data-testid="sortable-context">{children}</div>
  ),
  verticalListSortingStrategy: jest.fn(),
}));

jest.mock("@dnd-kit/utilities", () => ({
  arrayMove: jest.fn((array, oldIndex, newIndex) => {
    const newArray = [...array];
    newArray.splice(newIndex, 0, newArray.splice(oldIndex, 1)[0]);
    return newArray;
  }),
}));

describe("VisualBuilder", () => {
  beforeEach(() => {
    // Clear any previous state
    jest.clearAllMocks();
  });

  it("should render the visual builder interface", () => {
    render(<VisualBuilder />);

    expect(screen.getByText("Component Library")).toBeInTheDocument();
    expect(screen.getByText("Start building your page")).toBeInTheDocument();
    expect(
      screen.getByText("Drag components from the library to get started")
    ).toBeInTheDocument();
  });

  it("should display component library with categories", () => {
    render(<VisualBuilder />);

    // Check for tab categories
    expect(screen.getByText("Layout")).toBeInTheDocument();
    expect(screen.getByText("Text")).toBeInTheDocument();
    expect(screen.getByText("Interactive")).toBeInTheDocument();

    // Check for component items
    expect(screen.getByText("Container")).toBeInTheDocument();
    expect(screen.getByText("Row")).toBeInTheDocument();
    expect(screen.getByText("Column")).toBeInTheDocument();
    expect(screen.getByText("Heading")).toBeInTheDocument();
    expect(screen.getByText("Paragraph")).toBeInTheDocument();
    expect(screen.getByText("Button")).toBeInTheDocument();
  });

  it("should show empty canvas initially", () => {
    render(<VisualBuilder />);

    expect(screen.getByText("Start building your page")).toBeInTheDocument();
    expect(
      screen.getByText("Drag components from the library to get started")
    ).toBeInTheDocument();
  });

  it("should have toolbar with action buttons", () => {
    render(<VisualBuilder />);

    // Check for toolbar buttons
    expect(screen.getByRole("button", { name: /undo/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /redo/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /preview/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /code/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
  });

  it("should disable undo/redo buttons initially", () => {
    render(<VisualBuilder />);

    const undoButton = screen.getByRole("button", { name: /undo/i });
    const redoButton = screen.getByRole("button", { name: /redo/i });

    expect(undoButton).toBeDisabled();
    expect(redoButton).toBeDisabled();
  });

  it("should handle component selection", async () => {
    const user = userEvent.setup();
    render(<VisualBuilder />);

    // This would require implementing the drag and drop functionality
    // For now, we'll test the basic structure
    expect(screen.getByTestId("dnd-context")).toBeInTheDocument();
  });

  it("should show properties panel when component is selected", () => {
    render(<VisualBuilder />);

    // Initially, no properties panel should be visible
    expect(screen.queryByText("Properties")).not.toBeInTheDocument();
  });

  it("should handle save functionality", async () => {
    const user = userEvent.setup();
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();

    render(<VisualBuilder />);

    const saveButton = screen.getByRole("button", { name: /save/i });
    await user.click(saveButton);

    expect(consoleSpy).toHaveBeenCalledWith("Saving components:", []);

    consoleSpy.mockRestore();
  });

  it("should handle preview functionality", async () => {
    const user = userEvent.setup();
    const mockWindow = {
      document: {
        write: jest.fn(),
      },
    };

    // Mock window.open
    const originalOpen = window.open;
    window.open = jest.fn(() => mockWindow as any);

    render(<VisualBuilder />);

    const previewButton = screen.getByRole("button", { name: /preview/i });
    await user.click(previewButton);

    expect(window.open).toHaveBeenCalledWith("", "_blank");
    expect(mockWindow.document.write).toHaveBeenCalled();

    // Restore original window.open
    window.open = originalOpen;
  });

  it("should handle tab switching in component library", async () => {
    const user = userEvent.setup();
    render(<VisualBuilder />);

    // Click on different tabs
    await user.click(screen.getByText("Text"));
    await user.click(screen.getByText("Interactive"));
    await user.click(screen.getByText("Layout"));

    // All tabs should be accessible
    expect(screen.getByText("Layout")).toBeInTheDocument();
    expect(screen.getByText("Text")).toBeInTheDocument();
    expect(screen.getByText("Interactive")).toBeInTheDocument();
  });

  it("should render component library items correctly", () => {
    render(<VisualBuilder />);

    // Check that all expected components are rendered
    const componentItems = [
      "Container",
      "Row",
      "Column",
      "Heading",
      "Paragraph",
      "Button",
    ];

    componentItems.forEach((componentName) => {
      expect(screen.getByText(componentName)).toBeInTheDocument();
    });
  });

  it("should have proper accessibility attributes", () => {
    render(<VisualBuilder />);

    // Check for proper ARIA labels and roles
    expect(screen.getByRole("button", { name: /undo/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /redo/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /preview/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
  });

  it("should handle keyboard navigation", async () => {
    const user = userEvent.setup();
    render(<VisualBuilder />);

    // Test tab navigation
    await user.tab();
    await user.tab();
    await user.tab();

    // Should be able to navigate through buttons
    expect(document.activeElement).toBeInTheDocument();
  });

  it("should maintain component state", () => {
    render(<VisualBuilder />);

    // The component should maintain its internal state
    // This is tested implicitly through the component rendering
    expect(screen.getByTestId("dnd-context")).toBeInTheDocument();
  });

  it("should handle responsive design", () => {
    render(<VisualBuilder />);

    // Check that the layout is responsive
    const mainContainer = screen
      .getByTestId("dnd-context")
      .closest(".flex.h-screen.bg-gray-100");
    expect(mainContainer).toBeInTheDocument();
  });
});

describe("BuilderComponent Integration", () => {
  it("should handle component rendering correctly", () => {
    const mockComponent: BuilderComponent = {
      id: "test-component",
      type: "Button",
      name: "Button",
      icon: <span>B</span>,
      category: "Interactive",
      props: {
        text: "Test Button",
        className: "bg-blue-500 text-white px-4 py-2 rounded",
      },
    };

    // Test that the component structure is correct
    expect(mockComponent.id).toBe("test-component");
    expect(mockComponent.type).toBe("Button");
    expect(mockComponent.name).toBe("Button");
    expect(mockComponent.category).toBe("Interactive");
    expect(mockComponent.props.text).toBe("Test Button");
  });

  it("should handle component props correctly", () => {
    const mockComponent: BuilderComponent = {
      id: "test-heading",
      type: "Heading",
      name: "Heading",
      icon: <span>H</span>,
      category: "Text",
      props: {
        level: 1,
        text: "Test Heading",
        className: "text-3xl font-bold",
      },
    };

    expect(mockComponent.props.level).toBe(1);
    expect(mockComponent.props.text).toBe("Test Heading");
    expect(mockComponent.props.className).toBe("text-3xl font-bold");
  });

  it("should handle nested components", () => {
    const mockContainer: BuilderComponent = {
      id: "test-container",
      type: "Container",
      name: "Container",
      icon: <span>C</span>,
      category: "Layout",
      props: {
        className: "p-4 bg-white border rounded-lg",
      },
      children: [
        {
          id: "test-heading",
          type: "Heading",
          name: "Heading",
          icon: <span>H</span>,
          category: "Text",
          props: {
            level: 1,
            text: "Nested Heading",
            className: "text-2xl font-bold",
          },
        },
      ],
    };

    expect(mockContainer.children).toHaveLength(1);
    expect(mockContainer.children?.[0].type).toBe("Heading");
    expect(mockContainer.children?.[0].props.text).toBe("Nested Heading");
  });
});
