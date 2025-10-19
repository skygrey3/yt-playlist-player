# YouTube Playlist Player

## Contents
- [Overview](#overview)
- [Installation](#installation)
- [Contributing](#contributing)
- [License](#license)

## Overview
This is a lightweight React app that acts as a YouTube player; allows users to interact with any playlist. It requires no login and provides basic playback controls (play, pause, skip, previous, shuffle). It is built with React, Redux and Material-UI.

## Installation
Here are the steps to install and run the player locally:

1. Clone the repository wherever you see fit:
   ```bash
   git clone https://github.com/your-username/playlist-player.git
   ```
2. Navigate to the project directory:
   ```bash
   cd playlist-player
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the root of the project and add your own YouTube API key (see https://developers.google.com/youtube/v3/getting-started):
   ```
   REACT_APP_YT_API_KEY=your_api_key_here
   ```
5. Start the development server:
   ```bash
   npm start
   ```
6. Open the application in your browser at `http://localhost:3000`;

7. Paste a YouTube playlist URL into the input field and press Enter / click "Load Playlist".

## Contributing
Contributions and feedback are welcome! Feel free to open issues / submit pull requests.

## License
This project is licensed under the MIT License. See the LICENSE file for details.