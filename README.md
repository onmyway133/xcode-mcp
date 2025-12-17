# xcode-mcp

MCP (Model Context Protocol) server for interacting with Xcode build tools, iOS Simulator, and Apple notarization services.

## Installation

```bash
pnpm install
pnpm build
```

## Usage

### Add to Claude Code

```bash
pnpm run mcp:add
```

### Remove from Claude Code

```bash
pnpm run mcp:remove
```

## Tools

### Xcode Build

#### `xcode_get_version`
Get current Xcode version and installation path.
> What Xcode version am I running?

#### `xcode_list_sdks`
List all available SDKs installed on the system.
> What SDKs are available on my system?

#### `xcode_get_project_info`
Get comprehensive project information including targets, schemes, and build configurations.
> Show me the project structure of MyApp.xcodeproj

#### `xcode_list_schemes`
List all schemes available in a project or workspace.
> List all schemes in my Xcode workspace

#### `xcode_get_build_settings`
Retrieve build settings for a specific scheme and configuration.
> Show me the build settings for the Debug configuration

#### `xcode_get_info_plist`
Read and parse Info.plist file contents.
> What's the bundle identifier in my Info.plist?

#### `xcode_build_project`
Build an Xcode project or workspace with specified scheme and configuration.
> Build my iOS project with the Release configuration

#### `xcode_clean_project`
Remove build artifacts and derived data for a project.
> Clean the build folder for my project

#### `xcode_analyze_project`
Run Xcode's static analyzer to detect potential issues.
> Run static analysis on my project to find potential issues

#### `xcode_run_tests`
Execute unit tests or UI tests for a project.
> Run all tests for my project using the MyApp scheme

#### `xcode_archive_project`
Create an xcarchive for App Store or distribution.
> Archive my app for App Store distribution

#### `xcode_export_archive`
Export an archive to IPA or app bundle using an export options plist.
> Export my archive to an IPA file for ad-hoc distribution

### Simulator

#### `simulator_list`
List all simulators with their UDID, state, and runtime information.
> List all available iOS simulators

#### `simulator_list_runtimes`
List all installed simulator runtimes (iOS, watchOS, tvOS versions).
> What iOS versions are available for simulators?

#### `simulator_list_device_types`
List available device types (iPhone, iPad, Apple Watch models).
> What device types can I create simulators for?

#### `simulator_boot`
Start a simulator by UDID or device name.
> Boot the iPhone 15 Pro simulator

#### `simulator_shutdown`
Stop a running simulator.
> Shutdown the running simulator

#### `simulator_create`
Create a new simulator with specified device type and runtime.
> Create a new iPhone 16 simulator with iOS 18

#### `simulator_delete`
Remove a simulator permanently.
> Delete the simulator named "Test Device"

#### `simulator_erase`
Reset simulator to factory defaults, removing all apps and data.
> Erase all content and settings on the booted simulator

#### `simulator_install_app`
Install an app bundle (.app) on a simulator.
> Install MyApp.app on the booted simulator

#### `simulator_launch_app`
Start an installed app by bundle identifier.
> Launch the app com.example.myapp on the simulator

#### `simulator_terminate_app`
Force quit a running app on the simulator.
> Force quit the running app on the simulator

#### `simulator_uninstall_app`
Remove an app from the simulator.
> Uninstall com.example.myapp from the simulator

#### `simulator_screenshot`
Capture the simulator screen to a PNG file.
> Take a screenshot of the simulator and save it to ~/Desktop

#### `simulator_open_url`
Open a URL in the simulator (web links or custom URL schemes).
> Open myapp://deeplink/home in the simulator

#### `simulator_set_location`
Set simulated GPS coordinates on the device.
> Set the simulator location to San Francisco

#### `simulator_push_notification`
Send a push notification payload to an app.
> Send a test push notification to my app on the simulator

#### `simulator_add_media`
Add photos or videos to the simulator's photo library.
> Add test-image.png to the simulator's photo library

#### `simulator_get_app_container`
Get the filesystem path to an app's container directory.
> Where is the data container for com.example.myapp?

#### `simulator_set_status_bar`
Override status bar appearance (time, battery, signal).
> Set the simulator status bar to show 9:41 AM with full battery

#### `simulator_privacy`
Grant, revoke, or reset privacy permissions for an app.
> Grant camera permission to com.example.myapp

#### `simulator_get_logs`
Retrieve system logs from the simulator.
> Show me the recent simulator logs

### Notarization

#### `notarize_list_signing_identities`
List all code signing certificates in the keychain.
> List my available code signing certificates

#### `notarize_sign_code`
Sign an app bundle or binary with a Developer ID certificate.
> Sign MyApp.app with my Developer ID certificate

#### `notarize_verify_code`
Verify an app's code signature is valid and intact.
> Verify the code signature of MyApp.app

#### `notarize_create_zip`
Create a ZIP archive of an app bundle for notarization.
> Create a ZIP of MyApp.app for notarization

#### `notarize_create_dmg`
Create a DMG disk image containing the app.
> Create a DMG from MyApp.app for distribution

#### `notarize_store_credentials`
Save Apple ID credentials to the keychain for notarization.
> Store my Apple ID credentials for notarization

#### `notarize_submit`
Submit an app to Apple's notarization service.
> Submit MyApp.zip for notarization

#### `notarize_check_status`
Check the status of a notarization submission.
> Check the status of notarization submission abc-123

#### `notarize_get_log`
Retrieve the detailed notarization log for a submission.
> Get the notarization log for submission abc-123

#### `notarize_get_history`
List recent notarization submissions for a team.
> Show my recent notarization history

#### `notarize_staple`
Attach the notarization ticket to an app, DMG, or package.
> Staple the notarization ticket to MyApp.dmg

#### `notarize_validate_staple`
Verify that a notarization ticket is properly stapled.
> Verify the staple on MyApp.dmg

#### `notarize_and_staple`
Submit for notarization, wait for completion, and staple in one operation.
> Notarize MyApp.zip and staple when complete

## License

MIT
