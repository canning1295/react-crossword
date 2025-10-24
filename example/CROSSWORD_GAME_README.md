# 🎯 Classic Crossword Puzzle Game

A modern, feature-rich crossword puzzle game built with React and TypeScript. Play classic crossword puzzles on any device with a beautiful, responsive interface.

## ✨ Features

### 🎮 Game Features

- **Multiple Puzzles**: Choose from easy, medium, and hard difficulty levels
- **Smart Hints**: Three hint options available
  - 📝 Reveal single letter
  - 📖 Reveal entire word
  - 🔓 Reveal complete puzzle
- **Progress Tracking**: Real-time progress bar and completion statistics
- **Timer**: Track your solve time
- **Auto-save**: Your progress is automatically saved locally

### 🎨 Modern UI

- **Dark/Light Mode**: Toggle between themes for comfortable playing
- **Responsive Design**: Works perfectly on phones, tablets, and desktop
- **Touch-Friendly**: Optimized for touch and mouse input
- **Celebration Animation**: Fun animation when you complete a puzzle
- **Activity Log**: Track your game events and corrections

### ♿ Accessibility

- **Keyboard Navigation**: Full keyboard support
- **ARIA Labels**: Screen reader friendly
- **High Contrast**: Works with system preferences
- **Focus Management**: Clear visual focus indicators

### 🔄 Progressive Web App (PWA)

- **Installable**: Add to your home screen on mobile or desktop
- **Offline Support**: Play even without internet connection
- **Fast Loading**: Service worker caching for instant loads
- **Cross-Device Sync**: Firebase integration (when logged in)

## 🚀 Getting Started

### Prerequisites

- Node.js 18.7.0 or higher
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd react-crossword-fork/example
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

4. Open your browser to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## 🎯 How to Play

1. **Select a Puzzle**: Choose your difficulty level (Easy, Medium, or Hard)
2. **Click a Puzzle Card**: Select which puzzle you want to play
3. **Solve the Crossword**:
   - Click on a cell to start typing
   - Click a clue to jump to that word
   - Use arrow keys to navigate
   - Use Tab to switch between across/down
4. **Use Hints** (optional):
   - Reveal Letter: Shows one letter in the current word
   - Reveal Word: Shows the entire current word
   - Reveal All: Shows the complete solution
5. **Complete the Puzzle**: Fill in all answers correctly to see your stats!

## 🎨 Customization

### Adding New Puzzles

Edit `src/puzzleData.ts` to add new puzzles:

```typescript
{
  id: 'your-puzzle-id',
  title: 'Your Puzzle Title',
  difficulty: 'easy', // or 'medium' or 'hard'
  author: 'Your Name',
  data: {
    across: {
      1: { clue: 'Your clue', answer: 'ANSWER', row: 0, col: 0 },
      // ... more clues
    },
    down: {
      1: { clue: 'Your clue', answer: 'ANSWER', row: 0, col: 0 },
      // ... more clues
    },
  },
}
```

### Theming

Modify the theme object in `App.tsx` to customize colors:

```typescript
const theme = {
  primaryColor: '#007bff',
  gridBackground: 'rgb(0,0,0)',
  cellBackground: 'rgb(255,255,255)',
  // ... more theme properties
};
```

## 🔥 Firebase Integration

The app includes Firebase setup for:

- User authentication (Google & Email)
- Progress synchronization across devices
- Cloud storage for puzzles

To enable Firebase features:

1. Set up a Firebase project
2. Add your Firebase config to `src/firebase/config.ts`
3. Enable Authentication and Firestore in your Firebase console

## 📱 PWA Installation

### On Mobile (iOS/Android)

1. Open the app in your browser
2. Tap the "Share" or "Menu" button
3. Select "Add to Home Screen"

### On Desktop (Chrome/Edge)

1. Look for the install icon in the address bar
2. Click "Install" to add to your desktop

## 🛠️ Technologies Used

- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe code
- **Styled Components**: CSS-in-JS styling
- **Firebase**: Authentication and database
- **Service Workers**: PWA capabilities
- **@jaredreisinger/react-crossword**: Core crossword component

## 📝 License

MIT License - feel free to use this for your own projects!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🙏 Acknowledgments

- Built on top of [@jaredreisinger/react-crossword](https://github.com/JaredReisinger/react-crossword)
- Inspired by classic newspaper crosswords
- Made with ❤️ for word puzzle enthusiasts

## 🐛 Known Issues

- Service worker may need manual refresh after updates
- Some mobile keyboards may overlay the grid (use landscape mode)

## 📧 Support

For questions or issues, please open an issue on GitHub.

---

Enjoy solving puzzles! 🎯✨
