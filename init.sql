CREATE TABLE store(
  sid SERIAL PRIMARY KEY,
  sname TEXT NOT NULL,
  saddress TEXT,
  sgstid TEXT
);

CREATE TABLE customer(
  cid SERIAL PRIMARY KEY,
  cname TEXT NOT NULL,
  caddress TEXT,
  cgstid TEXT
);

CREATE TABLE product(
  pid SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  mrp FLOAT NOT NULL,
  price FLOAT NOT NULL,
  gst INT NOT NULL,
  active BOOLEAN DEFAULT TRUE
);

CREATE TABLE invoice(
  iid SERIAL PRIMARY KEY,
  dt TIMESTAMP NOT NULL,
  storeid INT NOT NULL REFERENCES store(sid),
  customerid INT REFERENCES customer(cid),
  igst BOOLEAN DEFAULT FALSE
);

CREATE TABLE invoiceproduct(
  ipid SERIAL PRIMARY KEY,
  invoiceid INT NOT NULL REFERENCES invoice(iid),
  productid INT NOT NULL REFERENCES product(pid),
  price FLOAT NOT NULL,
  quantity INT NOT NULL,
  usedgst INT NOT NULL
);
