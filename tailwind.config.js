/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit', 
  content: [
    "./*.html", // Scan HTML files in the root directory
    "./admin/**/*.html", // Scan HTML files in the admin directory
    "./**/*.html", // Scan HTML files in any subdirectory (for project/article detail pages)
    "./js/**/*.js", // Scan JS files if you dynamically add classes
  ],
  safelist: [
    'gap-[1px]','gap-[2px]','gap-[3px]','gap-[4px]', 'gap-[5px]', 'gap-[6px]','gap-[7px]','gap-[8px]','gap-[9px]','gap-[10px]','gap-[11px]','gap-[12px]','gap-[13px]','gap-[65px]', 'gap-[75px]',
    'mb-6',
    'bg-[#CDEDA2]',
    'text-black',
  ],
  theme: {
    extend: {
      colors: {
        
        'primary': '#CDEDA2',    // For buttons, highlighting texts and sections
        'secondary': '#F2EEE2',  // For intro write-up background, About page background
        'primary-background-dark': '#121212',
        'secondary-background-dark': '#262626', // Base background color
        'text-light': '#FFFFFF', // For texts, icons, dividing lines, text backgrounds for contrast
        'text-dark': '#000000',  // For texts and some icons
        'text-muted': '#A5A69D', // For some icons, placeholder texts and footer content
      },
      fontFamily: {
        sans: ['Audiowide', 'sans-serif'], // Set Audiowide as the default sans font
        
      }
    },
  },
  plugins: [
    
  ],
}