export function removeDuplicates(array, identifier) {
  const uniqueObjects = {};
  const result = [];

  for (const item of array) {
    const key = item[identifier]; // Use a specific property as the identifier

    if (!uniqueObjects[key]) {
      uniqueObjects[key] = true;
      result.push(item);
    }
  }

  return result;
}