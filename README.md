# FiveM Media Hoster

**Made for [LB-Phone](https://lbscripts.com/)** but can be used for other purposes as well!

> **Note**: LB Scripts does **not** provide support for this script.  
> If you need help, please contact me but only if you are a dev.  
> **Discord**: `captainchrizzle.`

---

## Requirements

- **Node.js v20+**
- **MariaDB** (or similar)

---

## Installation

1. **Clone the repository**:

       git clone https://github.com/EGOistentum/fivem-media

2. **Navigate into the directory**:

       cd fivem-media

3. **Install dependencies**:

       npm i

4. **Rename `.env.example` to `.env`** and fill in your data:

       mv .env.example .env
       # Edit the .env file to configure your DB, API key, etc.

5. **Run the script**:

       npm run start

6. **Test it with**:

       curl -F "file=@C:\Users\anonymous\Documents\fivemhosting\testdata\LHWnL8vLu1lY.png CHANGE ME" -H "x-api-key: GSFAF9851GHC CHANGE ME" http://localhost:3000/api/media/upload


> **Tip**: A reverse proxy is recommended to hide the API key.

---

## LB-Phone Integration

If you want to use this script with **LB-Phone**, edit `shared -> upload.lua` in your LB-Phone resource to match the following structure:

    Custom = {
        Video = {
            url = "https://your-url.com/api/media/upload",
            field = "file",
            headers = {
                ["x-api-key"] = "96df0227a978"
            },
            error = {
                path = "success",
                value = false
            },
            success = {
                path = "media.url"
            },
        },
        Image = {
            url = "https://your-url.com/api/media/upload",
            field = "file",
            headers = {
                ["x-api-key"] = "96df0227a978"
            },
            error = {
                path = "success",
                value = false
            },
            success = {
                path = "media.url"
            },
        },
        Audio = {
            url = "https://your-url.com/api/media/upload",
            field = "file",
            headers = {
                ["x-api-key"] = "96df0227a978"
            },
            error = {
                path = "success",
                value = false
            },
            success = {
                path = "media.url"
            },
        },
    }

Replace:
- `https://your-url.com` with your actual domain.
- `96df0227a978` with the actual API key you set in your `.env`.

---

## What You Can Do With It

- **Upload and Host Media** (images, videos, audio) for your FiveM server.
- **Use with LB-Phone** to handle in-game media sending/sharing/upload.
- **Protect Uploads** with an API key.
- **Store and Retrieve Media Info** from a database (e.g., MariaDB).
- **Extend or Customize** for other scripts that need media hosting.

# API Endpoints

Below is a brief overview of the available endpoints and what you can do with them:

- **POST** `/api/media/upload`  
  Upload a file (image, video, or audio). Returns file information, including a URL and direct link.

- **GET** `/api/media`  
  Retrieve a list of all uploaded media with their respective URLs.

- **GET** `/api/media/:id`  
  Redirect to the actual file associated with the specified media ID (e.g., `:id`).

- **GET** `/api/media/info/:id`  
  Fetch detailed information (metadata, direct link, etc.) for a specific media entry.

- **DELETE** `/api/media/:id`  
  Delete the specified media from the server.

