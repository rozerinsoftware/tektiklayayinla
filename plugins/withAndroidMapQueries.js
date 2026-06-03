const { withAndroidManifest } = require('@expo/config-plugins');

/** Android 11+: geo / Google Maps intent'lerini açabilmek için manifest queries */
function withAndroidMapQueries(config) {
  return withAndroidManifest(config, (cfg) => {
    cfg.modResults.manifest.queries = [
      {
        intent: [
          {
            action: [{ $: { 'android:name': 'android.intent.action.VIEW' } }],
            data: [{ $: { 'android:scheme': 'geo' } }],
          },
          {
            action: [{ $: { 'android:name': 'android.intent.action.VIEW' } }],
            data: [{ $: { 'android:scheme': 'google.navigation' } }],
          },
        ],
      },
      {
        package: [{ $: { 'android:name': 'com.google.android.apps.maps' } }],
      },
    ];
    return cfg;
  });
}

module.exports = withAndroidMapQueries;
