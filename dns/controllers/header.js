var headerToObject;

headerToObject = function (header) {
    var headers = {},
      flags_raw,
      flags = {},
      // Set our flags Masks here
      QR            = 32768, // '1000000000000000' (1 << 15)
      OPCODE        = 30720, // '0111100000000000' (15 << 11)
      AA            = 1024,  // '0000010000000000' (1 << 10)
      TC            = 512,   // '0000001000000000' (1 << 9)
      RD            = 256,   // '0000000100000000' (1 << 8)
      RA            = 128,   // '0000000010000000' (1 << 7)
      Z             = 64,    // '0000000001000000' (1 << 6)
      AD            = 32,    // '0000000000100000' (1 << 5)
      CD            = 16,    // '0000000000010000' (1 << 4)
      RCODE         = 15;    // '0000000000001111' (15)

    // Total header size is 12 bytes long
    // Flags at offset 2 is
    // +--------+-------------------------------+-------------------------------+
    // |                        0               |               1               |
    // |        +---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---|
    // |  BYTE  | 1 | 1 | 1 | 1 | 1 | 1 |       |                               |
    // | OFFSET | 5 | 4 | 3 | 2 | 1 | 0 | 9 | 8 | 7 | 6 | 5 | 4 | 3 | 2 | 1 | 0 |
    // |        +---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---|
    // |        |                               |       | 1 | 1 | 1 | 1 | 1 | 1 |
    // |        | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 0 | 1 | 2 | 3 | 4 | 5 |
    // |--------+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---|
    // |   0    |                               ID                              |
    // |--------+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---|
    // |   2    |QR |    OPCODE     | AA| TC| RD| RA| Z | AD| CD|     RCODE     |
    // |--------+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---|
    // |   4    |                         QUESTION COUNT                        |
    // |--------+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---|
    // |   5    |                          ANSWER COUNT                         |
    // |--------+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---|
    // |   8    |                         AUTHORITY COUNT                       |
    // |--------+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---|
    // |   10   |                        ADDITIONAL COUNT                       |
    // |--------+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---|

    // Message ID is 16bit INT
    headers.id = header.readUInt16BE(0);

    // Flags are all in a 16bit INT at byte offset 2
    flags_raw = header.readUInt16BE(2);

    // Set flags based on their masks
    headers.qr     = (flags_raw & QR) ? 1 : 0;
    headers.opcode = (flags_raw & OPCODE) >> 11;
    headers.aa     = (flags_raw & AA) >> 10;
    headers.tc     = (flags_raw & TC) >> 9;
    headers.rd     = (flags_raw & RD) >> 8;
    headers.ra     = (flags_raw & RA) >> 7;
    headers.z      = (flags_raw & Z)  >> 6;
    headers.ad     = (flags_raw & AD) >> 5;
    headers.cd     = (flags_raw & CD) >> 4;
    headers.rcode  = (flags_raw & RCODE);

    // Question/Answer/Authority/Additional are all 16bit INTs starting at offset 4
    headers.total_questions = header.readUInt16BE(4);
    headers.total_answers_rr = header.readUInt16BE(6);
    headers.total_authority_rr = header.readUInt16BE(8);
    headers.total_additional_rr = header.readUInt16BE(10);

    return headers;
};

module.exports = {
  toObject: headerToObject
};
