import { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import 'xterm/css/xterm.css';

const MATRIX_CHARS = '日ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ012345789Z:・.";=*+-<>¦｜╌';
const MATRIX_COLORS = ['\x1b[32m', '\x1b[92m']; // Green shades

const TerminalComponent = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const terminal = useRef<Terminal | null>(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      if (!terminalRef.current || terminal.current) return;

      // Essential command variables
      const startTime = Date.now();
      const currentDirectory = '/home/rafata/portfolio';
      const files = [
        'about.txt',
        'skills.txt', 
        'projects.txt',
        'contact.txt',
        'resume.txt',
        'experience.txt',
        'README.md'
      ];

      terminalRef.current.tabIndex = 0;

      const term = new Terminal({
        cursorBlink: true,
        fontSize: 14,
        fontFamily: 'Menlo, Monaco, "Courier New", monospace',
        rows: 20,
        cols: 80,
        convertEol: true,
        theme: {
          background: '#1a1b26',
          foreground: '#a9b1d6',
          cursor: '#c0caf5'
        }
      });

      const fitAddon = new FitAddon();
      const webLinksAddon = new WebLinksAddon();
      term.loadAddon(fitAddon);
      term.loadAddon(webLinksAddon);
      term.open(terminalRef.current);

      setTimeout(() => {
        fitAddon.fit();
        terminalRef.current?.focus();
      }, 0);

      terminal.current = term;

      let commandHistory: string[] = [];
      let historyIndex = 0;
      let currentLine = '';
      let cursorPosition = 0;
      const prompt = '$ ';

      const writePrompt = () => {
        term.write(prompt);
      };

      const clearLine = () => {
        term.write('\x1b[2K\r'); // Clear current line
        writePrompt();
        term.write(currentLine); // Write current input
        if (suggestion) {
          term.write('\x1b[90m' + suggestion + '\x1b[0m'); // 90m is bright black/gray
        }
        // Move cursor back to the end of currentLine
        term.write(`\x1b[${currentLine.length - cursorPosition + (suggestion ? suggestion.length : 0)}D`);
      };

      term.writeln('\x1b[1;36mWelcome to Rafata\'s Interactive Terminal!\x1b[0m');
      term.writeln('Type \x1b[1;32mhelp\x1b[0m to see available commands.\n');
      writePrompt();

      const availableCommands = [
        'help', 'about', 'skills', 'projects', 'contact', 'refresh', 'clear',
        'whoami', 'pwd', 'ls', 'cat', 'history', 'date', 'uptime', 'theme', 'fontsize', 'fullscreen', 'download',
        'hack', 'matrix', 'scan', 'encrypt', 'decode', 'ping', 'nmap', 'exit', 'cb'
      ];
      let suggestion = ''; // Stores the ghost text part of the suggestion

      const updateSuggestion = () => {
        // Ambil prefix sebelum spasi pertama (untuk command utama)
        const trimmedLine = currentLine.trim();
        if (trimmedLine.length === 0) {
          suggestion = '';
          return;
        }
        // Cek suggestion hanya untuk command utama (bukan argumen)
        const firstWord = trimmedLine.split(' ')[0].toLowerCase();
        const match = availableCommands.find(cmd =>
          cmd.startsWith(firstWord) && cmd !== firstWord
        );
        if (match) {
          // Tampilkan sisa kata pada posisi kursor jika kursor masih di firstWord
          if (cursorPosition <= firstWord.length) {
            suggestion = match.slice(cursorPosition);
          } else {
            suggestion = '';
          }
        } else {
          suggestion = '';
        }
      };

      term.onKey(({ key, domEvent }) => {
        const ev = domEvent as KeyboardEvent;
        const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;

        if (ev.keyCode === 13) { // Enter
          const command = currentLine.trim();
          if (command) {
            commandHistory.push(command);
            historyIndex = commandHistory.length;
          }
          term.writeln('');
          handleCommand(command);
          currentLine = '';
          cursorPosition = 0;
          suggestion = '';
          writePrompt();
        } else if (ev.keyCode === 8) { // Backspace
          if (cursorPosition > 0) {
            currentLine =
              currentLine.slice(0, cursorPosition - 1) +
              currentLine.slice(cursorPosition);
            cursorPosition--;
            updateSuggestion();
            clearLine();
          }
        } else if (ev.keyCode === 37) { // Left arrow
          if (cursorPosition > 0) {
            cursorPosition--;
            term.write(key);
          }
        } else if (ev.keyCode === 39) { // Right arrow
          if (suggestion) {
            currentLine += suggestion;
            cursorPosition = currentLine.length;
            suggestion = '';
            clearLine();
          } else if (cursorPosition < currentLine.length) {
            cursorPosition++;
            term.write(key);
          }
        } else if (ev.keyCode === 38) { // Up arrow
          if (historyIndex > 0) {
            historyIndex--;
            currentLine = commandHistory[historyIndex];
            cursorPosition = currentLine.length;
            updateSuggestion();
            clearLine();
          }
        } else if (ev.keyCode === 40) { // Down arrow
          if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            currentLine = commandHistory[historyIndex];
            cursorPosition = currentLine.length;
            updateSuggestion();
            clearLine();
          } else if (historyIndex === commandHistory.length - 1) {
            historyIndex++;
            currentLine = '';
            cursorPosition = 0;
            clearLine();
          }
        } else if (printable && !ev.key.includes('Arrow')) {
          currentLine =
            currentLine.slice(0, cursorPosition) +
            key +
            currentLine.slice(cursorPosition);
          cursorPosition++;
          updateSuggestion(); // Tambahkan ini agar shadow muncul saat mengetik
          clearLine();
        }
      });

      // Helper function for theme switching
      const applyTheme = (themeName: string) => {
        const themes = {
          dark: { background: '#1a1b26', foreground: '#a9b1d6', cursor: '#c0caf5' },
          light: { background: '#ffffff', foreground: '#333333', cursor: '#007acc' },
          matrix: { background: '#000000', foreground: '#00ff00', cursor: '#00ff00' },
          cyberpunk: { background: '#0f0f23', foreground: '#ff00ff', cursor: '#ffff00' }
        };
        const selectedTheme = themes[themeName as keyof typeof themes];
        term.options.theme = selectedTheme;
        term.refresh(0, term.rows - 1);
      };

      const protectedCommands = new Set([
        'hack',
        'matrix',
        'scan',
        'encrypt',
        'decode',
        'ping',
        'nmap',
        'exit'
      ]);

      // Updated handleCommand to accept args and cmd string
      const handleCommand = (raw: string) => {
        const parts = raw.trim().split(/\s+/);
        const isSudo = parts[0] === 'sudo';
        const cmdName = isSudo ? parts[1] : parts[0];
        const args = parts.slice(isSudo ? 2 : 1);

        // Deny if it's protected but not prefixed with sudo
        if (protectedCommands.has(cmdName) && !isSudo) {
          term.writeln('\x1b[1;31mPermission denied\x1b[0m');
          return;
        }

        switch (cmdName?.toLowerCase()) {
          case 'help':
            term.writeln('\x1b[1;32mAvailable commands:\x1b[0m');
            term.writeln('  \x1b[1;34mwhoami\x1b[0m    - Display current user info');
            term.writeln('  \x1b[1;34mpwd\x1b[0m       - Show current directory');
            term.writeln('  \x1b[1;34mls\x1b[0m        - List available files');
            term.writeln('  \x1b[1;34mcat\x1b[0m       - Display file content (cat <filename>)');
            term.writeln('  \x1b[1;34mhistory\x1b[0m   - Show command history');
            term.writeln('  \x1b[1;34mdate\x1b[0m      - Display current date/time');
            term.writeln('  \x1b[1;34muptime\x1b[0m    - Show portfolio uptime');
            term.writeln('  \x1b[1;34mabout\x1b[0m     - Show information about me');
            term.writeln('  \x1b[1;34mskills\x1b[0m    - List my technical skills');
            term.writeln('  \x1b[1;34mprojects\x1b[0m  - View my projects');
            term.writeln('  \x1b[1;34mcontact\x1b[0m   - Get contact information');
            term.writeln('  \x1b[1;34mrefresh\x1b[0m   - Refresh the page');
            term.writeln('  \x1b[1;34mtheme\x1b[0m     - Change terminal theme');
            term.writeln('  \x1b[1;34mfontsize\x1b[0m  - Adjust font size');
            term.writeln('  \x1b[1;34mfullscreen\x1b[0m- Toggle fullscreen');
            term.writeln('  \x1b[1;34mdownload\x1b[0m  - Download your cv or resume');
            term.writeln('  \x1b[1;34mclear\x1b[0m     - Clear terminal');
            break;

          // Easter-egg commands (require sudo)
          case 'hack':
            term.writeln('Simulating hack sequence… \x1b[1;32m[OK]\x1b[0m');
            break;
          case 'matrix':
            term.writeln('Entering the Matrix…');
            startMatrixAnimation(term); // Panggil fungsi animasi di sini
            break;
          case 'scan':
            term.writeln('Scanning network… \x1b[1;32mComplete\x1b[0m');
            break;
          case 'encrypt':
            term.writeln('Encrypted data: 4d79536563726574');
            break;
          case 'decode':
            term.writeln('Decoded text: MySecret');
            break;
          case 'ping':
            term.writeln('Pinging 8.8.8.8… \x1b[1;32mReply from 8.8.8.8: bytes=32 time=14ms TTL=117\x1b[0m');
            break;
          case 'nmap':
            term.writeln('Nmap scan report for localhost\nPORT    STATE SERVICE\n22/tcp  open  ssh\n80/tcp  open  http');
            break;
          case 'exit':
            term.writeln('\x1b[1;33mClosing terminal…\x1b[0m');
            setTimeout(() => window.close(), 500);
            break;

          case 'cb':
            term.writeln('\x1b[1;36mCybersecurity Interactive Commands:\x1b[0m');
            term.writeln('  \x1b[1;34mmatrix\x1b[0m   - Matrix-style effect');
            term.writeln('  \x1b[1;34mhack\x1b[0m     - Simulate a hacking sequence');
            term.writeln('  \x1b[1;34mscan\x1b[0m     - Fake network scan');
            term.writeln('  \x1b[1;34mencrypt\x1b[0m  - Base64 encrypt text');
            term.writeln('  \x1b[1;34mdecode\x1b[0m   - Base64 decode text');
            term.writeln('  \x1b[1;34mping\x1b[0m     - Simulate ping command');
            term.writeln('  \x1b[1;34mnmap\x1b[0m     - Fake nmap port scan');
            term.writeln('  \x1b[1;34mexit\x1b[0m     - Exit the browser');
            writePrompt();
            break;


          case 'whoami':
            term.writeln('\x1b[1;35mrafata\x1b[0m');
            term.writeln('User: Rafata Alfatih');
            term.writeln('Role: Cybersecurity Specialist & Cyber Deconstructor');
            term.writeln('Status: Online and ready to secure your systems!');
            break;

          case 'pwd':
            term.writeln(`\x1b[1;36m${currentDirectory}\x1b[0m`);
            break;

          case 'ls':
            term.writeln('\x1b[1;32mFiles in current directory:\x1b[0m');
            files.forEach(file => {
              const color = file.endsWith('.txt') ? '\x1b[1;33m' : '\x1b[1;36m';
              term.writeln(`${color}${file}\x1b[0m`);
            });
            break;

          case 'cat':
            if (args.length === 0) {
              term.writeln('\x1b[1;31mUsage: cat <filename>\x1b[0m');
              term.writeln('Available files: ' + files.join(', '));
            } else {
              const filename = args[0];
              if (!files.includes(filename)) {
                term.writeln(`\x1b[1;31mcat: ${filename}: No such file or directory\x1b[0m`);
              } else {
                handleCatCommand(filename);
              }
            }
            break;

          case 'history':
            term.writeln('\x1b[1;32mCommand History:\x1b[0m');
            commandHistory.forEach((cmd, index) => {
              term.writeln(`${index + 1}  ${cmd}`);
            });
            break;

          case 'date':
            const now = new Date();
            term.writeln(`\x1b[1;33m${now.toLocaleString()}\x1b[0m`);
            break;

          case 'uptime':
            const uptime = Math.floor((Date.now() - startTime) / 1000);
            const minutes = Math.floor(uptime / 60);
            const seconds = uptime % 60;
            term.writeln(`\x1b[1;32mPortfolio uptime: ${minutes}m ${seconds}s\x1b[0m`);
            term.writeln('System load: Optimized for maximum security! 🔒');
            break;

          case 'about':
            term.writeln('\x1b[1;35mRafata Alfatih\x1b[0m');
            term.writeln('Cybersecurity Specialist & Cyber Deconstructor');
            term.writeln('Breaking down barriers between security and innovation');
            break;

          case 'skills':
            term.writeln('\x1b[1;33mTechnical Skills:\x1b[0m');
            term.writeln('• Cybersecurity Analysis');
            term.writeln('• Penetration Testing');
            term.writeln('• Network Security');
            term.writeln('• Reverse Engineering');
            term.writeln('• Python, JavaScript, TypeScript');
            term.writeln('• React, Next.js, Node.js');
            break;

          case 'projects':
            term.writeln('\x1b[1;36mFeatured Projects:\x1b[0m');
            term.writeln('• Career Compass - Job matching platform');
            term.writeln('• Crime Dashboard - AI-powered crime analytics');
            term.writeln('• Security Risk Management - Centralized security platform');
            term.writeln('• Digital Forensic Analysis - Operation Rembrandt investigation');
            break;

          case 'contact':
            term.writeln('\x1b[1;32mContact Information:\x1b[0m');
            term.writeln('Email: rafataalfatih55@gmail.com');
            term.writeln('GitHub: github.com/GitVerseRALF');
            term.writeln('LinkedIn: linkedin.com/in/rafata-alfatih');
            break;

          case 'refresh':
            term.writeln('\x1b[1;33mRefreshing page...\x1b[0m');
            setTimeout(() => {
              window.location.reload();
            }, 1000);
            break;

          case 'theme': {
            const themeArgs = raw.split(' ');
            if (themeArgs.length < 2) {
              term.writeln('\x1b[1;33mAvailable themes:\x1b[0m dark, light, matrix, cyberpunk');
              term.writeln('Usage: theme <theme_name>');
            } else {
              const themeName = themeArgs[1].toLowerCase();
              const themes = ['dark', 'light', 'matrix', 'cyberpunk'];
              if (themes.includes(themeName)) {
                term.writeln(`\x1b[1;32mSwitching to ${themeName} theme...\x1b[0m`);
                applyTheme(themeName);
              } else {
                term.writeln(`\x1b[1;31mTheme '${themeName}' not found\x1b[0m`);
              }
            }
            break;
          }

          case 'fontsize': {
            const fontArgs = raw.split(' ');
            let currentSize = term.options.fontSize || 14;
            let newSize = currentSize;

            if (fontArgs.length < 2) {
              term.writeln('Usage: fontsize <size|default|bigger|smaller> (10-20)');
            } else {
              const arg = fontArgs[1].toLowerCase();
              if (arg === 'default') {
                newSize = 14;
              } else if (arg === 'bigger') {
                newSize = Math.min(currentSize + 2, 20);
              } else if (arg === 'smaller') {
                newSize = Math.max(currentSize - 2, 10);
              } else if (!isNaN(Number(arg))) {
                const size = parseInt(arg);
                if (size >= 10 && size <= 20) {
                  newSize = size;
                } else {
                  term.writeln('\x1b[1;31mFont size must be between 10-20\x1b[0m');
                  break;
                }
              } else {
                term.writeln('Usage: fontsize <size|default|bigger|smaller> (10-20)');
                break;
              }
              term.options.fontSize = newSize;
              fitAddon.fit();
              term.writeln(`\x1b[1;32mFont size set to ${newSize}px\x1b[0m`);
            }
            break;
          }

          case 'fullscreen':
            term.writeln('\x1b[1;33mToggling fullscreen mode...\x1b[0m');
            if (!document.fullscreenElement) {
              terminalRef.current?.requestFullscreen();
            } else {
              document.exitFullscreen();
            }
            break;

          case 'download': {
            // FIX: Ganti 'cmd' menjadi 'raw'
            const parts = raw.trim().split(/\s+/);

            // If no second argument, show choices
            if (parts.length === 1) {
              term.writeln('\x1b[1;33mAvailable downloads:\x1b[0m cv, resume');
              term.writeln('Usage: download <cv|resume>');
            } else {
              const choice = parts[1].toLowerCase();
              if (choice === 'cv') {
                term.writeln('\x1b[1;32mDownloading CV (PDF)...\x1b[0m');
                const a = document.createElement('a');
                a.href = '/CV2.pdf'; // Pastikan file ada di folder /public/CV2.pdf
                a.download = 'Rafata_Alfatih_CV.pdf';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              } else if (choice === 'resume') {
                term.writeln('\x1b[1;32mDownloading Resume (TXT)...\x1b[0m');
                const resumeText = `RAFATA ALFATIH
Cybersecurity Specialist & Cyber Deconstructor
Email: rafataalfatih55@gmail.com
GitHub: github.com/GitVerseRALF
...`;
                const blob = new Blob([resumeText], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'Rafata_Alfatih_Resume.txt';
                document.body.appendChild(a);
                a.click();
                URL.revokeObjectURL(url);
                document.body.removeChild(a);
              } else {
                term.writeln(`\x1b[1;31mUnknown option: ${choice}\x1b[0m`);
                term.writeln('Usage: download <cv|resume>');
              }
            }
          }
          break;

          case 'clear':
            term.clear();
            break;

          // --- Fun/Interactive Commands ---
          case 'matrix':
            for (let i = 0; i < 30; i++) {
              const line = Array(80)
                .fill(0)
                .map(() => String.fromCharCode(0x30A0 + (Math.random() * 96 | 0)))
                .join('');
              term.writeln(`\x1b[32m${line}\x1b[0m`);
            }
            break;

          case 'hack':
            term.writeln('Initializing hack sequence...');
            ['Accessing target', 'Bypassing firewall', 'Extracting data', 'Done'].forEach((step, idx) => {
              setTimeout(() => term.writeln(`> ${step}`), idx * 500);
            });
            break;
          case 'scan':
            term.writeln('Starting network scan:');
            ['192.168.0.1', '192.168.0.5', '192.168.0.10'].forEach((ip, i) => {
              setTimeout(() => term.writeln(`- Host ${ip} is ${Math.random() < 0.5 ? 'open' : 'closed'}`), i * 300);
            });
            break;

          // Regex-based commands for encrypt, decode, ping
          default:
            if (raw.match(/^encrypt\s+/)?.input?.startsWith('encrypt')) {
              const text = raw.replace(/^encrypt\s+/, '');
              const enc = Buffer.from(text).toString('base64');
              term.writeln(`Encrypted: ${enc}`);
              break;
            }
            if (raw.match(/^decode\s+/)?.input?.startsWith('decode')) {
              const text = raw.replace(/^decode\s+/, '');
              try {
                const dec = Buffer.from(text, 'base64').toString('utf8');
                term.writeln(`Decoded: ${dec}`);
              } catch {
                term.writeln('Error: invalid base64');
              }
              break;
            }
            if (raw.match(/^ping\s+/)?.input?.startsWith('ping')) {
              const host = raw.replace(/^ping\s+/, '');
              term.writeln(`Pinging ${host} with 32 bytes of data:`);
              [20, 25, 30].forEach((ms, i) => {
                setTimeout(() => term.writeln(`Reply from ${host}: bytes=32 time=${ms}ms TTL=64`), i * 400);
              });
              break;
            }
            if (raw.toLowerCase().startsWith('nmap')) {
              term.writeln('Starting Nmap 7.80 scan:');
              ['80/tcp open  http', '22/tcp closed ssh', '443/tcp open  https'].forEach((l, i) => {
                setTimeout(() => term.writeln(`Host: 192.168.0.1  ${l}`), i * 400);
              });
              break;
            }

            term.writeln(`\x1b[1;31mCommand not found: ${raw}\x1b[0m`);
            term.writeln('Type \x1b[1;32mhelp\x1b[0m to see available commands.');
        }
      };

      // handleCatCommand function
      const handleCatCommand = (filename: string) => {
        switch(filename) {
          case 'about.txt':
            term.writeln('\x1b[1;35m=== ABOUT RAFATA ALFATIH ===\x1b[0m');
            term.writeln('Cybersecurity Specialist & Cyber Deconstructor');
            term.writeln('Breaking down barriers between security and innovation');
            break;
          case 'skills.txt':
            term.writeln('\x1b[1;33m=== TECHNICAL SKILLS ===\x1b[0m');
            term.writeln('Cybersecurity: Analysis, Penetration Testing, Network Security');
            term.writeln('Programming: Python, JavaScript, TypeScript, Java, C++');
            break;
          case 'projects.txt':
            term.writeln('\x1b[1;36m=== FEATURED PROJECTS ===\x1b[0m');
            term.writeln('1. Career Compass - Job matching platform');
            term.writeln('2. Crime Dashboard - AI-powered crime analytics');
            break;
          case 'contact.txt':
            term.writeln('\x1b[1;32m=== CONTACT INFORMATION ===\x1b[0m');
            term.writeln('Email: rafataalfatih55@gmail.com');
            term.writeln('GitHub: github.com/GitVerseRALF');
            break;
          case 'resume.txt':
            term.writeln('\x1b[1;34m=== RESUME SUMMARY ===\x1b[0m');
            term.writeln('Education: BSc Computing, President University');
            term.writeln('Experience: Multiple cybersecurity internships');
            break;
          case 'experience.txt':
            term.writeln('\x1b[1;35m=== WORK EXPERIENCE ===\x1b[0m');
            term.writeln('• TATA - Cybersecurity Analyst (2025)');
            term.writeln('• Datacom - Cybersecurity Consultant (2025)');
            break;
          case 'README.md':
            term.writeln('\x1b[1;36m=== PORTFOLIO README ===\x1b[0m');
            term.writeln('Welcome to my interactive portfolio terminal!');
            term.writeln('Type "help" for a full list of commands.');
            break;
        }
      };

      const startMatrixAnimation = (term: Terminal) => {
        let animationFrame: number;
        let columns: number[] = [];
        const rows = term.rows;
        const cols = term.cols;

        for (let i = 0; i < cols; i++) {
          columns[i] = 0;
        }

        const drawMatrix = () => {
        for (let col = 0; col < cols; col++) {
            if (columns[col] > 0) {
                const color = MATRIX_COLORS[Math.floor(Math.random() * MATRIX_COLORS.length)];
                const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
                term.write(`\x1b[${columns[col]};${col + 1}H${color}${char}\x1b[0m`);
                if (columns[col] >= rows) {
                    columns[col] = 0;
                } else {
                    columns[col]++;
                }
            } else if (Math.random() < 0.02) {
                columns[col] = 1;
            }
        }
        animationFrame = requestAnimationFrame(drawMatrix);
    };

    term.clear();
    drawMatrix();

        setTimeout(() => {
          cancelAnimationFrame(animationFrame);
          term.write('\x1b[H\x1b[J');
          term.writeln('\x1b[1;32mMatrix simulation complete.\x1b[0m');
          writePrompt(); 
}, 10000);
      };

      const handleResize = () => {
        fitAddon.fit();
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        term.dispose();
      };
    });
  }, []);

  return (
    <div 
      ref={terminalRef} 
      className="h-[500px] w-full max-w-full rounded-lg overflow-hidden shadow-xl border border-gray-700 focus:outline-none"
      onClick={() => terminalRef.current?.focus()}
    />
  );
};

export default TerminalComponent;
