let peerConnection;
let localStream;
let remoteStream;

let servers = {
    iceServers: [
        {
            urls: ['stun:stun1.1.google.com:19302', 'stun:stun2.1.google.com:19302']
        }
    ]
};

let init = async () => {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    document.getElementById('user-left').srcObject = localStream;
}

let createOffer = async () => {
    peerConnection = new RTCPeerConnection(servers);

    remoteStream = new MediaStream();
    document.getElementById('user-right').srcObject = remoteStream;

    // Add tracks from local stream to peer connection object
    localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream)

    });

    // If tracks added to peer connection, add them to remote stream
    peerConnection.ontrack = async (event) => {
        event.streams[0].getTracks().forEach(track => {
            remoteStream.addTrack(track);
        });
    }

    // Update offer sdp when ice candidate is generated
    peerConnection.onicecandidate = async (event) => {
        if (event.candidate) {
            fetch('http://localhost:5000/createoffer', {
                method: 'POST',
                body: JSON.stringify(peerConnection.localDescription),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    }

    let offer = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(offer)

    fetch('http://localhost:5000/createoffer', {
        method: 'POST',
        body: JSON.stringify(peerConnection.localDescription),
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

let createAnswer = async () => {
    peerConnection = new RTCPeerConnection(servers);

    remoteStream = new MediaStream();
    document.getElementById('user-right').srcObject = remoteStream;

    // Add tracks from local stream to peer connection object
    localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream)

    });

    // If tracks added to peer connection, add them to remote stream
    peerConnection.ontrack = async (event) => {
        event.streams[0].getTracks().forEach(track => {
            remoteStream.addTrack(track);
        });
    }

    // Update answer sdp when ice candidate is generated
    peerConnection.onicecandidate = async (event) => {
        if (event.candidate) {
            fetch('http://localhost:5000/createanswer', {
                method: 'POST',
                body: JSON.stringify(answer),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    }

    let response = await fetch('http://localhost:5000/getoffer', {
        method: 'GET',
    })
    if (!response.ok) {
        alert('Failed to get offer');
    }
    response = await response.json();
    await peerConnection.setRemoteDescription(response);

    let answer = await peerConnection.createAnswer()
    await peerConnection.setLocalDescription(answer)

    fetch('http://localhost:5000/createanswer', {
        method: 'POST',
        body: JSON.stringify(answer),
        headers: {
            'Content-Type': 'application/json'
        }
    });

}

let addAnswer = async () => {
    let response = await fetch('http://localhost:5000/getanswer', {
        method: 'GET',
    })
    if (!response.ok) {
        alert('Failed to get answer');
    }
    response = await response.json();

    if (!peerConnection.currentRemoteDescription) {
        peerConnection.setRemoteDescription(response);
    }
}

init();

document.getElementById('create-offer').addEventListener('click', createOffer);
document.getElementById('create-answer').addEventListener('click', createAnswer);
document.getElementById('add-answer').addEventListener('click', addAnswer);