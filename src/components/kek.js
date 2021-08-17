async function kek(methodName, params) {
    const url = new URL(`http://localhost:3002/${methodName}`);
    url.search = new URLSearchParams(params).toString();
    await fetch(url.toString());
}
