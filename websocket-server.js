const WebSocket = require('ws');
const pty = require('node-pty');
const os = require('os');

const wss = new WebSocket.Server({ host: '0.0.0.0', port: 3001 });

// 确定系统 Shell：Windows 用 powershell.exe, Unix 用 bash
const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';

console.log('🚀 Real Terminal Server started on ws://localhost:3000');

wss.on('connection', (ws) => {
    console.log('✅ Client connected to system shell');

    // 1. 创建真正的 PTY 进程
    const ptyProcess = pty.spawn(shell, [], {
        name: 'xterm-256color', // 支持 256 色
        cols: 80,
        rows: 24,
        cwd: process.env.HOME || process.cwd(),
        env: process.env
    });

    // 2. 将 PTY 输出发送给 WebSocket
    ptyProcess.on('data', (data) => {
        ws.send(data);
    });

    // 3. 接收 WebSocket 输入并写入 PTY
    ws.on('message', (message) => {
        const data = message.toString();
        
        // 特殊处理：如果是 JSON 格式，可能是 Resize 指令
        try {
            const parsed = JSON.parse(data);
            if (parsed.type === 'resize') {
                ptyProcess.resize(parsed.cols, parsed.rows);
                return;
            }
        } catch (e) {
            // 不是 JSON 则视为普通输入
            ptyProcess.write(data);
        }
    });

    ws.on('close', () => {
        console.log('❌ Client disconnected');
        ptyProcess.kill();
    });
});
