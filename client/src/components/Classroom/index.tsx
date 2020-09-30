import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";

const Video = (props: any) => {
  const ref = useRef<any>();
  useEffect(() => {
    props.peer.on("stream", (stream: MediaStream) => {
      ref.current.srcObject = stream;
    });
  }, []);

  return <video playsInline autoPlay ref={ref} />;
};

export const Classroom = (props: any) => {
  const roomID = props.match.params.roomId;
  const [peers, setPeers] = useState<any[]>([]);
  const socketRef = useRef<any>();
  const userVideo = useRef<any>();
  const peersRef = useRef<any[]>([]);

  useEffect(() => {
    socketRef.current = io.connect("/");
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream: MediaStream) => {
        userVideo.current.srcObject = stream;
        socketRef.current.emit("join room", roomID);
        socketRef.current.on("all users", (users: any) => {
          const user: any[] = [];
          users.forEach((userID: any) => {
            const peer = createPeer(userID, socketRef.current.id, stream);
            peersRef.current.push({
              peerID: userID,
              peer,
            });
            user.push(peer);
            console.log(user);
          });
          setPeers(user);
        });

        socketRef.current.on("user joined", (payload: any) => {
          const peer = addPeer(payload.signal, payload.callerID, stream);
          peersRef.current.push({
            peerID: payload.callerID,
            peer,
          });

          setPeers((users: any) => [...users, peer]);
        });

        socketRef.current.on("receiving returned signal", (payload: any) => {
          const item = peersRef.current.find(
            (p: any) => p.peerID === payload.id
          );
          item.peer.signal(payload.signal);
        });
      });
  }, []);

  function createPeer(userToSignal: any, callerID: any, stream: MediaStream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("sending signal", {
        userToSignal,
        callerID,
        signal,
      });
    });

    return peer;
  }

  function addPeer(incomingSignal: any, callerID: any, stream: MediaStream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal: any) => {
      socketRef.current.emit("returning signal", { signal, callerID });
    });

    peer.signal(incomingSignal);

    return peer;
  }

  return (
    <>
      <video muted ref={userVideo} autoPlay playsInline></video>
      {peers.map((peer: any, index: number) => {
        return <Video key={index} peer={peer} />;
      })}
    </>
  );
};
// export const Classroom = (props:any) => {
//   const { data, loading } = useQuery(QUERY);
//   const [yourId, setYourId] = useState("");
//   const [users, setUsers] = useState<any>({});
//   const [stream, setStream] = useState<MediaStream | undefined>();
//   const [receivingCall, setReceivingCall] = useState(false);
//   const [caller, setCaller] = useState("");
//   const [callerSignal, setCallerSignal] = useState<any>();
//   const [callAccepted, setCallAccepted] = useState<Boolean>(false);

//   const userVideo = useRef<any>();
//   const partnerVideo = useRef<any>();
//   const socket = useRef<any>();

//   useEffect(() => {
//     socket.current = io.connect("/");
//     navigator.mediaDevices
//       .getUserMedia({ video: true, audio: true })
//       .then((stream: MediaStream) => {
//         setStream(stream);
//         if (userVideo.current) {
//           userVideo.current.srcObject = stream;
//         }
//       });

//     socket.current.on("yourID", (id: string) => {
//       setYourId(id);
//     });

//     socket.current.on("allUsers", (users: any) => {
//       setUsers(users);
//     });

//     socket.current.on("hey", (data: any) => {
//       setReceivingCall(true);
//       setCaller(data.from);
//       setCallerSignal(data.signal);
//     });
//   }, []);

//   const callPeer = (id: string) => {
//     const peer = new Peer({
//       initiator: true,
//       trickle: false,
//       stream: stream,
//     });

//     peer.on("signal", (data) => {
//       socket.current.emit("callUser", {
//         userToCall: id,
//         signalData: data,
//         from: yourId,
//       });
//     });
//     peer.on("stream", (stream) => {
//       if (partnerVideo.current) {
//         partnerVideo.current.srcObject = stream;
//       }
//     });

//     socket.current.on("callAccepted", (signal: any) => {
//       setCallAccepted(true);
//       peer.signal(signal);
//     });
//   };

//   const acceptCall = () => {
//     setCallAccepted(true);
//     const peer = new Peer({
//       initiator: false,
//       trickle: false,
//       stream: stream,
//     });
//     peer.on("signal", (data) => {
//       socket.current.emit("acceptCall", { signal: data, to: caller });
//     });

//     peer.on("stream", (stream) => {
//       partnerVideo.current.srcObject = stream;
//     });

//     peer.signal(callerSignal);
//   };

//   const endCall = () => {
//     setReceivingCall(false);
//     setCallAccepted(false);
//   };

//   let UserVideo;
//   if (stream) {
//     UserVideo = (
//       <video id="uservideo" playsInline muted ref={userVideo} autoPlay />
//     );
//   }

//   let PartnerVideo, HangUp;
//   if (callAccepted) {
//     PartnerVideo = (
//       <video id="partnervideo" playsInline ref={partnerVideo} autoPlay />
//     );
//     HangUp = <button onClick={endCall}>Hang Up</button>;
//   }

//   let incomingCall;
//   if (receivingCall) {
//     incomingCall = (
//       <div>
//         <span>You have an incoming call</span>
//         <button onClick={acceptCall}>Accept</button>
//       </div>
//     );
//   }

//   if (!data) return <h1>You need to be logged in for this</h1>;
//   if (loading) return <h2>Loading</h2>;

//   return (
//     <div>
//       <div>
//         {UserVideo}
//         {PartnerVideo}
//       </div>
//       <div>
//         {Object.keys(users).map((key) => {
//           if (key === yourId) return null;
//           return (
//             <button key={key} onClick={() => callPeer(key)}>
//               Call {}
//             </button>
//           );
//         })}
//       </div>
//       <div>
//         {incomingCall}
//         {HangUp}
//       </div>
//     </div>
//   );
// };
