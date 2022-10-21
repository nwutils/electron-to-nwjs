# Progress

How far electron-to-nwjs went mapping the Electron module to NW.js

**Statuses:**

* 🔴🔴🔴🔴 On Hold (May be impossible to implement right now)
* 🌑🌑🌑🌑 Not Planned
* 🌗🌑🌑🌑 Proposed (PR or detailed issue)
* 🌕🌑🌑🌑 Planned
* 🌕🌗🌑🌑 Started
* 🌕🌕🌑🌑 Partially Working
* 🌕🌕🌗🌑 Working
* 🌕🌕🌕🌑 Documented
* 🌕🌕🌕🌗 Tested
* 🌕🌕🌕🌕 Released

## app

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

## autoUpdater

## BrowserView

## BrowserWindow

### API

**API**                                | **Rating** | **Status**
:--                                    | :--        | :--
`constructor`                          | 🌕🌕🌑🌑 | Partially Working
`static getAllWindows`                 | 🌕🌕🌗🌑 | Working
`static getFocusedWindow`              | 🌕🌕🌗🌑 | Working
`static fromWebContents`               | 🌕🌕🌗🌑 | Working
`static fromBrowserView`               | 🌑🌑🌑🌑 | Not Planned
`static fromId`                        | 🌕🌕🌗🌑 | Working
`webContents`                          | 🌕🌕🌗🌑 | Working
`id`                                   | 🌕🌕🌗🌑 | Working
`autoHideMenuBar`                      | 🌑🌑🌑🌑 | Not Planned
`simpleFullScreen`                     | 🌑🌑🌑🌑 | Not Planned
`fullScreen`                           | 🌑🌑🌑🌑 | Not Planned
`focusable`                            | 🌑🌑🌑🌑 | Not Planned
`visibleOnAllWorkspaces`               | 🌑🌑🌑🌑 | Not Planned
`shadow`                               | 🌑🌑🌑🌑 | Not Planned
`menuBarVisible`                       | 🌑🌑🌑🌑 | Not Planned
`kiosk`                                | 🌑🌑🌑🌑 | Not Planned
`documentEdited`                       | 🌑🌑🌑🌑 | Not Planned
`representedFilename`                  | 🌑🌑🌑🌑 | Not Planned
`title`                                | 🌑🌑🌑🌑 | Not Planned
`minimizable`                          | 🌑🌑🌑🌑 | Not Planned
`maximizable`                          | 🌑🌑🌑🌑 | Not Planned
`fullScreenable`                       | 🌑🌑🌑🌑 | Not Planned
`resizable`                            | 🌑🌑🌑🌑 | Not Planned
`closable`                             | 🌑🌑🌑🌑 | Not Planned
`movable`                              | 🌑🌑🌑🌑 | Not Planned
`excludedFromShownWindowsMenu`         | 🌑🌑🌑🌑 | Not Planned
`accessibleTitle`                      | 🌑🌑🌑🌑 | Not Planned
`destroy`                              | 🌕🌕🌗🌑 | Working
`close`                                | 🌕🌕🌗🌑 | Working
`focus`                                | 🌕🌕🌗🌑 | Working
`blur`                                 | 🌕🌕🌗🌑 | Working
`isFocused`                            | 🌕🌕🌗🌑 | Working
`isDestroyed`                          | 🌑🌑🌑🌑 | Not Planned
`show`                                 | 🌕🌕🌗🌑 | Working
`showInactive`                         | 🌑🌑🌑🌑 | Not Planned
`hide`                                 | 🌕🌕🌗🌑 | Working
`isVisible`                            | 🌕🌕🌗🌑 | Working
`isModal`                              | 🌑🌑🌑🌑 | Not Planned
`maximize`                             | 🌕🌕🌗🌑 | Working
`unmaximize`                           | 🌕🌕🌗🌑 | Working
`isMaximized`                          | 🌑🌑🌑🌑 | Not Planned
`minimize`                             | 🌕🌕🌗🌑 | Working
`restore`                              | 🌕🌕🌗🌑 | Working
`isMinimized`                          | 🌑🌑🌑🌑 | Not Planned
`setFullScreen`                        | 🌕🌕🌗🌑 | Working
`isFullScreen`                         | 🌕🌕🌗🌑 | Working
`setSimpleFullScreen`                  | 🌑🌑🌑🌑 | Not Planned
`isSimpleFullScreen`                   | 🌑🌑🌑🌑 | Not Planned
`isNormal`                             | 🌑🌑🌑🌑 | Not Planned
`setAspectRatio`                       | 🌑🌑🌑🌑 | Not Planned
`setBackgroundColor`                   | 🌑🌑🌑🌑 | Not Planned
`previewFile`                          | 🌑🌑🌑🌑 | Not Planned
`closeFilePreview`                     | 🌑🌑🌑🌑 | Not Planned
`setBounds`                            | 🌑🌑🌑🌑 | Not Planned
`getBounds`                            | 🌑🌑🌑🌑 | Not Planned
`getBackgroundColor`                   | 🌑🌑🌑🌑 | Not Planned
`setContentBounds`                     | 🌑🌑🌑🌑 | Not Planned
`getContentBounds`                     | 🌑🌑🌑🌑 | Not Planned
`getNormalBounds`                      | 🌑🌑🌑🌑 | Not Planned
`setEnabled`                           | 🔴🔴🔴🔴 | On Hold
`isEnabled`                            | 🌕🌕🌑🌑 | Partially Working
`setSize`                              | 🌕🌕🌗🌑 | Working
`getSize`                              | 🌕🌕🌗🌑 | Working
`setContentSize`                       | 🔴🔴🔴🔴 | On Hold
`getContentSize`                       | 🌕🌕🌗🌑 | Working
`setMinimumSize`                       | 🌕🌕🌗🌑 | Working
`getMinimumSize`                       | 🌕🌕🌗🌑 | Working
`setMaximumSize`                       | 🌕🌕🌗🌑 | Working
`getMaximumSize`                       | 🌕🌕🌗🌑 | Working
`setResizable`                         | 🌕🌕🌗🌑 | Working
`isResizable`                          | 🌕🌕🌗🌑 | Working
`setMovable`                           | 🔴🔴🔴🔴 | On Hold
`isMovable`                            | 🌕🌕🌑🌑 | Partially Working
`setMinimizable`                       | 🔴🔴🔴🔴 | On Hold
`isMinimizable`                        | 🌕🌕🌑🌑 | Partially Working
`setMaximizable`                       | 🔴🔴🔴🔴 | On Hold
`isMaximizable`                        | 🌕🌕🌑🌑 | Partially Working
`setFullScreenable`                    | 🔴🔴🔴🔴 | On Hold
`isFullScreenable`                     | 🌕🌕🌑🌑 | Partially Working
`setClosable`                          | 🌑🌑🌑🌑 | Not Planned
`isClosable`                           | 🌑🌑🌑🌑 | Not Planned
`setAlwaysOnTop`                       | 🌕🌕🌗🌑 | Working
`isAlwaysOnTop`                        | 🌕🌕🌗🌑 | Working
`moveAbove`                            | 🌑🌑🌑🌑 | Not Planned
`moveTop`                              | 🌑🌑🌑🌑 | Not Planned
`center`                               | 🌕🌕🌗🌑 | Working
`setPosition`                          | 🌕🌕🌑🌑 | Partially Working
`getPosition`                          | 🌕🌕🌗🌑 | Working
`setTitle`                             | 🌕🌕🌗🌑 | Working
`getTitle`                             | 🌕🌕🌗🌑 | Working
`setSheetOffset`                       | 🌑🌑🌑🌑 | Not Planned
`flashFrame`                           | 🌕🌕🌗🌑 | Working
`setSkipTaskbar`                       | 🌕🌕🌗🌑 | Working
`setKiosk`                             | 🌕🌕🌗🌑 | Working
`isKiosk`                              | 🌕🌕🌗🌑 | Working
`isTabletMode`                         | 🌑🌑🌑🌑 | Not Planned
`getMediaSourceId`                     | 🌑🌑🌑🌑 | Not Planned
`getNativeWindowHandle`                | 🌑🌑🌑🌑 | Not Planned
`hookWindowMessage`                    | 🌑🌑🌑🌑 | Not Planned
`isWindowMessageHooked`                | 🌑🌑🌑🌑 | Not Planned
`unhookWindowMessage`                  | 🌑🌑🌑🌑 | Not Planned
`unhookAllWindowMessages`              | 🌑🌑🌑🌑 | Not Planned
`setRepresentedFilename`               | 🌑🌑🌑🌑 | Not Planned
`getRepresentedFilename`               | 🌑🌑🌑🌑 | Not Planned
`setDocumentEdited`                    | 🌑🌑🌑🌑 | Not Planned
`isDocumentEdited`                     | 🌑🌑🌑🌑 | Not Planned
`focusOnWebView`                       | 🌑🌑🌑🌑 | Not Planned
`blurWebView`                          | 🌑🌑🌑🌑 | Not Planned
`capturePage`                          | 🌕🌕🌑🌑 | Partially Working
`loadURL`                              | 🌕🌕🌑🌑 | Partially Working
`loadFile`                             | 🌕🌕🌑🌑 | Partially Working
`reload`                               | 🌕🌕🌗🌑 | Working
`setMenu`                              | 🌕🌕🌗🌑 | Working
`removeMenu`                           | 🌕🌕🌗🌑 | Working
`setProgressBar`                       | 🌑🌑🌑🌑 | Not Planned
`setOverlayIcon`                       | 🌑🌑🌑🌑 | Not Planned
`setHasShadow`                         | 🌕🌕🌗🌑 | Working
`hasShadow`                            | 🌕🌕🌗🌑 | Working
`setOpacity`                           | 🌑🌑🌑🌑 | Not Planned
`getOpacity`                           | 🌑🌑🌑🌑 | Not Planned
`setShape`                             | 🌑🌑🌑🌑 | Not Planned
`setThumbarButtons`                    | 🌑🌑🌑🌑 | Not Planned
`setThumbnailClip`                     | 🌑🌑🌑🌑 | Not Planned
`setThumbnailToolTip`                  | 🌑🌑🌑🌑 | Not Planned
`setAppDetails`                        | 🌑🌑🌑🌑 | Not Planned
`showDefinitionForSelection`           | 🌑🌑🌑🌑 | Not Planned
`setIcon`                              | 🌑🌑🌑🌑 | Not Planned
`setWindowButtonVisibility`            | 🌑🌑🌑🌑 | Not Planned
`setAutoHideMenuBar`                   | 🌕🌕🌗🌑 | Working
`isMenuBarAutoHide`                    | 🌕🌕🌗🌑 | Working
`setMenuBarVisibility`                 | 🌕🌕🌗🌑 | Working
`isMenuBarVisible`                     | 🌕🌕🌗🌑 | Working
`setVisibleOnAllWorkspaces`            | 🌕🌕🌗🌑 | Working
`isVisibleOnAllWorkspaces`             | 🌕🌕🌗🌑 | Working
`setIgnoreMouseEvents`                 | 🌑🌑🌑🌑 | Not Planned
`setContentProtection`                 | 🌑🌑🌑🌑 | Not Planned
`setFocusable`                         | 🔴🔴🔴🔴 | On Hold
`isFocusable`                          | 🌕🌕🌑🌑 | Partially Working
`setParentWindow`                      | 🌑🌑🌑🌑 | Not Planned
`getParentWindow`                      | 🌑🌑🌑🌑 | Not Planned
`getChildWindows`                      | 🌑🌑🌑🌑 | Not Planned
`setAutoHideCursor`                    | 🌑🌑🌑🌑 | Not Planned
`selectPreviousTab`                    | 🌑🌑🌑🌑 | Not Planned
`selectNextTab`                        | 🌑🌑🌑🌑 | Not Planned
`mergeAllWindows`                      | 🌑🌑🌑🌑 | Not Planned
`moveTabToNewWindow`                   | 🌑🌑🌑🌑 | Not Planned
`toggleTabBar`                         | 🌑🌑🌑🌑 | Not Planned
`addTabbedWindow`                      | 🌑🌑🌑🌑 | Not Planned
`setVibrancy`                          | 🌑🌑🌑🌑 | Not Planned
`setTrafficLightPosition`              | 🌑🌑🌑🌑 | Not Planned
`getTrafficLightPosition`              | 🌑🌑🌑🌑 | Not Planned
`setTouchBar`                          | 🌑🌑🌑🌑 | Not Planned
`setBrowserView`                       | 🌑🌑🌑🌑 | Not Planned
`getBrowserView`                       | 🌑🌑🌑🌑 | Not Planned
`addBrowserView`                       | 🌑🌑🌑🌑 | Not Planned
`removeBrowserView`                    | 🌑🌑🌑🌑 | Not Planned
`setTopBrowserView`                    | 🌑🌑🌑🌑 | Not Planned
`getBrowserViews`                      | 🌑🌑🌑🌑 | Not Planned
`setTitleBarOverlay`                   | 🌑🌑🌑🌑 | Not Planned

