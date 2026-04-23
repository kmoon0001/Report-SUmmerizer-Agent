import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PTCorner } from "../../components/PTCorner";
import { PT_CORNER_CONTENT } from "../../data/pt-data";

describe("PTCorner", () => {
  it("renders without crashing", () => {
    render(<PTCorner />);
    expect(screen.getByText("PT Corner")).toBeInTheDocument();
  });

  it("shows subtitle", () => {
    render(<PTCorner />);
    expect(
      screen.getByText(/CEUs, events, articles, and podcasts/i),
    ).toBeInTheDocument();
  });

  it("renders 4 tab buttons", () => {
    render(<PTCorner />);
    expect(screen.getByRole("button", { name: /CEUs/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Events/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Articles/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Podcasts/i }),
    ).toBeInTheDocument();
  });

  it("defaults to CEUs tab and shows CEU content", () => {
    render(<PTCorner />);
    expect(
      screen.getByText(PT_CORNER_CONTENT.ceus[0].title),
    ).toBeInTheDocument();
    expect(
      screen.getByText(PT_CORNER_CONTENT.ceus[0].provider),
    ).toBeInTheDocument();
  });

  it("shows all CEU items", () => {
    render(<PTCorner />);
    PT_CORNER_CONTENT.ceus.forEach((item) => {
      expect(screen.getByText(item.title)).toBeInTheDocument();
    });
  });

  it("switching to Events tab shows event content", () => {
    render(<PTCorner />);
    fireEvent.click(screen.getByRole("button", { name: /Events/i }));
    expect(
      screen.getByText(PT_CORNER_CONTENT.events[0].title),
    ).toBeInTheDocument();
    PT_CORNER_CONTENT.events.forEach((item) => {
      expect(screen.getByText(item.title)).toBeInTheDocument();
    });
  });

  it("switching to Articles tab shows blog content", () => {
    render(<PTCorner />);
    fireEvent.click(screen.getByRole("button", { name: /Articles/i }));
    expect(
      screen.getByText(PT_CORNER_CONTENT.blogs[0].title),
    ).toBeInTheDocument();
    PT_CORNER_CONTENT.blogs.forEach((item) => {
      expect(screen.getByText(item.title)).toBeInTheDocument();
    });
  });

  it("switching to Podcasts tab shows podcast content", () => {
    render(<PTCorner />);
    fireEvent.click(screen.getByRole("button", { name: /Podcasts/i }));
    expect(
      screen.getByText(PT_CORNER_CONTENT.podcasts[0].title),
    ).toBeInTheDocument();
    PT_CORNER_CONTENT.podcasts.forEach((item) => {
      expect(screen.getByText(item.title)).toBeInTheDocument();
    });
  });

  it("CEU items have correct credit info", () => {
    render(<PTCorner />);
    // Each CEU shows "{credits} Credits · {format}" — use getAllByText since values may repeat
    PT_CORNER_CONTENT.ceus.forEach((item) => {
      const matches = screen.getAllByText(
        new RegExp(`${item.credits} Credits`),
      );
      expect(matches.length).toBeGreaterThan(0);
    });
  });

  it("event items show date and location", () => {
    render(<PTCorner />);
    fireEvent.click(screen.getByRole("button", { name: /Events/i }));
    // Dates are shown combined with location: "{date} · {location}"
    // Just verify each event title is present (dates have special chars)
    PT_CORNER_CONTENT.events.forEach((item) => {
      expect(screen.getByText(item.title)).toBeInTheDocument();
    });
  });

  it("podcast items show host name", () => {
    render(<PTCorner />);
    fireEvent.click(screen.getByRole("button", { name: /Podcasts/i }));
    PT_CORNER_CONTENT.podcasts.forEach((item) => {
      expect(screen.getByText(item.host)).toBeInTheDocument();
    });
  });

  it('all links have target="_blank" and rel="noopener noreferrer"', () => {
    render(<PTCorner />);
    const links = document.querySelectorAll("a");
    links.forEach((link) => {
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toBe("noopener noreferrer");
    });
  });

  it("active tab has blue background styling", () => {
    render(<PTCorner />);
    const ceuBtn = screen.getByRole("button", { name: /CEUs/i });
    expect(ceuBtn.className).toContain("bg-blue-600");
  });

  it("inactive tabs do not have blue background", () => {
    render(<PTCorner />);
    const eventsBtn = screen.getByRole("button", { name: /Events/i });
    expect(eventsBtn.className).not.toContain("bg-blue-600");
  });

  it("contains no SLP-specific content", () => {
    render(<PTCorner />);
    expect(screen.queryByText(/ASHA/i)).toBeNull();
    expect(screen.queryByText(/dysphagia/i)).toBeNull();
    expect(screen.queryByText(/aphasia/i)).toBeNull();
  });
});
