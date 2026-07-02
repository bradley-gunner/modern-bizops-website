import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CompetencyDetail from "@/components/maturity/CompetencyDetail";
import { competencyBySlug } from "@/lib/maturity/competencies";

describe("CompetencyDetail", () => {
  const c = competencyBySlug("pipeline-stage-design");

  it("renders the data tools, data points, and questions", () => {
    render(<CompetencyDetail competency={c} />);
    expect(screen.getByText("The data")).toBeInTheDocument();
    expect(screen.getByText("The questions I ask")).toBeInTheDocument();
    expect(screen.getByText(/HubSpot/)).toBeInTheDocument();
    expect(screen.getByText(c.questions.listenFor)).toBeInTheDocument();
  });

  it("shows no rubric or level labels", () => {
    render(<CompetencyDetail competency={c} />);
    expect(screen.queryByText(/rubric/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/^\s*(Absent|Informal|Optimized)\s*$/)
    ).not.toBeInTheDocument();
  });
});
