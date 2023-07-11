export async function delayHandler(milliseconds) {
    return new Promise(
        resolve => setTimeout(resolve, milliseconds)
    );
}