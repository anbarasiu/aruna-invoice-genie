import React, { Component } from "react";
import { connect } from "redux-jetpack";
import * as invoice from "../../actions/invoice";

class Display extends Component {
  componentWillMount() {
    invoice.display(this.props.match.params.id);
  }

  camelize(sentence) {
    return sentence
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.substring(1))
      .join(" ");
  }

  render() {
    return this.props.invoice ? (
      <div className="invoiceContainer">
        <div id="printButton">
          <input type="button" value="Print" autoFocus onClick={window.print} />
        </div>
        <div className="invoiceHeader">
          <div id="sname">{this.props.invoice.sname}</div>
          <div>
            <div>Invoice: #{this.props.invoice.iid}</div>
            <div>Date: {this.props.invoice.dt}</div>
          </div>
        </div>
        <div className="addressBlock">
          <div className="shopAddress">
            {this.props.invoice.saddress &&
              this.props.invoice.saddress
                .split(",")
                .map(addressLine => <div>{addressLine}</div>)}
            <div>{this.props.invoice.sgstid}</div>
          </div>
          <div className="customerAddress">
            {this.props.invoice.cname && <div>{this.props.invoice.cname}</div>}
            {this.props.invoice.caddress && (
              <div>
                {this.props.invoice.caddress &&
                  this.props.invoice.caddress
                    .split(",")
                    .map(addressLine => <div>{addressLine}</div>)}
              </div>
            )}
            {this.props.invoice.cgstid && (
              <div>{this.props.invoice.cgstid}</div>
            )}
          </div>
        </div>
        <div id="invoiceProductsContainer">
          <table className="productList">
            {this.props.invoice.productList && (
              <thead>
                <tr id="productListHeader">
                  <th className="pr-product">Product</th>
                  <th className="pr-mrp">MRP</th>
                  <th className="pr-price">Unit Price</th>
                  <th className="pr-quantity">Quantity</th>
                  <th className="pr-bprice">Base Price</th>
                  <th className="pr-tax">Tax Rate</th>
                  {this.props.invoice.igst && <th className="pr-igst">IGST</th>}
                  {!this.props.invoice.igst && (
                    <th className="pr-cgst">CGST</th>
                  )}
                  {!this.props.invoice.igst && (
                    <th className="pr-sgst">SGST</th>
                  )}
                  <th className="pr-amount">Amount</th>
                </tr>
              </thead>
            )}
            {this.props.invoice.productList &&
              this.props.invoice.productList.map(row => (
                <tr className="productListRow">
                  <td className="pr-product">{row.name}</td>
                  <td className="pr-mrp">{row.mrp}</td>
                  <td className="pr-price">{row.price}</td>
                  <td className="pr-quantity">{row.quantity}</td>
                  <td className="pr-bprice">{row.bprice}</td>
                  <td className="pr-tax">{row.gst}</td>
                  {this.props.invoice.igst && (
                    <td className="pr-igst">{row.igst}</td>
                  )}
                  {!this.props.invoice.igst && (
                    <td className="pr-cgst">{row.cgst}</td>
                  )}
                  {!this.props.invoice.igst && (
                    <td className="pr-sgst">{row.sgst}</td>
                  )}
                  <td className="pr-amount">{row.amount}</td>
                </tr>
              ))}
            {this.props.invoice.total && (
              <tr className="invoiceTotalRow">
                <td className="empty-34">Total</td>
                <td className="empty-8" />
                <td className="empty-8" />
                <td className="empty-8" />
                <td className="summary-bprice">
                  {this.props.invoice.bpriceTotal}
                </td>
                <td className="summary-empty" />
                {this.props.invoice.igst && (
                  <td className="summary-igst">
                    {this.props.invoice.igstTotal}
                  </td>
                )}
                {!this.props.invoice.igst && (
                  <td className="summary-cgst">
                    {this.props.invoice.cgstTotal}
                  </td>
                )}
                {!this.props.invoice.igst && (
                  <td className="summary-sgst">
                    {this.props.invoice.sgstTotal}
                  </td>
                )}
                <td className="summary-total">
                  <b>{this.props.invoice.total}</b>
                </td>
              </tr>
            )}
          </table>
        </div>
        {this.props.invoice.total && (
          <div className="summary-totalInWords">
            <b>{this.camelize(this.props.invoice.totalInWords)}</b> only
          </div>
        )}
        <div id="disclaimer">
          <p>&nbsp;</p>
          <p>&nbsp;</p>
          <p>&nbsp;</p>
          [ This is a computer generated invoice. ]
        </div>
      </div>
    ) : (
      <div>Loading Data!</div>
    );
  }
}

export default connect(Display, state => state);
