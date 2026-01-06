export const getCategories = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/categories`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const jsonData = await res.json();
    const data = jsonData.data;

    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch category api");
    }
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
