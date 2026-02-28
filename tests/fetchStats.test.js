const axios = require("axios");
const { fetchStats } = require("../src/fetchStats");

jest.mock("axios");

describe("fetchStats", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("fetches stats for namespaced image", async () => {
    axios.get.mockResolvedValue({
      data: {
        name: "nginx",
        namespace: "library",
        description: "Official Nginx image",
        pull_count: 1000000000,
        star_count: 1500,
        last_updated: "2024-01-15T10:30:00Z",
      },
    });

    const stats = await fetchStats("library/nginx");

    expect(axios.get).toHaveBeenCalledWith(
      "https://hub.docker.com/v2/repositories/library/nginx/",
      { timeout: 5000 }
    );
    expect(stats).toEqual({
      name: "nginx",
      namespace: "library",
      fullName: "library/nginx",
      description: "Official Nginx image",
      pullCount: 1000000000,
      starCount: 1500,
      lastUpdated: "2024-01-15T10:30:00Z",
      isOfficial: true,
    });
  });

  test("auto-prefixes library/ for short image names", async () => {
    axios.get.mockResolvedValue({
      data: {
        name: "nginx",
        namespace: "library",
        description: "",
        pull_count: 500,
        star_count: 10,
        last_updated: null,
      },
    });

    await fetchStats("nginx");

    expect(axios.get).toHaveBeenCalledWith(
      "https://hub.docker.com/v2/repositories/library/nginx/",
      { timeout: 5000 }
    );
  });

  test("throws error when image is not found", async () => {
    axios.get.mockRejectedValue({
      response: { status: 404 },
    });

    await expect(fetchStats("nonexistent/image")).rejects.toThrow(
      "Image not found: nonexistent/image"
    );
  });

  test("throws error when image param is missing", async () => {
    await expect(fetchStats()).rejects.toThrow("Image parameter is required");
    await expect(fetchStats("")).rejects.toThrow("Image parameter is required");
  });

  test("throws error on network failure", async () => {
    axios.get.mockRejectedValue(new Error("Network Error"));

    await expect(fetchStats("library/nginx")).rejects.toThrow(
      "Failed to fetch stats for library/nginx"
    );
  });
});
