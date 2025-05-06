# Prompt Manager Chrome Extension

A Chrome extension for managing and organizing AI conversation prompts.

## Features

- Browse all saved prompts with titles and creation dates
- Add new prompts with custom titles and content
- Edit existing prompts
- Delete unwanted prompts
- One-click copy prompts to clipboard
- All data stored locally in your browser
- Clean and intuitive user interface

## Installation

1. Download or clone this repository
2. Open Chrome and go to the extensions page (chrome://extensions/)
3. Enable "Developer mode" in the top right
4. Click "Load unpacked"
5. Select the `src` directory from this repository

## Usage

1. Click the extension icon in your Chrome toolbar to open Prompt Manager
2. Click "Add New Prompt" to create a new prompt
3. View all your saved prompts in the list
4. Use the buttons on each prompt card to:
   - Edit the prompt
   - Delete the prompt
   - Copy the prompt to clipboard

## Privacy

This extension:
- Does not collect any user data
- Stores all prompts locally in your browser
- Does not send any data to external servers
- Only requires minimal permissions for local storage and clipboard access

For more information, please read our [Privacy Policy](https://gustavo-liu.github.io/PromptMgr/privacy.html).

## Development

### Project Structure

```
src/
  ├── manifest.json    # Extension configuration
  ├── popup.html      # Popup window HTML
  ├── popup.js        # Popup window JavaScript
  ├── styles.css      # Styles
  └── icons/          # Extension icons
```

### Building

1. Install dependencies:
   ```bash
   npm install
   ```

2. Development mode:
   ```bash
   npm run watch
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## License

MIT License - feel free to use this code for your own projects.

## Contact

If you have any questions or suggestions, please contact us at gustavo.liu@gmail.com. 