/**
 * Fetch all links in the group from database
 *
 * @param {number} groupId
 * @returns links[]
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
