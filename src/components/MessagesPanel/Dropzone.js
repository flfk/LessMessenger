import PropTypes from 'prop-types';
import React from 'react';
import Dropzone from 'react-dropzone';
import styled from 'styled-components';

const propTypes = {};

const defaultProps = {};

class MessageDropzone extends React.Component {
  state = {
    files: [],
  };

  onDrop = files => {
    this.setState({
      files: files.map(file =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      ),
    });
  };

  onCancel = () => {
    this.setState({
      files: [],
    });
  };

  render() {
    const { files } = this.state;

    const filesList = files.map(file => (
      <li key={file.name}>
        {file.name} - {file.size} bytes
      </li>
    ));

    const thumbs = files.map(file => (
      <ThumbImg key={file.name} src={file.preview} alt="File preview" />
    ));

    return (
      <div>
        <ThumbsContainer>{thumbs}</ThumbsContainer>
        <Dropzone onDrop={this.onDrop} onFileDialogCancel={this.onCancel}>
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <p>Drop files here, or click to select files</p>
            </div>
          )}
        </Dropzone>
        <div>{filesList}</div>
      </div>
    );
  }
}

const Container = styled.div`
  width: 200px;
  height: 200px;
  border: 1px solid red;
`;

const ThumbsContainer = styled.aside`
  border: 1px solid blue;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const ThumbImg = styled.div`
  border: 1px solid orange;
  height: 96px;
  width: 96px;
  border-radius: 10px;
  background-image: url(${props => props.src});
  background-size: cover;
`;

// const Thumb = styled.div`
//   border: 1px solid green;

//   display: inline-flex;
//   border-radius: 2;
//   border: 1px solid #eaeaea;
//   margin-bottom: 8;
//   margin-right: 8;
//   width: 100;
//   height: 100;
//   padding: 4;
//   box-sizing: border-box;
// `;

// const ThumbInner = styled.div`
//   border: 1px solid yellow;
//   display: flex;
//   min-width: 0;
//   overflow: hidden;
// `;

MessageDropzone.propTypes = propTypes;
MessageDropzone.defaultProps = defaultProps;

export default MessageDropzone;
