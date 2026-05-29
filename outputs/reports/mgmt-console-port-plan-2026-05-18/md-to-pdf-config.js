module.exports = {
  stylesheet: ['styles.css'],
  body_class: ['falcon-spec'],
  pdf_options: {
    format: 'A4',
    margin: {
      top: '18mm',
      bottom: '22mm',
      left: '16mm',
      right: '16mm'
    },
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: `
      <div style="font-family: 'Segoe UI', system-ui, sans-serif; font-size: 8pt; color: #698e92; width: 100%; padding: 0 16mm; display: flex; justify-content: space-between;">
        <span>Falcon Specs v1.0 · Management-Console Port</span>
        <span>Adnan · 2026-05-18 · Brain-grounded</span>
      </div>`,
    footerTemplate: `
      <div style="font-family: 'Segoe UI', system-ui, sans-serif; font-size: 8pt; color: #698e92; width: 100%; padding: 0 16mm; display: flex; justify-content: space-between;">
        <span>PLAN-ONLY · No code changes applied</span>
        <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
      </div>`
  },
  marked_options: {
    headerIds: true,
    gfm: true,
    breaks: false
  },
  launch_options: {
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
};
