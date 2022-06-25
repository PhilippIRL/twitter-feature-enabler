const stateConstant = '__INITIAL_STATE__'
const BLACKLIST = ['responsive_web_cookie_compliance_banner_enabled']

function patchJsonData(data) {
    console.log(data)

    Object.keys(data.featureSwitch.user.config).forEach(name => {
        const feature = data.featureSwitch.user.config[name]

        if(!name.includes('graphql') 
            && !BLACKLIST.includes(name) 
            && feature.value === false) {
            feature.value = true
        } else if(name === 'dm_reactions_config_active_reactions') {
            feature.value.push('🥺:pleading_face')
        }
    })
    
    return data
}

if(window[stateConstant]) {
    window[stateConstant] = patchJsonData(window[stateConstant])
} else {
    window.location.reload()
}
