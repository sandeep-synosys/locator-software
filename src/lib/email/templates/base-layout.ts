type Row = { label: string; value: string };

export function baseLayout(opts: {
  heading: string;
  subheading?: string;
  rows: Row[];
}) {
  const rowsHtml = opts.rows
    .map(
      (r, i) => `
      <tr>
        <td style="padding: ${i === 0 ? "0" : "18px"} 0 0 0;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
                font-size: 11px;
                font-weight: 700;
                letter-spacing: .06em;
                text-transform: uppercase;
                color: #8a8f9c;
                padding-bottom: 4px;
              ">
                ${r.label}
              </td>
            </tr>
            <tr>
              <td style="
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
                font-size: 15px;
                color: #1d1d1f;
                line-height: 1.5;
              ">
                ${r.value.replace(/\n/g, "<br/>")}
              </td>
            </tr>
          </table>
        </td>
      </tr>`
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
  <body style="margin:0; padding:0; background-color:#f2f4f8;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f2f4f8; padding: 32px 16px;">
      <tr>
        <td align="center">
          <table width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px; width:100%; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow: 0 6px 24px rgba(20,40,90,0.08);">

            <!-- Header bar -->
            <tr>
              <td style="background: linear-gradient(135deg, #2f6bff 0%, #1360ee 60%, #0e46c4 100%); padding: 28px 32px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; font-size: 13px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: rgba(255,255,255,.8);">
                      LOCATOR
                    </td>
                  </tr>
                  <tr>
                    <td style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; font-size: 22px; font-weight: 800; color: #ffffff; padding-top: 6px;">
                      ${opts.heading}
                    </td>
                  </tr>
                  ${
                    opts.subheading
                      ? `<tr>
                          <td style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; font-size: 13px; color: rgba(255,255,255,.75); padding-top: 4px;">
                            ${opts.subheading}
                          </td>
                        </tr>`
                      : ""
                  }
                </table>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding: 28px 32px 8px 32px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  ${rowsHtml}
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding: 24px 32px 28px 32px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="border-top: 1px solid #eef0f5; padding-top: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; font-size: 12px; color: #9a9ea8;">
                      Sent automatically from the LOCATOR website.
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}