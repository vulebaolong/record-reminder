import { FusesPlugin } from "@electron-forge/plugin-fuses";
import { FuseV1Options, FuseVersion } from "@electron/fuses";

export default {
   packagerConfig: {
      name: "Record Reminder",
      asar: true,
      icon: './public/images/logo/logo'
   },
   rebuildConfig: {},
   makers: [
      {
        name: '@electron-forge/maker-dmg',
        config: {
          format: 'ULFO',
          icon: './public/images/logo/logo.icns', 
          overwrite: true
        }
      }
   ],
   plugins: [
      {
         name: "@electron-forge/plugin-auto-unpack-natives",
         config: {},
      },
      // Fuses are used to enable/disable various Electron functionality
      // at package time, before code signing the application
      new FusesPlugin({
         version: FuseVersion.V1,
         [FuseV1Options.RunAsNode]: false,
         [FuseV1Options.EnableCookieEncryption]: true,
         [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
         [FuseV1Options.EnableNodeCliInspectArguments]: false,
         [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
         [FuseV1Options.OnlyLoadAppFromAsar]: true,
      }),
   ],
};
