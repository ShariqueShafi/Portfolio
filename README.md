# Sharique Shafi - Interactive Portfolio

Welcome to the source code of my interactive, cinematic personal portfolio. This website is designed to be an immersive experience that blends data, design, and storytelling, reflecting my background in business analytics, financial modeling, and AI marketing.

## Features

- **Cinematic Experience**: A dark, atmospheric design with custom grain effects, glowing accents, and elegant typography (Playfair Display & DM Sans).
- **Scroll-Triggered Animations**: Powered by [GSAP (GreenSock)](https://gsap.com/) and ScrollTrigger, the site features smooth fade-ins, stagger effects, and dynamic element reveals as you scroll.
- **Dynamic Avatar Background**: A unique, sticky portrait avatar that crossfades smoothly between different contextual images as you progress through each chapter of my professional journey.
- **Responsive Layout**: Carefully tuned media queries ensure a seamless experience across desktop, tablet, and mobile mobile devices, with intelligent stacking and dynamic typography scaling.
- **Interactive Contact Form**: Fully functional client-side form submission using [EmailJS](https://www.emailjs.com/), complete with validation, loading states, and a sleek toast notification system.
- **Modern UI Elements**: Custom cursors, glowing "ghost" buttons, frosted glass navigation bars (`backdrop-filter`), and sophisticated blend modes (`mix-blend-mode: lighten`).

## Technology Stack

- **HTML5**: Semantic structure and modern markup.
- **CSS3**: Vanilla CSS with custom properties (variables), Flexbox/Grid layouts, advanced animations, filters, and blend modes.
- **JavaScript (ES6+)**: Vanilla JS for DOM manipulation, form handling, and integrating external libraries.
- **GSAP 3**: Core animation engine for scroll-linked visual storytelling.
- **EmailJS**: Serverless email transmission for the contact form.

## Getting Started

To view the portfolio locally:

1. Clone this repository or download the source code.
2. The project uses standard web technologies and requires no build step. Simply open `index.html` in any modern web browser.
3. For the best experience, run a local development server (e.g., using Python or the VS Code Live Server extension) to avoid any local file protocol (`file://`) restrictions, especially for external assets or API calls.
   
```bash
# Example using Python 3
python3 -m http.server 8000
```
Then visit `http://localhost:8000` in your browser.

## Project Structure

- `index.html`: The main structural document containing all scenes and content.
- `style.css`: The comprehensive styling rules, animations, and responsive media queries.
- `main.js`: The interactive logic, including GSAP ScrollTrigger configuration and EmailJS form handling.
- `assets/`: Contains the images, resumes, and other multimedia assets used throughout the site (e.g., `avatar-s0.png` through `avatar-s8.png`).

## Contact

Feel free to connect with me or reach out through the contact form on the website!

**Sharique Shafi**
- **Email**: shariqueshafi5@gmail.com
- **LinkedIn / GitHub**: Links available in the footer of the portfolio.
