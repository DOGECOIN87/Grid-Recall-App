# Creating an APK for GridRecall

This guide will walk you through the process of creating an Android APK file for your GridRecall app using the exported web files.

## Prerequisites

- [Android Studio](https://developer.android.com/studio) (latest version)
- JDK 11 or newer
- Basic knowledge of Android development
- The `gridrecall-web.zip` file (containing the exported Next.js app)

## Step 1: Extract the Web Files

1. Download the `gridrecall-web.zip` file from your project
2. Extract the contents to a location on your computer
3. You should now have a folder named `out` containing all the web files

## Step 2: Create a New Android Project

1. Open Android Studio
2. Click "New Project"
3. Select "Empty Activity"
4. Configure your project:
   - Name: "GridRecall"
   - Package name: "com.yourdomain.gridrecall" (replace "yourdomain" with your actual domain)
   - Language: Kotlin
   - Minimum SDK: API 21 (Android 5.0) or higher
5. Click "Finish" to create the project

## Step 3: Configure the WebView in MainActivity

1. Open `MainActivity.kt`
2. Replace its contents with the following code:

```kotlin
package com.yourdomain.gridrecall

import android.annotation.SuppressLint
import android.os.Bundle
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    private lateinit var webView: WebView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webview)
        webView.webViewClient = WebViewClient()

        // Configure WebView settings
        val webSettings = webView.settings
        webSettings.javaScriptEnabled = true
        webSettings.domStorageEnabled = true
        webSettings.databaseEnabled = true
        webSettings.allowFileAccess = true
        webSettings.allowContentAccess = true
        webSettings.loadsImagesAutomatically = true
        webSettings.cacheMode = WebSettings.LOAD_DEFAULT
        
        // For offline support
        webSettings.setAppCachePath(applicationContext.cacheDir.absolutePath)
        webSettings.setAppCacheEnabled(true)
        
        // Load the app
        webView.loadUrl("file:///android_asset/www/index.html")
    }

    // Handle back button navigation within WebView
    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
}
```

## Step 4: Update the Layout XML

1. Open `res/layout/activity_main.xml`
2. Replace its contents with the following code:

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout 
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".MainActivity">

    <WebView
        android:id="@+id/webview"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent" />

</androidx.constraintlayout.widget.ConstraintLayout>
```

## Step 5: Update AndroidManifest.xml

1. Open `AndroidManifest.xml`
2. Update it to include internet permissions:

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.yourdomain.gridrecall">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.AppCompat.Light.NoActionBar">
        
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
```

## Step 6: Include Web App in Android Project

1. In Android Studio, right-click on the `app` module
2. Select New > Folder > Assets Folder
3. Create a subdirectory: `assets/www`
4. Copy all files from the extracted `out` directory
5. Paste them into the `assets/www` directory in your Android project

## Step 7: Add App Icon

1. Right-click on the `res` folder
2. Select New > Image Asset
3. Choose the logo2.png file from your project as the source
4. Configure and generate icons for different densities

## Step 8: Build and Test the App

1. Connect an Android device to your computer or start an emulator
2. Click the "Run" button in Android Studio
3. Select your device/emulator
4. Wait for the app to build and install
5. Test all functionality to ensure it works correctly

## Step 9: Generate a Signed APK

1. In Android Studio, select Build > Generate Signed Bundle/APK
2. Select "APK"
3. Click "Create new..." to create a new keystore
   - Keystore path: Choose a location for your keystore file
   - Password: Create a strong password
   - Key alias: "gridrecall"
   - Key password: Create a strong password (can be the same as keystore password)
   - Fill in the certificate information
4. Click "Next"
5. Select "release" build variant
6. Click "Finish"

The signed APK will be generated in the location you specified. This is your personal APK file that you can install on your Android device.

## Step 10: Install the APK on Your Device

1. Transfer the APK file to your Android device
2. On your device, navigate to the APK file using a file manager
3. Tap the APK file to install it
4. You may need to enable "Install from unknown sources" in your device settings

Congratulations! You now have a personal APK of your GridRecall app that you can install on your Android devices.

## Troubleshooting

### White Screen/Blank Screen
- Check WebView configuration
- Verify file paths in assets directory
- Enable WebView debugging

### JavaScript Not Working
- Ensure JavaScript is enabled in WebView settings
- Check for console errors using remote debugging

### Images Not Loading
- Verify that all image paths are correct
- Check that images are properly copied to the assets directory

### App Crashes on Start
- Check logcat in Android Studio for error messages
- Verify that all required permissions are included in the manifest