### Events

**Event**                              | **Rating** | **Status**
:--                                    | :--        | :--
`page-title-updated`                   | 🌑🌑🌑🌑 | Not Planned
`close`                                | 🌕🌕🌗🌑 | Working
`closed`                               | 🌕🌕🌗🌑 | Working
`session-end`                          | 🌑🌑🌑🌑 | Not Planned
`unresponsive`                         | 🌑🌑🌑🌑 | Not Planned
`responsive`                           | 🌑🌑🌑🌑 | Not Planned
`blur`                                 | 🌕🌕🌗🌑 | Working
`focus`                                | 🌕🌕🌗🌑 | Working
`show`                                 | 🌑🌑🌑🌑 | Not Planned
`hide`                                 | 🌑🌑🌑🌑 | Not Planned
`ready-to-show`                        | 🌑🌑🌑🌑 | Not Planned
`maximize`                             | 🌕🌕🌗🌑 | Working
`unmaximize`                           | 🌑🌑🌑🌑 | Not Planned
`minimize`                             | 🌕🌕🌗🌑 | Working
`restore`                              | 🌕🌕🌗🌑 | Working
`will-resize`                          | 🌑🌑🌑🌑 | Not Planned
`resize`                               | 🌑🌑🌑🌑 | Not Planned
`resized`                              | 🌕🌕🌗🌑 | Working
`will-move`                            | 🌑🌑🌑🌑 | Not Planned
`move`                                 | 🌑🌑🌑🌑 | Not Planned
`moved`                                | 🌕🌕🌗🌑 | Working
`enter-full-screen`                    | 🌕🌕🌗🌑 | Working
`leave-full-screen`                    | 🌕🌕🌗🌑 | Working
`enter-html-full-screen`               | 🌑🌑🌑🌑 | Not Planned
`leave-html-full-screen`               | 🌑🌑🌑🌑 | Not Planned
`always-on-top-changed`                | 🌑🌑🌑🌑 | Not Planned
`app-command`                          | 🌑🌑🌑🌑 | Not Planned
`scroll-touch-begin`                   | 🌑🌑🌑🌑 | Not Planned
`scroll-touch-end`                     | 🌑🌑🌑🌑 | Not Planned
`scroll-touch-edge`                    | 🌑🌑🌑🌑 | Not Planned
`swipe`                                | 🌑🌑🌑🌑 | Not Planned
`rotate-gesture`                       | 🌑🌑🌑🌑 | Not Planned
`sheet-begin`                          | 🌑🌑🌑🌑 | Not Planned
`sheet-end`                            | 🌑🌑🌑🌑 | Not Planned
`new-window-for-tab`                   | 🌑🌑🌑🌑 | Not Planned
`system-context-menu`                  | 🌑🌑🌑🌑 | Not Planned

