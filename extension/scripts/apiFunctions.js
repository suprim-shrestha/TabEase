/**
 * Fetch all links in the group from database
 *
 * @param {number} groupId
 */
async function getLinks(groupId) {
  try {
    const response = await fetch(`${API_URL}/links/?groupId=${groupId}`);
    const links = await response.json();
    return links.data;
  } catch (error) {
    console.log(error);
  }
}

/**
 * Add link to group with groupId
 *
 * @param {number} groupId
 * @param {Object} link
 */
async function addLink(groupId, link) {
  try {
    await fetch(`${API_URL}/links/?groupId=${groupId}`, {
      body: JSON.stringify(link),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
  }
}
