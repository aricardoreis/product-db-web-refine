# Authentication Setup Guide

## Overview
This application supports two authentication modes that automatically switch based on your environment configuration.

## Development Mode (No Authentication)
When running locally, you can disable authentication to skip the login process.

### Option 1: Environment Variable (Recommended)
Create a `.env.local` file in your project root with:
```bash
VITE_DISABLE_AUTH=true
```

### Option 2: Automatic Detection
The app automatically detects development mode (`import.meta.env.DEV`) and will show a console message indicating which auth provider is active.

## Production Mode (Full Authentication)
When `VITE_DISABLE_AUTH` is not set or is `false`, the app uses full authentication:
- Login required
- Token validation
- Secure API calls
- Proper logout functionality

## Console Messages
Look for these messages in your browser console:
- 🔓 **Development mode: Authentication disabled** - Mock auth provider active
- 🔐 **Development mode: Authentication enabled** - Production auth provider active  
- 🔐 **Production mode: Authentication enabled** - Production auth provider active

## Switching Between Modes
1. **To disable auth**: Set `VITE_DISABLE_AUTH=true` in `.env.local`
2. **To enable auth**: Remove the line or set `VITE_DISABLE_AUTH=false`
3. **Restart** your development server after changing the environment variable

## Security Note
- Mock authentication is **only active in development mode**
- Production builds always use full authentication
- Never commit `.env.local` with `VITE_DISABLE_AUTH=true` to production
