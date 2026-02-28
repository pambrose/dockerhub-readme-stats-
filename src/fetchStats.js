const axios = require("axios");

const DOCKERHUB_API = "https://hub.docker.com/v2/repositories";

async function fetchStats(image) {
  if (!image) {
    throw new Error("Image parameter is required");
  }

  // Normalize: "nginx" -> "library/nginx", "user/repo" stays as-is
  const normalizedImage = image.includes("/") ? image : `library/${image}`;
  const [namespace, repository] = normalizedImage.split("/");

  const url = `${DOCKERHUB_API}/${namespace}/${repository}/`;

  try {
    const response = await axios.get(url, { timeout: 5000 });
    const data = response.data;

    return {
      name: data.name,
      namespace: data.namespace,
      fullName: `${data.namespace}/${data.name}`,
      description: data.description || "",
      pullCount: data.pull_count || 0,
      starCount: data.star_count || 0,
      lastUpdated: data.last_updated || null,
      isOfficial: data.namespace === "library",
    };
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error(`Image not found: ${normalizedImage}`);
    }
    throw new Error(`Failed to fetch stats for ${normalizedImage}: ${error.message}`);
  }
}

module.exports = { fetchStats, DOCKERHUB_API };
