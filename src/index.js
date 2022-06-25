function injectScript(node) {
    const injectNode = document.createElement('script')
    injectNode.src = chrome.runtime.getURL('/inject.js')
    node.after(injectNode)
}

const observer = new MutationObserver(changes => {
    changes.forEach(change => {
        change.addedNodes.forEach(node => {
            if(node.tagName === 'SCRIPT' && node.innerHTML.startsWith('window.__INITIAL_STATE__')) {          
                injectScript(node)
            }
        })
    })
})

observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
})
