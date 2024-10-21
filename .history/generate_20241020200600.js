const pem = require('pem');
const fs = require('fs');

pem.createCertificate({ days: 365, selfSigned: true }, (err, keys) => {
  if (err) {
    console.error('Error generating certificate:', err);
    return;
  }

  // Save the key and certificate to files
  fs.writeFileSync('server.key', keys.serviceKey);
  fs.writeFileSync('server.cert', keys.certificate);
  
  console.log('SSL certificates generated successfully!');
  console.log('Key: server.key');
  console.log('Certificate: server.cert');
});
