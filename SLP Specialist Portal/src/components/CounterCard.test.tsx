import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CounterCard } from "./CounterCard";
import { Activity } from "lucide-react";

describe("CounterCard Component", () => {
  it("renders correctly with props", () => {
    render(
      <CounterCard
        label="Total Patients"
        value="123"
        icon={Activity}
        color="text-blue-500"
        bg="bg-blue-100"
      />,
    );

    expect(screen.getByText("Total Patients")).toBeInTheDocument();
    expect(screen.getByText("123")).toBeInTheDocument();
  });
});
