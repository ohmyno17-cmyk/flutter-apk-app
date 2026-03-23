# Flutter APK App

Flutter application with automated CI/CD using GitHub Actions.

## 🚀 Features

- ✅ Automated APK build on tag push
- ✅ Manual workflow trigger
- ✅ APK signing for release builds
- ✅ App Bundle (.aab) generation for Google Play
- ✅ Pull request testing

## 📱 Quick Start

### Build APK Manually

1. Go to **Actions** tab
2. Select **Flutter APK Release**
3. Click **Run workflow**
4. Choose build type (release/debug/profile)
5. Download APK from **Artifacts**

### Create Release

```bash
# Update version in pubspec.yaml
git add .
git commit -m "Release v1.0.0"
git tag v1.0.0
git push origin main --tags
```

APK will be automatically built and added to GitHub Releases.

## 🔐 Secrets Required

| Secret | Description |
|--------|-------------|
| `KEYSTORE_BASE64` | Base64 encoded keystore file |
| `KEYSTORE_PASSWORD` | Keystore password |
| `KEY_ALIAS` | Key alias |
| `KEY_PASSWORD` | Key password |

## 📋 Setup for Other Flutter Repos

Add this workflow file to your Flutter project:

```yaml
# .github/workflows/flutter-apk-release.yml
name: Flutter APK Release

on:
  workflow_dispatch:
    inputs:
      build_type:
        description: 'Build type'
        required: true
        default: 'release'
        type: choice
        options:
          - release
          - debug
          - profile
  push:
    tags:
      - 'v*'

jobs:
  call-builder:
    uses: ohmyno17-cmyk/flutter-apk-app/.github/workflows/flutter-apk-builder.yml@main
    with:
      flutter-version: '3.24.0'
      build-type: ${{ github.event.inputs.build_type || 'release' }}
    secrets: inherit
```

## 📁 Project Structure

```
├── .github/workflows/
│   ├── flutter-apk-release.yml      # Main workflow
│   ├── flutter-apk-builder.yml      # Reusable builder
│   └── auto-setup-new-repos.yml     # Auto-setup for new repos
├── lib/
│   └── main.dart
├── android/
│   └── app/
│       └── build.gradle             # Signing config
└── pubspec.yaml
```

## 🔄 Workflows

| Workflow | Trigger | Description |
|----------|---------|-------------|
| Flutter APK Release | Manual / Tag / PR | Build APK & AAB |
| Flutter APK Builder | Called by others | Reusable build logic |
| Auto Setup New Repos | Hourly | Detect & setup new Flutter repos |

## 📖 Documentation

- [Panduan Flutter GitHub Actions (ID)](docs/PANDUAN.md)
- [Flutter Documentation](https://docs.flutter.dev/)

## 📞 Support

Open an issue: https://github.com/ohmyno17-cmyk/flutter-apk-app/issues