## clipboard

## contentTracing

## contextBridge

## crashReporter

## desktopCapturer

## dialog

### API

**API**                                | **Rating** | **Status**
:--                                    | :--        | :--
`showOpenDialogSync`                   | 🔴🔴🔴🔴 | On Hold
`showOpenDialog`                       | 🌕🌕🌑🌑 | Partially Working
`showSaveDialogSync`                   | 🔴🔴🔴🔴 | On Hold
`showSaveDialog`                       | 🌕🌕🌑🌑 | Partially Working
`showMessageBoxSync`                   | 🌕🌕🌑🌑 | Partially Working
`showMessageBox`                       | 🌑🌑🌑🌑 | Not Planned
`showErrorBox`                         | 🌑🌑🌑🌑 | Not Planned
`showCertificateTrustDialog`           | 🌑🌑🌑🌑 | Not Planned

## globalShortcut

### API

**API**                                | **Rating** | **Status**
:--                                    | :--        | :--
`register`                             | 🌕🌕🌗🌑 | Working
`registerAll`                          | 🌕🌕🌗🌑 | Working
`isRegistered`                         | 🌕🌕🌗🌑 | Working
`unregister`                           | 🌕🌕🌗🌑 | Working
`unregisterAll`                        | 🌕🌕🌗🌑 | Working

