const { renderBadge } = require("../src/renderBadge");

const mockStats = {
  pullCount: 5000000,
  starCount: 200,
};

describe("renderBadge", () => {
  test("renders a valid SVG badge", () => {
    const svg = renderBadge(mockStats);
    expect(svg).toContain("<svg");
    expect(svg).toContain("</svg>");
  });

  test("includes pull count", () => {
    const svg = renderBadge(mockStats);
    expect(svg).toContain("5M");
  });

  test("includes default label", () => {
    const svg = renderBadge(mockStats);
    expect(svg).toContain("Docker Pulls");
  });

  test("supports custom label", () => {
    const svg = renderBadge(mockStats, { label: "Downloads" });
    expect(svg).toContain("Downloads");
  });

  test("renders for-the-badge style", () => {
    const svg = renderBadge(mockStats, { style: "for-the-badge" });
    expect(svg).toContain("DOCKER PULLS");
  });
});
