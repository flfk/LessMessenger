import PropTypes from 'prop-types';
import React from 'react';
import Dropzone from 'react-dropzone';
import { connect } from 'react-redux';
import styled from 'styled-components';

import Messages from './Messages';
import MessageInput from './MessageInput';
import { Container, Thumbnails } from '../components/MessagesPanel';

const propTypes = {};

const defaultProps = {};

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({});

class MessagePanel extends React.Component {
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
        return <Thumbnails.Img key={file.name} src={file.preview} alt="File preview" />;
      }
      return <Thumbnails.File key={file.name}>{file.name}</Thumbnails.File>;
    });

    // If you want to make the zone clickable use this
    // first get this from dropzone props getInputProps
    // <input {...getInputProps()} />

    return (
      <Container>
        <Dropzone onDrop={this.onDrop} onFileDialogCancel={this.onCancel}>
          {({ getRootProps }) => (
            <div {...getRootProps()}>
              <Messages />
              <Thumbnails.Container>{thumbnails}</Thumbnails.Container>
              <MessageInput />
            </div>
          )}
        </Dropzone>
      </Container>
    );
  }
}

MessagePanel.propTypes = propTypes;
MessagePanel.defaultProps = defaultProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MessagePanel);
