import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CompetencyCard from "@/components/maturity/CompetencyCard";
import { COMPETENCIES, competencyBySlug } from "@/lib/maturity/competencies";

describe("CompetencyCard", () => {
  it("always toggles the detail panel, even when a learn page exists", () => {
    const c = competencyBySlug("pipeline-stage-design");
    expect(c.learnMoreUrl).toBeTruthy();
    const onToggle = vi.fn();
    render(<CompetencyCard competency={c} isOpen={false} onToggle={onToggle} />);
    fireEvent.click(screen.getByRole("button", { expanded: false }));
    expect(onToggle).toHaveBeenCalledWith("pipeline-stage-design");
  });

  it("renders the learn page as a separate footer link, not the whole card", () => {
    const c = competencyBySlug("ideal-customer-profile");
    render(<CompetencyCard competency={c} isOpen={false} onToggle={() => {}} />);
    const link = screen.getByRole("link", { name: "Read the full breakdown" });
    expect(link).toHaveAttribute("href", "/learn/ideal-customer-profile");
  });

  it("shows the toggle hint instead of a link when no learn page exists yet", () => {
    const c = COMPETENCIES.find((x) => !x.learnMoreUrl);
    expect(c).toBeTruthy();
    render(<CompetencyCard competency={c} isOpen={false} onToggle={() => {}} />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByText("See how we score it")).toBeInTheDocument();
  });
});
