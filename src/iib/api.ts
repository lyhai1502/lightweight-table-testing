export const fetchData = async (start: number, limit: number) => {
    console.log(`📡 Fetching data: start=${start}, limit=${limit}`);

    const res = await fetch("https://microsoftedge.github.io/Demos/json-dummy-data/5MB.json");
    const data = await res.json();

    function randomState() {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        return Array.from({ length: 2 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    }

    function getCreatedDate() {
        const d = new Date();
        const pad = (n: number) => n.toString().padStart(2, "0");
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    }

    const createdDate = getCreatedDate();
    const result = data.slice(start, start + limit).map((item: any, idx: number) => ({
        id: `${item.id ?? "row"}_${start + idx}`,
        name: item.name,
        language: item.language ?? "",
        bio: item.bio ?? "",
        version: item.version ?? 1,
        created_date: createdDate,
        state: randomState(),
    }));

    return result;
};
