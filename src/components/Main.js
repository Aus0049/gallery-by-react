require('normalize.css/normalize.css');
require('styles/App.scss');

//加载主要对象
import React from 'react';
import ReactDOM from 'react-dom';

//加载图片数据
var imageDatas = require('../data/imageData.js');

//处理图片数据，使其可以接近使用
imageDatas = (function getImageURL(imageDataArr){
    for(var i = 0; i < imageDataArr.length; i++){
        var singleImageData = imageDataArr[i];

        singleImageData.imgURL = require('../images/' + singleImageData.filename);

        imageDataArr[i] = singleImageData;
    }

    return imageDataArr;
})(imageDatas);

//每个图片是一个类
var ImgFigure = React.createClass({

    handleClick:function(e){

        if(this.props.arrange.isCenter){
            this.props.inverse();
        }else {
            this.props.center();
        }
        

        e.stopPropagation();
        e.preventDefault();

    },

    render: function(){

        //渲染位置
        var styleObj = {};

        if(this.props.arrange.style){
            styleObj = this.props.arrange.style;
        }

        //处理浏览器兼容前缀
        if(this.props.arrange.transform){
            (['Moz','Ms','Webkit','O']).forEach(function(value){
                styleObj[value+'Transform'] = this.props.arrange.transform;
            }.bind(this));
        }

        //处理翻转 类名控制
        var imgFigureClassName = "img-figure";
        imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

        return (
            <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
                <img src={this.props.data.imgURL} alt={this.props.data.title}/>
                <figcaption>
                    <h2 className="img-title">{this.props.data.title}</h2>
                    <div className="img-back" onClick={this.handleClick}>
                        {this.props.data.desc}
                    </div>
                </figcaption>
            </figure>
        );
    }
});

//类
var ControllerUnit = React.createClass({

    handleClick:function(e){

        if(this.props.arrange.isCenter){
            this.props.inverse();
        }else {
            this.props.center();
        }

        e.stopPropagation();
        e.preventDefault();
    },

    render: function(){

        var controllerUnitClassName = "controller-unit";
        if(this.props.arrange.isCenter){
            controllerUnitClassName += " is-center";

            if(this.props.arrange.isInverse){
                controllerUnitClassName += " is-inverse";
            }
        }

        return (
            <span className={controllerUnitClassName} onClick={this.handleClick}></span>
        );
    }
});

