const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

test('CCI Aero selection hydrates its complete QuickBooks contact and addresses', () => {
  const html = fs.readFileSync(
    path.join(__dirname, '..', 'order-entry', 'index.html'),
    'utf8',
  );
  const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  const selectorCode = script.slice(
    script.indexOf('let qbEntities'),
    script.indexOf('async function sha256'),
  );
  const elements = new Map();
  const element = id => {
    if (!elements.has(id)) {
      elements.set(id, {
        value: '',
        addEventListener(event, listener) {
          this[event] = listener;
        },
      });
    }
    return elements.get(id);
  };
  const context = vm.createContext({
    document: { getElementById: element },
  });
  vm.runInContext(
    `${selectorCode}\n` +
      `qbEntities = { customers: [{` +
      `id: '109', name: 'CCI Aero, inc.', contactName: 'Jacob Wright', ` +
      `email: 'jacob@cci.aero', phone: '803-555-0123', ` +
      `billToText: '620 Wilkerson Rd\\nRock Hill, SC 29730', ` +
      `shipToText: '620 Wilkerson Rd\\nRock Hill, SC 29730'` +
      `}], vendors: [{` +
      `id: '42', name: 'Thread Supply', contactName: 'Avery Mills', ` +
      `email: 'avery@threads.example', phone: '704-555-0100', ` +
      `remitToText: '90 Textile Way\\nCharlotte, NC 28202'` +
      `}] }; bindEntitySelectors();`,
    context,
  );

  element('customer_select').change({ target: { value: '109' } });

  assert.equal(element('customer_contact_name').value, 'Jacob Wright');
  assert.equal(element('customer_email').value, 'jacob@cci.aero');
  assert.equal(element('customer_phone').value, '803-555-0123');
  assert.equal(
    element('customer_billing_address').value,
    '620 Wilkerson Rd\nRock Hill, SC 29730',
  );
  assert.equal(
    element('ship_to_address').value,
    '620 Wilkerson Rd\nRock Hill, SC 29730',
  );

  element('product_vendor_select').change({ target: { value: '42' } });
  assert.equal(element('product_vendor_contact_name').value, 'Avery Mills');
  assert.equal(element('product_vendor_email').value, 'avery@threads.example');
  assert.equal(element('product_vendor_phone').value, '704-555-0100');
  assert.equal(
    element('product_vendor_remit_address').value,
    '90 Textile Way\nCharlotte, NC 28202',
  );

  element('decoration_vendor_select').change({ target: { value: '42' } });
  assert.equal(element('decoration_vendor_contact_name').value, 'Avery Mills');
  assert.equal(element('decoration_vendor_email').value, 'avery@threads.example');
  assert.equal(element('decoration_vendor_phone').value, '704-555-0100');
  assert.equal(
    element('decoration_vendor_remit_address').value,
    '90 Textile Way\nCharlotte, NC 28202',
  );
  assert.match(
    script.slice(script.indexOf('async function sha256')),
    /\bbindEntitySelectors\(\);/,
    'the selector listeners must be bound during page initialization',
  );
});
