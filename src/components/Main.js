// require('normalize.css/normalize.css');
// require('styles/App.scss');
require("!style!css!sass!../styles/App.scss");

import React from 'react';

var imageData = require('../data/imageData.json');

// let yeomanImage = require('../images/yeoman.png');

imageData = (function getImageURL(imageDataArr){
    for(var i = 0, j = imageDataArr.length; i < j; i++){
        var singleImageData = imageDataArr[i];

        singleImageData.imgURL = require('../images/' + singleImageData.filename);

        imageDataArr[i] = singleImageData;
    }

    return imageDataArr;
})(imageData);

class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
          <section className="img-sec">
          </section>
          <nav className="controller-nav">
          </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
