:: Launch two clients
start index.html
start index.html

:: Launch signaling server
docker build -t signaling_server ./signaling_server
docker run -p 5000:5000 signaling_server
