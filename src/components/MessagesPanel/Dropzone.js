import PropTypes from 'prop-types';
import React from 'react';
import Dropzone from 'react-dropzone';
import styled from 'styled-components';

import MessageInput from '../../containers/MessageInput';

const propTypes = {};

const defaultProps = {};

class MessageDropzone extends React.Component {
  state = {
    files: [],
  };

  onDrop = filesDropped => {
    console.log(filesDropped);
    const { files } = this.state;
    const filesUpdated = files.slice();
    filesDropped.map(file => {
      filesUpdated.push(
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
    });
    this.setState({ files: filesUpdated });
  };

  onCancel = () => {
    this.setState({
      files: [],
    });
  };

  render() {
    const { files } = this.state;

    const thumbnails = files.map(file => {
      // if file is img vs not
      if (file.type.startsWith('image/')) {
        return <ThumbImg key={file.name} src={file.preview} alt="File preview" />;
      }
      return <ThumbFile key={file.name}>{file.name}</ThumbFile>;
    });

    // If you want to make the zone clickable use this
    // first get this from dropzone props getInputProps
    // <input {...getInputProps()} />

    return (
      <div>
        <ThumbsContainer>{thumbnails}</ThumbsContainer>
        <Dropzone onDrop={this.onDrop} onFileDialogCancel={this.onCancel}>
          {({ getRootProps }) => (
            <div {...getRootProps()}>
              <MessageInput />
            </div>
          )}
        </Dropzone>
      </div>
    );
  }
}

const ThumbsContainer = styled.div`
  border: 1px solid blue;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const ThumbFile = styled.div`
  border: 1px solid orange;
  height: 96px;
  width: 96px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 16px;
`;

const ThumbImg = styled(ThumbFile)`
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