## inAppPurchase

## ipcMain

### API

**API**                                | **Rating** | **Status**
:--                                    | :--        | :--
`on`                                   | 🌕🌕🌗🌑 | Working
`once`                                 | 🌑🌑🌑🌑 | Not Planned
`removeListener`                       | 🌑🌑🌑🌑 | Not Planned
`removeAllListeners`                   | 🌑🌑🌑🌑 | Not Planned
`handle`                               | 🌕🌕🌗🌑 | Working
`handleOnce`                           | 🌑🌑🌑🌑 | Not Planned
`removeHandler`                        | 🌑🌑🌑🌑 | Not Planned

## ipcRenderer

### API

**API**                                | **Rating** | **Status**
:--                                    | :--        | :--
`on`                                   | 🌕🌕🌗🌑 | Working
`once`                                 | 🌑🌑🌑🌑 | Not Planned
`removeListener`                       | 🌑🌑🌑🌑 | Not Planned
`removeAllListeners`                   | 🌑🌑🌑🌑 | Not Planned
`send`                                 | 🌕🌕🌗🌑 | Working
`invoke`                               | 🌑🌑🌑🌑 | Not Planned
`sendSync`                             | 🌕🌕🌗🌑 | Working
`postMessage`                          | 🌑🌑🌑🌑 | Not Planned
`sendTo`                               | 🌑🌑🌑🌑 | Not Planned
`sendToHost`                           | 🌑🌑🌑🌑 | Not Planned

## Menu

### API

