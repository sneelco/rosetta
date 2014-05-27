var parseQuestions = function(buffer, total) {
  var i,
    size,
    qSize,
    offset = 12,
    parts = [],
    questions = [],
    len = buffer.length;

  for (i = 0; i < total; i += 1) {
    qSize = 0;
    while (offset < len) {
      size = buffer[offset];
      if (size === 0) break ;
      part = buffer.slice(offset + 1, offset + size + 1).toString('utf-8');
      parts.push(part);
      offset += (parseInt(size, 10) + 1);
      qSize += (1 + size)
    }

    query_type = buffer.slice(offset + 1, offset + 3).readUInt16BE(0);
    query_class = buffer.slice(offset + 3, offset + 5).readUInt16BE(0);

    questions.push({
      parts: parts,
      type: query_type,
      class: query_class,
      size: qSize + 5,
    });

    offset += 5
  }
  return questions;
};

module.exports = parseQuestions;