//舞台对象
var AppComponent = React.createClass({
    //随机位置的取值范围
    Constant: {
        rangeInleftX:[0,0],
        rangeInRightX:[0,0],
        rangeInTopY:[0,0],
        ranfeInBottomY:[0,0]
    },
    //各个元素尺寸
    HeightAndWidth:{
        halfStageW:0,
        halfImgW:0,
        halfStageH:0,
        halfImgH:0
    },

    inverse:function(index){
        return function(){
            var imgsArrangeArr = this.state.imgsArrangeArr;

            imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

            this.setState({
                imgsArrangeArr:imgsArrangeArr
            });
        }.bind(this);
    },

    //初始化状态
    getInitialState: function () {
        return {
            imgsArrangeArr:[
            ]
        };
    },

    //dom加载完成时渲染
    componentDidMount: function(){
        //获取主要参数
        var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
            stageW = stageDOM.scrollWidth,
            stageH = 680,
            halfStageW = Math.ceil(stageW / 2),
            halfStageH = Math.ceil(stageH / 2);

        var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
            imgW = imgFigureDOM.scrollWidth,
            imgH = imgFigureDOM.scrollHeight,
            halfImgW = Math.ceil(imgW / 2),
            halfImgH = Math.ceil(imgH / 2);     

        //设置左边的x范围
        this.Constant.rangeInleftX[0] = -halfImgW;
        this.Constant.rangeInleftX[1] = halfStageW - halfImgW * 3;

        //设置右边的x范围
        this.Constant.rangeInRightX[0] = stageW - halfImgW * 3;
        this.Constant.rangeInRightX[1] = stageW - halfImgW;

        //设置上边的y范围
        this.Constant.rangeInTopY[0] = -halfImgH;
        this.Constant.rangeInTopY[1] = halfStageH - halfImgH * 3;

        //设置下边的y范围
        this.Constant.ranfeInBottomY[0] = stageH - halfImgH * 3;
        this.Constant.ranfeInBottomY[1] = stageH - halfImgH;

        //设置尺寸
        this.HeightAndWidth.halfStageW = halfStageW;
        this.HeightAndWidth.halfImgW = halfImgW;
        this.HeightAndWidth.halfStageH = halfStageH;
        this.HeightAndWidth.halfImgH = halfImgH;

        this.rearange(0);
    },

    rearange:function(index){
        //每个图片的位置数组
        var positionArr = [];

        for(var i = 0, j = imageDatas.length; i < j; i++ ){
            if(i == index){
                positionArr.push({style:{left:this.HeightAndWidth.halfStageW - this.HeightAndWidth.halfImgW, top:this.HeightAndWidth.halfStageH - this.HeightAndWidth.halfImgH},isInverse:false,isCenter:true})
            }
            positionArr.push({style:this.getRandomTopAndLeftInRange(i),isInverse:false,isCenter:false})
        }

        //更新状态 触发渲染
        this.setState({
            imgsArrangeArr: positionArr
        })
    },

    //随机位置和角度
    getRandomTopAndLeftInRange:function(index){
        var length = imageDatas.length;
        if(index < (Math.ceil(length / 4))){
            //左上 
            return {
                left:Math.ceil(Math.random() * (this.Constant.rangeInleftX[1] - this.Constant.rangeInleftX[0]) + this.Constant.rangeInleftX[0]),
                top:Math.ceil(Math.random() * (this.Constant.rangeInTopY[1] - this.Constant.rangeInTopY[0]) + this.Constant.rangeInTopY[0]),
                transform:this.getRandomRotate()
            }
        }else if((index > (Math.ceil(length / 4))) && (index < (Math.ceil(length / 2)))){
            //右上
            return {
                left:Math.ceil(Math.random() * (this.Constant.rangeInRightX[1] - this.Constant.rangeInRightX[0]) + this.Constant.rangeInRightX[0]),
                top:Math.ceil(Math.random() * (this.Constant.rangeInTopY[1] - this.Constant.rangeInTopY[0]) + this.Constant.rangeInTopY[0]),
                transform:this.getRandomRotate()
            }
        }else if((index > (Math.ceil(length / 2))) && (index < (Math.ceil(length * 3 / 4)))){
            //左下
            return {
                left:Math.ceil(Math.random() * (this.Constant.rangeInleftX[1] - this.Constant.rangeInleftX[0]) + this.Constant.rangeInleftX[0]),
                top:Math.ceil(Math.random() * (this.Constant.ranfeInBottomY[1] - this.Constant.ranfeInBottomY[0]) + this.Constant.ranfeInBottomY[0]),
                transform:this.getRandomRotate()
            }
        }else {
            //右下
            return {
                left:Math.ceil(Math.random() * (this.Constant.rangeInRightX[1] - this.Constant.rangeInRightX[0]) + this.Constant.rangeInRightX[0]),
                top:Math.ceil(Math.random() * (this.Constant.ranfeInBottomY[1] - this.Constant.ranfeInBottomY[0]) + this.Constant.ranfeInBottomY[0]),
                transform:this.getRandomRotate()
            }
        }
    },

    //随机角度
    getRandomRotate: function(){
        var deg = ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30));
        return 'rotate(' + deg + 'deg)';
    },

    center:function(index){
        return function(){
            this.rearange(index);
        }.bind(this);
    },

    render:function(){

        var controllerUnits = [];
        var imgFigures = [];

        imageDatas.forEach(function(value, index){

            if(!this.state.imgsArrangeArr[index]){
                this.state.imgsArrangeArr[index] = {
                    style:{
                        left:0,
                        top:0,
                        transform:'rotate(0deg)'
                    },
                    isInverse:false,
                    isCenter:false
                };
            }

            imgFigures.push(<ImgFigure data={value} ref={'imgFigure' + index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>)
            controllerUnits.push(<ControllerUnit arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)} />);
        }.bind(this));

        return (
            <section className="stage" ref="stage">
              <section className="img-sec">
                {imgFigures}
              </section>
              <nav className="controller-nav">
                {controllerUnits}
              </nav>
            </section>
        )
    }
});

export default AppComponent;

