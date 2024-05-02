const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null

// Fetch all properties
async function fetchProperties({ showFeatured = false } = {}) {
    try {

        // check if api domain is available
        if (!apiDomain) return []

        const res = await fetch(`${apiDomain}/properties${showFeatured ? "/featured" : ""}`);

        if (!res.ok) {
            throw new Error("Failed to fetch data");
        }

        return res.json();
    } catch (error) {
        console.log("Properties fetch error ", error);
        return [];
    }
}

async function fetchProperty(id) {
    try {
        if (!apiDomain) return [];

        const res = await fetch(`${apiDomain}/properties/${id}`, {
            cache: 'no-store'
        });

        if (!res.ok) throw new Error("Failed to fetch data")

        return res.json()

    } catch (error) {

        console.log("Property fetch error ");
        return null;
    }
}

export { fetchProperties, fetchProperty };