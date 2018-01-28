import React, { Component } from "react";
import { connect } from "redux-jetpack";
import Modal from "../modal";
import * as productInput from "../../actions/product-input";
import * as product from "../../actions/product";
import * as modal from "../../actions/modal";

class Product extends Component {
  constructor() {
    super();
    this.modalAction = this.modalAction.bind(this);
    this.createProduct = this.createProduct.bind(this);
    this.generateModalMessage = this.generateModalMessage.bind(this);
  }

  componentWillMount() {
    product.get();
  }

  componentWillReceiveProps() {
    console.log(this.props);
  }

  initiateCreate() {
    productInput.initiateCreate();
  }

  initiateUpdate(row) {
    productInput.initiateUpdate();
  }

  createProduct() {
    product.create(this.props.productManage.insert);
    setTimeout(product.get, 1000);
    productInput.purgeInsert();
  }

  modalAction() {
    console.log("Modal action -> ", this.props.productManage.activeModal);
    if (this.props.productManage.activeModal === "delete-confirm")
      product.remove(this.props.productManage.remove.id);
    if (this.props.productManage.activeModal === "update-confirm") {
      product.update(this.props.productManage.update);
      productInput.purgeUpdate();
    }
    setTimeout(product.get, 1000);
    productInput.closeModal();
  }

  generateModalMessage() {
    if (this.props.productManage.activeModal === "") return null;
    if (this.props.productManage.activeModal === "delete-confirm")
      return `Confirm Delete of ${this.props.productManage.remove.name}`;
    if (this.props.productManage.activeModal === "update-confirm")
      return `Confirm Update of ${this.props.products[
        this.props.productManage.update.row
      ].name}`;
    if (this.props.productManage.activeModal === "delete-success")
      return "Product Delete Successful";
    if (this.props.productManage.activeModal === "delete-failure")
      return "Product Deletion Failed";
    if (this.props.productManage.activeModal === "update-success")
      return "Product Update Successful";
    if (this.props.productManage.activeModal === "update-failure")
      return "Product Update Failed";
    if (this.props.productManage.activeModal === "create-failure")
      return "Product Creation Failed";
    if (this.props.productManage.activeModal === "create-success")
      return "Product Creation Success";
  }

  closeModal() {
    productInput.closeModal();
    moda.close();
  }

  render() {
    return (
      <div>
        <div className="productInputHeaders">
          <div className="headerTitles">
            <div>Name</div>
            <div>MRP</div>
            <div>Selling Price</div>
            <div>GST</div>
          </div>
          <div className="headerAddButton">
            <input
              type="button"
              value="Add Product"
              onClick={this.initiateCreate}
            />
          </div>
        </div>
        {Object.keys(this.props.productManage.insert).length !== 0 && (
          <div className="productInputRow">
            <input
              type="text"
              name="name"
              placeholder="Product"
              autoFocus
              value={this.props.productManage.insert.name}
              onChange={productInput.captureInsert}
            />
            <input
              type="text"
              name="mrp"
              placeholder="MRP"
              value={this.props.productManage.insert.mrp}
              onChange={productInput.captureInsert}
            />
            <input
              type="text"
              name="price"
              placeholder="Selling Price"
              value={this.props.productManage.insert.price}
              onChange={productInput.captureInsert}
            />
            <input
              type="text"
              name="gst"
              placeholder="GST"
              value={this.props.productManage.insert.gst}
              onChange={productInput.captureInsert}
            />
            <input
              id="addNewButton"
              type="button"
              value="Create"
              onClick={this.createProduct}
            />
          </div>
        )}
        {this.props.products &&
          this.props.products.map((p, row) => (
            <div key={row}>
              <div className="inputRow">
                <input
                  type="text"
                  name="name"
                  data-row={row}
                  placeholder="Product"
                  disabled={
                    this.props.productManage.update.row === row ? false : true
                  }
                  onChange={productInput.captureUpdate}
                  value={
                    this.props.productManage.update.row === row
                      ? this.props.productManage.update.name
                      : p.name
                  }
                />
                <input
                  type="text"
                  name="mrp"
                  data-row={row}
                  placeholder="MRP"
                  disabled={
                    this.props.productManage.update.row === row ? false : true
                  }
                  onChange={productInput.captureUpdate}
                  value={
                    this.props.productManage.update.row === row
                      ? this.props.productManage.update.mrp
                      : p.mrp
                  }
                />
                <input
                  type="text"
                  name="price"
                  data-row={row}
                  placeholder="Selling Price"
                  disabled={
                    this.props.productManage.update.row === row ? false : true
                  }
                  onChange={productInput.captureUpdate}
                  value={
                    this.props.productManage.update.row === row
                      ? this.props.productManage.update.price
                      : p.price
                  }
                />
                <input
                  type="text"
                  name="gst"
                  data-row={row}
                  placeholder="GST"
                  disabled={
                    this.props.productManage.update.row === row ? false : true
                  }
                  onChange={productInput.captureUpdate}
                  value={
                    this.props.productManage.update.row === row
                      ? this.props.productManage.update.gst
                      : p.gst
                  }
                />
                {this.props.productManage.update.row === row ? (
                  <input
                    type="button"
                    value="Update"
                    className="btn"
                    onClick={productInput.confirmUpdate}
                  />
                ) : (
                  <input
                    type="button"
                    value="Edit"
                    className="btn"
                    onClick={() => productInput.initiateUpdate(row, p)}
                  />
                )}
                <input
                  type="button"
                  value="Delete"
                  className="btn"
                  onClick={() => productInput.initiateDelete(p.pid, p.name)}
                />
              </div>
            </div>
          ))}
        {this.props.productManage.activeModal && (
          <Modal
            message={this.generateModalMessage()}
            okCallback={this.modalAction}
            cancelCallback={this.closeModal}
          />
        )}
      </div>
    );
  }
}

export default connect(Product, state => state);
