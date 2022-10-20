# Progress

How far electron-to-nwjs went mapping the Electron module to NW.js

**Statuses:**

* 🌑🌑🌑🌑 Not Planned
* 🌗🌑🌑🌑 Proposed (PR or detailed issue)
* 🌕🌑🌑🌑 Planned
* 🌕🌗🌑🌑 Started
* 🌕🌕🌑🌑 Partially Working
* 🌕🌕🌗🌑 Working
* 🌕🌕🌕🌑 Documented
* 🌕🌕🌕🌗 Tested
* 🌕🌕🌕🌕 Released

## electron.app

### API

**API**                                | **Rating** | **Status**
:--                                    | :--        | :--
`accessibilitySupportEnabled`          | 🌑🌑🌑🌑 | Not Planned
`applicationMenu`                      | 🌑🌑🌑🌑 | Not Planned
`badgeCount`                           | 🌑🌑🌑🌑 | Not Planned
`commandLine`                          | 🌕🌗🌑🌑 | Started
`dock`                                 | 🌑🌑🌑🌑 | Not Planned
`isPackaged`                           | 🌕🌕🌗🌑 | Working
`name`                                 | 🌕🌕🌗🌑 | Working
`userAgentFallback`                    | 🌑🌑🌑🌑 | Not Planned
`runningUnderARM64Translation`         | 🌑🌑🌑🌑 | Not Planned
`quit`                                 | 🌕🌕🌗🌑 | Working
`exit`                                 | 🌑🌑🌑🌑 | Not Planned
`relaunch`                             | 🌕🌑🌑🌑 | Planned
`isReady`                              | 🌑🌑🌑🌑 | Not Planned
`whenReady`                            | 🌑🌑🌑🌑 | Not Planned
`focus`                                | 🌑🌑🌑🌑 | Not Planned
`hide`                                 | 🌑🌑🌑🌑 | Not Planned
`isHidden`                             | 🌑🌑🌑🌑 | Not Planned
`show`                                 | 🌑🌑🌑🌑 | Not Planned
`setAppLogsPath`                       | 🌑🌑🌑🌑 | Not Planned
`getAppPath`                           | 🌑🌑🌑🌑 | Not Planned
`getPath`                              | 🌕🌕🌑🌑 | Partially Working
`getFileIcon`                          | 🌑🌑🌑🌑 | Not Planned
`setPath`                              | 🌑🌑🌑🌑 | Not Planned
`getVersion`                           | 🌕🌕🌗🌑 | Working
`getName`                              | 🌕🌕🌗🌑 | Working
`setName`                              | 🌕🌕🌗🌑 | Working
`getLocale`                            | 🌑🌑🌑🌑 | Not Planned
`getLocaleCountryCode`                 | 🌑🌑🌑🌑 | Not Planned
`addRecentDocument`                    | 🌑🌑🌑🌑 | Not Planned
`clearRecentDocuments`                 | 🌑🌑🌑🌑 | Not Planned
`setAsDefaultProtocolClient`           | 🌑🌑🌑🌑 | Not Planned
`removeAsDefaultProtocolClient`        | 🌑🌑🌑🌑 | Not Planned
`isDefaultProtocolClient`              | 🌑🌑🌑🌑 | Not Planned
`getApplicationNameForProtocol`        | 🌑🌑🌑🌑 | Not Planned
`setUserTasks`                         | 🌑🌑🌑🌑 | Not Planned
`getJumpListSettings`                  | 🌑🌑🌑🌑 | Not Planned
`setJumpList`                          | 🌑🌑🌑🌑 | Not Planned
`requestSingleInstanceLock`            | 🌑🌑🌑🌑 | Not Planned
`hasSingleInstanceLock`                | 🌑🌑🌑🌑 | Not Planned
`releaseSingleInstanceLock`            | 🌑🌑🌑🌑 | Not Planned
`setUserActivity`                      | 🌑🌑🌑🌑 | Not Planned
`getCurrentActivityType`               | 🌑🌑🌑🌑 | Not Planned
`invalidateCurrentActivity`            | 🌑🌑🌑🌑 | Not Planned
`resignCurrentActivity`                | 🌑🌑🌑🌑 | Not Planned
`updateCurrentActivity`                | 🌑🌑🌑🌑 | Not Planned
`setAppUserModelId`                    | 🌑🌑🌑🌑 | Not Planned
`setActivationPolicy`                  | 🌑🌑🌑🌑 | Not Planned
`importCertificate`                    | 🌑🌑🌑🌑 | Not Planned
`disableHardwareAcceleration`          | 🌑🌑🌑🌑 | Not Planned
`disableDomainBlockingFor3DAPIs`       | 🌑🌑🌑🌑 | Not Planned
`getAppMetrics`                        | 🌑🌑🌑🌑 | Not Planned
`getGPUFeatureStatus`                  | 🌑🌑🌑🌑 | Not Planned
`getGPUInfo`                           | 🌑🌑🌑🌑 | Not Planned
`setBadgeCount`                        | 🌑🌑🌑🌑 | Not Planned
`getBadgeCount`                        | 🌑🌑🌑🌑 | Not Planned
`isUnityRunning`                       | 🌑🌑🌑🌑 | Not Planned
`getLoginItemSettings`                 | 🌑🌑🌑🌑 | Not Planned
`setLoginItemSettings`                 | 🌑🌑🌑🌑 | Not Planned
`isAccessibilitySupportEnabled`        | 🌑🌑🌑🌑 | Not Planned
`setAccessibilitySupportEnabled`       | 🌑🌑🌑🌑 | Not Planned
`showAboutPanel`                       | 🌑🌑🌑🌑 | Not Planned
`setAboutPanelOptions`                 | 🌑🌑🌑🌑 | Not Planned
`isEmojiPanelSupported`                | 🌑🌑🌑🌑 | Not Planned
`showEmojiPanel`                       | 🌑🌑🌑🌑 | Not Planned
`startAccessingSecurityScopedResource` | 🌑🌑🌑🌑 | Not Planned
`enableSandbox`                        | 🌑🌑🌑🌑 | Not Planned
`isInApplicationsFolder`               | 🌑🌑🌑🌑 | Not Planned
`moveToApplicationsFolder`             | 🌑🌑🌑🌑 | Not Planned
`isSecureKeyboardEntryEnabled`         | 🌑🌑🌑🌑 | Not Planned
`setSecureKeyboardEntryEnabled`        | 🌑🌑🌑🌑 | Not Planned
`allowRendererProcessReuse`            | 🌑🌑🌑🌑 | Not Planned





