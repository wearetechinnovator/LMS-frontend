async function getUser() {
    const res = await fetch("https://jsonplaceholder.typicode.com/users", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
    const data = await res.json()

    return data;
}

export default getUser;
