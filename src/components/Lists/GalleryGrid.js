import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import LightBox from "../Overlay/LightBox";

const styles = () => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        /*justifyContent: 'space-around',*/
        overflow: 'hidden',
        backgroundColor: 'rgba(0,0,0,0)',
    },
    gridList: {
        width: 500,
        height: "auto",
        maxHeight: 600
    },
});


class GalleryGrid extends Component {

    state = {
        lightBox: false,
        showIndex: 0,
    };

    showImage = (i) => {
        this.setState({lightBox: true, showIndex: i})
    };


    changeImage = (i) => {
        this.setState(prev => ({
            showIndex:
                Math.max(
                    0,
                    Math.min(
                        this.props.images.length - 1,
                        prev.showIndex + i
                    )
                )
        }))
    };

    render() {
        const {classes, images} = this.props;
        const {lightBox, showIndex} = this.state;

        return (
            <>
                <LightBox open={lightBox} onClose={() => {
                    this.setState({lightBox: false, showIndex: 0})
                }} current={showIndex} changeImage={this.changeImage}
                          images={images.map(img => (
                              {image: img.img, alt: img.title}
                          ))}
                />

                <div className={classes.root}>
                    <GridList cellHeight={160} className={classes.gridList} cols={3}>

                        {images.map((tile, i) => (
                            <GridListTile key={i} cols={tile.cols || 1}>
                                <img className="pointer" src={tile.thumb} alt={tile.title} onClick={() => {
                                    this.showImage(i)
                                }}/>
                            </GridListTile>
                        ))}
                    </GridList>
                </div>
            </>
        );
    }


}

GalleryGrid.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GalleryGrid);