### Events

**Event**                              | **Rating** | **Status**
:--                                    | :--        | :--
`will-finish-launching`                | 🌑🌑🌑🌑 | Not Planned
`ready`                                | 🌕🌕🌗🌑 | Working
`window-all-closed`                    | 🌕🌕🌗🌑 | Working
`before-quit`                          | 🌑🌑🌑🌑 | Not Planned
`will-quit`                            | 🌑🌑🌑🌑 | Not Planned
`quit`                                 | 🌑🌑🌑🌑 | Not Planned
`open-file`                            | 🌑🌑🌑🌑 | Not Planned
`open-url`                             | 🌑🌑🌑🌑 | Not Planned
`activate`                             | 🌑🌑🌑🌑 | Not Planned
`continue-activity`                    | 🌑🌑🌑🌑 | Not Planned
`will-continue-activity`               | 🌑🌑🌑🌑 | Not Planned
`continue-activity-error`              | 🌑🌑🌑🌑 | Not Planned
`activity-was-continued`               | 🌑🌑🌑🌑 | Not Planned
`update-activity-state`                | 🌑🌑🌑🌑 | Not Planned
`new-window-for-tab`                   | 🌑🌑🌑🌑 | Not Planned
`browser-window-blur`                  | 🌑🌑🌑🌑 | Not Planned
`browser-window-focus`                 | 🌑🌑🌑🌑 | Not Planned
`browser-window-created`               | 🌑🌑🌑🌑 | Not Planned
`web-contents-created`                 | 🌑🌑🌑🌑 | Not Planned
`certificate-error`                    | 🌑🌑🌑🌑 | Not Planned
`select-client-certificate`            | 🌑🌑🌑🌑 | Not Planned
`login`                                | 🌑🌑🌑🌑 | Not Planned
`gpu-info-update`                      | 🌑🌑🌑🌑 | Not Planned
`gpu-process-crashed`                  | 🌑🌑🌑🌑 | Not Planned
`renderer-process-crashed`             | 🌑🌑🌑🌑 | Not Planned
`accessibility-support-changed`        | 🌑🌑🌑🌑 | Not Planned
`session-created`                      | 🌑🌑🌑🌑 | Not Planned
`second-instance`                      | 🌑🌑🌑🌑 | Not Planned
`desktop-capturer-get-sources`         | 🌑🌑🌑🌑 | Not Planned
`remote-require`                       | 🌑🌑🌑🌑 | Not Planned
`remote-get-global`                    | 🌑🌑🌑🌑 | Not Planned
`remote-get-builtin`                   | 🌑🌑🌑🌑 | Not Planned
`remote-get-current-window`            | 🌑🌑🌑🌑 | Not Planned
`remote-get-current-web-contents`      | 🌑🌑🌑🌑 | Not Planned