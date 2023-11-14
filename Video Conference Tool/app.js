document.addEventListener('DOMContentLoaded', () => {
  const localVideo = document.getElementById('local-video');
  const remoteVideo = document.getElementById('remote-video');
  const startCallBtn = document.getElementById('start-call');
  const endCallBtn = document.getElementById('end-call');
  const inviteLinkInput = document.getElementById('invite-link');

  let localStream;
  let remoteStream;
  let rtcPeerConnection;

  const iceServers = [{ urls: 'stun:stun.l.google.com:19302' }];

  startCallBtn.addEventListener('click', startCall);
  endCallBtn.addEventListener('click', endCall);

  async function startCall() {
      try {
          localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          localVideo.srcObject = localStream;

          rtcPeerConnection = new RTCPeerConnection({ iceServers });

          // Add local stream to the connection
          localStream.getTracks().forEach(track => rtcPeerConnection.addTrack(track, localStream));

          // Set up event handlers for the connection
          rtcPeerConnection.onicecandidate = handleIceCandidate;
          rtcPeerConnection.ontrack = handleRemoteStreamAdded;

          // Create and send an offer to the other person
          const offer = await rtcPeerConnection.createOffer();
          await rtcPeerConnection.setLocalDescription(offer);

          // Display the invite link (you would typically send this to the other person)
          const inviteLink = btoa(JSON.stringify(offer));
          inviteLinkInput.value = window.location.href.split('?')[0] + '?offer=' + inviteLink;

          startCallBtn.disabled = true;
          endCallBtn.disabled = false;
      } catch (error) {
          console.error('Error accessing media devices:', error);
      }
  }

  function handleIceCandidate(event) {
      if (event.candidate) {
          // Code to send the local ICE candidate to the other person goes here
      }
  }

  function handleRemoteStreamAdded(event) {
      remoteVideo.srcObject = event.streams[0];
  }

  function endCall() {
      // Code to close the connection and notify the other person that the call has ended goes here

      localVideo.srcObject = null;
      remoteVideo.srcObject = null;

      startCallBtn.disabled = false;
      endCallBtn.disabled = true;
  }
});
