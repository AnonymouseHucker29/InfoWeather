function delayHandler(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

module.exports.delayHandler = delayHandler;