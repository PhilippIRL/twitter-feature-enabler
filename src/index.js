import { parse as parsejs } from 'acorn'

const BLACKLIST = ['responsive_web_cookie_compliance_banner_enabled']

function patchJsonData(data) {
    console.log(data)

    Object.keys(data.__INITIAL_STATE__.featureSwitch.user.config).forEach(name => {
        const feature = data.__INITIAL_STATE__.featureSwitch.user.config[name]

        if(!name.includes('graphql') && !BLACKLIST.includes(name) && feature.value === false) {
            feature.value = true
        } else if(name === 'dm_reactions_config_active_reactions') {
            feature.value.push('🥺:pleading_face')
        }
    })
    
    return data
}

function patchJsonDataNode(node) {
    const data = {}
    const scriptText = node.innerHTML
    let doc

    try {
        doc = parsejs(scriptText, {ecmaVersion: '2020'})
    } catch(e) {
        window.localStorage.javascriptApiScreaming = (window.localStorage.javascriptApiScreaming || '') + 'A'

        console.error('Twitter config invalid / not completely loaded! Trying to reload, hopefully from cache...')

        if(window.localStorage.javascriptApiScreaming?.length >= 10) {
            window.alert('10 failed patch attempts, giving up. ' + window.localStorage.javascriptApiScreaming)
            return
        }

        window.stop()
        setTimeout(() => window.location.reload(), 2000)

        return
    }

    window.localStorage.javascriptApiScreaming = ''

    doc.body
        .filter(exp => exp.type === 'ExpressionStatement' && exp.expression.type === 'AssignmentExpression')
        .forEach(exp => {
            try {
                const property = exp.expression.left.property.name
                const valueStart = exp.expression.right.start, valueEnd = exp.expression.right.end
                const value = scriptText.substr(valueStart, valueEnd - valueStart)
                data[property] = JSON.parse(value)
            } catch(e) {
                console.error('uff twitter hat das format geändert', e, node.innerHTML)
            }
        })

    const patchedData = patchJsonData(data)

    let newScriptText = ''
    for(const [key, value] of Object.entries(patchedData)) {
        newScriptText += `window.${key}=${JSON.stringify(value)};`
    }
    node.innerHTML = newScriptText
}

const observer = new MutationObserver(changes => {
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

