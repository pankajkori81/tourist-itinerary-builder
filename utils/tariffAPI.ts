// Helper to fetch all tariffs
export const getAllTariffs = async () => {
    try {
        const res = await fetch('/api/tariffs');
        const json = await res.json();
        return json.success ? json.data : [];
    } catch (e) {
        console.error(e);
        return [];
    }
};

// Helper to save or update a tariff
export const saveTariff = async (tariffData: any) => {
    try {
        const method = tariffData._id ? 'PUT' : 'POST';
        const res = await fetch('/api/tariffs', {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tariffData)
        });
        const json = await res.json();
        return json.success;
    } catch (e) {
        console.error(e);
        return false;
    }
};