**API**                                | **Rating** | **Status**
:--                                    | :--        | :--
`constructor`                          | 🌕🌕🌗🌑 | Working
`static setApplicationMenu`            | 🌕🌕🌗🌑 | Working
`static getApplicationMenu`            | 🌕🌕🌗🌑 | Working
`static sendActionToFirstResponder`    | 🌑🌑🌑🌑 | Not Planned
`static buildFromTemplate`             | 🌕🌕🌗🌑 | Working
`popup`                                | 🌕🌕🌗🌑 | Working
`closePopup`                           | 🌑🌑🌑🌑 | Not Planned
`append`                               | 🌕🌕🌗🌑 | Working
`getMenuItemById`                      | 🌕🌕🌗🌑 | Working
`insert`                               | 🌕🌕🌗🌑 | Working
`items`                                | 🌕🌕🌗🌑 | Working

### Events

**Event**                              | **Rating** | **Status**
:--                                    | :--        | :--
`menu-will-show`                       | 🌕🌕🌗🌑 | Working
`menu-will-close`                      | 🌑🌑🌑🌑 | Not Planned

## MenuItem

### API

**API**                                | **Rating** | **Status**
:--                                    | :--        | :--
`constructor`                          | 🌕🌕🌑🌑 | Partially Working
`id`                                   | 🌑🌑🌑🌑 | Not Planned
`label`                                | 🌑🌑🌑🌑 | Not Planned
`click`                                | 🌑🌑🌑🌑 | Not Planned
`submenu`                              | 🌑🌑🌑🌑 | Not Planned
`type`                                 | 🌑🌑🌑🌑 | Not Planned
`role`                                 | 🌑🌑🌑🌑 | Not Planned
`accelerator`                          | 🌑🌑🌑🌑 | Not Planned
`userAccelerator`                      | 🌑🌑🌑🌑 | Not Planned
`icon`                                 | 🌑🌑🌑🌑 | Not Planned
`sublabel`                             | 🌑🌑🌑🌑 | Not Planned
`toolTip`                              | 🌑🌑🌑🌑 | Not Planned
`enabled`                              | 🌑🌑🌑🌑 | Not Planned
`visible`                              | 🌑🌑🌑🌑 | Not Planned
`checked`                              | 🌑🌑🌑🌑 | Not Planned
`registerAccelerator`                  | 🌑🌑🌑🌑 | Not Planned
`sharingItem`                          | 🌑🌑🌑🌑 | Not Planned
`commandId`                            | 🌑🌑🌑🌑 | Not Planned
`menu`                                 | 🌑🌑🌑🌑 | Not Planned

## MessageChannelMain

## MessagePortMain

## nativeImage

### API

**API**                                | **Rating** | **Status**
:--                                    | :--        | :--
`static createEmpty`                   | 🌕🌕🌗🌑 | Working
`static createThumbnailFromPath`       | 🌑🌑🌑🌑 | Not Planned
`static createFromPath`                | 🌕🌕🌑🌑 | Partially Working
`static createFromBitmap`              | 🌕🌕🌗🌑 | Working
`static createFromBuffer`              | 🌕🌕🌑🌑 | Partially Working
`static createFromDataURL`             | 🌑🌑🌑🌑 | Not Planned
`static createFromNamedImage`          | 🌑🌑🌑🌑 | Not Planned
`toPNG`                                | 🌕🌕🌑🌑 | Partially Working
`toJPEG`                               | 🌑🌑🌑🌑 | Not Planned
`toBitmap`                             | 🌕🌕🌑🌑 | Partially Working
`toDataURL`                            | 🌕🌕🌗🌑 | Working
`getBitmap`                            | 🌕🌕🌑🌑 | Partially Working
`getNativeHandle`                      | 🌑🌑🌑🌑 | Not Planned
`isEmpty`                              | 🌕🌕🌗🌑 | Working
`getSize`                              | 🌑🌑🌑🌑 | Not Planned
`setTemplateImage`                     | 🌑🌑🌑🌑 | Not Planned
`isTemplateImage`                      | 🌑🌑🌑🌑 | Not Planned
`crop`                                 | 🌑🌑🌑🌑 | Not Planned
`resize`                               | 🌑🌑🌑🌑 | Not Planned
`getAspectRatio`                       | 🌑🌑🌑🌑 | Not Planned
`getScaleFactors`                      | 🌑🌑🌑🌑 | Not Planned
`addRepresentation`                    | 🌑🌑🌑🌑 | Not Planned
`isMacTemplateImage`                   | 🌑🌑🌑🌑 | Not Planned

## nativeTheme

## net

## netLog

## Notification

## powerMonitor

## powerSaveBlocker

## process

## protocol

## safeStorage

## screen

## session

## ShareMenu

## shell

## systemPreferences

## TouchBar

## Tray

## WebContents

### API

