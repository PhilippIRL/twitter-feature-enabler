import { parse as parsejs } from 'acorn'

function patchJsonData(data) {
    Object.keys(data.__INITIAL_STATE__.featureSwitch.user.config).forEach(name => {
        let feature = data.__INITIAL_STATE__.featureSwitch.user.config[name]
        if(!name.includes('graphql') && feature.value === false) {
            feature.value = true
        }
    })
    return data
}

function patchJsonDataNode(node) {
    let data = {}

    let scriptText = node.innerHTML
    let doc = parsejs(scriptText, {ecmaVersion: '2020'})
    doc.body
        .filter(exp => exp.type === 'ExpressionStatement' && exp.expression.type === 'AssignmentExpression')
        .forEach(exp => {
            try {
                let property = exp.expression.left.property.name
                let valueStart = exp.expression.right.start, valueEnd = exp.expression.right.end
                let value = scriptText.substr(valueStart, valueEnd - valueStart)
                data[property] = JSON.parse(value)
            } catch(e) {
                console.error('uff twitter hat das format geändert', e, node.innerHTML)
            }
        })

    let patchedData = patchJsonData(data)

    let newScriptText = ''
    for(let [key, value] of Object.entries(patchedData)) {
        newScriptText += `window.${key}=${JSON.stringify(value)};`
    }
    node.innerHTML = newScriptText
}

let observer = new MutationObserver(changes => {
    changes.forEach(change => {
        change.addedNodes.forEach(node => {
            if(node.tagName === 'SCRIPT' && node.innerHTML.startsWith('window.__INITIAL_STATE__')) {          
                patchJsonDataNode(node)
            }
        })
    })
})

observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
})
