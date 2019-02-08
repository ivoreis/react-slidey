import React from 'react';
import ReactDOM from 'react-dom';
import Slidey from '../dist/es6/index.js';

const container = document.querySelector('#root');
const SlideShow = (
  <div
    style={{
      width: '90%',
      height: '500px',
      margin: '0 auto',
      position: 'relative',
    }}
  >
    <Slidey autoplay={true} slideInterval={10000} effect={'Fade'}>
      <div style={{ background: 'red', height: '100%' }}>Hello</div>
      <div style={{ background: 'blue', height: '100%' }}>World!</div>
      <div style={{ background: 'green', height: '100%' }}>How</div>
      <div style={{ background: 'yellow', height: '100%' }}>you</div>
      <div style={{ background: 'orange', height: '100%' }}>doing?</div>
    </Slidey>
  </div>
);

ReactDOM.render(SlideShow, container);
