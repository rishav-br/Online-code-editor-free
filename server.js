const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Docker = require('dockerode');

const app = express();
const docker = new Docker();

app.use(cors());
app.use(bodyParser.json());

// Endpoint to execute code
app.post('/execute', async (req, res) => {
    const { language, code } = req.body;

    let dockerImage, command;

    // Map languages to Docker images and commands
    switch (language) {
        case 'python':
            dockerImage = 'python:3.9';
            command = ['python', '-c', code];
            break;
        case 'javascript':
            dockerImage = 'node:16';
            command = ['node', '-e', code];
            break;
        case 'java':
            dockerImage = 'openjdk:11';
            command = ['sh', '-c', `echo "${code}" > Main.java && javac Main.java && java Main`];
            break;
        case 'html':
            dockerImage = 'httpd:alpine'; // Using an HTTP server
            command = ['sh', '-c', `echo "${code}" > index.html && httpd -f -p 8080`];
            break;
        default:
            return res.status(400).json({ error: 'Unsupported language' });
    }

    try {
        const container = await docker.createContainer({
            Image: dockerImage,
            Cmd: command,
            Tty: false,
        });

        await container.start();
        const output = await container.wait();
        const logs = await container.logs({ stdout: true, stderr: true });

        await container.remove();
        res.json({ output: logs.toString() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
