# MongoDB Migration Guide

## Overview

This application has been migrated from the deprecated MongoDB Atlas App Services (Data API) to the official MongoDB Node.js driver. This migration was necessary because MongoDB deprecated the App Services endpoint used by this application.

## What Changed

### Before (Deprecated)
- Used MongoDB Data API endpoint: `https://sa-east-1.aws.data.mongodb-api.com/app/data-rcjlb/endpoint/data/v1/action`
- Required `MONGODB_DATA_API_KEY` environment variable
- Made HTTP requests to MongoDB's REST API

### After (Current)
- Uses official MongoDB Node.js driver
- Requires `MONGODB_URI` environment variable (connection string)
- Direct connection to MongoDB Atlas cluster
- Better performance and reliability

## Migration Steps for Existing Users

### 1. Update Dependencies

The MongoDB driver is now included in `src/nodejs/package.json`. Run:

```bash
cd src/nodejs
npm install
```

### 2. Update Environment Configuration

1. **Get your MongoDB Atlas connection string:**
   - Log in to [MongoDB Atlas](https://cloud.mongodb.com/)
   - Navigate to your cluster
   - Click "Connect"
   - Choose "Connect your application"
   - Select "Node.js" as the driver
   - Copy the connection string

2. **Update your `src/nodejs/env.json` file:**

   **Old format (no longer works):**
   ```json
   {
     "MONGODB_DATA_API_KEY": "your-old-api-key"
   }
   ```

   **New format:**
   ```json
   {
     "MONGODB_URI": "mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority"
   }
   ```

   Replace `<username>`, `<password>`, and `<cluster>` with your actual credentials.

### 3. Security Recommendations

- **Never commit** `src/nodejs/env.json` to version control (it's already in .gitignore)
- Use a strong password for your MongoDB user
- Configure IP Access List in MongoDB Atlas (under Network Access)
- Consider using MongoDB Atlas Database Access roles to limit permissions

### 4. Verify the Migration

After updating your configuration, test that the application works:

```bash
npm run dev
```

The application should connect to MongoDB using the new driver.

## Benefits of the Migration

1. **No Deprecation Risk**: Using the official, actively maintained MongoDB driver
2. **Better Performance**: Direct connection instead of HTTP REST API
3. **More Features**: Access to all MongoDB features and operations
4. **Active Support**: Official driver receives regular updates and bug fixes
5. **Connection Pooling**: Built-in connection pooling for better resource management

## Troubleshooting

### Connection Failed Error

If you see an error like "MONGODB_URI environment variable is not defined":
- Ensure `src/nodejs/env.json` exists and contains the `MONGODB_URI` key

### Authentication Failed

If you get authentication errors:
- Verify your username and password are correct in the connection string
- Ensure the database user exists in MongoDB Atlas (Database Access section)
- Check that the password is properly URL-encoded if it contains special characters

### Network Errors

If you get network timeout errors:
- Check your Network Access settings in MongoDB Atlas
- Add your IP address to the IP Access List
- For development, you can temporarily allow access from anywhere (0.0.0.0/0), but this is not recommended for production

### Need Help?

If you encounter issues during migration:
1. Check the MongoDB Atlas documentation: https://www.mongodb.com/docs/atlas/
2. Review MongoDB Node.js driver documentation: https://www.mongodb.com/docs/drivers/node/
3. Open an issue in this repository

## References

- [MongoDB Atlas App Services End of Life Announcement](https://www.mongodb.com/community/forums/t/atlas-device-sync-end-of-life-and-deprecation/296687)
- [MongoDB Node.js Driver Documentation](https://www.mongodb.com/docs/drivers/node/current/)
- [MongoDB Atlas Documentation](https://www.mongodb.com/docs/atlas/)