**API**                                | **Rating** | **Status**
:--                                    | :--        | :--
`static getAllWebContents`             | 🌑🌑🌑🌑 | Not Planned
`static getFocusedWebContents`         | 🌕🌕🌗🌑 | Working
`static fromId`                        | 🌑🌑🌑🌑 | Not Planned
`static fromDevToolsTargetId`          | 🌑🌑🌑🌑 | Not Planned
`loadURL`                              | 🌕🌕🌑🌑 | Partially Working
`loadFile`                             | 🌕🌕🌑🌑 | Partially Working
`downloadURL`                          | 🌑🌑🌑🌑 | Not Planned
`getURL`                               | 🌑🌑🌑🌑 | Not Planned
`getTitle`                             | 🌑🌑🌑🌑 | Not Planned
`isDestroyed`                          | 🌑🌑🌑🌑 | Not Planned
`focus`                                | 🌑🌑🌑🌑 | Not Planned
`isFocused`                            | 🌑🌑🌑🌑 | Not Planned
`isLoading`                            | 🌑🌑🌑🌑 | Not Planned
`isLoadingMainFrame`                   | 🌑🌑🌑🌑 | Not Planned
`isWaitingForResponse`                 | 🌑🌑🌑🌑 | Not Planned
`stop`                                 | 🌑🌑🌑🌑 | Not Planned
`reload`                               | 🌑🌑🌑🌑 | Not Planned
`reloadIgnoringCache`                  | 🌑🌑🌑🌑 | Not Planned
`canGoBack`                            | 🌑🌑🌑🌑 | Not Planned
`canGoForward`                         | 🌑🌑🌑🌑 | Not Planned
`canGoToOffset`                        | 🌑🌑🌑🌑 | Not Planned
`clearHistory`                         | 🌑🌑🌑🌑 | Not Planned
`goBack`                               | 🌑🌑🌑🌑 | Not Planned
`goForward`                            | 🌑🌑🌑🌑 | Not Planned
`goToIndex`                            | 🌑🌑🌑🌑 | Not Planned
`goToOffset`                           | 🌑🌑🌑🌑 | Not Planned
`isCrashed`                            | 🌑🌑🌑🌑 | Not Planned
`forcefullyCrashRenderer`              | 🌑🌑🌑🌑 | Not Planned
`setUserAgent`                         | 🌑🌑🌑🌑 | Not Planned
`getUserAgent`                         | 🌑🌑🌑🌑 | Not Planned
`insertCSS`                            | 🌑🌑🌑🌑 | Not Planned
`removeInsertedCSS`                    | 🌑🌑🌑🌑 | Not Planned
`executeJavaScript`                    | 🌑🌑🌑🌑 | Not Planned
`executeJavaScriptInIsolatedWorld`     | 🌑🌑🌑🌑 | Not Planned
`setIgnoreMenuShortcuts`               | 🌑🌑🌑🌑 | Not Planned
`setWindowOpenHandler`                 | 🌑🌑🌑🌑 | Not Planned
`setAudioMuted`                        | 🌑🌑🌑🌑 | Not Planned
`isAudioMuted`                         | 🌑🌑🌑🌑 | Not Planned
`isCurrentlyAudible`                   | 🌑🌑🌑🌑 | Not Planned
`setZoomFactor`                        | 🌑🌑🌑🌑 | Not Planned
`getZoomFactor`                        | 🌑🌑🌑🌑 | Not Planned
`setZoomLevel`                         | 🌑🌑🌑🌑 | Not Planned
`getZoomLevel`                         | 🌑🌑🌑🌑 | Not Planned
`setVisualZoomLevelLimits`             | 🌑🌑🌑🌑 | Not Planned
`undo`                                 | 🌑🌑🌑🌑 | Not Planned
`redo`                                 | 🌑🌑🌑🌑 | Not Planned
`cut`                                  | 🌑🌑🌑🌑 | Not Planned
`copy`                                 | 🌑🌑🌑🌑 | Not Planned
`copyImageAt`                          | 🌑🌑🌑🌑 | Not Planned
`paste`                                | 🌑🌑🌑🌑 | Not Planned
`pasteAndMatchStyle`                   | 🌑🌑🌑🌑 | Not Planned
`delete`                               | 🌑🌑🌑🌑 | Not Planned
`selectAll`                            | 🌑🌑🌑🌑 | Not Planned
`unselect`                             | 🌑🌑🌑🌑 | Not Planned
`replace`                              | 🌑🌑🌑🌑 | Not Planned
`replaceMisspelling`                   | 🌑🌑🌑🌑 | Not Planned
`insertText`                           | 🌑🌑🌑🌑 | Not Planned
`findInPage`                           | 🌑🌑🌑🌑 | Not Planned
`stopFindInPage`                       | 🌑🌑🌑🌑 | Not Planned
`capturePage`                          | 🌑🌑🌑🌑 | Not Planned
`isBeingCaptured`                      | 🌑🌑🌑🌑 | Not Planned
`incrementCapturerCount`               | 🌑🌑🌑🌑 | Not Planned
`decrementCapturerCount`               | 🌑🌑🌑🌑 | Not Planned
`getPrinters`                          | 🌑🌑🌑🌑 | Not Planned
`getPrintersAsync`                     | 🌑🌑🌑🌑 | Not Planned
`print`                                | 🌑🌑🌑🌑 | Not Planned
`printToPDF`                           | 🌑🌑🌑🌑 | Not Planned
`addWorkSpace`                         | 🌑🌑🌑🌑 | Not Planned
`removeWorkSpace`                      | 🌑🌑🌑🌑 | Not Planned
`setDevToolsWebContents`               | 🌑🌑🌑🌑 | Not Planned
`openDevTools`                         | 🌕🌕🌑🌑 | Partially Working
`closeDevTools`                        | 🌕🌕🌗🌑 | Working
`isDevToolsOpened`                     | 🌕🌕🌗🌑 | Working
`isDevToolsFocused`                    | 🌑🌑🌑🌑 | Not Planned
`toggleDevTools`                       | 🌕🌕🌗🌑 | Working
`inspectElement`                       | 🌑🌑🌑🌑 | Not Planned
`inspectSharedWorker`                  | 🌑🌑🌑🌑 | Not Planned
`inspectSharedWorkerById`              | 🌑🌑🌑🌑 | Not Planned
`getAllSharedWorkers`                  | 🌑🌑🌑🌑 | Not Planned
`inspectServiceWorker`                 | 🌑🌑🌑🌑 | Not Planned
`send`                                 | 🌕🌕🌗🌑 | Working
`sendToFrame`                          | 🌑🌑🌑🌑 | Not Planned
`postMessage`                          | 🌑🌑🌑🌑 | Not Planned
`enableDeviceEmulation`                | 🌑🌑🌑🌑 | Not Planned
`disableDeviceEmulation`               | 🌑🌑🌑🌑 | Not Planned
`sendInputEvent`                       | 🌑🌑🌑🌑 | Not Planned
`beginFrameSubscription`               | 🌑🌑🌑🌑 | Not Planned
`endFrameSubscription`                 | 🌑🌑🌑🌑 | Not Planned
`startDrag`                            | 🌑🌑🌑🌑 | Not Planned
`savePage`                             | 🌑🌑🌑🌑 | Not Planned
`showDefinitionForSelection`           | 🌑🌑🌑🌑 | Not Planned
`isOffscreen`                          | 🌑🌑🌑🌑 | Not Planned
`startPainting`                        | 🌑🌑🌑🌑 | Not Planned
`stopPainting`                         | 🌑🌑🌑🌑 | Not Planned
`isPainting`                           | 🌑🌑🌑🌑 | Not Planned
`setFrameRate`                         | 🌑🌑🌑🌑 | Not Planned
`getFrameRate`                         | 🌑🌑🌑🌑 | Not Planned
`invalidate`                           | 🌑🌑🌑🌑 | Not Planned
`getWebRTCIPHandlingPolicy`            | 🌑🌑🌑🌑 | Not Planned
`setWebRTCIPHandlingPolicy`            | 🌑🌑🌑🌑 | Not Planned
`getMediaSourceId`                     | 🌑🌑🌑🌑 | Not Planned
`getOSProcessId`                       | 🌑🌑🌑🌑 | Not Planned
`getProcessId`                         | 🌑🌑🌑🌑 | Not Planned
`takeHeapSnapshot`                     | 🌑🌑🌑🌑 | Not Planned
`getBackgroundThrottling`              | 🌑🌑🌑🌑 | Not Planned
`setBackgroundThrottling`              | 🌑🌑🌑🌑 | Not Planned
`getType`                              | 🌑🌑🌑🌑 | Not Planned
`setImageAnimationPolicy`              | 🌑🌑🌑🌑 | Not Planned
`audioMuted`                           | 🌑🌑🌑🌑 | Not Planned
`userAgent`                            | 🌑🌑🌑🌑 | Not Planned
`zoomLevel`                            | 🌑🌑🌑🌑 | Not Planned
`zoomFactor`                           | 🌑🌑🌑🌑 | Not Planned
`frameRate`                            | 🌑🌑🌑🌑 | Not Planned
`id`                                   | 🌑🌑🌑🌑 | Not Planned
`session`                              | 🌑🌑🌑🌑 | Not Planned
`hostWebContents`                      | 🌑🌑🌑🌑 | Not Planned
`devToolsWebContents`                  | 🌑🌑🌑🌑 | Not Planned
`debugger`                             | 🌑🌑🌑🌑 | Not Planned
`backgroundThrottling`                 | 🌑🌑🌑🌑 | Not Planned
`mainFrame`                            | 🌑🌑🌑🌑 | Not Planned

