// File created : 15-05-2019 14:43
import React, {Component} from 'react';
import ReactPlayer from "react-player";
import {Modal} from "@material-ui/core";
import {FaTimes} from "react-icons/fa";

class VideoModal extends Component {
    render() {

        const {videoPlaying, closeVideo, video} = this.props;

        return (
            <Modal className="animated fadeIn fast" open={videoPlaying} onClose={closeVideo}>
                <>
                    <div className="h2 pointer" onClick={closeVideo} style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px"
                    }}>
                        <FaTimes/>
                    </div>

                    <ReactPlayer className="react-player" playing={videoPlaying} controls={true} url={video}
                                 width='80%' height='80%' style={{marginLeft: "5.5%", marginTop: "3%"}}/>
                </>
            </Modal>
        );
    }
}

export default VideoModal;
