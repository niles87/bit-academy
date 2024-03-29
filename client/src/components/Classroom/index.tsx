import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import Peer, { SignalData } from "simple-peer";
import "./classroom.css";

const Video = (props: any): JSX.Element => {
  const ref = useRef<any>();
  useEffect(() => {
    props.peer.on("stream", (stream: MediaStream) => {
      ref.current.srcObject = stream;
    });
  }, []);

  return <video className="peerVideo" playsInline autoPlay ref={ref} />;
};

type peersRef = {
  peerID: string;
  peer: Peer.Instance;
};

type joined = {
  signal: SignalData;
  callerID: string;
};

export const Classroom = (props: any): JSX.Element => {
  const [peers, setPeers] = useState<any[]>([]);
  const socketRef = useRef<any>();
  const userVideo = useRef<any>();
  const peersRef = useRef<Array<peersRef>>([]);
  const { id: roomID } = useParams<"id">();

  useEffect(() => {
    const videoEl = userVideo.current;
    socketRef.current = io.connect("/");
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        videoEl.srcObject = stream;
        socketRef.current.emit("join room", roomID);
        socketRef.current.on("all users", (users: any) => {
          const peerArr: Peer.Instance[] = [];
          users.forEach((userID: string) => {
            const peer: Peer.Instance = createPeer(
              userID,
              socketRef.current.id,
              stream
            );
            peersRef.current.push({
              peerID: userID,
              peer,
            });
            peerArr.push(peer);
          });
          setPeers(peerArr);
        });

        socketRef.current.on("user joined", (payload: joined) => {
          const item: peersRef | undefined = peersRef.current.find(
            (p: peersRef) => p.peerID === payload.callerID
          );
          if (!item) {
            const peer: Peer.Instance = addPeer(
              payload.signal,
              payload.callerID,
              stream
            );
            peersRef.current.push({
              peerID: payload.callerID,
              peer,
            });

            setPeers((users) => [...users, peer]);
          }
        });

        socketRef.current.on("receiving returned signal", (payload: any) => {
          const item: peersRef | undefined = peersRef.current.find(
            (p: peersRef) => p.peerID === payload.id
          );
          if (item) item.peer.signal(payload.signal);
        });

        socketRef.current.on("user disconnect", (id: any) => {
          console.log("peerRef", peersRef.current);
          const peerObj = peersRef.current.find((p) => p.peerID === id);
          if (peerObj) peerObj.peer.destroy();

          const peersArr = peersRef.current.filter((p) => p.peerID !== id);
          peersRef.current = peersArr;
          setPeers(peersArr);
        });
      });
    return () => {
      const tracks = videoEl.srcObject.getTracks();
      socketRef.current.disconnect();
      tracks.forEach((track: MediaStreamTrack) => {
        track.stop();
      });
    };
  }, []);

  const createPeer = (
    userToSignal: string,
    callerID: string,
    stream: MediaStream
  ): Peer.Instance => {
    const peer: Peer.Instance = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal: SignalData) => {
      socketRef.current.emit("sending signal", {
        userToSignal,
        callerID,
        signal,
      });
    });

    return peer;
  };

  const addPeer = (
    incomingSignal: SignalData,
    callerID: string,
    stream: MediaStream
  ): Peer.Instance => {
    const peer: Peer.Instance = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal: SignalData) => {
      socketRef.current.emit("returning signal", { signal, callerID });
    });

    peer.signal(incomingSignal);

    return peer;
  };
  return (
    <div className="classroom">
      <div className="peerContainer">
        {peersRef.current.map((peer: any) => {
          return <Video key={peer.peerID} peer={peer.peer} />;
        })}
      </div>
      <video
        className="userVideo"
        muted
        ref={userVideo}
        autoPlay
        playsInline
      ></video>
    </div>
  );
};
