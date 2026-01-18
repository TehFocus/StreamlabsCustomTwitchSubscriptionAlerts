# Streamlabs Custom Alert

A modern Twitch alert box for Streamlabs with animated gradients, shape options, and avatar-focused visuals. Heavily customizable and free for you to use.
## If you enjoy this, consider buying me a Kebap:
<p align="left">
<a href="https://ko-fi.com/tehf0cus" target="_blank" rel="noopener noreferrer">
   <img src="https://storage.ko-fi.com/cdn/generated/fhfuc7slzawvi/2025-12-25_rest-7b04ad9b98d6907e7f165a7f16cf94b6-i1wwshaq.jpg" alt="Festive Ko-fi artwork" width="300">
</a>
</p>

## Features

- Animated four-stop gradient frame with optional glow
- Customizeable alert box shapes
- Avatar ring with customizeable animated gradients, speed and size controls
- Configurable sway speed/angle
- Customizable typography, spacing, and layout direction/positioning
- Drop shadow, background blur, and opacity controls for glassy looks

## Showcase

<p align="left">
      <span>Default Color Scheme (customFields.json):</span>
      <br><br><img src="https://i.imgur.com/zwaw3QE.png" alt="Demopicture2" width="65%">
      <br><br><span>BlueWhite Color Scheme (customFieldsBlueIce.json):</span>
      <br><br><img src="https://i.imgur.com/3GBOyrA.png" alt="Demopicture2" width="65%">
      <br><br><span>Orange Color Scheme (customFieldsOrange.json):</span>
      <br><br><img src="https://i.imgur.com/I1gKLUp.png" alt="Demopicture2" width="65%">
      <br><br><span>Green Color Scheme (customFieldsGreen.json):</span>
      <br><br><img src="https://i.imgur.com/vERk1v9.png" alt="Demopicture2" width="65%">
</p>


## Installation
<h3>Streamlabs OBS</h3>

1. Open **Streamlabs Desktop**
2. Add a **Browser Source** → Select the **Alert Box** widget
3. In the widget editor tabs:
   - **HTML tab**: Paste contents of `alerts.html`
   - **CSS tab**: Paste contents of `alerts.css`  
   - **JS tab**: Paste contents of `alerts.js`
   - **Custom Fields tab**: Paste contents of `customFields.json`
4. Click **Save Settings**

<h3>Streamlabs Dashboard (For any Streaming program)</h3>

1. Open **Streamlabs Dashboard** https://streamlabs.com/dashboard
2. In the alrt box tab:
   - Select Subscription
   - **HTML tab**: Paste contents of `alerts.html`
   - **CSS tab**: Paste contents of `alerts.css`  
   - **JS tab**: Paste contents of `alerts.js`
   - **Custom Fields tab**: Paste contents of `customFields.json`
3. Click **Save Settings**
4. Copy the Alert URL (Top of page)
5. Create a Browser Source in your streaming programm
6. Paste the URL
7. Size width/height to fit the size of your alert


## Configuration

All settings are adjustable via the Streamlabs custom fields interface:



## How It Works

1. Streamlabs renders the alert using `alerts.html` and replaces tokens (e.g., avatar image).
2. `alerts.js` reads `customFields.json`, applies CSS variables, sets shapes, effects, and animation toggles.
3. `customFields.json` can be edited in any way you feel, but make sure to test your results first!


## License
NOTE: This Custom Alert was made by https://github.com/TehFocus with the help of GitHub Copilot.

MIT License - See [LICENSE](LICENSE) file