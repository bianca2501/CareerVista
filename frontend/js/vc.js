const localVideo = document.querySelector('#local-video video');
const remoteVideo = document.querySelector('#remote-video video');
let localStream;
let peerConnection;
const signalingServerUrl = 'ws://localhost:3000'; // Change to your signaling server URL
const signalingSocket = new WebSocket(signalingServerUrl);
const counselorId = 'counselor_id'; // Replace with actual counselor ID
const studentId = 'student_id'; // Replace with actual student ID

signalingSocket.onopen = () => {
    signalingSocket.send(JSON.stringify({ type: 'register', id: studentId })); // Register student
};

signalingSocket.onmessage = async (message) => {
    const data = JSON.parse(message.data);
    
    if (data.type === 'signal') {
        handleSignal(data.signal, data.fromId);
    } else if (data.type === 'chat') {
        const chatMessages = document.getElementById('chat-messages');
        const messageElement = document.createElement('p');
        messageElement.textContent = `${data.fromId}: ${data.message}`; // Indicate sender
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to the bottom
    }
};

async function startLocalVideo() {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideo.srcObject = localStream;
    localVideo.play();

    peerConnection = new RTCPeerConnection();

    localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
    });

    peerConnection.ontrack = (event) => {
        remoteVideo.srcObject = event.streams[0];
    };

    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            signalingSocket.send(JSON.stringify({
                type: 'signal',
                targetId: counselorId, // Send to counselor
                fromId: studentId,
                signal: { ice: event.candidate }
            }));
        }
    };

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    signalingSocket.send(JSON.stringify({
        type: 'signal',
        targetId: counselorId, // Send to counselor
        fromId: studentId,
        signal: { sdp: offer }
    }));
}

async function handleSignal(signal, fromId) {
    if (signal.sdp) {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(signal.sdp));
        if (signal.sdp.type === 'offer') {
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            signalingSocket.send(JSON.stringify({
                type: 'signal',
                targetId: fromId,
                fromId: studentId,
                signal: { sdp: answer }
            }));
        }
    } else if (signal.ice) {
        await peerConnection.addIceCandidate(new RTCIceCandidate(signal.ice));
    }
}

// Mute and camera toggle functionality
document.getElementById('mute-button').addEventListener('click', function() {
    localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled; // Mute/unmute
        this.textContent = track.enabled ? 'Mute' : 'Unmute';
    });
});

document.getElementById('camera-button').addEventListener('click', function() {
    localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled; // Turn off/on camera
        this.textContent = track.enabled ? 'Turn Off Camera' : 'Turn On Camera';
    });
});

// End call functionality
document.getElementById('end-call-button').addEventListener('click', function() {
    localStream.getTracks().forEach(track => track.stop()); // Stop all tracks
    if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
    }
});

// Chat functionality
document.getElementById('send-button').addEventListener('click', function() {
    const message = document.getElementById('chat-input').value;
    if (message) {
        const chatMessages = document.getElementById('chat-messages');
        const messageElement = document.createElement('p');
        messageElement.textContent = `You: ${message}`; // Indicate the sender
        chatMessages.appendChild(messageElement);
        document.getElementById('chat-input').value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Send the message via WebSocket to the counselor
        signalingSocket.send(JSON.stringify({
            type: 'chat',
            message: message,
            targetId: counselorId, // Send to the counselor's ID
            fromId: studentId // Your ID
        }));
    }    
});

window.addEventListener('load', startLocalVideo);
