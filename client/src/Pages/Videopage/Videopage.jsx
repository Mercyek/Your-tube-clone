import React, { useEffect, useState } from 'react'
import VideoPlayer from '../../Component/VideoPlayer';
import "./Videopage.css"
import moment from 'moment'
import Likewatchlatersavebtns from './Likewatchlatersavebtns'
import { useParams, Link } from 'react-router-dom'
import Comment from '../../Component/Comment/Comment'
import { viewvideo } from '../../action/video'
import { addtohistory } from '../../action/history'
import { useSelector, useDispatch } from 'react-redux'

const Videopage = () => {
    const [videoSrc, setVideoSrc] = useState(null);
    const [vv, setVv] = useState(null); // vv is initially null
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);

    const { vid } = useParams();
    const dispatch = useDispatch();
    const vids = useSelector((state) => state.videoreducer);
    const currentuser = useSelector((state) => state.currentuserreducer);

    const handlePlay = () => {
        setIsVideoPlaying(true);
        setVideoSrc(`https://your-tube-clone-2oiv.onrender.com/${vv?.filepath}`);
    };

    const handleviews = () => {
        dispatch(viewvideo({ id: vid }));
    }

    const handlehistory = () => {
        dispatch(addtohistory({
            videoid: vid,
            viewer: currentuser?.result._id,
        }));
    }

    useEffect(() => {
        if (currentuser) {
            handlehistory();
        }
        handleviews();

        // Simulating data after fetching (replace with actual API call)
        setTimeout(() => {
            setVv({
                uploader: 'JohnDoe',
                filepath: 'C:/Users/Smart/react/youtube/client/src/Component/Video/video1.mp4',
                title: 'Video1',
                views: 1234,
                createdat: Date.now(),
                _id: '12345',  // Add the _id to avoid the error later
            });
        }, 2000);
    }, [currentuser, vid, dispatch]);

    return (
        <>
            <div>
                <h1>Video Player</h1>
            </div>
            {isVideoPlaying && vv && (
                <VideoPlayer
                    videoSrc={videoSrc}
                    onNextVideo={() => setVideoSrc('video2.mp4')}
                    onCloseWebsite={() => window.close()}
                    onShowComments={() => console.log('Showing comments')}
                />
            )}
            <div className="container_videoPage">
                <div className="container2_videoPage">
                    <div className="video_display_screen_videoPage">
                        {vv ? (
                            <video
                                src={`https://your-tube-clone-2oiv.onrender.com/${vv?.filepath}`}
                                className="video_ShowVideo_videoPage"
                                controls
                            ></video>
                        ) : (
                            <p>Loading video...</p> // Show loading text if vv is not set yet
                        )}
                        <div className="video_details_videoPage">
                            <div className="video_btns_title_VideoPage_cont">
                                <p className="video_title_VideoPage">{vv?.title || 'Loading...'}</p>
                                <div className="views_date_btns_VideoPage">
                                    <div className="views_videoPage">
                                        {vv?.views ? `${vv?.views} views` : 'Loading views'} <div className="dot"></div>{" "}
                                        {vv?.createdat ? moment(vv.createdat).fromNow() : 'Loading...'}
                                    </div>
                                   {vv && <Likewatchlatersavebtns vv={vv} vid={vid} />}
                                </div>
                            </div>
                            <Link to={'/'} className='chanel_details_videoPage'>
                                <b className="chanel_logo_videoPage">
                                    <p>{vv?.uploader?.charAt(0).toUpperCase() || '?'}</p>
                                </b>
                                <p className="chanel_name_videoPage">{vv?.uploader || 'Unknown'}</p>
                            </Link>
                            <div className="comments_VideoPage">
                                <h2><u>Comments</u></h2>
                                {vv?._id ? (
                                    <Comment videoid={vv._id} />
                                ) : (
                                    <p>Loading comments...</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="moreVideoBar">More videos</div>
                </div>
            </div>
        </>
    );
};

export default Videopage;
