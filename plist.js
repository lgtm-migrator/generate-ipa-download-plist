const gen_plist = (opt = { url: "", version: "0.0.1", name: "" }) => `<?xml version="1.0" encoding="utf-8"?>
<plist version="1.0">
  <dict>
    <key>items</key>
    <array>
      <dict>
        <key>assets</key>
        <array>
          <dict>
            <key>kind</key>
            <string>software-package</string>
            <key>url</key>
            <string>${opt.url}</string>
          </dict>
        </array>
        <key>metadata</key>
        <dict>
          <key>bundle-identifier</key>
          <string>${opt.id}</string>
          <key>bundle-version</key>
          <string>${opt.version}</string>
          <key>kind</key>
          <string>software</string>
          <key>title</key>
          <string>${opt.name}</string>
        </dict>
      </dict>
    </array>
  </dict>
</plist>`


module.exports = { gen_plist }