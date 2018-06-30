import React, { Component } from 'react';
import '../assets/css/Gallery.css';

class Gallery extends Component {
	constructor(props) {
		super(props);

		this.state = {
			imgCount: this.props.imgCount,
			imgList: this.initImgList()
		};
	}

	componentDidMount() {
		this.adjust();
		window.addEventListener('resize', this.adjust);
		let images = document.querySelectorAll('.imageBox')
		images.forEach(image => {
			image.addEventListener('dragstart', this.handleDragStart);
			image.addEventListener('dragenter', this.handleDragEnter);
			image.addEventListener('dragover', this.handleDragOver);
			image.addEventListener('dragleave', this.handleDragLeave);
			image.addEventListener('drop', this.handleDrop);
			image.addEventListener('dragend', this.handleDragEnd);
		});
		document.querySelectorAll('.imageBox label').forEach(imgLabel => {
			imgLabel.ondragstart = () => { return false; };
		});
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.adjust);
		let images = document.querySelectorAll('.imageBox')
		images.forEach(image => {
			image.removeEventListener('dragstart', this.handleDragStart);
			image.removeEventListener('dragenter', this.handleDragEnter);
			image.removeEventListener('dragover', this.handleDragOver);
			image.removeEventListener('dragleave', this.handleDragLeave);
			image.removeEventListener('drop', this.handleDrop);
			image.removeEventListener('dragend', this.handleDragEnd);
		});
	}

	render() {
		return(
			<div className="Gallery">
				<div className="gridLayout">
					{this.state.imgList.map((image, id) => 
						<div key={id} data-key={id+1} className="imageBox" draggable="true">
							<label htmlFor={`fileInput${id+1}`}>
								<img src={image.imageUrl} alt={`snapshot${id+1}`} id={`image${id+1}`} draggable="false" />
							</label>
							<input id={`fileInput${id+1}`} type="file" onChange={(e) => this.handleImageUpload(e, id+1)} />
						</div>
					)}
				</div>
			</div>
		);
	}

	adjust = () => {
		clearTimeout(this.resizeTimeout);
		this.resizeTimeout = setTimeout(() => {
			let galleryWidth = document.querySelector('.gridLayout').offsetWidth;
			let imgBox = document.querySelectorAll('.imageBox');
			let boxWidth = imgBox[0].offsetWidth;
			let numBox = parseInt(galleryWidth / boxWidth, 10);
			let margin = galleryWidth - (boxWidth * numBox) - 1;
			margin = margin / (numBox * 2);
			if (margin < 5)
				numBox -= 1;
			margin = galleryWidth - (boxWidth * numBox) - 1;
			margin = margin / (numBox * 2);
			imgBox.forEach((box) => {
				box.style.margin = margin + "px";
			});
		}, 100);
	}

	initImgList() {
		let imgList = [], n = this.props.imgCount;
		for(let i=1; i<=n; i++) {
			let imgData = localStorage.getItem('imgData'+i);
			if (imgData == null) {
				imgData = 'data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='
				localStorage.setItem('imgData'+i, imgData);
			}
			imgList.push({
				_id: i,
				file: '',
				imageUrl: imgData
			});
		}
		return imgList;
	}

	handleImageUpload = (e, id) => {
		e.preventDefault();

		let reader = new FileReader();
		let file = e.target.files[0];

		reader.onloadend = () => {
			this.setState({
				imgList: this.state.imgList.map(image => 
					(image._id === id ? Object.assign(image, {
						file: file,
						imageUrl: reader.result	
					}) : image)
				)
			});
			localStorage.setItem("imgData"+id, reader.result);
		};

		reader.readAsDataURL(file);
	}

	handleDragStart = (e) => {
		e.target.style.opacity = '0.4';
		this.lastItemIndex = e.target.attributes[0].value;
	}

	handleDragEnter = (e) => {
		let elem = e.target;
		if (elem.nodeName === 'LABEL')
			elem = elem.parentNode;
		elem.classList.add('dropOver');
	}

	handleDragOver = (e) => {
		e.preventDefault();
		e.dataTransfer.dragEffectAllowed = 'move';
		return false;
	}

	handleDragLeave = (e) => {
		let elem = e.target;
		if (elem.nodeName === 'LABEL')
			elem = elem.parentNode;
		elem.classList.remove('dropOver');
	}

	handleDrop = (e) => {
		e.stopPropagation();

		let elem = e.target;
		if (elem.nodeName === 'LABEL')
			elem = elem.parentNode;
		let curItemIndex = elem.attributes[0].value;
		if (this.lastItemIndex !== curItemIndex) {
			let srcImage = document.querySelector('#image'+this.lastItemIndex);
			let destImage = document.querySelector('#image'+curItemIndex);

			let temp = destImage.src;
			destImage.src = srcImage.src;
			srcImage.src = temp;

			localStorage.setItem("imgData"+this.lastItemIndex, srcImage.src);
			localStorage.setItem("imgData"+curItemIndex, destImage.src);
		}
		return false;
	}

	handleDragEnd = (e) => {
		let images = document.querySelectorAll('.imageBox')
		images.forEach(image => {
			image.classList.remove('dropOver');
			image.style.opacity = '1';
		});
	}
}

export default Gallery;