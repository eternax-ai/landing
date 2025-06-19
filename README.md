# eternaX Landing Page

## Tech Stack

- **HTML5**: Semantic markup
- **Tailwind CSS**: Utility-first CSS framework
- **JavaScript**: Vanilla JS for interactions
- **GitHub Pages**: Static site hosting
- **GitHub Actions**: Automated deployment

## Getting Started

### Prerequisites

- A GitHub account
- Git installed on your machine

### Installation

1. Clone this repository:
```bash
git clone https://github.com/eternax-ai/landing.git
cd landing
```

2. Open `index.html` in your browser to view the site locally.

## Deployment

### GitHub Pages

1. Push your changes to the `main` branch
2. Go to your repository settings
3. Navigate to "Pages" in the sidebar
4. Select "GitHub Actions" as the source
5. The site will automatically deploy when you push to main

### Manual Deployment

If you prefer manual deployment:

1. Enable GitHub Pages in your repository settings
2. Select the branch you want to deploy from
3. Your site will be available at `https://eternax-ai.github.io/landing`

## Project Structure

```
landing/
├── index.html              # Main HTML file
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions deployment config
├── README.md               # Project documentation
└── .gitignore             # Git ignore file
```

## Customization Guide

### Adding New Sections

1. Create a new `<section>` element in `index.html`
2. Add corresponding navigation link in the nav bar
3. Style using Tailwind classes
4. Add smooth scrolling behavior in the JavaScript section

### Modifying Styling

- Use Tailwind utility classes for styling
- Custom colors are defined in the Tailwind config
- Glass effects use CSS custom properties
- Animations are defined in the `<style>` section

### Adding Interactivity

- JavaScript is included at the bottom of `index.html`
- Smooth scrolling is already implemented
- Add more interactive features as needed

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Optimized for fast loading
- Minimal external dependencies
- Compressed images and assets
- Efficient CSS with Tailwind

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For support and questions:
- Create an issue in this repository
- Check the documentation
- Review the whitepaper for technical details

---

Built with ❤️ for the autonomous agent economy. 