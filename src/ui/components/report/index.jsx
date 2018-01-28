import React, { Component } from "react";
import { connect } from "redux-jetpack";
import * as trackInput from "../../actions/report-input";
import * as report from "../../actions/report";
import * as invoice from "../../actions/invoice";

class Report extends Component {
  constructor(props) {
    super(props)
    // this.deleteInvoice = this.deleteInvoice.bind(this)
  }

  // deleteInvoice(row) {
  //   const id = this.props.report.rows[row].iid
  //   invoice.remove(id)
  //   setTimeout(function() { report.get(this.props.report.from, this.props.report.to) }, 1000);
  // }

  downloadCsv(report, total) {
    const csvContent = report.length > 0 &&
    report.reduce((csv, r) =>
      `${csv}
      ${
        Object.keys(r.gst).map(gst => r.igst
          ? `"${r.dt}","${r.iid}","${r.cgstid || ""}","${r.gst[gst].amount.toFixed(2)}","${gst}","","","${(r.gst[gst].gst).toFixed(2)}","${r.gst[gst].total.toFixed(2)}"`
          : `"${r.dt}","${r.iid}","${r.cgstid || ""}","${r.gst[gst].amount.toFixed(2)}","${gst}","${(r.gst[gst].gst / 2).toFixed(2)}","${(r.gst[gst].gst / 2).toFixed(2)}","","${r.gst[gst].total.toFixed(2)}"`
        ).join("\r\n")
      }`,
      'data:text/csv;charset=utf-8,"Date","Invoice","GST No.","Amount","GST Rate","CGST","SGST","IGST","Total"'
    ) + "\r\n" + `"Total","","","${total.amount.toFixed(2)}","","${(total.gst / 2).toFixed(2)}","${(total.gst / 2).toFixed(2)}","${total.igst.toFixed(2)}","${total.total.toFixed(2)}"`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "aruna.csv");
    document.body.appendChild(link); // Required for FF
    link.click();
  }

  render() {
    const { rows, total } = this.props.report.out
    return (
      <div id="reportContainer">
        <div id="reportToolbelt">
          <span>From</span>
          <input
            type="date"
            name="from"
            value={this.props.report.from}
            onChange={trackInput.captureDate}
          />
          <span>To</span>
          <input
            type="date"
            name="to"
            value={this.props.report.to}
            onChange={trackInput.captureDate}
          />
          <input
            type="button"
            value="Generate Report"
            onClick={() =>
              report.get(this.props.report.from, this.props.report.to)
            }
          />
          {/*<div id="printButton">
            <input type="button" value="Print" onClick={window.print} />
          </div>*/}
          <div id="printButton">
            <input type="button" value="Download CSV" onClick={() => this.downloadCsv(rows, total)} />
          </div>
        </div>
        {rows.length > 0 && (
          <div>
            <div id="reportTable">
              <div id="reportTableHeader">
                <div>Date</div>
                <div>Invoice</div>
                <div>GST No.</div>
                <div>Amount</div>
                <div>GST Rate</div>
                <div>CGST</div>
                <div>SGST</div>
                <div>IGST</div>
                <div>Total</div>
              </div>
              {Object.keys(rows).map(row => (
                <div id="reportDataRow">
                  <div id="reportRow-date">
                    {rows[row].dt}
                  </div>
                  <div id="reportRow-invoice">
                    <a href={`/invoice/${rows[row].iid}`}>
                      {rows[row].iid}
                    </a>
                  </div>
                  <div id="reportRow-cgstId">
                    {rows[row].cgstid}
                  </div>
                  <div id="reportRow-money">
                    {Object.keys(rows[row].gst).map(rate => (
                      <div id="reportMoneyRow">
                        <div>
                          {(rows[row].gst[rate].amount).toFixed(2)}
                        </div>
                        <div id="reportRow-gstRate">{rate}</div>
                        {rows[row].igst && (
                          <div>
                            {rows[row].gst[rate].gst.toFixed(
                              2
                            )}
                          </div>
                        )}
                        {rows[row].igst && <div />}
                        {rows[row].igst && <div />}
                        {!rows[row].igst && (
                          <div>
                            {(
                              rows[row].gst[rate].gst / 2
                            ).toFixed(2)}
                          </div>
                        )}
                        {!rows[row].igst && (
                          <div>
                            {(
                              rows[row].gst[rate].gst / 2
                            ).toFixed(2)}
                          </div>
                        )}
                        {!rows[row].igst && <div />}

                        <div>
                          {(rows[row].gst[rate].total).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div className="reportTableSummary">
                <div className="noBorder">Total</div>
                <div className="noBorder" />
                <div className="noBorder" />
                <div>{total.amount.toFixed(2)}</div>
                <div className="noBorder" />
                <div>{(total.gst / 2).toFixed(2)}</div>
                <div>{(total.gst / 2).toFixed(2)}</div>
                <div>{total.igst.toFixed(2)}</div>
                <div>{total.total.toFixed(2)}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default connect(Report, state => state);
