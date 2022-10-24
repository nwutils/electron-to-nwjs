class systemPreferences {
    isDarkMode() {
        return false // this method is deprecated already, so we probably won't be supporting it
    }

    // macOS only methods
    isSwipeTrackingFromScrollEventsEnabled() {
        return false
    }
    postNotification(event, userInfo, deliverImmediately) {

    }
    postLocalNotification(event, userInfo) {

    }
    postWorkspaceNotification(event, userInfo) {

    }
    subscribeNotification(event, callback) {

    }
    subscribeLocalNotification(event, callback) {

    }
    subscribeWorkspaceNotification(event, callback) {

    }
    unsubscribeNotification(id) {

    }
    unsubscribeLocalNotification(id) {

    }
    unsubscribeWorkspaceNotification(id) {

    }
    registerDefaults(defaults) {

    }
    getUserDefault(key, type) {

    }
    setUserDefault(key, type, value) {
        
    }
    removeUserDefault(key) {

    }


    isAeroGlassEnabled() {
        return false
    }


    getAccentColor() {

    }
    getColor(color) {
        return undefined
    }
    getSystemColor(color) {
        switch(color) {
            case 'blue':   return "#0000FFFF"
            case 'brown':  return "#996633FF"
            case 'gray':   return "#7F7F7FFF"
            case 'green':  return "#00FF00FF"
            case 'orange': return "#FF7F00FF"
            case 'pink':   return "#FF007FFF"
            case 'purple': return "#7F007FFF"
            case 'red':    return "#FF0000FF"
            case 'yellow': return "#FFFF00FF"
            default: return undefined
        }
    }
    isInvertedColorScheme() {
        return false // this method is deprecated already, so we probably won't be supporting it
    }
    isHighContrastColorScheme() {
         return false // this method is deprecated already, so we probably won't be supporting it
    }
    getEffectiveAppearance() {

    }
    getAppLevelAppearance() {
        return null // this method is deprecated already, so we probably won't be supporting it
    }
    setAppLevelAppearance(appearance) {
        // this method is deprecated already, so we probably won't be supporting it
    }
    canPromptTouchID() {
        return false
    }
    promptTouchID(reason) {

    }
    isTrustedAccessibilityClient(prompt) {

    }
    getMediaAccessStatus(mediaType) {

    }
    askForMediaAccess(mediaType) {
        
    }
    getAnimationSettings() {
        
    }
}
module.exports = new systemPreferences()