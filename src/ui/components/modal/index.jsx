import React, { Component } from "react";
import { connect } from "redux-jetpack";

const Modal = ({ message, okCallback, cancelCallback }) => (
  <div>
    <div id="overlay" />
    <div id="modal">
      <div>{message}</div>
      <div className="modalButtons">
        <input type="button" value="Ok" onClick={okCallback} />
        <input type="button" value="Cancel" onClick={cancelCallback} />
      </div>
    </div>
  </div>
);

export default connect(Modal, state => state);
