(function () {
  "use strict";

  /* ============================================
     CONFIGURATION & TYPES
     ============================================ */

  /**
   * @typedef {Object} ImageConfig
   * @property {string} id - Unique identifier
   * @property {string} src - Image source URL
   * @property {string} alt - Alt text for accessibility
   * @property {number} width - Native width
   * @property {number} height - Native height
   * @property {number} scale - Scale multiplier
   * @property {string} type - Image type (gif, png, jpg, webp)
   */

  /**
   * @typedef {Object} SoundConfig
   * @property {string} id - Unique identifier
   * @property {string} src - Sound source URL
   * @property {number} volume - Volume level 0-1
   */

  /**
 * Default configuration values
 * All values can be overridden via customFields.json in Streamlabs
 */
const DEFAULTS = {
  // Shape & Geometry
  alertBoxShape: "rounded-rectangle",
  shapePadding: 16,
  maintainAspectRatio: "none",

  // Container sizing
  containerWidth: 1000,
  containerHeight: 180,
  containerBorderRadius: 42,
  containerOutlineWidth: 8,
  scalingMode: "fixed",
  maxScale: 1.5,
  minScale: 0.5,

  // Container gradients
  containerGradient1: "#7d1dff",
  containerGradient2: "#a82bff",
  containerGradient3: "#5a11c9",
  containerGradient4: "#3f0a9b",
  gradientAngle: 135,
  containerOpacity: 1,
  backgroundBlur: 0,

  // Avatar/Circle sizing
  avatarSize: 150,
  avatarRingWidth: 10,
  avatarShape: "circle",
  avatarBorderColor: "#ffffff",
  avatarBorderWidth: 4,

  // Ring gradients
  circleGradient1: "#ff9a1f",
  circleGradient2: "#ff5df2",
  circleGradient3: "#7c2dff",

  // Animation
  rotationAngle: 25,
  rotationSpeed: 6,
  ringSpinSpeed: 6,
  gradientAnimationSpeed: 8,
  introDuration: 800,
  introEasing: "easeOutExpo",
  enableSway: "true",
  enableRingSpin: "true",
  enableGradientAnimation: "true",

  // Typography
  textScale: 1,
  textColorMain: "#0c0018",
  textColorMeta: "#f4d8ff",
  textShadowColor: "rgba(0, 0, 0, 0.35)",
  textShadowBlur: 4,
  textCase: "none",
  fontChoice: "Ubuntu",
  fontWeightPrimary: 900,
  fontWeightMeta: 700,
  letterSpacing: -0.02,

  // Effects
  dropShadowEnabled: "true",
  dropShadowOffsetX: 0,
  dropShadowOffsetY: 12,
  dropShadowBlur: 24,
  dropShadowColor: "#000000",
  dropShadowOpacity: 0.4,
  glowEnabled: "false",
  glowColor: "#ffffff",
  glowIntensity: 20,

  // Layout
  layoutDirection: "row",
  contentAlignment: "center",
  avatarPosition: "center",
  contentGap: 24,

  // Assets
  fallbackImage: "https://i.imgur.com/y1kRGQp.gif",
  soundVolume: 0.8,
};

  /* ============================================
     UTILITY FUNCTIONS
     ============================================ */

  /**
   * Safe DOM element selector with error handling
   * @param {string} selector - CSS selector
   * @returns {Element|null}
   */
  const $ = (selector) => {
    try {
      return document.querySelector(selector);
    } catch (e) {
      console.warn(`[Alert] Invalid selector: ${selector}`);
      return null;
    }
  };

  /**
   * Set CSS custom property on document root
   * @param {string} name - Property name (without --)
   * @param {string|number} value - Property value
   */
  const setVar = (name, value) => {
    document.documentElement.style.setProperty(`--${name}`, value);
  };

  /**
   * Get field value with fallback
   * @param {Object} fields - Custom fields object
   * @param {string} key - Field key
   * @param {*} fallback - Fallback value
   * @returns {*}
   */
  const getField = (fields, key, fallback) => {
    const val = fields[key];
    if (val === undefined || val === null || val === "") {
      return fallback;
    }
    if (typeof val === "string") {
      const trimmed = val.trim();
      return trimmed === "" ? fallback : trimmed;
    }
    return val;
  };

  /**
   * Parse numeric value with bounds
   * @param {*} value - Value to parse
   * @param {number} fallback - Fallback value
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {number}
   */
  const parseNumber = (value, fallback, min = -Infinity, max = Infinity) => {
    const num = parseFloat(value);
    if (isNaN(num)) return fallback;
    return Math.min(Math.max(num, min), max);
  };

  /* ============================================
     CONFIG MANAGER
     ============================================ */

  /**
   * Manages configuration loading and access
   */
  const ConfigManager = {
    fields: {},
    images: {},
    config: {},

    /**
     * Initialize with Streamlabs custom fields
     */
    init() {
      this.fields = window.customFields || {};

      // Load images configuration (embedded for Streamlabs compatibility)
      this.images = this.loadImagesConfig();

      return this;
    },

    /**
     * Load images configuration
     * Simplified - uses fallback image, actual image comes from customFields.json
     * @returns {Object}
     */
    loadImagesConfig() {
      return {
        fallback: {
          id: "fallback",
          src: DEFAULTS.fallbackImage,
          alt: "Fallback avatar image",
          width: 220,
          height: 220,
          scale: 1,
          type: "gif",
        },
      };
    },

    /**
     * Get a custom field value
     * @param {string} key
     * @param {*} fallback
     * @returns {*}
     */
    get(key, fallback) {
      return getField(this.fields, key, fallback ?? DEFAULTS[key]);
    },
  };

  /* ============================================
     THEME MANAGER
     ============================================ */

  /**
   * Applies design tokens as CSS custom properties
   * All values come from customFields.json via ConfigManager
   */
  const ThemeManager = {
    /**
     * Apply all theme variables from customFields.json
     */
    apply() {
      this.applyContainerSize();
      this.applyContainerGradients();
      this.applyAvatarSize();
      this.applyRingGradients();
      this.applyAnimation();
      this.applyTypography();
    },

    /**
     * Apply container dimensions from customFields.json
     */
    applyContainerSize() {
      const width = parseNumber(ConfigManager.get("containerWidth"), 1000, 300, 1600);
      const height = parseNumber(ConfigManager.get("containerHeight"), 180, 80, 400);
      const borderRadius = parseNumber(ConfigManager.get("containerBorderRadius"), 42, 0, 100);
      const outlineWidth = parseNumber(ConfigManager.get("containerOutlineWidth"), 8, 1, 30);

      setVar("container-width", `${width}px`);
      setVar("container-height", `${height}px`);
      setVar("container-radius-outer", `${borderRadius}px`);
      setVar("container-radius-inner", `${Math.max(0, borderRadius - 8)}px`);
      setVar("outline-width", `${outlineWidth}px`);
    },

    /**
     * Apply container gradient colors
     */
    applyContainerGradients() {
      for (let i = 1; i <= 4; i++) {
        const color = ConfigManager.get(`containerGradient${i}`);
        setVar(`container-${i}`, color);
      }
    },

    /**
     * Apply avatar/circle dimensions from customFields.json
     */
    applyAvatarSize() {
      const size = parseNumber(ConfigManager.get("avatarSize"), 150, 60, 300);
      const ringWidth = parseNumber(ConfigManager.get("avatarRingWidth"), 10, 2, 30);

      setVar("avatar-size", `${size}px`);
      setVar("avatar-ring-offset", `${ringWidth}px`);
      setVar("avatar-ring-width", `${Math.max(2, ringWidth / 2)}px`);
    },

    /**
     * Apply ring/circle gradient colors
     */
    applyRingGradients() {
      for (let i = 1; i <= 3; i++) {
        const color = ConfigManager.get(`circleGradient${i}`);
        setVar(`ring-${i}`, color);
      }
    },

    /**
     * Apply animation parameters
     */
    applyAnimation() {
      const angle = parseNumber(ConfigManager.get("rotationAngle"), 25, 0, 45);
      const speed = parseNumber(ConfigManager.get("rotationSpeed"), 6, 1, 20);
      const ringSpeed = parseNumber(ConfigManager.get("ringSpinSpeed"), 6, 1, 20);

      setVar("sway-angle", `${angle}deg`);
      setVar("sway-duration", `${speed}s`);
      setVar("ring-spin-duration", `${ringSpeed}s`);
    },

    /**
     * Apply typography settings
     */
    applyTypography() {
      const scale = parseNumber(ConfigManager.get("textScale"), 1, 0.5, 2);
      const textCase = ConfigManager.get("textCase", "none");
      const font = ConfigManager.get("fontChoice", "Ubuntu");
      const shadowBlur = parseNumber(ConfigManager.get("textShadowBlur"), 4, 0, 30);
      const fontWeightPrimary = ConfigManager.get("fontWeightPrimary", 900);
      const fontWeightMeta = ConfigManager.get("fontWeightMeta", 700);
      const letterSpacing = parseNumber(ConfigManager.get("letterSpacing"), -0.02, -0.1, 0.3);

      setVar("text-scale", scale);
      setVar("text-transform", textCase);
      setVar("font-family", `'${font}', 'Ubuntu', system-ui, sans-serif`);
      setVar("text-primary", ConfigManager.get("textColorMain"));
      setVar("text-secondary", ConfigManager.get("textColorMeta"));
      setVar("text-shadow-color", ConfigManager.get("textShadowColor"));
      setVar("text-shadow-blur", `${shadowBlur}px`);
      setVar("font-weight-primary", fontWeightPrimary);
      setVar("font-weight-meta", fontWeightMeta);
      setVar("letter-spacing", `${letterSpacing}em`);
    },
  };

  /* ============================================
     SHAPE MANAGER
     ============================================ */

  /**
   * Manages geometric shapes and aspect ratios
   * Applies data attributes to elements for CSS-based shape rendering
   */
  const ShapeManager = {
    /**
     * Apply shape configuration to DOM elements
     */
    apply() {
      const frame = $(".alert-frame");
      const avatarWrapper = $(".alert-avatar-wrapper");

      if (!frame) {
        console.warn("[Alert] Alert frame not found for shape application");
        return;
      }

      // Apply alert box shape
      const shape = ConfigManager.get("alertBoxShape", "rounded-rectangle");
      frame.dataset.shape = shape;

      // Apply aspect ratio
      const aspectRatio = ConfigManager.get("maintainAspectRatio", "none");
      if (aspectRatio !== "none") {
        frame.dataset.aspect = aspectRatio;
      } else {
        delete frame.dataset.aspect;
      }

      // Apply avatar shape
      if (avatarWrapper) {
        const avatarShape = ConfigManager.get("avatarShape", "circle");
        avatarWrapper.dataset.avatarShape = avatarShape;
      }

      // Apply shape padding as CSS variable
      const padding = parseNumber(ConfigManager.get("shapePadding"), 16, 0, 60);
      setVar("shape-padding", `${padding}px`);
    },
  };

  /* ============================================
     EFFECTS MANAGER
     ============================================ */

  /**
   * Manages visual effects like glow, shadows, and animation toggles
   */
  const EffectsManager = {
    /**
     * Apply all visual effects
     */
    apply() {
      this.applyDropShadow();
      this.applyGlow();
      this.applyAnimationToggles();
    },

    /**
     * Apply drop shadow effect
     */
    applyDropShadow() {
      const enabled = ConfigManager.get("dropShadowEnabled", "true") === "true";
      const offsetX = parseNumber(ConfigManager.get("dropShadowOffsetX"), 0, -50, 50);
      const offsetY = parseNumber(ConfigManager.get("dropShadowOffsetY"), 12, 0, 50);
      const blur = parseNumber(ConfigManager.get("dropShadowBlur"), 24, 0, 80);
      const color = ConfigManager.get("dropShadowColor", "#000000");
      const opacity = parseNumber(ConfigManager.get("dropShadowOpacity"), 0.4, 0, 1);

      setVar("drop-shadow-enabled", enabled ? "1" : "0");
      setVar("drop-shadow-x", `${offsetX}px`);
      setVar("drop-shadow-y", `${offsetY}px`);
      setVar("drop-shadow-blur", `${blur}px`);
      setVar("drop-shadow-color", color);
      setVar("drop-shadow-opacity", opacity);
    },

    /**
     * Apply glow effect
     */
    applyGlow() {
      const frame = $(".alert-frame");
      const enabled = ConfigManager.get("glowEnabled", "false") === "true";
      const color = ConfigManager.get("glowColor", "#ffffff");
      const intensity = parseNumber(ConfigManager.get("glowIntensity"), 20, 5, 60);

      setVar("glow-enabled", enabled ? "1" : "0");
      setVar("glow-color", color);
      setVar("glow-intensity", `${intensity}px`);

      // Toggle glow class on frame
      if (frame) {
        frame.classList.toggle("alert-frame--glow", enabled);
      }
    },

    /**
     * Apply animation toggle states
     */
    applyAnimationToggles() {
      const frame = $(".alert-frame");
      const ring = $(".alert-avatar-ring");

      // Sway animation toggle
      const swayEnabled = ConfigManager.get("enableSway", "true") === "true";
      if (frame) {
        frame.classList.toggle("alert-frame--no-sway", !swayEnabled);
      }

      // Ring spin toggle
      const ringSpinEnabled = ConfigManager.get("enableRingSpin", "true") === "true";
      if (ring) {
        ring.classList.toggle("alert-avatar-ring--no-spin", !ringSpinEnabled);
      }

      // Gradient animation toggle
      const gradientEnabled = ConfigManager.get("enableGradientAnimation", "true") === "true";
      if (frame) {
        frame.classList.toggle("alert-frame--no-gradient-animation", !gradientEnabled);
      }

      // Set gradient animation speed
      const gradientSpeed = parseNumber(ConfigManager.get("gradientAnimationSpeed"), 8, 2, 20);
      setVar("gradient-duration", `${gradientSpeed}s`);
    },
  };

  /* ============================================
     IMAGE RENDERER
     ============================================ */

  /**
   * Handles avatar image display
   * Image source is set directly in HTML via Streamlabs token {avatarImage}
   * This manager only handles fallback on error
   */
  const ImageRenderer = {
    element: null,
    fallbackSrc: DEFAULTS.fallbackImage,

    /**
     * Initialize image renderer
     */
    init() {
      this.element = $("#alert-avatar");
      if (!this.element) {
        console.warn("[Alert] Avatar element not found");
        return this;
      }

      // Get fallback from data attribute or default
      this.fallbackSrc =
        this.element.dataset.fallback || DEFAULTS.fallbackImage;

      // Set up error handling for fallback only
      this.element.addEventListener("error", () => this.handleError());

      return this;
    },

    /**
     * Render is now a no-op - image is already set via HTML template
     * Streamlabs handles the {avatarImage} token replacement
     */
    render() {
      // Image src is set directly in HTML via {avatarImage} token
      // No JavaScript manipulation needed
    },

    /**
     * Handle image load error - fallback gracefully
     */
    handleError() {
      if (!this.element) return;

      const currentSrc = this.element.src;
      if (currentSrc !== this.fallbackSrc) {
        console.warn(
          `[Alert] Image failed to load: ${currentSrc}, using fallback`
        );
        this.element.src = this.fallbackSrc;
      }
    },
  };

  /* ============================================
     AUDIO MANAGER
     ============================================ */

  /**
   * Handles alert sound playback with volume control
   */
  const AudioManager = {
    element: null,

    /**
     * Initialize audio manager
     */
    init() {
      this.element = $("#alert-sound");
      return this;
    },

    /**
     * Play alert sound if configured
     */
    play() {
      if (!this.element) return;

      const soundSrc = ConfigManager.get("alertSound", "");
      const volume = parseNumber(ConfigManager.get("soundVolume"), 0.8, 0, 1);

      if (soundSrc && !this.isTokenString(soundSrc)) {
        this.element.src = soundSrc;
        this.element.volume = volume;
        this.element.currentTime = 0;
        this.element.play().catch((err) => {
          console.warn("[Alert] Audio playback failed:", err.message);
        });
      }
    },

    /**
     * Check if string is an unresolved template token
     * @param {string} str
     * @returns {boolean}
     */
    isTokenString(str) {
      return !str || str.includes("{") || str.includes("}");
    },
  };

  /* ============================================
     ANIMATION CONTROLLER
     ============================================ */

  /**
   * Manages intro animations via anime.js
   */
  const AnimationController = {
    /**
     * Check if anime.js is available
     * @returns {boolean}
     */
    isAvailable() {
      return typeof anime !== "undefined";
    },

    /**
     * Run intro animation sequence
     */
    playIntro() {
      if (!this.isAvailable()) {
        console.warn("[Alert] anime.js not available, skipping animations");
        return;
      }

      const frame = $(".alert-frame");
      const leftZone = $(".alert-zone--left");
      const rightZone = $(".alert-zone--right");
      const avatarWrapper = $(".alert-avatar-wrapper");

      const targets = [frame, leftZone, rightZone, avatarWrapper].filter(
        Boolean
      );

      if (targets.length === 0) {
        console.warn("[Alert] No animation targets found");
        return;
      }

      // Set initial state
      anime.set(targets, {
        opacity: 0,
        scale: 0.9,
      });

      // Create timeline
      anime
        .timeline({
          easing: "easeOutExpo",
          duration: 800,
        })
        .add({
          targets: frame,
          opacity: [0, 1],
          scale: [0.9, 1],
          duration: 600,
        })
        .add(
          {
            targets: leftZone,
            opacity: [0, 1],
            translateX: [-60, 0],
            scale: [0.95, 1],
          },
          "-=400"
        )
        .add(
          {
            targets: avatarWrapper,
            opacity: [0, 1],
            scale: [0.6, 1],
            rotateZ: [-8, 0],
          },
          "-=400"
        )
        .add(
          {
            targets: rightZone,
            opacity: [0, 1],
            translateX: [60, 0],
            scale: [0.95, 1],
          },
          "-=400"
        );
    },
  };

  /* ============================================
     ACCESSIBILITY MANAGER
     ============================================ */

  /**
   * Handles accessibility announcements
   */
  const AccessibilityManager = {
    element: null,

    /**
     * Initialize accessibility manager
     */
    init() {
      this.element = $("#sr-announcement");
      return this;
    },

    /**
     * Announce message to screen readers
     * @param {string} message
     */
    announce(message) {
      if (!this.element) return;

      this.element.textContent = "";
      // Small delay to ensure announcement is triggered
      setTimeout(() => {
        this.element.textContent = message;
      }, 100);
    },
  };

  /* ============================================
     MAIN INITIALIZATION
     ============================================ */

  /**
   * Main initialization function
   * Called when DOM is ready
   */
  const init = () => {
    try {
      // Initialize managers
      ConfigManager.init();
      ImageRenderer.init();
      AudioManager.init();
      AccessibilityManager.init();

      // Apply theme (CSS custom properties)
      ThemeManager.apply();

      // Apply geometric shapes
      ShapeManager.apply();

      // Apply visual effects
      EffectsManager.apply();

      // Render image (with fallback support)
      ImageRenderer.render();

      // Play sound
      AudioManager.play();

      // Run intro animation
      AnimationController.playIntro();

      // Announce for screen readers
      AccessibilityManager.announce("New subscription alert");

      console.log("[Alert] Initialization complete v2.1.0");
    } catch (error) {
      console.error("[Alert] Initialization error:", error);
    }
  };

  // Run initialization
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Export for testing/debugging
  window.AlertWidget = {
    ConfigManager,
    ThemeManager,
    ShapeManager,
    EffectsManager,
    ImageRenderer,
    AudioManager,
    AnimationController,
    AccessibilityManager,
    reinit: init,
  };
})();
