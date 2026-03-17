module.exports = {
  packagerConfig: {
    icon: "./images/icon.icns",
    executableName: "ChatGPT-MenuBar",
    appBundleId: "com.robi.chatgpt-menubar",
    appCategoryType: "public.app-category.productivity",
    osxSign: {
      identity: "Developer ID Application: Robi750"
    }
  },
  makers: [
    {
      name: "@electron-forge/maker-dmg",
      config: {
        name: "ChatGPT-MenuBar",
        overwrite: true,
        format: "ULFO"
      }
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin"]
    }
  ]
};