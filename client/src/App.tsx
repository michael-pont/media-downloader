import React, { useState } from 'react';
import { Button, InputGroup } from '@blueprintjs/core';
import '@blueprintjs/core/lib/css/blueprint.css';
import axios from 'axios';

type Props = {
  name: string;
  color: string;
};

const handleInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
  console.log(e.target.value);
};

/* const handleButtonClick = async (e: React.MouseEvent<HTMLElement, MouseEvent>, url: string): Promise<void> => {
  const response = await axios.post('http://localhost:8080/downloadMusic', { url: url }, { responseType: 'blob' });
  let fileName: string = response.headers['content-disposition'].split('filename=')[1];
  fileName = fileName.replace(/"/g, '');
  const downloadUrl = window.URL.createObjectURL(new Blob([response.data], { type: 'audio/mp3' }));
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
}; */

const handleButtonClick = async (e: React.MouseEvent<HTMLElement, MouseEvent>, url: string): Promise<void> => {
  const response = await axios.post(
    'http://localhost:8080/downloadPlaylist',
    { url: url },
    { responseType: 'arraybuffer' },
  );
  let fileName: string = response.headers['content-disposition'].split('filename=')[1];
  fileName = fileName.replace(/"/g, '');
  console.log(fileName);
  const downloadUrl = window.URL.createObjectURL(new Blob([response.data], { type: 'application/zip' }));
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
};

// Written as a function declaration
const App: React.FC = () => {
  const [currentText, setCurrentText] = useState('');
  return (
    <div>
      <h1>My Website Heading</h1>
      <Button
        className="bp3-bp3-outlined"
        intent="success"
        text="button content"
        onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => handleButtonClick(e, currentText)}
      />
      <InputGroup
        leftIcon="download"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentText(e.target.value)}
      />
    </div>
  );
};

export default App;
