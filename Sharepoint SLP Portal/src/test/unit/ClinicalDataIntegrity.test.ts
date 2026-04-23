import { describe, it, expect } from "vitest";
import { DisciplineService } from "../../services/DisciplineService";
import { SLP_DATA } from "../../data/slp-data";
import { PT_DATA } from "../../data/pt-data";
// import { OT_DATA } from '../../data/ot-data'; // If exists

describe("Clinical Data Integrity — Multidisciplinary Hub Parity", () => {
  it("verifies all SLP hubs have corresponding data entries", () => {
    const slpConfig = DisciplineService.getDisciplineConfig("slp");
    if (!slpConfig) throw new Error("SLP config missing");

    const slpHubIds = slpConfig.hubs.map((h) => h.id);
    const slpDataIds = SLP_DATA.map((d) => d.id);

    console.log("SLP Hub IDs:", slpHubIds);
    console.log("SLP Data IDs:", slpDataIds);

    slpHubIds.forEach((id) => {
      const exists =
        slpDataIds.includes(id as any) ||
        id === "news-ceu" ||
        id === "asha-hub" ||
        id === "clinical-pathways" ||
        id === "pt-resource-center" ||
        id === "slp-resource-center";

      expect(
        exists,
        `SLP Hub ID "${id}" detected in registry but missing from SLP_DATA repository`,
      ).toBe(true);
    });
  });

  it("verifies all PT hubs have corresponding data entries", () => {
    const ptConfig = DisciplineService.getDisciplineConfig("pt");
    if (!ptConfig) throw new Error("PT config missing");

    const ptHubIds = ptConfig.hubs.map((h) => h.id);
    const ptDataIds = (PT_DATA as any[]).map((d) => d.id);

    console.log("PT Hub IDs:", ptHubIds);
    console.log("PT Data IDs:", ptDataIds);

    ptHubIds.forEach((id) => {
      const exists =
        ptDataIds.includes(id as any) ||
        id === "pt-resource-center" ||
        id === "clinical-calculators" ||
        id === "exercise-library" ||
        id === "anatomy-lab";
      expect(
        exists,
        `PT Hub ID "${id}" detected in registry but missing from PT_DATA repository`,
      ).toBe(true);
    });
  });

  it("detects duplicate IDs WITHIN each clinical data repository", () => {
    // SLP Duplicates
    const slpIds = SLP_DATA.map((d) => d.id);
    const uniqueSlpIds = new Set(slpIds);
    expect(
      slpIds.length,
      `Duplicate IDs found in SLP_DATA: ${slpIds.filter((item, index) => slpIds.indexOf(item) !== index)}`,
    ).toBe(uniqueSlpIds.size);

    // PT Duplicates
    const ptIds = (PT_DATA as any[]).map((d) => d.id);
    const uniquePtIds = new Set(ptIds);
    expect(
      ptIds.length,
      `Duplicate IDs found in PT_DATA: ${ptIds.filter((item, index) => ptIds.indexOf(item) !== index)}`,
    ).toBe(uniquePtIds.size);
  });
});
