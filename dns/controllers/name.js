var toObject,
  toBuffer;

toObject = function (buffer, offset) {
  var psize = 0,
    size,
    parts = [],
    POINTER = 192, // '11000000' (3 << 6 )
    len = buffer.length;

  while (offset < len) {
    //Get the size of name part
    size = buffer.readUInt8(offset);
    offset += 1;

    //If size is 0, we're done
    if (size === 0) break;

    //If size matches POINTER mask, process pointer
    if (size & POINTER) {
      psize += 1;
      break;
    }

    //Get the part slice and convert to string
    part = buffer.slice(offset, offset + size).toString('utf-8');

    //Push the part to our parts array
    parts.push(part);

    //Increment our offset and size
    offset += (size);
    psize += (size + 1);
  }

  return {
    parts: parts,
    size: psize
  }
};

toBuffer = function (parts) {
  var buf,
    offset = 0,
    size = 0;

  //Get the size of each part in addition to the one byte for the 8bit Int size
  parts.forEach(function (part) {
    size += part.length + 1;
  });

  //Build the buffer
  buf = new Buffer(size);

  //Set the buffer
  parts.forEach(function (part) {
    //Write the part size
    buf.writeUInt8(part.length, offset);
    //Write the part
    buf.write(part, offset + 1);
    //Adjust our offset
    offset += (1 + part.length);
  });

  return buf;
};

module.exports = {
  toObject: toObject,
  toBuffer: toBuffer
};