### Events

**Event**                              | **Rating** | **Status**
:--                                    | :--        | :--
`did-finish-load`                      | 🌑🌑🌑🌑 | Not Planned
`did-fail-load`                        | 🌑🌑🌑🌑 | Not Planned
`did-fail-provisional-load`            | 🌑🌑🌑🌑 | Not Planned
`did-frame-finish-load`                | 🌑🌑🌑🌑 | Not Planned
`did-start-loading`                    | 🌑🌑🌑🌑 | Not Planned
`did-stop-loading`                     | 🌑🌑🌑🌑 | Not Planned
`dom-ready`                            | 🌑🌑🌑🌑 | Not Planned
`page-title-updated`                   | 🌑🌑🌑🌑 | Not Planned
`page-favicon-updated`                 | 🌑🌑🌑🌑 | Not Planned
`new-window`                           | 🌑🌑🌑🌑 | Not Planned
`did-create-window`                    | 🌑🌑🌑🌑 | Not Planned
`will-navigate`                        | 🌑🌑🌑🌑 | Not Planned
`did-start-navigation`                 | 🌑🌑🌑🌑 | Not Planned
`will-redirect`                        | 🌑🌑🌑🌑 | Not Planned
`did-redirect-navigation`              | 🌑🌑🌑🌑 | Not Planned
`did-navigate`                         | 🌑🌑🌑🌑 | Not Planned
`did-frame-navigate`                   | 🌑🌑🌑🌑 | Not Planned
`did-navigate-in-page`                 | 🌑🌑🌑🌑 | Not Planned
`will-prevent-unload`                  | 🌑🌑🌑🌑 | Not Planned
`crashed`                              | 🌑🌑🌑🌑 | Not Planned
`render-process-gone`                  | 🌑🌑🌑🌑 | Not Planned
`unresponsive`                         | 🌑🌑🌑🌑 | Not Planned
`responsive`                           | 🌑🌑🌑🌑 | Not Planned
`plugin-crashed`                       | 🌑🌑🌑🌑 | Not Planned
`destroyed`                            | 🌑🌑🌑🌑 | Not Planned
`before-input-event`                   | 🌑🌑🌑🌑 | Not Planned
`enter-html-full-screen`               | 🌑🌑🌑🌑 | Not Planned
`leave-html-full-screen`               | 🌑🌑🌑🌑 | Not Planned
`zoom-changed`                         | 🌑🌑🌑🌑 | Not Planned
`blur`                                 | 🌑🌑🌑🌑 | Not Planned
`focus`                                | 🌑🌑🌑🌑 | Not Planned
`devtools-opened`                      | 🌑🌑🌑🌑 | Not Planned
`devtools-closed`                      | 🌑🌑🌑🌑 | Not Planned
`devtools-focused`                     | 🌑🌑🌑🌑 | Not Planned
`certificate-error`                    | 🌑🌑🌑🌑 | Not Planned
`select-client-certificate`            | 🌑🌑🌑🌑 | Not Planned
`login`                                | 🌑🌑🌑🌑 | Not Planned
`found-in-page`                        | 🌑🌑🌑🌑 | Not Planned
`media-started-playing`                | 🌑🌑🌑🌑 | Not Planned
`media-paused`                         | 🌑🌑🌑🌑 | Not Planned
`did-change-theme-color`               | 🌑🌑🌑🌑 | Not Planned
`update-target-url`                    | 🌑🌑🌑🌑 | Not Planned
`cursor-changed`                       | 🌑🌑🌑🌑 | Not Planned
`context-menu`                         | 🌑🌑🌑🌑 | Not Planned
`select-bluetooth-device`              | 🌑🌑🌑🌑 | Not Planned
`paint`                                | 🌑🌑🌑🌑 | Not Planned
`devtools-reload-page`                 | 🌑🌑🌑🌑 | Not Planned
`will-attach-webview`                  | 🌑🌑🌑🌑 | Not Planned
`did-attach-webview`                   | 🌑🌑🌑🌑 | Not Planned
`console-message`                      | 🌑🌑🌑🌑 | Not Planned
`preload-error`                        | 🌑🌑🌑🌑 | Not Planned
`ipc-message`                          | 🌑🌑🌑🌑 | Not Planned
`ipc-message-sync`                     | 🌑🌑🌑🌑 | Not Planned
`preferred-size-changed`               | 🌑🌑🌑🌑 | Not Planned
`frame-created`                        | 🌑🌑🌑🌑 | Not Planned

## webFrame

## webFrameMain
